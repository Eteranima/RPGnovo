/** The engine owns validation, migration, storage writes and rollback. UI only handles a local file. */
export type PwaSavePreview = {
  mapName: string;
  level: number;
  heroNames: string[];
  elapsedSeconds: number;
  savedAt?: string;
};
export type PwaSaveTransferProps = {
  canExport: boolean;
  canImport: boolean;
  exportSave: () => string | null;
  previewSave: (text: string) => PwaSavePreview | null;
  importSave: (text: string) => boolean;
};
export const MAX_PWA_SAVE_FILE_BYTES = 2 * 1024 * 1024;
