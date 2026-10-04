"""Read-only pixel/count proof for FFmpeg-extracted Seiji/Shin QA. Never generates or edits imagery."""
from pathlib import Path
import hashlib
import json
from PIL import Image

repo = Path(__file__).resolve().parents[3]
source = repo / 'art-source/v33/opening/clips/02-seiji-corrected.mp4'
qa = repo / 'docs/qa-v33/opening/seiji-source'
crop = {'x': 740, 'y': 180, 'w': 500, 'h': 530}

def digest(path):
    result = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(chunk)
    return result.hexdigest()

# This record belongs to the exact clip whose FFprobe result and pixels were reviewed.
source_hash = digest(source)
assert source_hash == '532324c6e66ff71263dbacf70f291465543496239bcb070a12fefacc838a8a0c', 'Source changed; re-run technical and visual QA before replacing this record.'

def samples(folder, count, stride, dimensions):
    paths = sorted((qa / folder).glob('frame-*.png'))
    assert len(paths) == count, (folder, len(paths), count)
    result = []
    for index, path in enumerate(paths):
        assert path.name == f'frame-{index:02d}.png'
        with Image.open(path) as image:
            assert image.size == dimensions and image.mode == 'RGB', (path.name, image.size, image.mode)
        result.append({'sample': index, 'sourceFrame': index * stride, 'seconds': index * stride / 24,
                       'path': path.relative_to(repo).as_posix(), 'width': dimensions[0],
                       'height': dimensions[1], 'sha256': digest(path)})
    return result

full = samples('full', 20, 12, (1280, 720))
subject = samples('shin', 48, 5, (500, 530))
proof = []
for full_index, shin_index in [(0, 0), (5, 12), (10, 24), (15, 36)]:
    with Image.open(qa / f'full/frame-{full_index:02d}.png') as image:
        pixels = image.tobytes()
    # Compare existing decoded RGB rows; no crop operation writes a replacement image.
    expected = b''.join(pixels[((y * 1280 + crop['x']) * 3):((y * 1280 + crop['x'] + crop['w']) * 3)]
                        for y in range(crop['y'], crop['y'] + crop['h']))
    with Image.open(qa / f'shin/frame-{shin_index:02d}.png') as image:
        actual = image.tobytes()
    assert expected == actual, f'Native RGB pixels differ at source frame {full_index * 12}'
    proof.append({'sourceFrame': full_index * 12, 'identicalNativeRGBPixels': crop['w'] * crop['h'],
                  'sha256Pixels': hashlib.sha256(actual).hexdigest()})

report = {
    'source': source.relative_to(repo).as_posix(), 'sourceSHA256': source_hash,
    'sourceBytes': source.stat().st_size,
    'metadata': {'codec': 'h264', 'width': 1280, 'height': 720, 'pixelFormat': 'yuv420p',
                 'r_frame_rate': '24/1', 'avg_frame_rate': '24/1', 'durationSeconds': 10,
                 'nb_frames': 240, 'nb_read_frames': 240, 'audioCodec': 'aac',
                 'audioDurationSeconds': 10.005, 'containerDurationSeconds': 10.005},
    'metadataEvidence': 'Actual local FFprobe 9.0.2 -count_frames result recorded by the QA owner.',
    'fullFrames': full, 'shinFrames': subject, 'shinCrop': crop,
    'distinctReviewedSourceFrames': len({frame['sourceFrame'] for frame in full + subject}),
    'nativePixelProof': proof,
    'extraction': {
        'fullFilter': "select='not(mod(n,12))',format=rgb24",
        'shinFilter': "select='not(mod(n,5))',format=rgb24,crop=500:530:740:180",
        'frameMode': 'passthrough', 'startNumber': 0,
        'fullContact': {'columns': 5, 'rows': 4, 'thumbWidth': 320, 'thumbHeight': 180},
        'shinContacts': {'sheets': 3, 'columns': 4, 'rows': 4, 'thumbWidth': 320},
        'note': 'Only review thumbnails are scaled. The 20 full PNGs and 48 subject PNGs are native decoded/cropped RGB pixels.'
    },
    'scope': 'Source QA only; no film assembled and no source footage was changed.'
}
(qa / 'qa-manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('PASS: 20 native full PNGs, 48 native Shin crops, 64 distinct source frames; 1,060,000 RGB pixels matched across four shared frames.')
