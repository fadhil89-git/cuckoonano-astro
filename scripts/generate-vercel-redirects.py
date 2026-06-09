from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
redirects = []
seen = set()

for raw in (ROOT / "public/_redirects").read_text(encoding="utf-8").splitlines():
    line = raw.strip()
    if not line or line.startswith("#"):
        continue

    parts = line.split()
    if len(parts) < 2:
        continue

    source, destination = parts[0], parts[1]
    status = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 301

    if not source.endswith("/"):
        continue

    if source in seen:
        continue

    seen.add(source)
    redirects.append(
        {
            "source": source,
            "destination": destination,
            "permanent": status in (301, 308),
        }
    )

(ROOT / "vercel.json").write_text(
    json.dumps({"redirects": redirects}, indent=2) + "\n",
    encoding="utf-8",
)

print(f"wrote vercel.json with {len(redirects)} redirects")
