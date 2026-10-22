/**
 * Placeholder avatar sprites for the dressing room.
 *
 * Drawing uses an 80×112 grid. Every file under public/assets is a 990×990
 * PNG, matching AVATAR_FRAME in types/avatar.ts. The grid is scaled by 8
 * with nearest-neighbor and centered at (175, 47). Backgrounds bleed to the
 * square edges. Body bases are full-color bodies on that same mask.
 *
 * These are solid pixel shapes, not final CryptoPanim art.
 * `save()` leaves a PNG in place when the file already exists, so real
 * 990×990 exports are not replaced.
 *
 * Placeholder clothes share this mask. Final outfits must be exported on the
 * same 990×990 canvas (public/assets/_guide/body-guide.png).
 */

import { deflateSync } from "node:zlib";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 80;
const H = 112;
const FRAME = 990;
const SCALE = 8;
const OX = Math.floor((FRAME - W * SCALE) / 2);
const OY = Math.floor((FRAME - H * SCALE) / 2);

const HEAD = { cx: 40, cy: 36, rx: 14, ry: 16 };
const EAR_L = { cx: 26, cy: 38, rx: 3, ry: 4 };
const EAR_R = { cx: 54, cy: 38, rx: 3, ry: 4 };
const NECK = { x: 36, y: 48, w: 8, h: 8 };
const SHOULDER = { cx: 40, cy: 58, rx: 13, ry: 7 };
const TORSO = { x: 29, y: 54, w: 22, h: 22 };
const ARM_L = { x: 18, y: 56, w: 12, h: 22 };
const ARM_R = { x: 50, y: 56, w: 12, h: 22 };
const HAND_L = { cx: 24, cy: 80, rx: 6, ry: 5 };
const HAND_R = { cx: 56, cy: 80, rx: 6, ry: 5 };
const LEG_L = { x: 31, y: 74, w: 8, h: 22 };
const LEG_R = { x: 42, y: 74, w: 8, h: 22 };
const FOOT_L = { x: 29, y: 94, w: 11, h: 6 };
const FOOT_R = { x: 41, y: 94, w: 11, h: 6 };

const INK = [28, 16, 42, 255];
const WHITE = [247, 248, 255, 255];
const PUPIL = [24, 14, 36, 255];
const LIP = [196, 110, 132, 255];

function createSprite(w = W, h = H) {
  return { w, h, data: new Uint8ClampedArray(w * h * 4) };
}

function setPixel(sprite, x, y, color) {
  x = Math.round(x);
  y = Math.round(y);
  if (!color || x < 0 || y < 0 || x >= sprite.w || y >= sprite.h) return;
  const i = (y * sprite.w + x) * 4;
  sprite.data[i] = color[0];
  sprite.data[i + 1] = color[1];
  sprite.data[i + 2] = color[2];
  sprite.data[i + 3] = color.length > 3 ? color[3] : 255;
}

function alpha(sprite, x, y) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= sprite.w || y >= sprite.h) return 0;
  return sprite.data[(y * sprite.w + x) * 4 + 3];
}

function rgb(sprite, x, y) {
  const i = (Math.round(y) * sprite.w + Math.round(x)) * 4;
  return [sprite.data[i], sprite.data[i + 1], sprite.data[i + 2], sprite.data[i + 3]];
}

function clamp(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function darken(color, amount) {
  const f = 1 - amount;
  return [clamp(color[0] * f), clamp(color[1] * f), clamp(color[2] * f), color[3] ?? 255];
}

function lighten(color, amount) {
  return [
    clamp(color[0] + (255 - color[0]) * amount),
    clamp(color[1] + (255 - color[1]) * amount),
    clamp(color[2] + (255 - color[2]) * amount),
    color[3] ?? 255,
  ];
}

function mix(a, b, t) {
  return [
    clamp(a[0] + (b[0] - a[0]) * t),
    clamp(a[1] + (b[1] - a[1]) * t),
    clamp(a[2] + (b[2] - a[2]) * t),
    255,
  ];
}

function inEllipse(x, y, e) {
  const nx = (x + 0.5 - e.cx) / e.rx;
  const ny = (y + 0.5 - e.cy) / e.ry;
  return nx * nx + ny * ny <= 1;
}

function ellipse(sprite, e, color) {
  for (let y = Math.floor(e.cy - e.ry); y <= Math.ceil(e.cy + e.ry); y++) {
    for (let x = Math.floor(e.cx - e.rx); x <= Math.ceil(e.cx + e.rx); x++) {
      if (inEllipse(x, y, e)) setPixel(sprite, x, y, color);
    }
  }
}

function fillRect(sprite, r, color) {
  for (let y = r.y; y < r.y + r.h; y++) {
    for (let x = r.x; x < r.x + r.w; x++) setPixel(sprite, x, y, color);
  }
}

function forOpaque(sprite, fn) {
  for (let y = 0; y < sprite.h; y++) {
    for (let x = 0; x < sprite.w; x++) {
      if (alpha(sprite, x, y) > 0) fn(x, y);
    }
  }
}

function drawBody(sprite) {
  const white = [255, 255, 255, 255];
  ellipse(sprite, EAR_L, white);
  ellipse(sprite, EAR_R, white);
  ellipse(sprite, HEAD, white);
  fillRect(sprite, NECK, white);
  ellipse(sprite, SHOULDER, white);
  fillRect(sprite, TORSO, white);
  fillRect(sprite, ARM_L, white);
  fillRect(sprite, ARM_R, white);
  ellipse(sprite, HAND_L, white);
  ellipse(sprite, HAND_R, white);
  fillRect(sprite, LEG_L, white);
  fillRect(sprite, LEG_R, white);
  fillRect(sprite, FOOT_L, white);
  fillRect(sprite, FOOT_R, white);
}

function paintSkin(mask, base) {
  const sprite = createSprite();
  forOpaque(mask, (x, y) => {
    let color = base;
    if (x > 48) color = darken(color, 0.16);
    else if (x < 30) color = lighten(color, 0.07);
    if (((x + y) & 7) === 0) color = darken(color, 0.05);
    if (inEllipse(x, y, HEAD) && y > HEAD.cy + 8) color = darken(color, 0.1);
    if (inEllipse(x, y, { cx: 32, cy: 43, rx: 3, ry: 2 }) || inEllipse(x, y, { cx: 48, cy: 43, rx: 3, ry: 2 })) {
      color = mix(color, [255, 122, 150], 0.5);
    }
    if (x === 40 && y === 42) color = darken(base, 0.28);
    if (x === 40 && (y === 67 || y === 68)) color = darken(base, 0.22);
    setPixel(sprite, x, y, color);
  });
  return sprite;
}

function outlineFrom(mask) {
  const sprite = createSprite();
  ellipse(sprite, { cx: 40, cy: 106, rx: 16, ry: 3 }, [0, 0, 0, 80]);
  forOpaque(mask, (x, y) => {
    const edge =
      alpha(mask, x - 1, y) === 0 ||
      alpha(mask, x + 1, y) === 0 ||
      alpha(mask, x, y - 1) === 0 ||
      alpha(mask, x, y + 1) === 0;
    if (edge) setPixel(sprite, x, y, INK);
  });
  return sprite;
}

function paintBodyBase(mask, color) {
  const filled = paintSkin(mask, color);
  blit(filled, outlineFrom(mask));
  return filled;
}

function clothShade(rgb, x, y) {
  let color = rgb;
  if (x > 46) color = darken(color, 0.16);
  else if (x < 30) color = lighten(color, 0.08);
  if ((x * 2 + y) % 11 === 0) color = darken(color, 0.08);
  return color;
}

function inkEdges(sprite) {
  const marks = [];
  forOpaque(sprite, (x, y) => {
    const edge =
      alpha(sprite, x - 1, y) === 0 ||
      alpha(sprite, x + 1, y) === 0 ||
      alpha(sprite, x, y - 1) === 0 ||
      alpha(sprite, x, y + 1) === 0;
    if (edge) marks.push([x, y]);
  });
  for (const [x, y] of marks) {
    const current = rgb(sprite, x, y);
    setPixel(sprite, x, y, darken(current, 0.45));
  }
}

function inNeckHole(x, y) {
  return x >= 36 && x <= 43 && y >= 50 && y <= 58;
}

function paintTop(mask, rgb, mode) {
  const sprite = createSprite();
  forOpaque(mask, (x, y) => {
    if (y < 52 || inNeckHole(x, y)) return;
    const sleeve = x <= 31 || x >= 48;
    let keep = false;
    if (mode === "crop") keep = sleeve ? y < 64 : y < 68;
    if (mode === "tee") keep = sleeve ? y < 70 : y < 78;
    if (mode === "hoodie") keep = sleeve ? y < 72 : y < 80;
    if (mode === "jacket") keep = sleeve ? y < 74 : y < 86;
    if (!keep) return;
    setPixel(sprite, x, y, clothShade(rgb, x, y));
  });
  inkEdges(sprite);
  return sprite;
}

function stampIfOpaque(sprite, x, y, color) {
  if (alpha(sprite, x, y) > 0) setPixel(sprite, x, y, color);
}

function addTopDetails(sprite, mode, rgb) {
  const ink = darken(rgb, 0.5);
  if (mode === "tee") {
    for (let y = 62; y <= 64; y++) {
      for (let x = 37; x <= 42; x++) stampIfOpaque(sprite, x, y, [255, 43, 214, 255]);
    }
  }
  if (mode === "jacket") {
    for (let y = 60; y <= 82; y++) stampIfOpaque(sprite, 40, y, ink);
    for (let x = 33; x <= 37; x++) stampIfOpaque(sprite, x, 66, ink);
    for (let x = 43; x <= 47; x++) stampIfOpaque(sprite, x, 66, ink);
  }
  if (mode === "hoodie") {
    for (let x = 34; x <= 46; x++) {
      stampIfOpaque(sprite, x, 64, ink);
      stampIfOpaque(sprite, x, 72, ink);
    }
    for (let y = 64; y <= 72; y++) {
      stampIfOpaque(sprite, 34, y, ink);
      stampIfOpaque(sprite, 46, y, ink);
    }
  }
}

function paintBottom(mask, rgb, mode) {
  const sprite = createSprite();
  forOpaque(mask, (x, y) => {
    if (y < 74) return;
    if (mode === "shorts" && y >= 90) return;
    if (mode === "pants" && y >= 102) return;
    setPixel(sprite, x, y, clothShade(rgb, x, y));
  });
  if (mode === "shorts") {
    forOpaque(sprite, (x, y) => {
      if (y <= 77) setPixel(sprite, x, y, darken(rgb, 0.35));
    });
  }
  if (mode === "pants") {
    const shoe = [22, 20, 32, 255];
    forOpaque(sprite, (x, y) => {
      if (y >= 96) setPixel(sprite, x, y, shoe);
      if (x === 33 || x === 46) setPixel(sprite, x, y, [62, 224, 255, 255]);
    });
  }
  inkEdges(sprite);
  return sprite;
}

function paintSkirt(rgb) {
  const sprite = createSprite();
  const y0 = 74;
  const y1 = 96;
  for (let y = y0; y <= y1; y++) {
    const t = (y - y0) / (y1 - y0);
    const width = Math.round(16 + 16 * t);
    const x0 = 40 - Math.floor(width / 2);
    for (let x = x0; x < x0 + width; x++) {
      if (inEllipse(x, y, HAND_L) || inEllipse(x, y, HAND_R)) continue;
      setPixel(sprite, x, y, clothShade(rgb, x, y));
    }
  }
  for (let x = 34; x <= 46; x++) setPixel(sprite, x, 76, darken(rgb, 0.4));
  inkEdges(sprite);
  return sprite;
}

function spike(sprite, x, top, base, half, color) {
  for (let y = top; y <= base; y++) {
    const t = (y - top) / (base - top || 1);
    const w = Math.max(0, Math.round(half * t));
    for (let dx = -w; dx <= w; dx++) setPixel(sprite, x + dx, y, color);
  }
}

function hairShade(sprite, base, highlight) {
  forOpaque(sprite, (x, y) => {
    let color = base;
    if (x < 36) color = mix(base, highlight, 0.35);
    if (x > 50) color = darken(base, 0.18);
    if ((x + y) % 6 === 0) color = darken(color, 0.08);
    setPixel(sprite, x, y, color);
  });
}

function hairBob(part, base, highlight) {
  const sprite = createSprite();
  if (part === "back") {
    ellipse(sprite, { cx: 40, cy: 46, rx: 18, ry: 24 }, base);
  } else {
    fillRect(sprite, { x: 28, y: 20, w: 24, h: 12 }, base);
    fillRect(sprite, { x: 22, y: 30, w: 10, h: 24 }, base);
    fillRect(sprite, { x: 48, y: 30, w: 10, h: 24 }, base);
    setPixel(sprite, 40, 22, highlight);
    setPixel(sprite, 40, 26, highlight);
  }
  hairShade(sprite, base, highlight);
  return sprite;
}

function hairSpikes(part, base, highlight) {
  const sprite = createSprite();
  if (part === "front") {
    ellipse(sprite, { cx: 40, cy: 28, rx: 14, ry: 9 }, base);
    forOpaque(sprite, (x, y) => {
      if (y > 33) setPixel(sprite, x, y, [0, 0, 0, 0]);
    });
    for (const [x, top, bottom, half] of [
      [30, 14, 28, 3],
      [36, 8, 30, 3],
      [42, 10, 32, 4],
      [48, 8, 30, 3],
      [52, 15, 28, 3],
    ]) {
      spike(sprite, x, top, bottom, half, base);
    }
  } else {
    spike(sprite, 24, 18, 36, 3, base);
    spike(sprite, 56, 18, 36, 3, base);
  }
  hairShade(sprite, base, highlight);
  return sprite;
}

function hairLong(part, base, highlight) {
  const sprite = createSprite();
  if (part === "back") {
    // Rim behind the skull, plus tails that start on the head and fall outside the arms.
    ellipse(sprite, { cx: 40, cy: 40, rx: 18, ry: 18 }, base);
    fillRect(sprite, { x: 8, y: 36, w: 16, h: 64 }, base);
    fillRect(sprite, { x: 56, y: 36, w: 16, h: 64 }, base);
  } else {
    fillRect(sprite, { x: 28, y: 20, w: 24, h: 12 }, base);
    fillRect(sprite, { x: 24, y: 30, w: 8, h: 36 }, base);
    fillRect(sprite, { x: 48, y: 30, w: 8, h: 36 }, base);
  }
  hairShade(sprite, base, highlight);
  return sprite;
}

function hairBun(part, base, highlight) {
  const sprite = createSprite();
  if (part === "back") {
    ellipse(sprite, { cx: 40, cy: 14, rx: 8, ry: 7 }, base);
  } else {
    ellipse(sprite, { cx: 40, cy: 26, rx: 14, ry: 8 }, base);
    forOpaque(sprite, (x, y) => {
      if (y > 32) setPixel(sprite, x, y, [0, 0, 0, 0]);
    });
    fillRect(sprite, { x: 30, y: 28, w: 20, h: 5 }, base);
  }
  hairShade(sprite, base, highlight);
  return sprite;
}

function drawHood(rgb) {
  const sprite = createSprite();
  const cx = 40;
  const cy = 34;
  const outer = { rx: 17, ry: 19 };
  const inner = { rx: 12, ry: 14 };
  for (let y = cy - outer.ry; y <= cy + outer.ry; y++) {
    for (let x = cx - outer.rx; x <= cx + outer.rx; x++) {
      if (y > 54) continue;
      const outside = inEllipse(x, y, { cx, cy, rx: outer.rx, ry: outer.ry });
      const inside = inEllipse(x, y, { cx, cy, rx: inner.rx, ry: inner.ry });
      if (outside && !inside) setPixel(sprite, x, y, clothShade(rgb, x, y));
    }
  }
  inkEdges(sprite);
  return sprite;
}

function blitPattern(sprite, x, y, rows, colors) {
  rows.forEach((row, dy) => {
    [...row].forEach((ch, dx) => {
      if (colors[ch]) setPixel(sprite, x + dx, y + dy, colors[ch]);
    });
  });
}

function drawEyes(kind) {
  const sprite = createSprite();
  const left = [32, 34];
  const right = [43, 34];
  const neutral = [".WWWW.", "WWPPWW", "WWPPWW", ".WWWW."];
  const happy = [".HHHH.", "HH..HH"];
  const sleepy = ["IIIIII", "WWPPWW", ".WWWW."];
  const cyber = [".CCCC.", "CCGGCC", "CCGGCC", ".CCCC."];
  const map = {
    W: WHITE,
    P: PUPIL,
    H: INK,
    I: INK,
    C: [8, 36, 52, 255],
    G: [122, 247, 255, 255],
  };

  if (kind === "neutral") {
    blitPattern(sprite, left[0], left[1], neutral, map);
    blitPattern(sprite, right[0], right[1], neutral, map);
    setPixel(sprite, left[0] + 2, left[1] + 1, [255, 255, 255, 255]);
    setPixel(sprite, right[0] + 2, right[1] + 1, [255, 255, 255, 255]);
  } else if (kind === "happy") {
    blitPattern(sprite, left[0], left[1] + 1, happy, map);
    blitPattern(sprite, right[0], right[1] + 1, happy, map);
  } else if (kind === "wink") {
    blitPattern(sprite, left[0], left[1], neutral, map);
    setPixel(sprite, left[0] + 2, left[1] + 1, [255, 255, 255, 255]);
    blitPattern(sprite, right[0], right[1] + 1, happy, map);
  } else if (kind === "sleepy") {
    blitPattern(sprite, left[0], left[1] + 1, sleepy, map);
    blitPattern(sprite, right[0], right[1] + 1, sleepy, map);
  } else if (kind === "cyber") {
    blitPattern(sprite, left[0], left[1], cyber, map);
    blitPattern(sprite, right[0], right[1], cyber, map);
    for (let x = left[0] + 6; x < right[0]; x++) setPixel(sprite, x, left[1] + 2, [62, 224, 255, 255]);
  }

  const mouth =
    kind === "happy" || kind === "wink"
      ? ["L....L", ".LLLL."]
      : kind === "sleepy"
        ? [".LL."]
        : kind === "cyber"
          ? ["CCCC"]
          : ["LLLL"];
  const mouthColors = { L: LIP, C: [90, 220, 230, 255] };
  const mouthX = kind === "happy" || kind === "wink" ? 37 : kind === "sleepy" ? 38 : 38;
  blitPattern(sprite, mouthX, 46, mouth, mouthColors);
  return sprite;
}

function drawCap(rgb) {
  const sprite = createSprite();
  for (let y = 16; y <= 30; y++) {
    for (let x = 26; x <= 54; x++) {
      if (inEllipse(x, y, { cx: 40, cy: 26, rx: 14, ry: 10 })) setPixel(sprite, x, y, clothShade(rgb, x, y));
    }
  }
  fillRect(sprite, { x: 20, y: 28, w: 40, h: 4 }, darken(rgb, 0.15));
  inkEdges(sprite);
  return sprite;
}

function drawHeadphones() {
  const sprite = createSprite();
  const band = [32, 36, 48, 255];
  const cup = [18, 22, 32, 255];
  const pad = [62, 224, 255, 255];
  for (let y = 16; y <= 40; y++) {
    for (let x = 20; x <= 60; x++) {
      const d = Math.hypot(x + 0.5 - 40, y + 0.5 - 38);
      if (d > 16 && d < 20 && y < 36) setPixel(sprite, x, y, band);
    }
  }
  fillRect(sprite, { x: 20, y: 32, w: 10, h: 12 }, cup);
  fillRect(sprite, { x: 50, y: 32, w: 10, h: 12 }, cup);
  fillRect(sprite, { x: 27, y: 35, w: 3, h: 6 }, pad);
  fillRect(sprite, { x: 50, y: 35, w: 3, h: 6 }, pad);
  inkEdges(sprite);
  return sprite;
}

function drawChoker(rgb) {
  const sprite = createSprite();
  fillRect(sprite, { x: 35, y: 49, w: 10, h: 4 }, rgb);
  inkEdges(sprite);
  return sprite;
}

function drawPendant(rgb) {
  const sprite = createSprite();
  fillRect(sprite, { x: 39, y: 49, w: 2, h: 14 }, darken(rgb, 0.2));
  const gem = [
    [39, 63],
    [38, 64],
    [39, 64],
    [40, 64],
    [41, 64],
    [39, 65],
    [40, 65],
    [39, 66],
  ];
  for (const [x, y] of gem) setPixel(sprite, x, y, rgb);
  setPixel(sprite, 39, 64, lighten(rgb, 0.4));
  return sprite;
}

function drawGloves(rgb) {
  const sprite = createSprite();
  ellipse(sprite, { ...HAND_L, rx: HAND_L.rx + 1, ry: HAND_L.ry + 1 }, rgb);
  ellipse(sprite, { ...HAND_R, rx: HAND_R.rx + 1, ry: HAND_R.ry + 1 }, rgb);
  forOpaque(sprite, (x, y) => setPixel(sprite, x, y, clothShade(rgb, x, y)));
  fillRect(sprite, { x: 20, y: 80, w: 8, h: 2 }, [62, 224, 255, 255]);
  fillRect(sprite, { x: 52, y: 80, w: 8, h: 2 }, [62, 224, 255, 255]);
  inkEdges(sprite);
  return sprite;
}

function drawCuffs(rgb) {
  const sprite = createSprite();
  fillRect(sprite, { x: 19, y: 74, w: 12, h: 4 }, rgb);
  fillRect(sprite, { x: 49, y: 74, w: 12, h: 4 }, rgb);
  inkEdges(sprite);
  return sprite;
}

function backgroundStudio() {
  const sprite = createSprite();
  for (let y = 0; y < H; y++) {
    const t = y / H;
    const color = mix([22, 18, 40], [10, 10, 18], t);
    for (let x = 0; x < W; x++) setPixel(sprite, x, y, color);
  }
  return sprite;
}

function backgroundGrid() {
  const sprite = createSprite();
  fillRect(sprite, { x: 0, y: 0, w: W, h: H }, [8, 12, 26, 255]);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (y === 78) setPixel(sprite, x, y, [62, 224, 255, 255]);
      else if (y > 78 && (x % 8 === 0 || (y - 78) % 6 === 0)) setPixel(sprite, x, y, [20, 48, 78, 255]);
      else if (y < 78 && x % 8 === 0 && y % 8 === 0) setPixel(sprite, x, y, [18, 32, 58, 255]);
    }
  }
  return sprite;
}

function backgroundAlley() {
  const sprite = createSprite();
  fillRect(sprite, { x: 0, y: 0, w: W, h: H }, [14, 8, 28, 255]);
  fillRect(sprite, { x: 0, y: 0, w: 18, h: 96 }, [26, 16, 48, 255]);
  fillRect(sprite, { x: 62, y: 0, w: 18, h: 96 }, [22, 14, 42, 255]);
  fillRect(sprite, { x: 0, y: 96, w: W, h: 16 }, [12, 8, 20, 255]);
  const windows = [
    [4, 12, 255, 43, 214],
    [10, 28, 62, 224, 255],
    [5, 48, 255, 193, 74],
    [11, 66, 62, 224, 255],
    [66, 16, 62, 224, 255],
    [72, 36, 255, 43, 214],
    [67, 58, 255, 193, 74],
    [73, 74, 62, 224, 255],
  ];
  for (const [x, y, r, g, b] of windows) fillRect(sprite, { x, y, w: 3, h: 4 }, [r, g, b, 255]);
  fillRect(sprite, { x: 4, y: 40, w: 10, h: 3 }, [255, 43, 214, 255]);
  return sprite;
}

function bodyGuide(mask) {
  const sprite = createSprite();
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (x % 8 === 0 || y % 8 === 0) setPixel(sprite, x, y, [255, 255, 255, 28]);
    }
  }
  forOpaque(mask, (x, y) => setPixel(sprite, x, y, [255, 43, 214, 90]));
  const edge = outlineFrom(mask);
  forOpaque(edge, (x, y) => {
    if (rgb(edge, x, y)[3] === 255) setPixel(sprite, x, y, [255, 255, 255, 255]);
  });
  return sprite;
}

function blit(dest, src, ox = 0, oy = 0) {
  for (let y = 0; y < src.h; y++) {
    for (let x = 0; x < src.w; x++) {
      const a = alpha(src, x, y);
      if (a === 0) continue;
      const s = rgb(src, x, y);
      if (a === 255) {
        setPixel(dest, x + ox, y + oy, s);
        continue;
      }
      const d = rgb(dest, x + ox, y + oy);
      const aa = a / 255;
      const da = d[3] / 255;
      const outA = aa + da * (1 - aa);
      if (outA <= 0) continue;
      setPixel(dest, x + ox, y + oy, [
        clamp((s[0] * aa + d[0] * da * (1 - aa)) / outA),
        clamp((s[1] * aa + d[1] * da * (1 - aa)) / outA),
        clamp((s[2] * aa + d[2] * da * (1 - aa)) / outA),
        clamp(outA * 255),
      ]);
    }
  }
}

function composite(layers) {
  const out = createSprite();
  for (const layer of [...layers].sort((a, b) => a.z - b.z)) blit(out, layer.sprite);
  return out;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const name = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])), 0);
  return Buffer.concat([length, name, data, crc]);
}

function encodePng(sprite) {
  const stride = sprite.w * 4;
  const raw = Buffer.alloc((stride + 1) * sprite.h);
  for (let y = 0; y < sprite.h; y++) {
    const dest = y * (stride + 1);
    raw[dest] = 0;
    for (let i = 0; i < stride; i++) raw[dest + 1 + i] = sprite.data[y * stride + i];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(sprite.w, 0);
  ihdr.writeUInt32BE(sprite.h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function toFrame(sprite, { bleed = false } = {}) {
  if (sprite.w === FRAME && sprite.h === FRAME) return sprite;
  if (sprite.w !== W || sprite.h !== H) {
    throw new Error(`Sprite is ${sprite.w}×${sprite.h}; expected ${W}×${H} or ${FRAME}×${FRAME}`);
  }
  const out = createSprite(FRAME, FRAME);
  for (let y = 0; y < FRAME; y++) {
    for (let x = 0; x < FRAME; x++) {
      let sx = Math.floor((x - OX) / SCALE);
      let sy = Math.floor((y - OY) / SCALE);
      if (bleed) {
        if (sx < 0) sx = 0;
        else if (sx >= W) sx = W - 1;
        if (sy < 0) sy = 0;
        else if (sy >= H) sy = H - 1;
      } else if (sx < 0 || sy < 0 || sx >= W || sy >= H) {
        continue;
      }
      if (alpha(sprite, sx, sy) === 0) continue;
      setPixel(out, x, y, rgb(sprite, sx, sy));
    }
  }
  return out;
}

function save(rel, sprite, options) {
  const file = join(root, rel);
  if (existsSync(file)) {
    console.log(`keep ${rel}`);
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, encodePng(toFrame(sprite, options)));
}

function stampFrame(sprite) {
  const edge = [62, 224, 255, 220];
  const box = [255, 255, 255, 160];
  for (let i = 0; i < FRAME; i++) {
    setPixel(sprite, i, 0, edge);
    setPixel(sprite, i, FRAME - 1, edge);
    setPixel(sprite, 0, i, edge);
    setPixel(sprite, FRAME - 1, i, edge);
  }
  const x0 = OX;
  const y0 = OY;
  const x1 = OX + W * SCALE - 1;
  const y1 = OY + H * SCALE - 1;
  for (let x = x0; x <= x1; x++) {
    setPixel(sprite, x, y0, box);
    setPixel(sprite, x, y1, box);
  }
  for (let y = y0; y <= y1; y++) {
    setPixel(sprite, x0, y, box);
    setPixel(sprite, x1, y, box);
  }
  return sprite;
}

function crop(sprite, x0, y0, w, h) {
  const out = createSprite(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (alpha(sprite, x0 + x, y0 + y) === 0) continue;
      setPixel(out, x, y, rgb(sprite, x0 + x, y0 + y));
    }
  }
  return out;
}

function opaqueCount(sprite, x0, y0, x1, y1) {
  let n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) if (alpha(sprite, x, y) > 0) n++;
  }
  return n;
}

const mask = createSprite();
drawBody(mask);

const skins = {
  porcelain: [255, 220, 206],
  sand: [236, 190, 150],
  amber: [214, 156, 102],
  bronze: [168, 112, 72],
  umber: [112, 72, 48],
  night: [104, 82, 132],
};

const bodyTones = {
  light: [255, 224, 208],
  "light-medium": [244, 204, 170],
  medium: [224, 176, 128],
  "medium-deep": [176, 122, 80],
  deep: [112, 74, 48],
};
const bodyBases = {};
for (const [id, color] of Object.entries(bodyTones)) {
  bodyBases[id] = paintBodyBase(mask, color);
  save(`public/assets/base/${id}.png`, bodyBases[id]);
}
const baseSprite = bodyBases.medium;
try {
  unlinkSync(join(root, "public/assets/base/chibi.png"));
} catch {
  // The old 80×112 outline is no longer in the catalog.
}

const skinSprites = {};
for (const [id, color] of Object.entries(skins)) {
  skinSprites[id] = paintSkin(mask, color);
  save(`public/assets/skin/${id}.png`, skinSprites[id]);
}

const eyeSprites = {};
for (const id of ["neutral", "happy", "wink", "sleepy", "cyber"]) {
  eyeSprites[id] = drawEyes(id);
  save(`public/assets/eyes/${id}.png`, eyeSprites[id]);
}

const hairColors = {
  bob: [[124, 92, 255], [214, 196, 255]],
  spikes: [[62, 224, 255], [220, 255, 255]],
  long: [[255, 79, 163], [255, 190, 220]],
  bun: [[255, 193, 74], [255, 236, 190]],
};
const hairSprites = {};
for (const [id, [base, highlight]] of Object.entries(hairColors)) {
  const make =
    id === "bob" ? hairBob : id === "spikes" ? hairSpikes : id === "long" ? hairLong : hairBun;
  hairSprites[id] = {
    back: make("back", base, highlight),
    front: make("front", base, highlight),
  };
  save(`public/assets/hair/${id}-back.png`, hairSprites[id].back);
  save(`public/assets/hair/${id}-front.png`, hairSprites[id].front);
}

const tops = {
  "tee-cyan": { mode: "tee", rgb: [62, 207, 255] },
  "jacket-magenta": { mode: "jacket", rgb: [255, 43, 214] },
  "hoodie-violet": { mode: "hoodie", rgb: [139, 108, 255] },
  "crop-lime": { mode: "crop", rgb: [198, 255, 74] },
};
const topSprites = {};
for (const [id, spec] of Object.entries(tops)) {
  const garment = paintTop(mask, spec.rgb, spec.mode);
  addTopDetails(garment, spec.mode, spec.rgb);
  topSprites[id] = garment;
  save(`public/assets/top/${id}.png`, garment);
}
const hood = drawHood(tops["hoodie-violet"].rgb);
save("public/assets/top/hoodie-violet-hood.png", hood);

const bottoms = {
  shorts: { mode: "shorts", rgb: [36, 48, 86] },
  pants: { mode: "pants", rgb: [28, 30, 46] },
};
const bottomSprites = {};
for (const [id, spec] of Object.entries(bottoms)) {
  bottomSprites[id] = paintBottom(mask, spec.rgb, spec.mode);
  save(`public/assets/bottom/${id}.png`, bottomSprites[id]);
}
bottomSprites.skirt = paintSkirt([255, 77, 141]);
save("public/assets/bottom/skirt.png", bottomSprites.skirt);

const accessories = {
  cap: drawCap([255, 193, 74]),
  headphones: drawHeadphones(),
  choker: drawChoker([255, 43, 214]),
  pendant: drawPendant([62, 224, 255]),
  gloves: drawGloves([20, 24, 36]),
  cuffs: drawCuffs([255, 193, 74]),
};
for (const [id, sprite] of Object.entries(accessories)) {
  save(`public/assets/accessory/${id}.png`, sprite);
}

const backgrounds = {
  studio: backgroundStudio(),
  grid: backgroundGrid(),
  alley: backgroundAlley(),
};
for (const [id, sprite] of Object.entries(backgrounds)) {
  save(`public/assets/background/${id}.png`, sprite, { bleed: true });
}

save("public/assets/_guide/body-guide.png", stampFrame(toFrame(bodyGuide(mask))));

function stack(parts) {
  return composite(parts.map(([z, sprite]) => ({ z, sprite })));
}

const previews = {
  default: stack([
    [0, backgrounds.studio],
    [10, hairSprites.bob.back],
    [20, skinSprites.sand],
    [30, baseSprite],
    [40, bottomSprites.shorts],
    [50, topSprites["tee-cyan"]],
    [70, eyeSprites.happy],
    [80, hairSprites.bob.front],
    [90, accessories.headphones],
  ]),
  naked: stack([
    [0, backgrounds.studio],
    [20, skinSprites.sand],
    [30, baseSprite],
    [70, eyeSprites.neutral],
  ]),
  long: stack([
    [0, backgrounds.alley],
    [10, hairSprites.long.back],
    [20, skinSprites.umber],
    [30, baseSprite],
    [40, bottomSprites.pants],
    [50, topSprites["jacket-magenta"]],
    [60, accessories.pendant],
    [70, eyeSprites.cyber],
    [80, hairSprites.long.front],
    [90, accessories.cap],
  ]),
  bun: stack([
    [0, backgrounds.grid],
    [10, hairSprites.bun.back],
    [20, skinSprites.porcelain],
    [30, baseSprite],
    [40, bottomSprites.skirt],
    [50, topSprites["hoodie-violet"]],
    [60, accessories.choker],
    [70, eyeSprites.wink],
    [80, hairSprites.bun.front],
    [85, hood],
    [100, accessories.cuffs],
  ]),
  spikes: stack([
    [0, backgrounds.studio],
    [10, hairSprites.spikes.back],
    [20, skinSprites.night],
    [30, baseSprite],
    [40, bottomSprites.shorts],
    [50, topSprites["crop-lime"]],
    [70, eyeSprites.sleepy],
    [80, hairSprites.spikes.front],
    [100, accessories.gloves],
  ]),
};

const previewDir = join(process.env.TEMP || "/tmp", "cryptopanim-sprite-preview");
mkdirSync(previewDir, { recursive: true });
for (const [name, sprite] of Object.entries(previews)) {
  writeFileSync(join(previewDir, `${name}.png`), encodePng(toFrame(sprite, { bleed: true })));
}

const sheet = createSprite(FRAME * 5, FRAME);
Object.values(previews).forEach((sprite, index) => {
  blit(sheet, toFrame(sprite, { bleed: true }), index * FRAME, 0);
});
const sheetPath = join(previewDir, "sheet.png");
writeFileSync(sheetPath, encodePng(sheet));

const iconPath = join(root, "app/icon.png");
if (!existsSync(iconPath)) {
  writeFileSync(iconPath, encodePng(crop(previews.default, 24, 16, 32, 32)));
}

const headPixels = opaqueCount(previews.default, 28, 22, 54, 50);
const bodyPixels = opaqueCount(previews.naked, 20, 54, 60, 100);
if (headPixels < 80 || bodyPixels < 120) {
  console.error(`Sprite sanity check failed (head ${headPixels}, body ${bodyPixels})`);
  process.exit(1);
}

console.log(`Wrote placeholder sprites. Preview sheet: ${sheetPath}`);
