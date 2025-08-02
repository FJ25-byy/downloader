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
  cfonts.say('Downloader', {
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
  console.log("\nPilih menu:");
  console.log("1. TikTok");
  console.log("2. Instagram");
  console.log("Ketik 'exit' untuk keluar.");
  rl.question("Masukkan pilihan Anda: ", (choice) => {
    if (choice === "1") {
      downloadTikTok();
    } else if (choice === "2") {
      downloadInstagram();
    } else if (choice.toLowerCase() === "exit") {
      console.log("👋 Keluar dari program.");
      rl.close();
    } else {
      console.log("❌ Pilihan tidak valid.");
      promptMenu();
    }
  });
}

function downloadTikTok() {
  rl.question("\nMasukkan link TikTok (atau ketik 'back' untuk kembali): ", async (link) => {
    if (!link || link.toLowerCase() === "back") return promptMenu();

    try {
      const res = await axios.get("https://api.neoxr.eu/api/tiktok", {
        params: { url: link, apikey: API_KEY }
      });

      const result = res.data;
      if (!result.status) throw new Error("Gagal mendapatkan data TikTok.");

      const data = result.data;
      const caption = data.caption
      const videoUrl = data.video;
      const filename = sanitizeFilename(data.author.nickname) + ".mp4";
      const filePath = path.join(OUTPUT_DIR, filename);

      if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

      const videoRes = await axios.get(videoUrl, { responseType: "stream" });
      const stream = fs.createWriteStream(filePath);

      console.log("\nCaption: ", caption);
      console.log("\n⬇️  Mengunduh video TikTok...\n");

      videoRes.data.pipe(stream);
      stream.on("finish", () => {
        console.log(`✅ Disimpan sebagai: ${filePath}\n`);
        promptMenu();
      });

    } catch (err) {
      console.error("❌ Error:", err.message);
      promptMenu();
    }
  });
}

function downloadInstagram() {
  rl.question("\nMasukkan link Instagram (atau ketik 'back' untuk kembali): ", async (link) => {
    if (!link || link.toLowerCase() === "back") return promptMenu();

    try {
      const res = await axios.get("https://api.neoxr.eu/api/ig", {
        params: { url: link, apikey: API_KEY }
      });

      const result = res.data;
      if (!result.status || !result.data.length) throw new Error("Gagal mendapatkan data Instagram.");

      const media = result.data[0];
      const filename = `${pickRandom("instagram", "ig", "insta", "igdl", "instagram_dl", "gramIns")}.${media.type}`;
      const filePath = path.join(OUTPUT_DIR, filename);

      if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

      const mediaRes = await axios.get(media.url, { responseType: "stream" });
      const stream = fs.createWriteStream(filePath);

      console.log("\n⬇️  Mengunduh video Instagram...\n");

      mediaRes.data.pipe(stream);
      stream.on("finish", () => {
        console.log(`✅ Disimpan sebagai: ${filePath}\n`);
        promptMenu();
      });

    } catch (err) {
      console.error("❌ Error:", err.message);
      promptMenu();
    }
  });
}

// Jalankan
showTitle();
promptMenu();
