#!/usr/bin/env python3
"""Package only the portable skill, without machine-specific caches or files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'photo-world-builder'
archive = ROOT / 'photo-world-builder.zip'
with ZipFile(archive, 'w', ZIP_DEFLATED) as z:
    for path in sorted(source.rglob('*')):
        if path.is_file() and not any(p.startswith('.') or p == '__pycache__' for p in path.relative_to(source).parts) and path.suffix != '.pyc':
            z.write(path, path.relative_to(ROOT))
with ZipFile(archive) as z:
    assert z.testzip() is None
    print(f'{archive.name}: {len(z.namelist())} files; {archive.stat().st_size:,} bytes')
