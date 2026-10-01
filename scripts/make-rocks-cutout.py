"""Extract the connected mountain foreground from the supplied night photograph.

Usage:
    python scripts/make-rocks-cutout.py source.png public/hero/rocks_silhouette.png public/hero/sky-plate.webp

Requires Pillow: python -m pip install Pillow
The PNG keeps the source dimensions so it aligns exactly with a copy used as sky.
"""

from argparse import ArgumentParser
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


def make_cutout(source: Path, destination: Path, sky_destination: Path | None = None) -> None:
    photo = Image.open(source).convert("RGB")
    width, height = photo.size
    pixels = photo.load()
    candidate = Image.new("L", photo.size, 0)
    mask_pixels = candidate.load()

    # The warm rock has more red than blue; the sky remains strongly blue.
    # Include very dark stone, then discard detached stars with a flood fill.
    for y in range(round(height * 0.55), height):
        for x in range(width):
            red, green, blue = pixels[x, y]
            if red - blue > -22 or (red < 25 and green < 35 and blue < 48):
                mask_pixels[x, y] = 255

    candidate = candidate.filter(ImageFilter.MedianFilter(3))
    candidate = candidate.filter(ImageFilter.MaxFilter(3))
    candidate = candidate.filter(ImageFilter.MinFilter(3))
    ImageDraw.floodfill(candidate, (width // 2, height - 1), 128, thresh=0)

    # Pull the matte one pixel inside the rock. This drops the blue sky pixels
    # that otherwise become a bright outline against the darker sky plate.
    solid = candidate.point(lambda value: 255 if value == 128 else 0)
    solid = solid.filter(ImageFilter.MinFilter(3))
    alpha = solid.filter(ImageFilter.GaussianBlur(0.55))
    rocks = photo.convert("RGBA")
    rocks.putalpha(alpha)
    rock_pixels = rocks.load()
    solid_pixels = solid.load()
    alpha_pixels = alpha.load()
    for y in range(round(height * 0.55), height):
        for x in range(width):
            if 0 < alpha_pixels[x, y] < 255:
                # Reuse nearby interior rock color at partially transparent
                # pixels instead of blending a sky-blue source pixel into the edge.
                for distance in range(1, 5):
                    neighbor_y = min(height - 1, y + distance)
                    if solid_pixels[x, neighbor_y] == 255:
                        red, green, blue = pixels[x, neighbor_y]
                        rock_pixels[x, y] = red, green, blue, alpha_pixels[x, y]
                        break
    destination.parent.mkdir(parents=True, exist_ok=True)
    rocks.save(destination, optimize=True)

    if sky_destination:
        # The original full photo remains a separate asset. A sky-only plate
        # prevents a duplicate ridge from showing when the foreground moves.
        softened_photo = photo.filter(ImageFilter.GaussianBlur(12))
        soft_pixels = softened_photo.load()
        sky_plate = photo.copy()
        sky_pixels = sky_plate.load()
        connected_pixels = candidate.load()
        for x in range(width):
            ridge = next(
                (y for y in range(round(height * 0.55), height) if connected_pixels[x, y] == 128),
                height - 1,
            )
            sky_color = soft_pixels[x, max(0, ridge - 22)]
            for y in range(ridge - 4, height):
                sky_pixels[x, y] = sky_color
        sky_destination.parent.mkdir(parents=True, exist_ok=True)
        sky_plate.save(sky_destination, quality=88, method=6)


if __name__ == "__main__":
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("sky_destination", type=Path, nargs="?")
    options = parser.parse_args()
    make_cutout(options.source, options.destination, options.sky_destination)
