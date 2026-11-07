"""
Renders the cinematic hero backdrop (sky + golden-hour cloud sea) as WebP layers.

    python scripts/render_hero.py

Outputs to public/hero/:
  sky.webp           opaque sky, sun glow, distant cloud sea and the cumulus tower
  clouds-mid.webp    transparent wisps that drift behind the island
  clouds-front.webp  transparent fog bank that drifts in front of the cliff base

Stage coordinates match the SVG island (1600 x 900). Everything is procedural:
fractal value noise for texture, shaded "puffs" composited back to front.
"""
from __future__ import annotations

import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "hero")
W, H = 2400, 1350
S = W / 1600.0  # stage unit -> pixel
SUN = np.array([1560.0 * S, 440.0 * S])  # just off the right edge, low

rng = np.random.default_rng(20031)


def hexc(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255.0


def fbm(h: int, w: int, cells=(320, 160, 80, 40, 20, 10, 5), gain=0.55, seed=0) -> np.ndarray:
    r = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    tot, a = 0.0, 1.0
    for c in cells:
        gh, gw = h // c + 3, w // c + 3
        g = r.random((gh, gw)).astype(np.float32)
        arr = np.asarray(Image.fromarray(g).resize((gw * c, gh * c), Image.BICUBIC))
        oy, ox = int(r.integers(0, c)), int(r.integers(0, c))
        out += a * arr[oy:oy + h, ox:ox + w]
        tot += a
        a *= gain
    out /= tot
    lo, hi = np.percentile(out, 1), np.percentile(out, 99)
    return np.clip((out - lo) / (hi - lo), 0, 1)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- palette
SKY_TOP = hexc("#0e1520")
SKY_MID = hexc("#2b3445")
SKY_WARM = hexc("#d48a4c")
SUN_HOT = hexc("#ffe7b5")
HAZE = hexc("#a07f68")

C_SHADOW = hexc("#3b3749")
C_MID = hexc("#9a7f76")
C_LIT = hexc("#f0b46e")
C_HOT = hexc("#fff3d8")


def render_sky() -> np.ndarray:
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = yy / H
    base = SKY_TOP[None, None] * (1 - smoothstep(0.0, 0.55, v))[..., None] + \
        SKY_MID[None, None] * smoothstep(0.0, 0.55, v)[..., None]
    dx = (xx - SUN[0]) / W
    dy = (yy - SUN[1]) / H
    d = np.sqrt((dx * 1.25) ** 2 + (dy * 1.6) ** 2)
    warm = np.exp(-d * 2.3)[..., None]
    hot = np.exp(-d * 5.0)[..., None]
    col = base * (1 - warm) + SKY_WARM * warm
    col = col + (SUN_HOT - col) * hot * 0.9
    # faint high cirrus streaks in the dark top-left
    streak = fbm(H, W, cells=(640, 320, 160, 80), seed=3)
    streak = np.asarray(Image.fromarray(streak).resize((W, H // 3)).resize((W, H)))
    col += (0.05 * smoothstep(0.55, 0.9, streak) * (1 - smoothstep(0.0, 0.5, v)))[..., None] * HAZE
    return np.clip(col, 0, 1)


TEX = fbm(H + 600, W + 1800, seed=11)  # shared fluff texture


class Canvas:
    def __init__(self, h: int, w: int, rgb: np.ndarray | None = None):
        self.h, self.w = h, w
        self.rgb = np.zeros((h, w, 3), np.float32) if rgb is None else rgb.copy()
        self.a = np.zeros((h, w), np.float32) if rgb is None else np.ones((h, w), np.float32)

    def puff(self, cx, cy, r, *, sun, light=1.0, fog=0.0, warmth=1.0, squash=0.82, tex_off=(0, 0), soft=0.6):
        x0, x1 = int(max(0, cx - r * 1.35)), int(min(self.w, cx + r * 1.35))
        y0, y1 = int(max(0, cy - r * 1.35)), int(min(self.h, cy + r * 1.35))
        if x0 >= x1 or y0 >= y1:
            return
        yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        dx = (xx - cx) / r
        dy = (yy - cy) / (r * squash)
        tx, ty = tex_off
        t = TEX[(y0 + ty) % TEX.shape[0]:(y0 + ty) % TEX.shape[0] + (y1 - y0),
                (x0 + tx) % TEX.shape[1]:(x0 + tx) % TEX.shape[1] + (x1 - x0)]
        if t.shape != dx.shape:
            t = np.resize(t, dx.shape)
        d = np.sqrt(dx * dx + dy * dy)
        dn = d + (t - 0.5) * 0.6
        alpha = smoothstep(1.05, 1.05 - soft, dn) * (0.85 + 0.15 * t)
        alpha *= 1 - 0.25 * smoothstep(0.4, 1.0, dy)
        if alpha.max() < 0.01:
            return
        lv = np.array([sun[0] - cx, sun[1] - cy], np.float32)
        lv /= (np.linalg.norm(lv) + 1e-6)
        sd = np.clip(dx * lv[0] + dy * lv[1], -1, 1)
        tv = smoothstep(-1.0, 0.85, dy + (t - 0.5) * 0.9)  # 0 top -> 1 underside
        lit = np.clip((0.62 * (1 - tv) + 0.38 * (sd * 0.5 + 0.5)) * light, 0, 1)
        col = C_SHADOW + (C_MID - C_SHADOW) * np.clip(lit * 1.8, 0, 1)[..., None]
        col = col + (C_LIT - col) * (smoothstep(0.25, 0.9, lit) * warmth)[..., None]
        edge = smoothstep(0.5, 0.92, dn) * smoothstep(1.08, 0.92, dn)
        col = col + (C_HOT - col) * np.clip(edge * np.clip(sd, 0, 1) * light * 1.2, 0, 1)[..., None]
        col = col * (0.9 + 0.1 * t)[..., None]
        col = col + (HAZE - col) * fog
        a = alpha[..., None]
        self.rgb[y0:y1, x0:x1] = col * a + self.rgb[y0:y1, x0:x1] * (1 - a)
        self.a[y0:y1, x0:x1] = alpha + self.a[y0:y1, x0:x1] * (1 - alpha)


def sun_light(cx, cy, falloff=1050.0):
    d = np.hypot(cx - SUN[0], (cy - SUN[1]) * 1.3)
    return float(np.clip(np.exp(-d / (falloff * S)) * 2.4, 0.12, 1.0))


def sea_puffs(y_top_stage: float, y_bot_stage: float, x_min=-80, x_max=1680, density=1.0, seed=1):
    r = np.random.default_rng(seed)
    puffs = []
    y = y_top_stage
    while y < y_bot_stage:
        depth = (y - y_top_stage) / (900 - y_top_stage)
        rad = (26 + 200 * depth ** 1.25) * S
        step_y = max(5.0, rad / S * 0.42)
        x = x_min + r.uniform(0, rad / S)
        while x < x_max:
            jitter_y = r.normal(0, rad / S * 0.25)
            rr = rad * r.uniform(0.7, 1.25)
            puffs.append((x * S, (y + jitter_y) * S, rr, depth))
            x += rad / S * r.uniform(0.95, 1.6) / density
        y += step_y
    return puffs


def tower_puffs(seed=2):
    """Billowing cumulus heap on the right, lit by the low sun."""
    r = np.random.default_rng(seed)
    puffs = []
    for _ in range(150):
        x = r.uniform(1040, 1700)
        peak = 140 + 0.0016 * (x - 1330) ** 2 * 1.6  # top edge profile (stage y)
        top = min(peak + r.normal(0, 18), 440)
        y = r.uniform(top, 470)
        rad = r.uniform(45, 110) * (0.75 + 0.5 * (y - top) / 330)
        puffs.append((x * S, y * S, rad * S, 0.25))
    # cauliflower crown detail
    for _ in range(70):
        x = r.uniform(1080, 1680)
        top = 140 + 0.0016 * (x - 1330) ** 2 * 1.6
        puffs.append((x * S, (top + r.uniform(-4, 40)) * S, r.uniform(24, 52) * S, 0.2))
    puffs.sort(key=lambda p: p[1])
    return puffs


def left_bank(seed=4):
    r = np.random.default_rng(seed)
    puffs = []
    for _ in range(120):
        x = r.uniform(-60, 420)
        top = 250 + 0.0009 * (x - 120) ** 2
        y = r.uniform(top, 330)
        puffs.append((x * S, y * S, r.uniform(18, 46) * S, 0.15))
    puffs.sort(key=lambda p: p[1])
    return puffs


def render_backdrop():
    print("sky...")
    sky = render_sky()
    cv = Canvas(H, W, sky)
    print("left bank...")
    for (x, y, rr, d) in left_bank():
        cv.puff(x, y, rr, sun=SUN, light=sun_light(x, y) * 0.8, fog=0.45, squash=0.7)
    print("sea...")
    sea = sea_puffs(318, 905, density=1.05, seed=5)
    tower = tower_puffs()
    # interleave: tower sits around stage y 470; sea puffs nearer than that draw after it
    far = [p for p in sea if p[1] < 470 * S]
    near = [p for p in sea if p[1] >= 470 * S]
    far.sort(key=lambda p: p[1])
    near.sort(key=lambda p: p[1])
    for (x, y, rr, d) in far:
        cv.puff(x, y, rr, sun=SUN, light=sun_light(x, y), fog=0.85 * (1 - d) ** 1.2, squash=0.26 + 0.4 * d,
                tex_off=(int(x) % 977, int(y) % 431))
    print("tower...")
    for (x, y, rr, d) in tower:
        cv.puff(x, y, rr, sun=SUN, light=min(1.0, sun_light(x, y, 1600) * 1.15), fog=0.08, squash=0.85,
                tex_off=(int(x * 3) % 1201, int(y * 7) % 557))
    for (x, y, rr, d) in near:
        cv.puff(x, y, rr, sun=SUN, light=sun_light(x, y), fog=0.3 * (1 - d) ** 2, squash=0.38 + 0.3 * d,
                tex_off=(int(x) % 977, int(y) % 431))
    rgb = np.clip(cv.rgb, 0, 1)
    # gentle vignette towards bottom-left so the giant name keeps contrast
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    vig = smoothstep(0.35, 1.05, (1 - xx / W) * 0.55 + (yy / H) * 0.6)
    rgb *= (1 - 0.38 * vig)[..., None]
    return rgb


def render_band(width_mul: float, h_px: int, puffs, light_mul=1.0, fog=0.2, squash=0.6, seed_off=0, soft=0.45):
    w = int(W * width_mul)
    cv = Canvas(h_px, w)
    for (x, y, rr, d) in puffs:
        cv.puff(x, y, rr, sun=SUN, light=sun_light(x % W, y) * light_mul, fog=fog, squash=squash,
                tex_off=(int(x + seed_off) % 1500, int(y) % 600), soft=soft)
    a = np.clip(cv.a, 0, 1)
    return np.clip(cv.rgb, 0, 1), a


def mid_layer():
    r = np.random.default_rng(9)
    puffs = []
    for cx in np.linspace(0, W * 1.5, 7):
        cy = r.uniform(560, 660) * S
        for _ in range(26):
            puffs.append((cx + r.normal(0, 150 * S), cy + r.normal(0, 12 * S), r.uniform(45, 90) * S, 0.5))
    puffs.sort(key=lambda p: p[1])
    rgb, a = render_band(1.5, H, puffs, light_mul=0.9, fog=0.3, squash=0.28, seed_off=211, soft=0.95)
    return rgb, a * 0.75


def front_layer():
    """Fog bank in front of the cliff base: stage y 520..900, rendered into its own strip."""
    r = np.random.default_rng(13)
    h_px = int(380 * S)
    puffs = []
    for _ in range(420):
        x = r.uniform(-100, 2500) * S
        y = r.uniform(150, 420) * S
        rad = r.uniform(50, 120) * S * (0.6 + 0.6 * y / h_px)
        puffs.append((x, y, rad, 1.0))
    puffs.sort(key=lambda p: p[1])
    w = int(W * 1.5)
    cv = Canvas(h_px, w)
    for (x, y, rr, d) in puffs:
        gy = y + 520 * S  # global y for lighting
        cv.puff(x, y, rr, sun=(SUN[0], SUN[1] - 520 * S), light=sun_light(x % W, gy) * 0.75, fog=0.12,
                squash=0.55, tex_off=(int(x) % 1500, int(y) % 600), soft=0.5)
    # fade the top edge so it melts into the cliff
    yy = np.arange(h_px, dtype=np.float32)[:, None] / h_px
    a = np.clip(cv.a, 0, 1) * smoothstep(0.0, 0.35, yy)
    return np.clip(cv.rgb, 0, 1), a


def save_rgb(rgb, path, q=82):
    Image.fromarray((rgb * 255).astype(np.uint8), "RGB").save(path, "WEBP", quality=q, method=6)
    print(path, os.path.getsize(path) // 1024, "KB")


def save_rgba(rgb, a, path, q=80):
    # canvas colour is premultiplied by coverage; un-premultiply before saving
    rgb = np.where(a[..., None] > 1e-3, rgb / np.maximum(a[..., None], 1e-3), 0)
    arr = np.dstack([np.clip(rgb, 0, 1), a[..., None]])
    Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8), "RGBA").save(
        path, "WEBP", quality=q, alpha_quality=70, method=6)
    print(path, os.path.getsize(path) // 1024, "KB")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    save_rgb(render_backdrop(), os.path.join(OUT, "sky.webp"))
    rgb, a = mid_layer()
    save_rgba(rgb, a, os.path.join(OUT, "clouds-mid.webp"))
    rgb, a = front_layer()
    save_rgba(rgb, a, os.path.join(OUT, "clouds-front.webp"))
