"""Render the OCP ESUN LMS poster at the Academy catalog's exact 800×400 size.

The cached OCP Academy mark is rasterized without alteration from the
authoritative ``skills/academy-wizard/assets/ocp_academy_white.svg`` asset.
All other artwork stays editable here as simple vector-like drawing primitives.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
SKILL_ASSETS = ROOT.parents[1] / "skills/academy-wizard/assets"
SCALE = 4
WIDTH, HEIGHT = 800, 400
SIZE = (WIDTH * SCALE, HEIGHT * SCALE)
NAVY = (28, 34, 86, 255)
INDIGO = (52, 58, 134, 255)
GREEN = (141, 198, 63, 255)
WHITE = (255, 255, 255, 255)


def xy(point):
    return tuple(round(value * SCALE) for value in point)


def box(rect):
    return tuple(round(value * SCALE) for value in rect)


def mix(start, end, fraction):
    return tuple(round(a + (b - a) * fraction) for a, b in zip(start, end))


def horizontal_gradient(left, right, size=SIZE):
    canvas = Image.new("RGBA", size)
    drawing = ImageDraw.Draw(canvas)
    for x in range(size[0]):
        color = mix(left, right, x / max(1, size[0] - 1))
        drawing.line((x, 0, x, size[1]), fill=color)
    return canvas


def tracked_text(drawing, left, top, text, font, fill, tracking=0):
    cursor = left * SCALE
    # Use a shared baseline. Aligning each glyph by its own top puts the
    # hyphen in SCALE-UP level with the capitals' top edges.
    baseline = top * SCALE - font.getbbox("H", anchor="ls")[1]
    for character in text:
        drawing.text((round(cursor), round(baseline)), character,
                     font=font, fill=fill, anchor="ls")
        cursor += font.getlength(character) + tracking * SCALE
    return cursor / SCALE


def main():
    poster = horizontal_gradient((27, 32, 82, 255), INDIGO)

    layers = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layers)
    draw.polygon([xy(p) for p in ((570, 0), (800, 0), (800, 400), (654, 400))],
                 fill=(110, 116, 195, 68))
    poster = Image.alpha_composite(poster, layers)

    rail_mask = Image.new("L", SIZE)
    ImageDraw.Draw(rail_mask).polygon(
        [xy(p) for p in ((603, 0), (800, 0), (800, 400), (684, 400))],
        fill=255,
    )
    rail = horizontal_gradient((160, 211, 75, 255), (113, 173, 47, 255))
    poster.paste(rail, (0, 0), rail_mask)

    layers = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layers)
    draw.polygon([xy(p) for p in ((576, 0), (605, 0), (685, 400), (656, 400))],
                 fill=(37, 42, 112, 140))
    poster = Image.alpha_composite(poster, layers)

    # Sparse arc and connector accents, all kept outside the text field.
    layers = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layers)
    draw.arc(box((511, 88, 755, 312)), 109, 251,
             fill=(169, 175, 217, 110), width=2 * SCALE)
    for x1, y1, x2, y2 in ((538, 91, 566, 91), (538, 309, 568, 309),
                            (734, 91, 755, 91), (735, 309, 756, 309)):
        draw.line(box((x1, y1, x2, y2)), fill=(216, 221, 229, 112),
                  width=2 * SCALE)
    for x, y, radius, color in (
        (528, 91, 5, (162, 167, 204, 128)),
        (536, 111, 4, (183, 187, 213, 140)),
        (536, 288, 4, (183, 187, 213, 140)),
        (528, 309, 5, (162, 167, 204, 128)),
        (758, 91, 5, (213, 230, 166, 184)),
        (758, 309, 5, (213, 230, 166, 184)),
    ):
        draw.ellipse(box((x-radius, y-radius, x+radius, y+radius)), fill=color)
    poster = Image.alpha_composite(poster, layers)

    disc_mask = Image.new("L", SIZE)
    ImageDraw.Draw(disc_mask).ellipse(box((529, 78, 773, 322)), fill=255)
    disc = horizontal_gradient((244, 245, 249, 255), (250, 252, 246, 255))
    poster.paste(disc, (0, 0), disc_mask)
    draw = ImageDraw.Draw(poster)
    draw.ellipse(box((529, 78, 773, 322)), outline=(100, 106, 173, 255),
                 width=4 * SCALE)
    draw.ellipse(box((534, 83, 768, 317)), outline=(255, 255, 255, 160),
                 width=3 * SCALE)

    tile_mask = Image.new("L", SIZE)
    ImageDraw.Draw(tile_mask).rounded_rectangle(box((582, 130, 720, 270)),
                                                radius=38 * SCALE, fill=255)
    tile = horizontal_gradient((58, 68, 134, 255), (122, 179, 66, 255))
    poster.paste(tile, (0, 0), tile_mask)

    # One symbolic Ethernet switch plane and four coupled endpoints.
    draw = ImageDraw.Draw(poster)
    for segment in ((651, 162, 651, 185), (651, 215, 651, 238),
                    (612, 200, 635, 200), (667, 200, 690, 200)):
        draw.line(box(segment), fill=WHITE, width=8 * SCALE, joint="curve")
    draw.rounded_rectangle(box((635, 184, 667, 216)), radius=8 * SCALE,
                           outline=WHITE, width=7 * SCALE)
    for x, y, radius in ((651, 157, 11), (651, 243, 11),
                         (607, 200, 11), (695, 200, 11), (651, 200, 5)):
        draw.ellipse(box((x-radius, y-radius, x+radius, y+radius)), fill=WHITE)

    logo = Image.open(ROOT / "poster_assets/ocp_academy_white_raster.png").convert("RGBA")
    logo = logo.resize(xy((160, 79)), Image.Resampling.LANCZOS)
    poster.alpha_composite(logo, xy((41, 20)))

    draw = ImageDraw.Draw(poster)
    draw.rounded_rectangle(box((43, 117, 150, 145)), radius=14 * SCALE,
                           fill=GREEN)
    bold = SKILL_ASSETS / "fonts/lato2-bold.woff"
    badge_font = ImageFont.truetype(bold, 14 * SCALE)
    title_font = ImageFont.truetype(bold, 40 * SCALE)
    support_font = ImageFont.truetype(bold, 18 * SCALE)
    tracked_text(draw, 55, 127, "OCP ESUN", badge_font, NAVY, 1.4)
    tracked_text(draw, 42, 163, "ETHERNET FOR", title_font, WHITE, 0.7)
    tracked_text(draw, 42, 208, "SCALE-UP NETWORKS", title_font, WHITE, 0.7)
    draw.rounded_rectangle(box((44, 269, 104, 273)), radius=2 * SCALE,
                           fill=GREEN)
    draw.text(xy((42, 293)), "Ethernet built for tightly", font=support_font,
              fill=WHITE, anchor="lt")
    draw.text(xy((42, 318)), "coupled AI fabrics.", font=support_font,
              fill=WHITE, anchor="lt")

    poster = poster.convert("RGB")
    poster.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(
        ROOT / "thumbnail.png", format="PNG", optimize=True,
    )


if __name__ == "__main__":
    main()
