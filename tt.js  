const axios = require("axios");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const cfonts = require("cfonts");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_KEY = "yujixd";
const BASE_API = "https://api.neoxr.eu/api/tiktok";
const OUTPUT_DIR = "/sdcard/hasil-download";

function showTitle() {
  console.clear();
  cfonts.say('YUJI', {
    font: 'block',
    align: 'center',
    gradient: ['blue', 'cyan'],
    transitionGradient: true,
    env: 'node'
  });
}

function showDesk() {
cfonts.say('TIKTOK \nNo WM', {
font: 'simple',
align: 'center',
gradient: ['green','cyan'],
transitionGradient: true,
env: 'node'
});
}
function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_");
}

function promptLink() {
  rl.question("Masukkan link TikTok: ", async (link) => {
    if (!link) {
      console.log("Link kosong!");
      rl.close();
      return;
    }

    try {
      const res = await axios.get(BASE_API, {
        params: {
          url: link,
          apikey: API_KEY
        }
      });

      const result = res.data;
      if (!result.status) {
        console.log("Gagal mendapatkan data.");
        rl.close();
        return;
      }

      const data = result.data;
      const caption = data.caption;
      const videoUrl = data.video;

      console.log("\n=== INFO VIDEO ===\n");
      console.log("📄 Caption:", caption);
      console.log("                     ");
      console.log("⬇️  Mengunduh video...\n");

      // pastikan folder output tersedia
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }

      const filename = sanitizeFilename(data.author.nickname) + ".mp4";
      const filePath = path.join(OUTPUT_DIR, filename);

      const videoRes = await axios.get(videoUrl, { responseType: "stream" });
      const stream = fs.createWriteStream(filePath);

      videoRes.data.pipe(stream);
      stream.on("finish", () => {
        console.log(`✅ Video berhasil disimpan sebagai: ${filePath}`);
        rl.close();
      });

    } catch (err) {
      console.error("❌ Error:", err.message);
      rl.close();
    }
  });
}

// Jalankan program
showTitle();
showDesk();
promptLink();
