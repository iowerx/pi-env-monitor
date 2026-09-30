#!/usr/bin/env python3
"""Generate the seven-pose image set for Mecha, the clockwork owl mascot.

Mecha is drawn as flat-vector SVG (gold head, wings, and legs; silver
scalloped chest; big silver lens eyes with spoked apertures) and rendered to
transparent RGBA PNGs trimmed to their content, matching what the
book-installer learning-mascot feature expects in docs/img/mascot/.

Usage:
    python scripts/generate-mecha-mascot.py            # PNGs only
    python scripts/generate-mecha-mascot.py --svg      # also keep the SVGs

Requires: cairosvg, Pillow
"""

import argparse
import io
import math
import random
from pathlib import Path

import cairosvg
from PIL import Image

OUT_DIR = Path(__file__).resolve().parent.parent / "docs" / "img" / "mascot"
RENDER_HEIGHT = 2400  # supersampled render height before downscaling
MAX_SIZE = 400        # longest side of the final PNG (learning-mascot spec)
ALPHA_THRESH = 10     # matches book-installer's trim-padding-from-image.py
TRIM_PAD = 4

# ---------------------------------------------------------------- palette
INK = "#2B2622"           # outline
GOLD_HI = "#FFE7A0"
GOLD = "#F2B632"
GOLD_LO = "#B7791F"
GOLD_LINE = "#9A6414"
SILVER_HI = "#FBFCFD"
SILVER = "#C9D0D8"
SILVER_LO = "#8C96A1"
STEEL = "#5E6975"
IRIS_HI = "#FF8A50"
IRIS_LO = "#C62828"
INDIGO = "#3F51B5"
ORANGE = "#FF9800"
OUTLINE_W = 7

# Character anchor points (pre-mirror, left side of the owl)
CX = 400
HEAD_C = (400, 300)
HEAD_R = (215, 172)
BODY_C = (400, 605)
BODY_R = (185, 212)
EYE_L = (306, 305)
EYE_R = (494, 305)
SHOULDER = (246, 440)


def f(v):
    return f"{v:.1f}"


def rot(x, y, deg):
    a = math.radians(deg)
    return x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a)


def polar(origin, deg, length):
    a = math.radians(deg)
    return origin[0] + length * math.cos(a), origin[1] + length * math.sin(a)


# ------------------------------------------------------------------ defs
DEFS = f"""
<defs>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{GOLD_HI}"/>
    <stop offset="0.45" stop-color="{GOLD}"/>
    <stop offset="1" stop-color="{GOLD_LO}"/>
  </linearGradient>
  <linearGradient id="goldSide" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="{GOLD_LO}"/>
    <stop offset="0.5" stop-color="{GOLD}"/>
    <stop offset="1" stop-color="{GOLD_HI}"/>
  </linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{SILVER_HI}"/>
    <stop offset="0.55" stop-color="{SILVER}"/>
    <stop offset="1" stop-color="{SILVER_LO}"/>
  </linearGradient>
  <radialGradient id="dish" cx="0.4" cy="0.35" r="0.75">
    <stop offset="0" stop-color="{SILVER_HI}"/>
    <stop offset="0.6" stop-color="{SILVER}"/>
    <stop offset="1" stop-color="{SILVER_LO}"/>
  </radialGradient>
  <radialGradient id="iris" cx="0.4" cy="0.35" r="0.7">
    <stop offset="0" stop-color="{IRIS_HI}"/>
    <stop offset="1" stop-color="{IRIS_LO}"/>
  </radialGradient>
  <radialGradient id="bulb" cx="0.4" cy="0.35" r="0.7">
    <stop offset="0" stop-color="#FFFBE0"/>
    <stop offset="0.6" stop-color="#FFE45C"/>
    <stop offset="1" stop-color="#F9B924"/>
  </radialGradient>
  <clipPath id="bodyClip">
    <ellipse cx="{BODY_C[0]}" cy="{BODY_C[1]}" rx="{BODY_R[0]}" ry="{BODY_R[1]}"/>
  </clipPath>
  <clipPath id="headClip">
    <ellipse cx="{HEAD_C[0]}" cy="{HEAD_C[1]}" rx="{HEAD_R[0]}" ry="{HEAD_R[1]}"/>
  </clipPath>
  <clipPath id="eyeClipL"><circle cx="{EYE_L[0]}" cy="{EYE_L[1]}" r="56"/></clipPath>
  <clipPath id="eyeClipR"><circle cx="{EYE_R[0]}" cy="{EYE_R[1]}" r="56"/></clipPath>
</defs>
"""


# ------------------------------------------------------------ primitives
def feather_path(origin, deg, length, width):
    """Teardrop feather starting at origin, pointing along deg."""
    pts = [(0, 0), (length * 0.3, -width), (length * 0.8, -width * 0.7),
           (length, 0), (length * 0.8, width * 0.7), (length * 0.3, width)]
    g = [(origin[0] + rx, origin[1] + ry) for rx, ry in (rot(x, y, deg) for x, y in pts)]
    return (f"M{f(g[0][0])},{f(g[0][1])} C{f(g[1][0])},{f(g[1][1])} "
            f"{f(g[2][0])},{f(g[2][1])} {f(g[3][0])},{f(g[3][1])} "
            f"C{f(g[4][0])},{f(g[4][1])} {f(g[5][0])},{f(g[5][1])} "
            f"{f(g[0][0])},{f(g[0][1])} Z")


def feather(origin, deg, length, width, fill="url(#gold)"):
    return (f'<path d="{feather_path(origin, deg, length, width)}" fill="{fill}" '
            f'stroke="{INK}" stroke-width="{OUTLINE_W - 1}" stroke-linejoin="round"/>')


def leaf_wing(origin, deg, length, w, scallops=4):
    """A folded owl-wing segment: smooth leading edge, scalloped trailing edge."""
    top = []
    for i in range(0, 21):
        x = length * i / 20
        t = x / length
        y = -w * (0.85 + 0.3 * math.sin(math.pi * t)) * (1 - t ** 3)
        top.append((x, y))
    d = [top[0]] + top[1:]
    path = "M" + " L".join(f"{f(px)},{f(py)}" for px, py in
                            ((origin[0] + a, origin[1] + b) for a, b in (rot(x, y, deg) for x, y in d)))

    def ybot(x):
        t = x / length
        return w * (0.85 + 0.45 * math.sin(math.pi * t)) * (1 - t ** 2.2)

    segs = []
    for i in range(scallops):
        x0 = length * (1 - i / scallops)
        x1 = length * (1 - (i + 1) / scallops)
        y0, y1 = ybot(x0), ybot(x1)
        cx, cy = (x0 + x1) / 2 + 6, max(y0, y1) + w * 0.42
        c = rot(cx, cy, deg)
        e = rot(x1, y1, deg)
        segs.append(f"Q{f(origin[0] + c[0])},{f(origin[1] + c[1])} "
                    f"{f(origin[0] + e[0])},{f(origin[1] + e[1])}")
    path += " " + " ".join(segs) + " Z"

    out = [f'<path d="{path}" fill="url(#gold)" stroke="{INK}" '
           f'stroke-width="{OUTLINE_W}" stroke-linejoin="round"/>']
    # feather bands across the wing
    for t in (0.3, 0.52, 0.74):
        x = length * t
        a = rot(x - 10, -w * 0.55 * (1 - t ** 3), deg)
        b = rot(x + 16, 0, deg)
        c = rot(x - 4, w * 0.75 * (1 - t ** 2.2), deg)
        out.append(f'<path d="M{f(origin[0] + a[0])},{f(origin[1] + a[1])} '
                   f'Q{f(origin[0] + b[0])},{f(origin[1] + b[1])} '
                   f'{f(origin[0] + c[0])},{f(origin[1] + c[1])}" fill="none" '
                   f'stroke="{GOLD_LINE}" stroke-width="4" stroke-linecap="round"/>')
    # highlight streak on the leading edge
    h0 = rot(length * 0.12, -w * 0.5, deg)
    h1 = rot(length * 0.55, -w * 0.62, deg)
    out.append(f'<path d="M{f(origin[0] + h0[0])},{f(origin[1] + h0[1])} '
               f'L{f(origin[0] + h1[0])},{f(origin[1] + h1[1])}" stroke="{GOLD_HI}" '
               f'stroke-width="6" stroke-linecap="round" opacity="0.9"/>')
    return "\n".join(out)


def hand(kind, at, direction):
    """Feathered wing-tip 'hand'. Directions are in degrees (SVG, y down)."""
    out = []
    if kind == "open":
        for off in (-48, -16, 16, 48):
            out.append(feather(at, direction + off, 66, 17))
        out.append(f'<circle cx="{f(at[0])}" cy="{f(at[1])}" r="27" fill="url(#gold)" '
                   f'stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
    elif kind == "point":
        out.append(feather(at, direction, 92, 15))
        out.append(f'<circle cx="{f(at[0])}" cy="{f(at[1])}" r="27" fill="url(#gold)" '
                   f'stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
        for off in (70, 110):
            out.append(feather(polar(at, direction + off, 10), direction + off + 40, 34, 11))
    elif kind == "thumb":
        out.append(feather(polar(at, 270, 18), 270, 64, 16))
        out.append(f'<ellipse cx="{f(at[0])}" cy="{f(at[1] + 8)}" rx="34" ry="30" '
                   f'fill="url(#gold)" stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
        for dy in (-4, 10, 24):
            out.append(f'<path d="M{f(at[0] + 4)},{f(at[1] + dy)} L{f(at[0] + 30)},{f(at[1] + dy)}" '
                       f'stroke="{GOLD_LINE}" stroke-width="4" stroke-linecap="round"/>')
    elif kind == "chin":
        out.append(feather(polar(at, 280, 10), 280, 44, 12))
        out.append(f'<circle cx="{f(at[0])}" cy="{f(at[1])}" r="26" fill="url(#gold)" '
                   f'stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
        out.append(f'<path d="M{f(at[0] - 10)},{f(at[1] + 4)} Q{f(at[0])},{f(at[1] + 14)} '
                   f'{f(at[0] + 12)},{f(at[1] + 4)}" fill="none" stroke="{GOLD_LINE}" '
                   f'stroke-width="4" stroke-linecap="round"/>')
    return "\n".join(out)


def wing(spec):
    """Draw one (left-side) wing from a pose spec.

    spec: dict(segments=[(deg, length, width), ...], hand=(kind, direction))
    """
    out = []
    at = SHOULDER
    joints = []
    for i, (deg, length, width) in enumerate(spec["segments"]):
        out.append(leaf_wing(at, deg, length, width, scallops=4 if i == 0 else 3))
        at = polar(at, deg, length * 0.97)
        joints.append((at, width))
    # round elbow joint between segments so they read as one limb
    for (pt, width) in joints[:-1]:
        out.append(f'<circle cx="{f(pt[0])}" cy="{f(pt[1])}" r="{f(width * 0.62)}" '
                   f'fill="url(#gold)" stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
    if spec.get("hand"):
        kind, direction = spec["hand"]
        out.append(hand(kind, at, direction))
    return "\n".join(out), at


def mirrored(svg):
    return f'<g transform="translate({2 * CX},0) scale(-1,1)">{svg}</g>'


# ------------------------------------------------------------- body parts
def scallop(x, y, half, depth, fill, line, width=3):
    d = f"M{x - half},{y} C{x - half},{y + depth} {x + half},{y + depth} {x + half},{y}"
    return (f'<path d="{d} Z" fill="{fill}"/>'
            f'<path d="{d}" fill="none" stroke="{line}" stroke-width="{width}" stroke-linecap="round"/>')


def tail():
    out = []
    for deg in (62, 76, 90, 104, 118):
        out.append(feather((CX, 770), deg, 125, 26))
    return "\n".join(out)


def legs(jump=False):
    out = []
    for lx in (338, 462):
        top, bottom = 780, 900
        out.append(f'<rect x="{lx - 19}" y="{top}" width="38" height="{bottom - top}" rx="16" '
                   f'fill="url(#goldSide)" stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
        for y in (826, 858):
            out.append(f'<rect x="{lx - 23}" y="{y}" width="46" height="13" rx="6" '
                       f'fill="{GOLD_LO}" stroke="{INK}" stroke-width="4"/>')
        if jump:
            toes = [(-40, 44), (0, 56), (40, 44)]
        else:
            toes = [(-62, 26), (0, 42), (62, 26)]
        foot = (lx, bottom - 2)
        for dx, dy in toes:
            end = (foot[0] + dx, foot[1] + dy)
            ctrl = (foot[0] + dx * 0.5, foot[1] + dy * 0.2 - 6)
            d = f"M{foot[0]},{foot[1]} Q{f(ctrl[0])},{f(ctrl[1])} {f(end[0])},{f(end[1])}"
            out.append(f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="26" stroke-linecap="round"/>')
            out.append(f'<path d="{d}" fill="none" stroke="{GOLD}" stroke-width="13" stroke-linecap="round"/>')
            # claw
            cdir = math.degrees(math.atan2(dy, dx if dx else 0.001))
            out.append(feather(end, cdir + (35 if dx >= 0 else -35), 24, 8, STEEL))
    return "\n".join(out)


def body():
    out = [f'<ellipse cx="{BODY_C[0]}" cy="{BODY_C[1]}" rx="{BODY_R[0]}" ry="{BODY_R[1]}" fill="url(#silver)"/>']
    feathers = ['<g clip-path="url(#bodyClip)">']
    rows = list(range(420, 840, 38))
    for r_i, y in reversed(list(enumerate(rows))):
        offset = 0 if r_i % 2 == 0 else 26
        for x in range(190 + offset, 640, 52):
            gold = (x // 52 + r_i) % 7 == 0
            fill = GOLD if gold else ("#DCE2E8" if (x // 52 + r_i) % 2 else "#C3CBD4")
            feathers.append(scallop(x, y, 27, 38, fill, SILVER_LO))
            feathers.append(
                f'<path d="M{x - 14},{y + 8} Q{x - 12},{y + 20} {x - 4},{y + 24}" fill="none" '
                f'stroke="{SILVER_HI}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>')
    feathers.append("</g>")
    out += feathers
    out.append(f'<ellipse cx="{BODY_C[0]}" cy="{BODY_C[1]}" rx="{BODY_R[0]}" ry="{BODY_R[1]}" '
               f'fill="none" stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
    # sensor badge on the chest: the book's indigo + orange accent
    bx, by = CX, 548
    out.append(f'<circle cx="{bx}" cy="{by}" r="33" fill="{INDIGO}" stroke="{GOLD_LO}" stroke-width="7"/>')
    out.append(f'<circle cx="{bx}" cy="{by}" r="33" fill="none" stroke="{INK}" stroke-width="3"/>')
    for a in range(0, 360, 45):
        p0 = polar((bx, by), a, 17)
        p1 = polar((bx, by), a, 25)
        out.append(f'<line x1="{f(p0[0])}" y1="{f(p0[1])}" x2="{f(p1[0])}" y2="{f(p1[1])}" '
                   f'stroke="#9FA8DA" stroke-width="3" stroke-linecap="round"/>')
    out.append(f'<circle cx="{bx}" cy="{by}" r="11" fill="{ORANGE}" stroke="{INK}" stroke-width="3"/>')
    out.append(f'<circle cx="{bx - 4}" cy="{by - 4}" r="4" fill="#FFF3E0"/>')
    return "\n".join(out)


def head():
    out = []
    # ear tufts (behind head)
    for side in (-1, 1):
        base_x = CX + side * 150
        d = (f"M{base_x - side * 50},{160} Q{base_x + side * 10},{118} {base_x + side * 50},{112} "
             f"Q{base_x + side * 44},{150} {base_x + side * 62},{200} Z")
        out.append(f'<path d="{d}" fill="url(#gold)" stroke="{INK}" stroke-width="{OUTLINE_W}" '
                   f'stroke-linejoin="round"/>')
    out.append(f'<ellipse cx="{HEAD_C[0]}" cy="{HEAD_C[1]}" rx="{HEAD_R[0]}" ry="{HEAD_R[1]}" fill="url(#gold)"/>')
    # layered crown feathers
    g = ['<g clip-path="url(#headClip)">']
    for r_i, y in reversed(list(enumerate(range(118, 250, 30)))):
        offset = 0 if r_i % 2 == 0 else 22
        for x in range(170 + offset, 650, 44):
            g.append(scallop(x, y, 23, 36, GOLD if (x // 44 + r_i) % 2 else "#F7C84E", GOLD_LINE))
    # lower cheeks
    g.append(f'<ellipse cx="{CX}" cy="430" rx="190" ry="70" fill="{GOLD_LO}" opacity="0.35"/>')
    g.append("</g>")
    out += g
    out.append(f'<ellipse cx="{HEAD_C[0]}" cy="{HEAD_C[1]}" rx="{HEAD_R[0]}" ry="{HEAD_R[1]}" '
               f'fill="none" stroke="{INK}" stroke-width="{OUTLINE_W}"/>')
    return "\n".join(out)


def eye(center, clip_id, expr, is_left):
    cx, cy = center
    out = [
        f'<circle cx="{cx}" cy="{cy}" r="99" fill="{GOLD_LO}" stroke="{INK}" stroke-width="{OUTLINE_W}"/>',
        f'<circle cx="{cx}" cy="{cy}" r="88" fill="url(#dish)" stroke="{INK}" stroke-width="4"/>',
        f'<circle cx="{cx}" cy="{cy}" r="72" fill="{STEEL}" stroke="{INK}" stroke-width="4"/>',
    ]
    # clockwork aperture spokes around the lens
    for a in range(0, 360, 20):
        p0 = polar(center, a, 58)
        p1 = polar(center, a + 10, 70)
        out.append(f'<line x1="{f(p0[0])}" y1="{f(p0[1])}" x2="{f(p1[0])}" y2="{f(p1[1])}" '
                   f'stroke="#A7B1BC" stroke-width="3" stroke-linecap="round"/>')
    # dish highlight
    out.append(f'<path d="M{cx - 70},{cy - 28} A76,76 0 0 1 {cx - 20},{cy - 76}" fill="none" '
               f'stroke="white" stroke-width="7" stroke-linecap="round" opacity="0.8"/>')

    if expr.get("closed"):
        # happy "^" eye
        out.append(f'<circle cx="{cx}" cy="{cy}" r="56" fill="{SILVER}" stroke="{INK}" stroke-width="4"/>')
        out.append(f'<path d="M{cx - 34},{cy + 12} Q{cx},{cy - 38} {cx + 34},{cy + 12}" fill="none" '
                   f'stroke="{INK}" stroke-width="13" stroke-linecap="round"/>')
        return "\n".join(out)

    dx, dy = expr.get("look", (0, 0))
    ix, iy = cx + dx, cy + dy
    out.append(f'<circle cx="{cx}" cy="{cy}" r="56" fill="white" stroke="{INK}" stroke-width="4"/>')
    lens = [f'<g clip-path="url(#{clip_id})">',
            f'<circle cx="{f(ix)}" cy="{f(iy)}" r="32" fill="url(#iris)" stroke="{INK}" stroke-width="4"/>']
    for a in range(0, 360, 30):
        p0 = polar((ix, iy), a, 17)
        p1 = polar((ix, iy), a, 28)
        lens.append(f'<line x1="{f(p0[0])}" y1="{f(p0[1])}" x2="{f(p1[0])}" y2="{f(p1[1])}" '
                    f'stroke="#FFB199" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>')
    lens.append(f'<circle cx="{f(ix)}" cy="{f(iy)}" r="14" fill="{INK}"/>')
    lens.append(f'<circle cx="{f(ix - 12)}" cy="{f(iy - 13)}" r="10" fill="white"/>')
    lens.append(f'<circle cx="{f(ix + 11)}" cy="{f(iy + 10)}" r="4.5" fill="white"/>')
    lid = expr.get("lid", 0)          # 0..1 of upper eye covered
    if lid:
        y_edge = cy - 56 + 112 * lid
        lens.append(f'<path d="M{cx - 60},{cy - 60} L{cx + 60},{cy - 60} L{cx + 60},{f(y_edge)} '
                    f'Q{cx},{f(y_edge + 10)} {cx - 60},{f(y_edge)} Z" fill="{SILVER}" '
                    f'stroke="{INK}" stroke-width="5"/>')
    smile = expr.get("smile_lid", 0)  # lower lid pushed up by a smile
    if smile:
        top = cy + 56 - 112 * smile
        lens.append(f'<path d="M{cx - 60},{cy + 60} L{cx - 60},{f(top + 16)} '
                    f'Q{cx},{f(top - 14)} {cx + 60},{f(top + 16)} L{cx + 60},{cy + 60} Z" '
                    f'fill="{SILVER}" stroke="{INK}" stroke-width="5"/>')
    lens.append("</g>")
    out += lens
    out.append(f'<circle cx="{cx}" cy="{cy}" r="56" fill="none" stroke="{INK}" stroke-width="5"/>')
    return "\n".join(out)


def brow(center, inner_dy, outer_dy, is_left):
    cx, cy = center
    sign = 1 if is_left else -1       # inner end points toward the beak
    x_out, x_in = cx - sign * 62, cx + sign * 58
    y_out, y_in = cy - 112 + outer_dy, cy - 112 + inner_dy
    mx, my = (x_out + x_in) / 2, min(y_out, y_in) - 14
    d = f"M{f(x_out)},{f(y_out)} Q{f(mx)},{f(my)} {f(x_in)},{f(y_in)}"
    return (f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="30" stroke-linecap="round"/>'
            f'<path d="{d}" fill="none" stroke="{GOLD_HI}" stroke-width="16" stroke-linecap="round"/>')


def beak(mode):
    out = []
    if mode == "closed":
        out.append(f'<path d="M372,318 Q400,300 428,318 Q432,362 400,412 Q368,362 372,318 Z" '
                   f'fill="url(#goldSide)" stroke="{INK}" stroke-width="{OUTLINE_W}" stroke-linejoin="round"/>')
        out.append(f'<path d="M386,322 Q390,350 398,378" fill="none" stroke="{GOLD_HI}" '
                   f'stroke-width="5" stroke-linecap="round"/>')
    else:
        gape = {"open": 30, "small": 18, "wide": 44}[mode]
        # mouth interior
        out.append(f'<path d="M376,360 Q400,{360 + gape * 1.9} 424,360 Z" fill="#7A1F2B" '
                   f'stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>')
        out.append(f'<ellipse cx="400" cy="{360 + gape * 0.95}" rx="{12 + gape * 0.2}" '
                   f'ry="{4 + gape * 0.12}" fill="#E57373"/>')
        # lower beak
        out.append(f'<path d="M378,362 Q400,{372 + gape * 1.2} 422,362 Q412,{378 + gape * 1.35} '
                   f'400,{384 + gape * 1.45} Q388,{378 + gape * 1.35} 378,362 Z" fill="{GOLD_LO}" '
                   f'stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>')
        # upper beak
        out.append(f'<path d="M372,318 Q400,300 428,318 Q432,350 400,386 Q368,350 372,318 Z" '
                   f'fill="url(#goldSide)" stroke="{INK}" stroke-width="{OUTLINE_W}" stroke-linejoin="round"/>')
        out.append(f'<path d="M386,322 Q390,344 397,362" fill="none" stroke="{GOLD_HI}" '
                   f'stroke-width="5" stroke-linecap="round"/>')
    return "\n".join(out)


def blush():
    return "\n".join(
        f'<ellipse cx="{x}" cy="402" rx="30" ry="12" fill="#F06292" opacity="0.35"/>'
        for x in (262, 538))


# ----------------------------------------------------------------- props
def sparkle(x, y, s=1.0, fill="#FFD54F"):
    pts = []
    for i in range(8):
        r = 30 * s if i % 2 == 0 else 9 * s
        a = math.radians(i * 45 - 90)
        pts.append(f"{f(x + r * math.cos(a))},{f(y + r * math.sin(a))}")
    return (f'<polygon points="{" ".join(pts)}" fill="{fill}" stroke="{INK}" '
            f'stroke-width="4" stroke-linejoin="round"/>')


def lightbulb(x, y):
    out = []
    for a in (-160, -125, -90, -55, -20):
        p0 = polar((x, y), a, 58)
        p1 = polar((x, y), a, 82)
        out.append(f'<line x1="{f(p0[0])}" y1="{f(p0[1])}" x2="{f(p1[0])}" y2="{f(p1[1])}" '
                   f'stroke="#FFC107" stroke-width="8" stroke-linecap="round"/>')
    out.append(f'<path d="M{x - 24},{y + 34} Q{x - 46},{y + 10} {x - 44},{y - 8} '
               f'A44,44 0 1 1 {x + 44},{y - 8} Q{x + 46},{y + 10} {x + 24},{y + 34} Z" '
               f'fill="url(#bulb)" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>')
    out.append(f'<path d="M{x - 12},{y + 30} L{x - 10},{y} Q{x - 5},{y - 12} {x},{y} '
               f'Q{x + 5},{y - 12} {x + 10},{y} L{x + 12},{y + 30}" fill="none" '
               f'stroke="#E08A00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>')
    out.append(f'<path d="M{x - 26},{y - 20} A30,30 0 0 1 {x - 6},{y - 38}" fill="none" '
               f'stroke="white" stroke-width="6" stroke-linecap="round"/>')
    for i in range(3):
        yy = y + 36 + i * 12
        out.append(f'<rect x="{x - 25 + i * 2}" y="{yy}" width="{50 - i * 4}" height="12" rx="5" '
                   f'fill="{"#B0BEC5" if i % 2 == 0 else "#90A4AE"}" stroke="{INK}" stroke-width="4"/>')
    out.append(f'<path d="M{x - 12},{y + 72} Q{x},{y + 84} {x + 12},{y + 72} Z" fill="{STEEL}" '
               f'stroke="{INK}" stroke-width="4"/>')
    return "\n".join(out)


def caution(x, y, size=120):
    h = size * math.sqrt(3) / 2
    top, left, right = (x, y - h * 0.6), (x - size / 2, y + h * 0.4), (x + size / 2, y + h * 0.4)
    out = []
    # little circuit traces leaving the sign
    for (px, py), (qx, qy) in (((left[0] + 8, left[1] - 4), (left[0] - 40, left[1] - 4)),
                               ((right[0] - 8, right[1] - 4), (right[0] + 40, right[1] - 4)),
                               ((x, left[1] + 4), (x, left[1] + 30))):
        out.append(f'<line x1="{f(px)}" y1="{f(py)}" x2="{f(qx)}" y2="{f(qy)}" stroke="{GOLD_LO}" '
                   f'stroke-width="6" stroke-linecap="round"/>')
        out.append(f'<circle cx="{f(qx)}" cy="{f(qy)}" r="8" fill="{GOLD}" stroke="{INK}" stroke-width="4"/>')
    out.append(f'<polygon points="{f(top[0])},{f(top[1])} {f(right[0])},{f(right[1])} '
               f'{f(left[0])},{f(left[1])}" fill="#FFC107" stroke="{INK}" stroke-width="9" '
               f'stroke-linejoin="round"/>')
    out.append(f'<rect x="{x - 8}" y="{f(y - h * 0.3)}" width="16" height="{f(h * 0.42)}" rx="8" fill="{INK}"/>')
    out.append(f'<circle cx="{x}" cy="{f(y + h * 0.26)}" r="9" fill="{INK}"/>')
    return "\n".join(out)


def confetti(seed=7):
    rng = random.Random(seed)
    colors = [INDIGO, ORANGE, GOLD, "#43A047", "#E53935", "#29B6F6"]
    out = []
    placed = 0
    while placed < 30:
        x, y = rng.uniform(20, 780), rng.uniform(-90, 560)
        # keep confetti off the face and wings
        if ((x - CX) / 250) ** 2 + ((y - 320) / 210) ** 2 < 1:
            continue
        if (x < 210 or x > 590) and 130 < y < 520:  # raised wings
            continue
        if ((x - BODY_C[0]) / (BODY_R[0] + 30)) ** 2 + ((y - BODY_C[1]) / (BODY_R[1] + 30)) ** 2 < 1:
            continue
        c = rng.choice(colors)
        if rng.random() < 0.45:  # LED-style dot
            r = rng.uniform(8, 13)
            out.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{c}" stroke="{INK}" stroke-width="3"/>')
            out.append(f'<circle cx="{f(x - r / 3)}" cy="{f(y - r / 3)}" r="{f(r / 3)}" fill="white" opacity="0.8"/>')
        else:
            w, h = rng.uniform(12, 20), rng.uniform(22, 32)
            out.append(f'<rect x="{f(x - w / 2)}" y="{f(y - h / 2)}" width="{f(w)}" height="{f(h)}" rx="3" '
                       f'fill="{c}" stroke="{INK}" stroke-width="3" '
                       f'transform="rotate({rng.randint(0, 180)} {f(x)} {f(y)})"/>')
        placed += 1
    return "\n".join(out)


def motion_arcs(x, y):
    return "\n".join(
        f'<path d="M{x - 30 - i * 22},{y + 40 + i * 6} A{60 + i * 22},{60 + i * 22} 0 0 1 '
        f'{x - 10 - i * 12},{y - 30 - i * 16}" fill="none" stroke="{GOLD_LO}" stroke-width="7" '
        f'stroke-linecap="round" opacity="{0.8 - i * 0.25}"/>'
        for i in range(2))


# ------------------------------------------------------------------ poses
REST = {"segments": [(99, 330, 46)]}

POSES = {
    "neutral": dict(
        left=REST, right=REST,
        eyes=dict(look=(0, 2)), brows=(0, 0), beak="closed",
    ),
    "welcome": dict(
        left={"segments": [(186, 128, 44), (262, 150, 38)], "hand": ("open", 272)},
        right=REST, left_front=False,
        eyes=dict(look=(-4, 0), smile_lid=0.12), brows=(-10, -4), beak="open",
        extras=lambda: motion_arcs(40, 250),
    ),
    "thinking": dict(
        left={"segments": [(104, 160, 44), (-46, 215, 36)], "hand": ("chin", 0)},
        right=REST, left_front=True,
        eyes=dict(look=(14, -18)), brows=(6, -8), beak="closed", right_brow=(-14, -10),
        extras=lambda: lightbulb(560, 20),
    ),
    "tip": dict(
        left=REST,
        right={"segments": [(192, 118, 44), (266, 160, 38)], "hand": ("point", 270)},
        eyes=dict(look=(14, -6), lid=0.18), brows=(-4, -12), beak="small",
        extras=lambda: sparkle(706, 118, 1.2) + sparkle(752, 176, 0.6, "#FFF59D"),
    ),
    "warning": dict(
        left={"segments": [(150, 110, 44), (272, 178, 38)], "hand": ("open", 270)},
        right={"segments": [(150, 110, 44), (272, 178, 38)], "hand": ("open", 270)},
        eyes=dict(look=(0, 4)), brows=(-22, 6), beak="small",
        extras=lambda: caution(CX, 32, 128),
    ),
    "encouraging": dict(
        left={"segments": [(122, 130, 44), (254, 138, 38)], "hand": ("thumb", 0)},
        right=REST,
        eyes=dict(look=(-6, 0), smile_lid=0.22), brows=(-8, -6), beak="open",
        extras=lambda: sparkle(92, 250, 0.9) + sparkle(46, 318, 0.5, "#FFF59D"),
    ),
    "celebration": dict(
        left={"segments": [(222, 150, 46), (246, 150, 40)], "hand": ("open", 250)},
        right={"segments": [(222, 150, 46), (246, 150, 40)], "hand": ("open", 250)},
        eyes=dict(closed=True), brows=(-16, -8), beak="wide", jump=True,
        extras=lambda: confetti(),
    ),
}


def build_svg(pose):
    p = POSES[pose]
    jump = p.get("jump", False)
    parts = []
    lift = -48 if jump else 0

    if jump:
        parts.append(f'<ellipse cx="{CX}" cy="962" rx="170" ry="20" fill="{INK}" opacity="0.18"/>')

    char = [tail(), legs(jump), body()]
    left_svg, _ = wing(p["left"])
    right_svg, _ = wing(p["right"])
    back, front = [], []
    (front if p.get("left_front") else back).append(left_svg)
    (front if p.get("right_front") else back).append(mirrored(right_svg))
    char += back
    char.append(head())
    char.append(eye(EYE_L, "eyeClipL", p["eyes"], True))
    char.append(eye(EYE_R, "eyeClipR", p["eyes"], False))
    char.append(blush())
    char.append(beak(p["beak"]))
    bi, bo = p["brows"]
    char.append(brow(EYE_L, bi, bo, True))
    rbi, rbo = p.get("right_brow", p["brows"])
    char.append(brow(EYE_R, rbi, rbo, False))
    char += front

    parts.append(f'<g transform="translate(0,{lift})">' + "\n".join(char) + "</g>")
    if p.get("extras"):
        parts.append(f'<g transform="translate(0,{lift})">{p["extras"]()}</g>')

    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 1200 1220" '
            f'width="1200" height="1220">{DEFS}' + "\n".join(parts) + "</svg>")


def visible_bbox(img):
    return img.getchannel("A").point(lambda a: 255 if a > ALPHA_THRESH else 0).getbbox()


def render(svg, out_png, max_size=MAX_SIZE):
    png = cairosvg.svg2png(bytestring=svg.encode(), output_height=RENDER_HEIGHT)
    img = Image.open(io.BytesIO(png)).convert("RGBA")
    img = img.crop(visible_bbox(img))
    scale = (max_size - 2 * TRIM_PAD) / max(img.size)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    img = img.crop(visible_bbox(img))  # drop faint resampling fringe
    # exactly TRIM_PAD px of transparent margin on every side
    out = Image.new("RGBA", (img.width + 2 * TRIM_PAD, img.height + 2 * TRIM_PAD), (0, 0, 0, 0))
    out.paste(img, (TRIM_PAD, TRIM_PAD))
    # flat-vector art survives 256 colors; keeps RGBA files well under 100 KB
    out = out.quantize(256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).convert("RGBA")
    out.save(out_png, optimize=True)
    return out.size


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--svg", action="store_true", help="also write the source SVG files")
    ap.add_argument("--out", type=Path, default=OUT_DIR)
    ap.add_argument("--size", type=int, default=MAX_SIZE,
                    help=f"longest side of each PNG in px (default {MAX_SIZE})")
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    for pose in POSES:
        svg = build_svg(pose)
        if args.svg:
            (args.out / f"{pose}.svg").write_text(svg)
        size = render(svg, args.out / f"{pose}.png", args.size)
        print(f"{pose:12s} {size[0]}x{size[1]}  {args.out / (pose + '.png')}")


if __name__ == "__main__":
    main()
