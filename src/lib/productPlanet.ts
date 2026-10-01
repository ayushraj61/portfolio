const SIZE = 416;
const cache = new Map<string, HTMLCanvasElement>();
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const fract = (value: number) => value - Math.floor(value);

function hash(x: number, y: number, seed: number) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 19.19) * 43758.5453);
}

function noise(x: number, y: number, seed: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const left = hash(ix, iy, seed) * (1 - ux) + hash(ix + 1, iy, seed) * ux;
  const right = hash(ix, iy + 1, seed) * (1 - ux) + hash(ix + 1, iy + 1, seed) * ux;
  return left * (1 - uy) + right * uy;
}

function rgb(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  const value = parseInt(match?.[1] ?? 'd4a853', 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function getProductPlanet(id: string, color: string): HTMLCanvasElement {
  const key = `${id}:${color}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const output = ctx.createImageData(SIZE, SIZE);
  const pixels = output.data;
  const radius = SIZE * .48;
  const center = SIZE / 2;
  const [red, green, blue] = rgb(color);
  const seed = [...id].reduce((sum, character) => sum * 31 + character.charCodeAt(0), 17) >>> 0;
  const rocky = id === 'outlay' || id === 'splitme';

  for (let y = 0; y < SIZE; y++) {
    const ny = (center - y) / radius;
    for (let x = 0; x < SIZE; x++) {
      const nx = (x - center) / radius;
      const distance = nx * nx + ny * ny;
      if (distance >= 1) continue;
      const nz = Math.sqrt(1 - distance);
      const latitude = Math.asin(ny);
      const longitude = Math.atan2(nx, nz);
      const broad = noise(longitude * 2.5 + 8, latitude * 2.8 + 6, seed);
      const medium = noise(longitude * 7.7 + 3, latitude * 9.5 + 5, seed + 7);
      const fine = noise(longitude * 19 + 2, latitude * 23 + 4, seed + 13);
      let material: number;
      let pale: number;
      if (rocky) {
        const terrain = broad * .58 + medium * .32 + fine * .1;
        material = terrain > .51 ? .73 + (terrain - .51) * 1.25 : .37 + terrain * .35;
        pale = terrain > .69 ? (terrain - .69) * 1.9 : 0;
      } else {
        const bands = Math.sin(latitude * (id === 'daknode' ? 19 : 26) + broad * 3.1 + medium * 1.2);
        const swirls = Math.sin(longitude * 10 + latitude * 13 + medium * 5);
        material = .58 + bands * .19 + swirls * .09 + (fine - .5) * .22;
        pale = Math.max(0, bands) * .24;
      }
      const light = clamp(.48 + (-nx * .54 + ny * .26 + nz * .44) * .68);
      const shadow = .13 + light * .98;
      const rim = Math.pow(1 - nz, 3) * .34;
      const glint = rocky && fine > .83 && light < .56 ? (fine - .83) * 1.5 : 0;
      const index = (y * SIZE + x) * 4;
      pixels[index] = clamp((red * material * shadow + 222 * pale * light + red * rim + 175 * glint) / 255) * 255;
      pixels[index + 1] = clamp((green * material * shadow + 213 * pale * light + green * rim + 150 * glint) / 255) * 255;
      pixels[index + 2] = clamp((blue * material * shadow + 203 * pale * light + blue * rim + 100 * glint) / 255) * 255;
      pixels[index + 3] = Math.floor(clamp((1 - Math.sqrt(distance)) * radius * .85) * 255);
    }
  }
  ctx.putImageData(output, 0, 0);
  cache.set(key, canvas);
  return canvas;
}
