const TAU = Math.PI * 2;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (from: number, to: number, value: number) => {
  const point = clamp((value - from) / (to - from));
  return point * point * (3 - 2 * point);
};

function createEarth(image: HTMLImageElement, nightImage: HTMLImageElement): HTMLCanvasElement {
  const size = 760;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const source = document.createElement('canvas');
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  const sourceCtx = source.getContext('2d', { willReadFrequently: true });
  if (!sourceCtx) return canvas;
  sourceCtx.drawImage(image, 0, 0);
  const texture = sourceCtx.getImageData(0, 0, source.width, source.height).data;
  const nightSource = document.createElement('canvas');
  nightSource.width = nightImage.naturalWidth;
  nightSource.height = nightImage.naturalHeight;
  const nightCtx = nightSource.getContext('2d', { willReadFrequently: true });
  if (!nightCtx) return canvas;
  nightCtx.drawImage(nightImage, 0, 0);
  const nightTexture = nightCtx.getImageData(0, 0, nightSource.width, nightSource.height).data;
  const output = ctx.createImageData(size, size);
  const target = output.data;
  const radius = size / 2 - 3;
  const lat0 = 16 * Math.PI / 180;
  const lon0 = -77 * Math.PI / 180;
  const cosLat0 = Math.cos(lat0);
  const sinLat0 = Math.sin(lat0);

  for (let y = 0; y < size; y++) {
    const ny = (size / 2 - y) / radius;
    for (let x = 0; x < size; x++) {
      const nx = (x - size / 2) / radius;
      const r2 = nx * nx + ny * ny;
      if (r2 >= 1) continue;
      const nz = Math.sqrt(1 - r2);
      const lat = Math.asin(ny * cosLat0 + nz * sinLat0);
      const lon = lon0 + Math.atan2(nx, nz * cosLat0 - ny * sinLat0);
      const sourceX = Math.floor((((lon + Math.PI) / TAU) % 1 + 1) % 1 * (source.width - 1));
      const sourceY = Math.floor((.5 - lat / Math.PI) * (source.height - 1));
      const src = (sourceY * source.width + sourceX) * 4;
      const nightX = Math.floor(sourceX / source.width * nightSource.width);
      const nightY = Math.floor(sourceY / source.height * nightSource.height);
      const nightSrc = (nightY * nightSource.width + nightX) * 4;
      const dst = (y * size + x) * 4;
      const sunlight = nx * .82 + ny * .14 + nz * .34 - .1;
      const daylight = smooth(-.25, .42, sunlight);
      const shade = .53 + Math.max(0, sunlight) * .55;
      const lights = clamp((nightTexture[nightSrc] + nightTexture[nightSrc + 1] + nightTexture[nightSrc + 2] - 52) / 360);
      const atmosphere = Math.pow(1 - nz, 3) * (.14 + daylight * .52);
      const nightRed = texture[src] * .065 + lights * 155;
      const nightGreen = texture[src + 1] * .07 + lights * 132;
      const nightBlue = texture[src + 2] * .15 + lights * 93;
      target[dst] = (nightRed * (1 - daylight) + texture[src] * shade * daylight) * (1 - atmosphere) + 72 * atmosphere;
      target[dst + 1] = (nightGreen * (1 - daylight) + texture[src + 1] * shade * daylight) * (1 - atmosphere) + 162 * atmosphere;
      target[dst + 2] = (nightBlue * (1 - daylight) + texture[src + 2] * shade * daylight) * (1 - atmosphere) + 232 * atmosphere;
      target[dst + 3] = Math.floor(clamp((1 - Math.sqrt(r2)) * radius * .75) * 255);
    }
  }
  ctx.putImageData(output, 0, 0);
  return canvas;
}

let earthTexturePromise: Promise<HTMLCanvasElement> | null = null;

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${source}`));
    image.src = source;
  });
}

export function getEarthTexture(): Promise<HTMLCanvasElement> {
  if (!earthTexturePromise) {
    earthTexturePromise = Promise.all([
      loadImage('/flight/earth-blue-marble-clouds.jpg'),
      loadImage('/flight/earth-night-lights.jpg'),
    ]).then(([day, night]) => createEarth(day, night)).catch((error) => {
      earthTexturePromise = null;
      throw error;
    });
  }
  return earthTexturePromise;
}
