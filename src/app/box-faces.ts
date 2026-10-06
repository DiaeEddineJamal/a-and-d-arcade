import type { Game } from "./catalog";

// Printed faces of a big box, generated from the front cover when no real photography exists
// (drop public/box-art/<id>-back.png or <id>-spine.png in to replace them).
type Face = HTMLImageElement | HTMLCanvasElement;
const font = (variable: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback;
const players = (game: Game) => `${game.players} PLAYER${game.players === "1" ? "" : "S"}`;

function sheet(width: number, height: number) {
  const element = document.createElement("canvas");
  element.width = width; element.height = height;
  return [element, element.getContext("2d")!] as const;
}

/** Scuffed print: fine grain plus darker rubbed edges. */
function wear(context: CanvasRenderingContext2D, width: number, height: number) {
  const pixels = context.getImageData(0, 0, width, height), data = pixels.data;
  for (let i = 0; i < data.length; i += 4) { const n = (Math.random() - .5) * 14; data[i] += n; data[i + 1] += n; data[i + 2] += n; }
  context.putImageData(pixels, 0, 0);
  for (const [x0, y0, x1, y1] of [[0, 0, width, 0], [0, 0, 0, height]]) {
    const edge = context.createLinearGradient(x0, y0, x1, y1);
    edge.addColorStop(0, "#00000055"); edge.addColorStop(.05, "#0000"); edge.addColorStop(.95, "#0000"); edge.addColorStop(1, "#00000055");
    context.fillStyle = edge; context.fillRect(0, 0, width, height);
  }
}

/** Spine: the front art wraps round the corner, under a darkened band with the title running down it. */
function spine(front: HTMLImageElement, game: Game, title: string, fromRight: boolean) {
  const [element, context] = sheet(192, 896);
  const strip = front.width * .2;
  context.drawImage(front, fromRight ? front.width - strip : 0, 0, strip, front.height, 0, 0, 192, 896);
  context.fillStyle = "#00000080"; context.fillRect(0, 0, 192, 896);
  context.fillStyle = "#f2ecd8"; context.fillRect(20, 24, 152, 88);
  context.fillStyle = "#1a1a1a"; context.textAlign = "center";
  context.font = `italic 700 46px ${font("--font-serif", "Georgia")}`; context.fillText("A&D", 96, 84);
  context.save(); context.translate(96, 480); context.rotate(Math.PI / 2);
  context.fillStyle = "#fffaf0"; context.shadowColor = "#000c"; context.shadowBlur = 8;
  context.font = `700 ${title.length > 16 ? 50 : 64}px ${font("--font-serif", "Georgia")}`;
  context.fillText(title.toUpperCase(), 0, 22, 660);
  context.restore();
  context.fillStyle = "#f2ecd8"; context.font = `600 28px ${font("--font-plex", "monospace")}`; context.fillText(game.number, 96, 862);
  wear(context, 192, 896);
  return element;
}

/** Top and bottom flaps: the cover's edge colour with a small printed credit line. */
function lid(front: HTMLImageElement, game: Game, bottom: boolean) {
  const [element, context] = sheet(640, 192);
  context.drawImage(front, 0, bottom ? front.height * .9 : 0, front.width, front.height * .1, 0, 0, 640, 192);
  context.fillStyle = "#0000009e"; context.fillRect(0, 0, 640, 192);
  context.fillStyle = "#e9e1c9"; context.textAlign = "center"; context.font = `600 26px ${font("--font-plex", "monospace")}`;
  context.fillText(`A&D ARCADE  ·  BOX ${game.number}  ·  ${players(game)}`, 320, 106);
  wear(context, 640, 192);
  return element;
}

/** Back of the box: blurred art, title, two crops as "screenshots", blurb, feature bullets, barcode. */
function back(front: HTMLImageElement, game: Game, title: string) {
  const [element, context] = sheet(640, 960);
  const serif = font("--font-serif", "Georgia"), mono = font("--font-plex", "monospace");
  context.filter = "blur(18px) saturate(1.2)";
  context.drawImage(front, -40, -40, 720, 1040);
  context.filter = "none";
  context.fillStyle = "#000000b8"; context.fillRect(0, 0, 640, 960);
  context.textAlign = "left";
  context.fillStyle = "#f5efdc"; context.font = `700 44px ${serif}`; context.fillText(title, 44, 92, 552);
  context.fillStyle = "#f5b800"; context.font = `italic 500 24px ${serif}`; context.fillText(game.tagline, 44, 134, 552);
  [[.08, .18], [.45, .5]].forEach(([sx, sy], index) => {
    const x = 44 + index * 286;
    context.fillStyle = "#f5efdc"; context.fillRect(x - 4, 166, 274, 196);
    context.drawImage(front, front.width * sx, front.height * sy, front.width * .48, front.height * .24, x, 170, 266, 188);
  });
  context.fillStyle = "#e8e1cc"; context.font = `400 21px ${serif}`;
  let line = "", y = 430;
  for (const word of game.description.split(" ")) {
    if (context.measureText(`${line}${word} `).width > 552) { context.fillText(line, 44, y); line = ""; y += 30; }
    line += `${word} `;
  }
  context.fillText(line, 44, y); y += 52;
  context.font = `600 19px ${mono}`;
  for (const feature of game.features) { context.fillStyle = "#f5b800"; context.fillText("■", 44, y); context.fillStyle = "#f5efdc"; context.fillText(feature.toUpperCase(), 74, y); y += 34; }
  context.fillStyle = "#f5efdc"; context.fillRect(44, 820, 180, 96);
  context.fillStyle = "#111";
  for (let x = 54; x < 214; x += 3 + (x * 7) % 5) context.fillRect(x, 830, 1 + (x % 3), 62);
  context.font = `500 13px ${mono}`; context.fillText(`4 006381 3333${game.number}`, 58, 908);
  context.fillStyle = "#f5efdc"; context.textAlign = "right"; context.font = `600 16px ${mono}`;
  context.fillText("A&D ARCADE · PC / BROWSER", 596, 852);
  context.fillText(`${players(game)} · ${game.genre.toUpperCase()}`, 596, 880, 360);
  wear(context, 640, 960);
  return element;
}

/** In three.js BoxGeometry material order: +x, -x, +y, -y, +z (front), -z (back). */
export function boxFaces(front: HTMLImageElement, backArt: HTMLImageElement | null, spineArt: HTMLImageElement | null, game: Game, title: string): Face[] {
  // ChatGPT spines come as 2:3 sheets with the design in a centred vertical band; cut that band out
  let spineFace: Face | null = null;
  if (spineArt) {
    const [element, context] = sheet(192, 896);
    const band = spineArt.height * (192 / 896);
    context.drawImage(spineArt, (spineArt.width - band) / 2, 0, band, spineArt.height, 0, 0, 192, 896);
    spineFace = element;
  }
  return [
    spineFace ?? spine(front, game, title, true), spineFace ?? spine(front, game, title, false),
    lid(front, game, false), lid(front, game, true),
    front, backArt ?? back(front, game, title),
  ];
}
