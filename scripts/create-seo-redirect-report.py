from __future__ import annotations

import os
import re
import zipfile
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "outputs"
OUTPUT_FILE = OUTPUT_DIR / "cuckoonano-seo-redirect-report.xlsx"


def col_name(index: int) -> str:
    name = ""
    while index:
        index, rem = divmod(index - 1, 26)
        name = chr(65 + rem) + name
    return name


def cell_ref(row: int, col: int) -> str:
    return f"{col_name(col)}{row}"


def sheet_xml(rows: list[list[object]], widths: list[int] | None = None) -> str:
    widths = widths or []
    max_cols = max((len(row) for row in rows), default=1)
    dimension = f"A1:{cell_ref(len(rows), max_cols)}"
    cols_xml = ""
    if widths:
        cols = []
        for idx, width in enumerate(widths, start=1):
            cols.append(f'<col min="{idx}" max="{idx}" width="{width}" customWidth="1"/>')
        cols_xml = f"<cols>{''.join(cols)}</cols>"

    row_xml = []
    for r_idx, row in enumerate(rows, start=1):
        cells = []
        for c_idx in range(1, max_cols + 1):
            value = row[c_idx - 1] if c_idx <= len(row) else ""
            ref = cell_ref(r_idx, c_idx)
            style = ' s="1"' if r_idx == 1 else ""
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                cells.append(f'<c r="{ref}"{style}><v>{value}</v></c>')
            else:
                text = escape(str(value or ""))
                cells.append(f'<c r="{ref}" t="inlineStr"{style}><is><t>{text}</t></is></c>')
        row_xml.append(f'<row r="{r_idx}">{"".join(cells)}</row>')

    auto_filter = f'<autoFilter ref="{dimension}"/>' if rows else ""
    freeze = (
        '<sheetViews><sheetView workbookViewId="0">'
        '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
        "</sheetView></sheetViews>"
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<dimension ref=\"{dimension}\"/>"
        f"{freeze}{cols_xml}<sheetData>{''.join(row_xml)}</sheetData>{auto_filter}"
        "</worksheet>"
    )


def xlsx_package(sheets: list[tuple[str, list[list[object]], list[int]]], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    now = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "[Content_Types].xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            '<Default Extension="xml" ContentType="application/xml"/>'
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
            '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
            '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
            + "".join(
                f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
                for i in range(1, len(sheets) + 1)
            )
            + "</Types>",
        )
        z.writestr(
            "_rels/.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
            '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
            "</Relationships>",
        )
        z.writestr(
            "docProps/core.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
            'xmlns:dc="http://purl.org/dc/elements/1.1/" '
            'xmlns:dcterms="http://purl.org/dc/terms/" '
            'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
            "<dc:title>CUCKOO Nano SEO Redirect Report</dc:title>"
            "<dc:creator>Codex</dc:creator>"
            f'<dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>'
            f'<dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>'
            "</cp:coreProperties>",
        )
        z.writestr(
            "docProps/app.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
            'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
            "<Application>Codex</Application></Properties>",
        )
        workbook_sheets = []
        rels = []
        for idx, (name, _rows, _widths) in enumerate(sheets, start=1):
            workbook_sheets.append(
                f'<sheet name="{escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>'
            )
            rels.append(
                f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{idx}.xml"/>'
            )
        rels.append(
            f'<Relationship Id="rId{len(sheets)+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        )
        z.writestr(
            "xl/workbook.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            f"<sheets>{''.join(workbook_sheets)}</sheets></workbook>",
        )
        z.writestr(
            "xl/_rels/workbook.xml.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            f"{''.join(rels)}</Relationships>",
        )
        z.writestr(
            "xl/styles.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
            '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'
            '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
            '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
            '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/></cellXfs>'
            '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
            "</styleSheet>",
        )
        for idx, (_name, rows, widths) in enumerate(sheets, start=1):
            z.writestr(f"xl/worksheets/sheet{idx}.xml", sheet_xml(rows, widths))


def route_from_file(path: Path) -> str:
    rel = path.parent.relative_to(ROOT / "src/pages").as_posix()
    if rel == ".":
        return "/"
    return "/" + rel + "/"


def normalize_source(source: str) -> str:
    return source if source.endswith("/") else source + "/"


def parse_redirects() -> list[list[object]]:
    redirect_file = ROOT / "public/_redirects"
    redirects: dict[str, dict[str, object]] = {}
    if redirect_file.exists():
        for raw in redirect_file.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) < 2:
                continue
            source, target = parts[0], parts[1]
            status = parts[2] if len(parts) > 2 else "301"
            norm = normalize_source(source)
            item = redirects.setdefault(
                norm,
                {
                    "source": norm,
                    "target": target,
                    "status": status,
                    "variants": set(),
                },
            )
            item["variants"].add(source)

    rows = [
        [
            "Type",
            "Old URL / Route",
            "Final URL",
            "HTTP Status",
            "Source",
            "File Path",
            "Notes",
        ]
    ]
    for source in sorted(redirects):
        item = redirects[source]
        variants = item["variants"]
        note = "Slash + non-slash variants covered" if len(variants) > 1 else "Single redirect rule"
        rows.append([
            "Redirect",
            item["source"],
            item["target"],
            item["status"],
            "public/_redirects",
            "",
            note,
        ])

    route_files = sorted((ROOT / "src/pages").glob("**/index.astro"))
    redirect_sources = set(redirects)
    for file in route_files:
        route = route_from_file(file)
        if route in redirect_sources:
            continue
        rows.append([
            "Kekal",
            route,
            route,
            "200",
            "Astro route",
            file.relative_to(ROOT).as_posix(),
            "File/page kekal, no redirect source",
        ])
    return rows


def extract_value(text: str, keys: list[str]) -> str:
    for key in keys:
        patterns = [
            rf"{re.escape(key)}\s*:\s*(['\"])(.*?)\1",
            rf"{re.escape(key)}\s*=\s*(['\"])(.*?)\1",
            rf"{re.escape(key)}\s*:\s*`([^`]*)`",
            rf"{re.escape(key)}\s*=\s*`([^`]*)`",
        ]
        for pattern in patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                value = match.group(2) if len(match.groups()) >= 2 and match.group(2) is not None else match.group(1)
                return re.sub(r"\s+", " ", value).strip()
    return "belum"


def extract_h1(text: str) -> str:
    article_title = extract_value(text, ["articleTitle"])
    if article_title != "belum":
        return article_title
    match = re.search(r"<h1[^>]*>(.*?)</h1>", text, re.DOTALL)
    if not match:
        return "belum"
    value = re.sub(r"<[^>]+>", "", match.group(1))
    value = re.sub(r"\{([^}]+)\}", r"\1", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value or "belum"


def seo_rows() -> list[list[object]]:
    rows = [
        [
            "Route",
            "Type",
            "File Path",
            "Meta Title",
            "Meta Description",
            "Canonical",
            "OG Image",
            "OG Type",
            "H1 / Article Title",
            "Published Date",
            "Modified Date",
            "On-page SEO Status",
        ]
    ]
    for file in sorted((ROOT / "src/pages").glob("**/index.astro")):
        text = file.read_text(encoding="utf-8")
        route = route_from_file(file)
        page_type = "Blog" if route.startswith("/blog/") else "Page"
        title = extract_value(text, ["title"])
        description = extract_value(text, ["description"])
        canonical = extract_value(text, ["canonical"])
        og_image = extract_value(text, ["ogImage"])
        og_type = extract_value(text, ["ogType"])
        h1 = extract_h1(text)
        published = extract_value(text, ["publishedDate"])
        modified = extract_value(text, ["modifiedDate"])
        missing = [
            label
            for label, value in [
                ("meta title", title),
                ("meta description", description),
                ("canonical", canonical),
                ("og image", og_image),
                ("og type", og_type),
                ("h1", h1),
            ]
            if value == "belum"
        ]
        status = "Lengkap asas" if not missing else "Belum: " + ", ".join(missing)
        rows.append([
            route,
            page_type,
            file.relative_to(ROOT).as_posix(),
            title,
            description,
            canonical,
            og_image,
            og_type,
            h1,
            published,
            modified,
            status,
        ])
    return rows


def main() -> None:
    redirect_rows = parse_redirects()
    seo = seo_rows()
    sheets = [
        ("Redirect & Kekal", redirect_rows, [16, 54, 56, 12, 20, 55, 36]),
        ("On-page SEO", seo, [42, 12, 58, 55, 80, 68, 70, 14, 55, 16, 16, 38]),
    ]
    xlsx_package(sheets, OUTPUT_FILE)
    print(f"created={OUTPUT_FILE}")
    print(f"redirect_rows={len(redirect_rows)-1}")
    print(f"seo_rows={len(seo)-1}")


if __name__ == "__main__":
    main()
