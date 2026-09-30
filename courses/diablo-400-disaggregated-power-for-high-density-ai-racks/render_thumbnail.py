#!/usr/bin/env python3
"""Render the Diablo 400 LMS poster in the maintained Academy catalog style."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
REPO_REFERENCE = ROOT.parent / "ai-computing-continuum" / "thumbnail.png"
SKILL_REFERENCE = Path.home() / ".codex/skills/academy-wizard/references/posters/sst.png"
REFERENCE = REPO_REFERENCE if REPO_REFERENCE.exists() else SKILL_REFERENCE
OUTPUT = ROOT / "thumbnail.png"
SCALE = 3
NAVY = (27, 32, 85)
GREEN = (141, 198, 63)
WHITE = (255, 255, 255)
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"


def xy(values):
    return tuple(round(v * SCALE) for v in values)


def color(rgb, alpha=255):
    return (*rgb, alpha)


def mix(a, b, t):
    return tuple(round(x * (1 - t) + y * t) for x, y in zip(a, b))


def font(size, black=False):
    return ImageFont.truetype(FONT_BLACK if black else FONT_BOLD, round(size * SCALE))


def text(draw, location, value, size, fill=WHITE, black=False):
    draw.text(xy(location), value, font=font(size, black), fill=color(fill), anchor="lt")


def academy_logo():
    """Lift only white logo pixels from the authoritative SST catalog poster."""
    source = Image.open(REFERENCE).convert("RGB").crop((40, 25, 200, 100))
    logo = Image.new("RGBA", source.size, (255, 255, 255, 0))
    pixels = source.load()
    out = logo.load()
    for y in range(source.height):
        for x in range(source.width):
            r, g, b = pixels[x, y]
            intensity = min(r, g, b)
            alpha = max(0, min(255, round((intensity - 45) * 255 / 180)))
            if alpha > 7:
                out[x, y] = (255, 255, 255, alpha)
    return logo


def draw_poster():
    width, height = 800 * SCALE, 400 * SCALE
    image = Image.new("RGBA", (width, height))
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            t = min(1, max(0, (x / width * 0.78 + y / height * 0.22)))
            pixels[x, y] = color(mix(NAVY, (52, 59, 141), t))
    draw = ImageDraw.Draw(image, "RGBA")

    draw.polygon([xy(p) for p in [(575, 0), (800, 0), (800, 400), (655, 400)]], fill=(89, 102, 174, 70))
    draw.polygon([xy(p) for p in [(612, 0), (800, 0), (800, 400), (683, 400)]], fill=(115, 127, 189, 70))
    for x in range(625 * SCALE, width):
        top_edge = 625 * SCALE
        bottom_edge = 692 * SCALE
        if x < bottom_edge:
            # The left edge of the angled rail sweeps right as it descends.
            y_end = min(height, round((x - top_edge) * height / (bottom_edge - top_edge)))
            if y_end <= 0:
                continue
            rail_range = range(0, y_end)
        else:
            rail_range = range(height)
        for y in rail_range:
            t = y / height
            pixels[x, y] = color(mix((164, 213, 83), (108, 167, 45), t))

    # Signals behind the emblem remain deliberately quiet.
    arc_box = xy((510, 75, 776, 333))
    draw.arc(arc_box, 112, 248, fill=(194, 201, 238, 86), width=2 * SCALE)
    for line in [(529, 94, 566, 94), (524, 305, 568, 305), (723, 92, 761, 92), (726, 305, 761, 305)]:
        draw.line(xy(line), fill=(210, 222, 243, 112), width=2 * SCALE)
    for center in [(529, 94), (524, 305), (761, 92), (761, 305)]:
        x, y = center
        draw.ellipse(xy((x - 4.5, y - 4.5, x + 4.5, y + 4.5)), fill=(219, 231, 244, 158))

    # Catalog emblem with a lightly shaded face.
    draw.ellipse(xy((525, 74, 775, 324)), fill=(80, 89, 161, 255))
    draw.ellipse(xy((529, 78, 771, 320)), fill=(250, 251, 255, 255))
    draw.pieslice(xy((529, 78, 771, 320)), 0, 180, fill=(238, 241, 249, 255))
    draw.ellipse(xy((534, 83, 766, 315)), outline=(255, 255, 255, 145), width=2 * SCALE)

    # Sidecar power rack and IT rack. The three green paths convey the
    # multi-conductor DC interface without claiming to be a wiring diagram.
    draw.rounded_rectangle(xy((571, 137, 643, 267)), radius=10 * SCALE, fill=(42, 50, 105), outline=(111, 127, 176), width=2 * SCALE)
    draw.rounded_rectangle(xy((577, 143, 637, 261)), radius=6 * SCALE, outline=(119, 135, 175), width=2 * SCALE)
    for top in (153, 177, 201, 225):
        draw.rounded_rectangle(xy((583, top, 631, top + 16)), radius=3 * SCALE, fill=color(GREEN))
    for x in (591, 603):
        draw.ellipse(xy((x - 3, 246, x + 3, 252)), fill=(197, 211, 234))

    draw.rounded_rectangle(xy((682, 137, 731, 267)), radius=9 * SCALE, fill=(42, 50, 105), outline=(111, 127, 176), width=2 * SCALE)
    draw.rounded_rectangle(xy((687, 143, 726, 261)), radius=5 * SCALE, outline=(119, 135, 175), width=2 * SCALE)
    for y in (158, 174, 190, 206, 222, 238):
        draw.line(xy((694, y, 718, y)), fill=(221, 230, 241), width=5 * SCALE)
    draw.ellipse(xy((694, 247, 700, 253)), fill=color(GREEN))

    for y in (174, 201, 228):
        draw.line(xy((642, y, 673, y)), fill=color(GREEN), width=5 * SCALE)
        draw.line([xy((673, y - 7)), xy((680, y)), xy((673, y + 7))], fill=color(GREEN), width=5 * SCALE, joint="curve")

    # Text hierarchy and authoritative Academy mark.
    draw.rounded_rectangle(xy((44, 117, 182, 146)), radius=15 * SCALE, fill=color(GREEN))
    text(draw, (66, 126), "OCP DIABLO", 15, NAVY)
    text(draw, (42, 159), "DIABLO 400", 57, black=True)
    text(draw, (43, 236), "DISAGGREGATED POWER", 26)
    draw.rounded_rectangle(xy((43, 286, 105, 290)), radius=2 * SCALE, fill=color(GREEN))
    text(draw, (43, 305), "For high-density AI racks", 21)

    image = image.convert("RGB").resize((800, 400), Image.Resampling.LANCZOS)
    logo = academy_logo()
    image.paste(logo, (42, 29), logo)
    image.save(OUTPUT, optimize=True)


if __name__ == "__main__":
    draw_poster()
    print(OUTPUT)
