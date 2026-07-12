#!/usr/bin/env python3
"""
Overlay coupon codes onto the card-back PDF template.

Usage (from tools/):
  .venv/bin/python render_coupon_cards.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not installed. Run: .venv/bin/pip install -r requirements.txt", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
OUT = ROOT / "out"

TEMPLATE = ASSETS / "card_back_ver1_template.pdf"
FONT_PATH = ASSETS / "Helvetica.ttc"
CODES_PATH = ASSETS / "codes.txt"

# Typography / placement (coordinates from page top-left, bottom-left of text)
FONT_SIZE = 18
LETTER_SPACING = -0.05  # -5% of each glyph advance
TEXT_X = 30
TEXT_Y = 220  # baseline y from top of page
TEXT_COLOR = (0, 0, 0)  # pure black


def load_codes(path: Path) -> list[str]:
    codes: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\s*\d+\.\s+([A-Z0-9]+)\s*$", line.strip())
        if m:
            codes.append(m.group(1))
    if not codes:
        raise SystemExit(f"No codes found in {path}")
    return codes


def draw_tracked_text(
    page: fitz.Page,
    text: str,
    x: float,
    y: float,
    fontfile: str,
    fontsize: float,
    color: tuple[float, float, float],
    letter_spacing: float,
) -> None:
    """Draw text with letter-spacing relative to glyph advances. (x,y) = baseline start from top-left."""
    font = fitz.Font(fontfile=fontfile)
    tw = fitz.TextWriter(page.rect, color=color)
    cursor_x = x
    for ch in text:
        # TextWriter pos is the baseline start of this glyph (top-left page coords)
        tw.append(fitz.Point(cursor_x, y), ch, font=font, fontsize=fontsize)
        advance = font.glyph_advance(ord(ch)) * fontsize
        cursor_x += advance * (1.0 + letter_spacing)
    tw.write_text(page)


def render_card(code: str, index: int) -> Path:
    doc = fitz.open(TEMPLATE)
    page = doc[0]
    draw_tracked_text(
        page,
        code,
        x=TEXT_X,
        y=TEXT_Y,
        fontfile=str(FONT_PATH),
        fontsize=FONT_SIZE,
        color=TEXT_COLOR,
        letter_spacing=LETTER_SPACING,
    )
    out_path = OUT / f"coupon_{index:02d}_{code}.pdf"
    doc.save(out_path)
    doc.close()
    return out_path


def main() -> None:
    for path in (TEMPLATE, FONT_PATH, CODES_PATH):
        if not path.exists():
            raise SystemExit(f"Missing asset: {path}")

    OUT.mkdir(parents=True, exist_ok=True)
    codes = load_codes(CODES_PATH)
    print(f"Rendering {len(codes)} cards → {OUT}")

    for i, code in enumerate(codes, start=1):
        out = render_card(code, i)
        print(f"  {i:02d}. {code} → {out.name}")

    print("Done.")


if __name__ == "__main__":
    main()
