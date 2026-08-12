from __future__ import annotations

import base64
import html
import mimetypes
import re
from pathlib import Path


ROOT = Path("/Users/kotenterprises/Desktop/People First")
MD_PATH = ROOT / "output/qa/PeopleFirst_Final_QA_Validation_Report.md"
HTML_PATH = ROOT / "tmp/pdfs/PeopleFirst_Client_QA_Closure_Report.html"


def file_data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def inline_markup(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
    return text


def render_markdown(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    paragraph: list[str] = []
    in_list = False
    in_table = False
    table_rows: list[list[str]] = []

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            out.append("<p>" + " ".join(inline_markup(x) for x in paragraph) + "</p>")
            paragraph = []

    def flush_list() -> None:
        nonlocal in_list
        if in_list:
            out.append("</ul>")
            in_list = False

    def flush_table() -> None:
        nonlocal in_table, table_rows
        if not in_table:
            return
        if table_rows:
            head, *body = table_rows
            out.append("<table><thead><tr>" + "".join(f"<th>{inline_markup(c)}</th>" for c in head) + "</tr></thead><tbody>")
            for row in body:
                out.append("<tr>" + "".join(f"<td>{inline_markup(c)}</td>" for c in row) + "</tr>")
            out.append("</tbody></table>")
        in_table = False
        table_rows = []

    for raw in lines:
        line = raw.rstrip()
        if not line:
            flush_paragraph(); flush_list(); flush_table()
            continue

        if line == "---":
            flush_paragraph(); flush_list(); flush_table(); out.append("<hr>")
            continue

        image_match = re.fullmatch(r"!\[([^]]*)\]\(([^)]+)\)", line)
        if image_match:
            flush_paragraph(); flush_list(); flush_table()
            alt, rel = image_match.groups()
            img_path = (MD_PATH.parent / rel).resolve()
            out.append(f'<figure><img src="{file_data_uri(img_path)}" alt="{html.escape(alt)}"></figure>')
            continue

        if line.startswith("|") and line.endswith("|"):
            flush_paragraph(); flush_list()
            cells = [c.strip() for c in line.strip("|").split("|")]
            if all(re.fullmatch(r":?-{3,}:?", c) for c in cells):
                in_table = True
                continue
            in_table = True
            table_rows.append(cells)
            continue
        elif in_table:
            flush_table()

        heading = re.match(r"^(#{1,3})\s+(.+)$", line)
        if heading:
            flush_paragraph(); flush_list()
            level = len(heading.group(1))
            title = heading.group(2)
            if level == 1:
                out.append(f'<section class="cover"><div class="cover-mark">PF</div><h1>{inline_markup(title)}</h1>')
            elif level == 2:
                if title == "Final QA Closure Report" and out and out[-1].startswith('<section class="cover">'):
                    out.append(f'<h2 class="cover-title">{inline_markup(title)}</h2>')
                else:
                    out.append(f'<h2>{inline_markup(title)}</h2>')
            else:
                out.append(f'<h3>{inline_markup(title)}</h3>')
            continue

        if line.startswith("- "):
            flush_paragraph(); flush_table()
            if not in_list:
                out.append("<ul>"); in_list = True
            item = line[2:]
            checked = item.startswith("[x] ")
            if checked:
                item = "✓ " + item[4:]
            out.append(f"<li>{inline_markup(item)}</li>")
            continue

        if line.startswith("*") and line.endswith("*") and not line.startswith("**"):
            flush_paragraph(); flush_list(); flush_table()
            out.append(f'<p class="caption">{inline_markup(line[1:-1])}</p>')
            continue

        paragraph.append(line[:-2] if line.endswith("  ") else line)

    flush_paragraph(); flush_list(); flush_table()
    body = "\n".join(out)
    # Close the cover immediately before the first numbered report section.
    body = body.replace('<h2>1. Executive Summary</h2>', '</section><h2>1. Executive Summary</h2>', 1)
    return body


STYLE = r"""
@page { size: A4; margin: 17mm 17mm 18mm; }
* { box-sizing: border-box; }
html { font-family: Arial, Helvetica, sans-serif; color: #171717; font-size: 10.2pt; }
body { margin: 0; line-height: 1.46; }
p { margin: 0 0 10px; }
h1, h2, h3 { font-family: Arial, Helvetica, sans-serif; break-after: avoid; }
h1 { color: #245b92; font-size: 25pt; margin: 0 0 5px; }
h2 { color: #2b6195; font-size: 16pt; margin: 24px 0 8px; }
h3 { color: #8c2835; font-size: 11.2pt; margin: 20px 0 8px; border-left: 4px solid #8c2835; padding-left: 8px; }
hr { border: 0; height: 1px; background: #d9dee5; margin: 22px 0; }
ul { margin: 4px 0 12px 19px; padding: 0; }
li { margin: 2px 0; }
strong { font-weight: 700; }
code { font-family: Arial, Helvetica, sans-serif; background: #f1f4f6; padding: 1px 3px; border-radius: 2px; }
.cover { height: 258mm; position: relative; padding: 56mm 13mm 20mm; background: linear-gradient(145deg,#f9fcff 0%,#ffffff 55%,#f4f2fa 100%); border-top: 9px solid #2f6399; break-after: page; }
.cover::after { content: ""; position: absolute; right: 0; bottom: 0; width: 112mm; height: 70mm; opacity: .16; background: radial-gradient(circle at 35% 40%,#35c1bb 0 8%,transparent 9%), radial-gradient(circle at 60% 50%,#a63853 0 9%,transparent 10%), radial-gradient(circle at 80% 72%,#3b1c82 0 12%,transparent 13%); }
.cover h1 { color: #2c5f96; font-size: 31pt; }
.cover .cover-title { color: #6d214f; font-size: 25pt; margin: 6px 0 28px; }
.cover p { font-size: 13pt; max-width: 120mm; color: #424a52; }
.cover-mark { display: grid; place-items: center; width: 29mm; height: 29mm; border-radius: 50%; background: linear-gradient(135deg,#2d1d72,#b03255 55%,#51bcb5); color: white; font-size: 21pt; font-weight: 800; margin-bottom: 15mm; }
table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-size: 7.7pt; break-inside: auto; }
thead { display: table-header-group; }
tr { break-inside: avoid; }
th { background: #edf3f8; color: #244f79; text-align: left; }
th, td { border: 1px solid #777; padding: 4px 5px; vertical-align: top; }
figure { margin: 9px 0 3px; text-align: center; break-inside: avoid; }
figure img { display: block; max-width: 100%; max-height: 103mm; width: auto; height: auto; margin: 0 auto; border: 1px solid #d5d9dd; box-shadow: 0 2px 9px rgba(25,42,58,.12); }
.caption { text-align: center; font-size: 8pt; color: #535c65; margin: 4px 8px 14px; break-after: avoid; }
h3 + p { margin-top: 0; }
h3, h3 + p, h3 + p + figure { break-inside: avoid; }
"""


content = render_markdown(MD_PATH.read_text(encoding="utf-8"))
document = f"""<!doctype html><html><head><meta charset="utf-8"><title>PeopleFirst Final QA Closure Report</title><style>{STYLE}</style></head><body>{content}</body></html>"""
HTML_PATH.parent.mkdir(parents=True, exist_ok=True)
HTML_PATH.write_text(document, encoding="utf-8")
print(HTML_PATH)
