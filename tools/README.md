# Coupon card renderer

Generates one PDF per coupon code by stamping the code onto the card-back template.

## Setup (once)

```bash
cd tools
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

## Assets (already copied here)

| File | Purpose |
|------|---------|
| `assets/card_back_ver1_template.pdf` | Card template |
| `assets/Helvetica.ttc` | Font |
| `assets/codes.txt` | Coupon list |

## Render

```bash
cd tools
.venv/bin/python render_coupon_cards.py
```

Outputs: `tools/out/coupon_01_XXXXXXXX.pdf` … `coupon_20_….pdf`

## Tunables

Edit the constants at the top of `render_coupon_cards.py`:

- `FONT_SIZE` (18)
- `LETTER_SPACING` (-0.05 = -5%)
- `TEXT_X` / `TEXT_Y` (30, 220 from top-left; Y is text baseline)
- `TEXT_COLOR` (pure black)
