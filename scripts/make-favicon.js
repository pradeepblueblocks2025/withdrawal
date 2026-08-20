const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const src = path.join(root, "public", "logo-f.png");
const size = 512;
const logoSize = Math.round(size * 0.78);
const offset = Math.round((size - logoSize) / 2);

async function main() {
  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
  );

  const logo = await sharp(src)
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const radius = Math.round(logoSize * 0.22);
  const roundedMask = Buffer.from(
    `<svg width="${logoSize}" height="${logoSize}"><rect width="${logoSize}" height="${logoSize}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
  );

  const roundedLogo = await sharp(logo)
    .composite([{ input: roundedMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const favicon = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: circleSvg, top: 0, left: 0 },
      { input: roundedLogo, top: offset, left: offset },
    ])
    .png()
    .toBuffer();

  await sharp(favicon).png().toFile(path.join(root, "public", "favicon.png"));
  await sharp(favicon)
    .resize(32, 32)
    .png()
    .toFile(path.join(root, "public", "favicon-32.png"));
  await sharp(favicon)
    .resize(180, 180)
    .png()
    .toFile(path.join(root, "public", "apple-touch-icon.png"));
  await sharp(favicon).png().toFile(path.join(root, "app", "icon.png"));

  const ico32 = await sharp(favicon).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = 32;
  entry[1] = 32;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(ico32.length, 8);
  entry.writeUInt32LE(22, 12);
  const ico = Buffer.concat([header, entry, ico32]);
  fs.writeFileSync(path.join(root, "public", "favicon.ico"), ico);
  fs.writeFileSync(path.join(root, "app", "favicon.ico"), ico);

  console.log("favicon assets written with white round background");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
