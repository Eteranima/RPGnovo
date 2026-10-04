import {ASSETS, type Entity, type MapData, type MapId} from './data';
import {ENVIRONMENT_ASSETS, ENVIRONMENT_THEMES, environmentObject, environmentScenery} from './environment';
import {EXPLORATION_DIRECTIONS_V31} from './explorationArtV31';

export type WorldAssetPlanV32 = {
  map: MapId | null;
  name: string;
  entries: Readonly<Record<string, string>>;
  signature: string;
  groundSignature: string;
};

/** Resolve the same consumers as WorldRenderer, rather than a prefix-based global preload. */
export function worldAssetPlanV32(map: MapData, actors: readonly string[], entities: readonly Entity[] = map.entities): WorldAssetPlanV32 {
  const entries: Record<string, string> = {};
  const ground = new Set<string>();
  const add = (key: string, terrain = false) => {
    const src = ENVIRONMENT_ASSETS[key] || ASSETS[key];
    if (!src) throw new Error(`Arte de exploração não registrada: ${key}`);
    entries[key] = src;
    if (terrain) ground.add(key);
  };
  const actor = (key: string) => {
    if (key === 'abel' || key === 'orfeu') {
      for (const direction of EXPLORATION_DIRECTIONS_V31) add(`walk_${key}_${direction}`);
    } else add(key);
  };
  const object = (key: string, atlas?: number, sheet = 'props') => {
    const art = environmentObject(key, atlas, sheet);
    add(art ? art.sheet : atlas !== undefined ? sheet : key);
  };
  const theme = ENVIRONMENT_THEMES[map.id];
  for (const tile of new Set(map.rows.join(''))) {
    add(theme.floor[tile]?.sheet || 'env_floor_depths', true);
  }
  if (map.rows.some(row => row.includes('#'))) {
    add('env_boundaries', true);
    if (theme.boundary !== 1) add('env_wallcaps', true);
  }
  map.props.forEach((prop, index) => {
    const art = environmentScenery(map.id, prop, index);
    if (art) add(art.sheet);
    else object(prop.asset, prop.atlas, prop.atlasSheet);
  });
  for (const entity of entities) {
    switch (entity.kind) {
      case 'npc': if (entity.asset) actor(entity.asset); break;
      case 'mob': case 'boss': if (entity.asset) object(entity.asset); break;
      case 'chest': object('dungeon', 1, 'dungeon'); break;
      case 'shop': case 'book': object('dungeon', 0, 'dungeon'); break;
      case 'rune': object('dungeon', 2, 'dungeon'); break;
      case 'sign':
        add(entity.id.startsWith('v31:') && entity.asset?.startsWith('quest_') ? entity.asset : 'env_signboards');
        break;
      case 'warp': add('env_exits'); break;
      // Events and save markers are drawn with the canvas, without a sprite consumer.
    }
  }
  for (const key of actors) actor(key);
  const pairs = Object.entries(entries).sort(([a], [b]) => a.localeCompare(b));
  return {
    map: map.id, name: map.name, entries: Object.fromEntries(pairs),
    signature: `${map.id}:${JSON.stringify(pairs)}`,
    groundSignature: JSON.stringify([...ground].sort().map(key => [key, entries[key]])),
  };
}

export function emptyWorldAssetPlanV32(): WorldAssetPlanV32 {
  return {map: null, name: '', entries: {}, signature: 'title', groundSignature: ''};
}

export type WorldLoadingStatusV32 = {
  loading: boolean;
  map: MapId | null;
  error: string | null;
  /** Completed unique image URLs, in the range 0–1. */
  progress: number;
  loaded: number;
  total: number;
  ready: boolean;
};
export type WorldAssetSessionOptionsV32 = {
  createImage?: () => HTMLImageElement;
  onStatus?: (status: WorldLoadingStatusV32) => void;
  onCommit?: (images: Record<string, HTMLImageElement>, plan: WorldAssetPlanV32) => void;
  concurrency?: number;
  /** Retain a few unused sources; current map/party sources are always retained. */
  retainInactive?: number;
  timeoutMs?: number;
};
type Source = {
  image: HTMLImageElement;
  promise: Promise<HTMLImageElement>;
  settled: boolean;
  used: number;
  cancel: () => void;
};

/** A renderer-local URL cache with singleflight requests and atomic map commits. */
export class WorldAssetSessionV32 {
  private options: WorldAssetSessionOptionsV32;
  private sources = new Map<string, Source>();
  private queue: (() => void)[] = [];
  private running = 0;
  private clock = 0;
  private generation = 0;
  private disposed = false;
  private desired: WorldAssetPlanV32 | null = null;
  private committed: WorldAssetPlanV32 | null = null;
  private pending: Promise<boolean> | null = null;
  private listeners = new Set<(status: WorldLoadingStatusV32) => void>();
  private status: WorldLoadingStatusV32 = {loading: false, map: null, error: null, progress: 0, loaded: 0, total: 0, ready: false};
  private currentImages: Record<string, HTMLImageElement> = {};

  constructor(options: WorldAssetSessionOptionsV32 = {}) { this.options = options; }
  getStatus(): WorldLoadingStatusV32 { return {...this.status}; }
  get images(): Readonly<Record<string, HTMLImageElement>> { return this.currentImages; }
  subscribe(listener: (status: WorldLoadingStatusV32) => void): () => void {
    if (this.disposed) return () => {};
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => this.listeners.delete(listener);
  }
  private publish(status: WorldLoadingStatusV32) {
    if (this.disposed) return;
    this.status = status;
    this.options.onStatus?.(this.getStatus());
    for (const listener of this.listeners) listener(this.getStatus());
  }
  private pump() {
    const limit = Math.max(1, this.options.concurrency ?? 4);
    while (!this.disposed && this.running < limit && this.queue.length) {
      this.running++;
      this.queue.shift()!();
    }
  }
  private source(src: string): Promise<HTMLImageElement> {
    const existing = this.sources.get(src);
    if (existing) { existing.used = ++this.clock; return existing.promise; }
    const image = (this.options.createImage || (() => new Image()))();
    let resolve!: (image: HTMLImageElement) => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<HTMLImageElement>((ok, fail) => { resolve = ok; reject = fail; });
    let started = false, finished = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const record: Source = {image, promise, settled: false, used: ++this.clock, cancel: () => finish(new Error('Carregamento encerrado.'))};
    const finish = (error?: Error) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      image.onload = image.onerror = null;
      if (started) this.running--;
      if (error) {
        if (this.sources.get(src) === record) this.sources.delete(src);
        reject(error);
      } else {
        record.settled = true;
        this.trim(new Set([...Object.values(this.desired?.entries || {}), ...Object.values(this.committed?.entries || {})]));
        resolve(image);
      }
      this.pump();
    };
    this.sources.set(src, record);
    this.queue.push(() => {
      started = true;
      if (this.disposed || finished) { this.running--; this.pump(); return; }
      // Obsolete queued work never begins a download. Already running shared URLs can still be reused.
      if (!Object.values(this.desired?.entries || {}).includes(src)) { finish(new Error('Cenário substituído.')); return; }
      timer = setTimeout(() => finish(new Error(`Tempo de carregamento esgotado: ${src}`)), this.options.timeoutMs ?? 30000);
      image.onload = () => {
        // Decode before making the complete map visible. A stale generation may cache the source,
        // but cannot replace the visible map or publish its status.
        const decoded = Promise.resolve().then(() => typeof image.decode === 'function' ? image.decode() : undefined);
        void decoded.then(() => finish(), () => finish(new Error(`Imagem inválida: ${src}`)));
      };
      image.onerror = () => finish(new Error(`Imagem indisponível: ${src}`));
      image.src = src;
    });
    this.pump();
    return promise;
  }
  private trim(active: Set<string>) {
    const inactive = [...this.sources].filter(([src, entry]) => entry.settled && !active.has(src)).sort(([, a], [, b]) => b.used - a.used);
    for (const [src] of inactive.slice(Math.max(0, this.options.retainInactive ?? 8))) this.sources.delete(src);
  }
  load(plan: WorldAssetPlanV32, retry = false): Promise<boolean> {
    if (this.disposed) return Promise.resolve(false);
    if (!retry && this.desired?.signature === plan.signature) {
      return this.pending || Promise.resolve(this.status.ready);
    }
    const generation = ++this.generation;
    this.desired = plan;
    const urls = [...new Set(Object.values(plan.entries))];
    this.publish({loading: urls.length > 0, map: plan.map, error: null, progress: urls.length ? 0 : 1, loaded: 0, total: urls.length, ready: false});
    const execute = async () => {
      const loaded = new Map<string, HTMLImageElement>();
      let cursor = 0, completed = 0, failed = false;
      const current = () => !this.disposed && generation === this.generation;
      try {
        const worker = async () => {
          while (current() && !failed && cursor < urls.length) {
            const src = urls[cursor++];
            try { loaded.set(src, await this.source(src)); }
            catch (error) { failed = true; throw error; }
            if (!current()) return;
            completed++;
            if (this.status.loading) this.publish({...this.status, loaded: completed, progress: completed / urls.length});
          }
        };
        await Promise.all(Array.from({length: Math.min(urls.length, Math.max(1, this.options.concurrency ?? 4))}, worker));
        if (!current()) return false;
        const images: Record<string, HTMLImageElement> = {};
        for (const [key, src] of Object.entries(plan.entries)) images[key] = loaded.get(src)!;
        this.currentImages = images;
        this.committed = plan;
        this.options.onCommit?.(images, plan);
        this.trim(new Set(urls));
        this.publish({loading: false, map: plan.map, error: null, progress: 1, loaded: urls.length, total: urls.length, ready: true});
        return true;
      } catch {
        if (current()) this.publish({loading: false, map: plan.map, error: `Não foi possível carregar ${plan.name || 'o cenário'}. Verifique a conexão e tente novamente.`, progress: urls.length ? completed / urls.length : 0, loaded: completed, total: urls.length, ready: false});
        return false;
      } finally {
        if (current()) this.pending = null;
      }
    };
    this.pending = execute();
    return this.pending;
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.generation++;
    this.listeners.clear();
    this.queue = [];
    for (const entry of this.sources.values()) if (!entry.settled) entry.cancel();
    this.sources.clear();
    this.currentImages = {};
    this.pending = null;
  }
}
