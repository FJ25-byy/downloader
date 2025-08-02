const axios = require("axios");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const cfonts = require("cfonts");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const OUTPUT_DIR = "/sdcard/hasil-download";
const API_KEY = "yujixd";

function showTitle() {
  console.clear();
  cfonts.say('YUJI', {
    font: 'block',
    align: 'center',
    gradient: ['blue', 'cyan'],
    transitionGradient: true,
    env: 'node'
  });
  cfonts.say('Downloader\n', {
    font: 'console',
    align: 'center',
    gradient: ['green', 'cyan'],
    transitionGradient: true,
    env: 'node'
  });
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_");
}

function pickRandom(...list) {
  return list[Math.floor(Math.random() * list.length)];
}

function promptMenu() {
  rl.question("Pilih menu\n1. TikTok\n2. Instagram\nMasukan Pilihan Anda: ", (choice) => {
    if (choice === "1") {
      downloadTikTok();
    } else if (choice === "2") {
      downloadInstagram();
    } else {
      console.log("Pilihan tidak valid.");
      rl.close();
    }
  });
}

function downloadTikTok() {
  rl.question("Masukkan link TikTok: ", async (link) => {
    if (!link) return rl.close();

    try {
      const res = await axios.get("https://api.neoxr.eu/api/tiktok", {
        params: { url: link, apikey: API_KEY }
      });

      const result = res.data;
      if (!result.status) throw new Error("Gagal mendapatkan data TikTok.");

      const data = result.data;
      const videoUrl = data.video;
      const filename = sanitizeFilename(data.author.nickname) + ".mp4";
      const filePath = path.join(OUTPUT_DIR, filename);

      if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

      const videoRes = await axios.get(videoUrl, { responseType: "stream" });
      const stream = fs.createWriteStream(filePath);

      console.log("\n⬇️  Mengunduh video TikTok...\n");

      videoRes.data.pipe(stream);
      stream.on("finish", () => {
        console.log(`✅ Disimpan sebagai: ${filePath}`);
        rl.close();
      });

    } catch (err) {
      console.error("❌ Error:", err.message);
      rl.close();
    }
  });
}

function downloadInstagram() {
  rl.question("Masukkan link Instagram: ", async (link) => {
    if (!link) return rl.close();

    try {
      const res = await axios.get("https://api.neoxr.eu/api/ig", {
        params: { url: link, apikey: API_KEY }
      });

      const result = res.data;
      if (!result.status || !result.data.length) throw new Error("Gagal mendapatkan data Instagram.");

      const media = result.data[0];
      const filename = `${pickRandom("instagram","ig","insta","igdl","instagram_dl","gramIns")}.${media.type}`;
      const filePath = path.join(OUTPUT_DIR, filename);

      if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

      const mediaRes = await axios.get(media.url, { responseType: "stream" });
      const stream = fs.createWriteStream(filePath);

      console.log("\n⬇️  Mengunduh video Instagram...\n");

      mediaRes.data.pipe(stream);
      stream.on("finish", () => {
        console.log(`✅ Disimpan sebagai: ${filePath}`);
        rl.close();
      });

    } catch (err) {
      console.error("❌ Error:", err.message);
      rl.close();
    }
  });
}

// Jalankan
showTitle();
promptMenu();
