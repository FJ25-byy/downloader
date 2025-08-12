const axios = require("axios");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const cfonts = require("cfonts");
const FormData = require("form-data");
const cheerio = require("cheerio");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ===== LOGIN CONFIG =====
const LOGIN_USER = "share";
const LOGIN_PASS = "sharenih";
const LOGIN_KEY = "yuji";

function login() {
  rl.question("👤 Username: ", (user) => {
    rl.question("🔑 Password: ", (pass) => {
      rl.question("🗝️ Key: ", (key) => {
        if (user === LOGIN_USER && pass === LOGIN_PASS && key === LOGIN_KEY) {
          console.log("\n✅ Login berhasil!\n");
          showTitle();
          promptMenu();
        } else {
          console.log("\n❌ Login gagal! Program dihentikan.\n");
          process.exit(0);
        }
      });
    });
  });
}

const OUTPUT_DIR = "/sdcard/hasil-download";
const API_KEY = "yujixd";

// Spotify Configuration
process.env['SPOTIFY_CLIENT_ID'] = '4c4fc8c3496243cbba99b39826e2841f';
process.env['SPOTIFY_CLIENT_SECRET'] = 'd598f89aba0946e2b85fb8aefa9ae4c8';

// VirusTotal Configuration
const VT_API_KEY = "928dc6c89cb000ee255b99634434cb6582ca31cf249620edfb4bb6bd89bcf072";
const API_ENDPOINT_FILES = "https://www.virustotal.com/api/v3/files";
const API_ENDPOINT_URLS = "https://www.virustotal.com/api/v3/urls";
const API_ENDPOINT_ANALYSES = "https://www.virustotal.com/api/v3/analyses";

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
  return name.replace(/[^a-zA-Z0-9-_.]/g, "_");
}

function pickRandom(...list) {
  return list[Math.floor(Math.random() * list.length)];
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function convert(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function promptMenu() {
  console.log("\n" + "=".repeat(50));
  console.log("🎯 MENU UTAMA");
  console.log("1. 📱 TikTok Downloader");
  console.log("2. 📸 Instagram Downloader");
  console.log("3. 🎵 Music Downloader");
  console.log("4. 🎧 Spotify Downloader");
  console.log("5. 📝 YouTube Transcript");
  console.log("6. 💳 Top Up DANA");
  console.log("7. 🔥 NGL Spam");
  console.log("8. 📱 OTP Spam");
  console.log("9. 🛡️ VirusTotal Scan");
  console.log("10. 🔍 Telegram Channel Search");
  console.log("11. 📧 TempMail (Email Sementara)");
  console.log("12. 📱 Verif SMS (Nomor Gratis)");
  console.log("0. 🚪 Keluar");
  console.log("=".repeat(50));

  rl.question("Pilih menu: ", (choice) => {
    switch(choice) {
      case "1": downloadTikTok(); break;
      case "2": downloadInstagram(); break;
      case "3": musicMenu(); break;
      case "4": spotifyMenu(); break;
      case "5": transcriptMenu(); break;
      case "6": topupDana(); break;
      case "7": nglSpamMenu(); break;
      case "8": otpSpamMenu(); break;
      case "9": virusTotalMenu(); break;
      case "10": telegramMenu(); break;
      case "11": tempmailMenu(); break;
      case "12": lubanMenu(); break;
      case "0":
        console.log("👋 Sampai jumpa!");
        rl.close();
        break;
      default:
        console.log("❌ Pilihan tidak valid");
        promptMenu();
    }
  });
}

// VirusTotal Functions
async function makeApiRequest(url, method, headers, body = null) {
  const response = await axios({
    url,
    method,
    headers,
    data: body,
    validateStatus: () => true
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error("VirusTotal API Error: " + response.status);
  }
  return response.data;
}

async function getAnalysisResults(analysisId) {
  const url = `${API_ENDPOINT_ANALYSES}/${analysisId}`;
  const headers = { "x-apikey": VT_API_KEY };
  return makeApiRequest(url, "GET", headers);
}

async function analyzeUrl(url) {
  const formData = new URLSearchParams();
  formData.append("url", url);
  const headers = {
    "x-apikey": VT_API_KEY,
    "Content-Type": "application/x-www-form-urlencoded"
  };
  const data = await makeApiRequest(API_ENDPOINT_URLS, "POST", headers, formData);
  return data.data.id;
}

async function uploadFile(fileBuffer) {
  const form = new FormData();
  form.append('file', fileBuffer, { filename: 'file' });
  const headers = {
    "x-apikey": VT_API_KEY,
    ...form.getHeaders()
  };
  const data = await makeApiRequest(API_ENDPOINT_FILES, "POST", headers, form);
  return data.data.id;
}

async function checkUrl(url) {
  const analysisId = await analyzeUrl(url);
  const pollAnalysis = async () => {
    const analysisResults = await getAnalysisResults(analysisId);
    if (analysisResults.data.attributes.status === "completed") {
      return analysisResults;
    } else {
      await new Promise((r) => setTimeout(r, 5000));
      return pollAnalysis();
    }
  };
  const results = await pollAnalysis();
  return parseUrlResult(results);
}

async function checkFile(fileBuffer) {
  const analysisId = await uploadFile(fileBuffer);
  const pollAnalysis = async () => {
    const analysisResults = await getAnalysisResults(analysisId);
    if (analysisResults.data.attributes.status === "completed") {
      return analysisResults;
    } else {
      await new Promise((r) => setTimeout(r, 5000));
      return pollAnalysis();
    }
  };
  const results = await pollAnalysis();
  return parseFileResult(results);
}

function parseUrlResult(analysisResults) {
  const stats = analysisResults.data.attributes.stats;
  const vendors = analysisResults.data.attributes.results;
  let status = "🟢 Safe";
  if (stats.malicious > 0) status = "🔴 Malicious";
  else if (stats.suspicious > 0) status = "🟡 Suspicious";
  return {
    vendors,
    message: `VIRUSTOTAL URL ANALYSIS\nStatus: ${status}\nMalicious: ${stats.malicious}\nSuspicious: ${stats.suspicious}\n`
  };
}

function parseFileResult(analysisResults) {
  const stats = analysisResults.data.attributes.stats;
  const vendors = analysisResults.data.attributes.results;
  let status = "🟢 Safe";
  if (stats.malicious > 0) status = "🔴 Malicious";
  else if (stats.suspicious > 0) status = "🟡 Suspicious";
  return {
    vendors,
    message: `VIRUSTOTAL FILE ANALYSIS\nStatus: ${status}\nMalicious: ${stats.malicious}\nSuspicious: ${stats.suspicious}\n`
  };
}

async function saveResultToFile(data, filename) {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Hasil tersimpan di: ${filePath}`);
}

// =================== Spotify Functions (unchanged) ====================
async function spotifyCreds() {
  try {
    const json = await (await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: { Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64') }
    })).data;
    if (!json.access_token) return { status: false, msg: `Can't generate token!` };
    return { status: true, data: json };
  } catch (e) {
    return { status: false, msg: e.message };
  }
}

async function searchingSpotify(query, type = 'track', limit = 20) {
  const creds = await spotifyCreds();
  if (!creds.status) return creds;
  const json = await (await axios.get(`https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=${type}&offset=0&limit=${limit}`, {
    headers: { Authorization: 'Bearer ' + creds.data.access_token }
  })).data;
  if (!json.tracks || !json.tracks.items || json.tracks.items.length < 1) return { status: false, msg: 'Music not found!' };
  let data = json.tracks.items.map(v => ({
    title: v.album.artists[0].name + ' - ' + v.name,
    duration: convert(v.duration_ms),
    popularity: v.popularity + '%',
    preview: v.preview_url,
    url: v.external_urls.spotify
  }));
  return { status: true, data };
}

async function spotifydl(url) {
  try {
    const yanzz = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`);
    const yanz = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${yanzz.data.result.gid}/${yanzz.data.result.id}`);
    return {
      title: yanzz.data.result.name,
      type: yanzz.data.result.type,
      artis: yanzz.data.result.artists,
      durasi: yanzz.data.result.duration_ms,
      image: yanzz.data.result.image,
      download: "https://api.fabdl.com" + yanz.data.result.download_url
    };
  } catch (error) {
    throw new Error(`Gagal download dari Spotify: ${error.message}`);
  }
}

function spotifyMenu() {
  console.log("\n🎧 SPOTIFY DOWNLOADER");
  console.log("1. 🔍 Cari Lagu Spotify");
  console.log("2. 📥 Download dari URL Spotify");
  console.log("3. 🔙 Kembali ke Menu Utama");

  rl.question("Pilih opsi: ", (choice) => {
    if (choice === "1") {
      searchSpotifyMusic();
    } else if (choice === "2") {
      downloadFromSpotifyUrl();
    } else if (choice === "3") {
      promptMenu();
    } else {
      console.log("❌ Pilihan tidak valid");
      spotifyMenu();
    }
  });
}

async function searchSpotifyMusic() {
  rl.question("\n🔍 Masukkan nama lagu atau artis: ", async (query) => {
    if (!query) return spotifyMenu();

    try {  
      console.log(`🎵 Mencari "${query}" di Spotify...`);  
      const result = await searchingSpotify(query, 'track', 10);  
        
      if (!result.status) {  
        console.log(`❌ ${result.msg}`);  
        return spotifyMenu();  
      }  

      console.log("\n🎶 Hasil Pencarian:");  
      console.log("=".repeat(60));  
      result.data.forEach((track, index) => {  
        console.log(`${index + 1}. ${track.title}`);  
        console.log(`   ⏱ Durasi: ${track.duration} | 🔥 Popularitas: ${track.popularity}`);  
        console.log(`   🔗 URL: ${track.url}`);  
        console.log("-".repeat(40));  
      });  

      rl.question("\nPilih nomor lagu (1-10) atau 0 untuk kembali: ", async (choice) => {  
        const index = parseInt(choice) - 1;  
        if (choice === "0") return spotifyMenu();  
        if (isNaN(index) || index < 0 || index >= result.data.length) {  
          console.log("❌ Pilihan tidak valid");  
          return searchSpotifyMusic();  
        }  

        const selectedTrack = result.data[index];  
        console.log(`\n📥 Memproses download: ${selectedTrack.title}`);  
          
        try {  
          const downloadData = await spotifydl(selectedTrack.url);  
          const filename = `${sanitizeFilename(downloadData.title)}_${pickRandom("spotify", "spot", "music")}.mp3`;  
          const filePath = path.join(OUTPUT_DIR, filename);  

          console.log("\n⬇️ Mengunduh dari Spotify...");  
          await downloadFile(downloadData.download, filePath);  
          console.log(`✅ Berhasil! File tersimpan di: ${filePath}`);  
        } catch (error) {  
          console.error(`❌ Gagal: ${error.message}`);  
        }  
          
        spotifyMenu();  
      });  
    } catch (error) {  
      console.error("❌ Error:", error.message);  
      spotifyMenu();  
    }
  });
}

async function downloadFromSpotifyUrl() {
  rl.question("\n📥 Masukkan URL Spotify: ", async (url) => {
    if (!url) return spotifyMenu();

    if (!url.includes('spotify.com/track/')) {  
      console.log("❌ URL tidak valid! Pastikan URL adalah link track Spotify");  
      return downloadFromSpotifyUrl();  
    }  

    try {  
      console.log("🔍 Memproses URL Spotify...");  
      const downloadData = await spotifydl(url);  
      console.log("\n🎵 Informasi Lagu:");  
      console.log("=".repeat(40));  
      console.log(`🎧 Judul: ${downloadData.title}`);  
      console.log(`👤 Artis: ${downloadData.artis}`);  
      console.log(`⏱ Durasi: ${convert(downloadData.durasi)}`);  
      console.log("=".repeat(40));  

      const filename = `${sanitizeFilename(downloadData.title)}_${pickRandom("spotify", "spot", "music")}.mp3`;  
      const filePath = path.join(OUTPUT_DIR, filename);  

      console.log("\n⬇️ Mengunduh dari Spotify...");  
      await downloadFile(downloadData.download, filePath);  
      console.log(`\n✅ Berhasil! File tersimpan di: ${filePath}`);  
    } catch (error) {  
      console.error("❌ Error:", error.message);  
      console.log("\n💡 Tips:");  
      console.log("- Pastikan URL Spotify valid");  
      console.log("- Cek koneksi internet Anda");  
      console.log("- Coba lagi nanti jika server sibuk");  
    }  
    
    spotifyMenu();
  });
}

// TopUp DANA unchanged
async function topupDana() {
  rl.question("\n💳 Masukkan nomor dan jumlah (contoh: 08123456789|10000): ", async (input) => {
    if (!input) return promptMenu();

    const [number, amount] = input.split('|');  
    
    if (!number || !amount) {  
      console.log("❌ Format salah! Contoh: 08123456789|10000");  
      return topupDana();  
    }  

    try {  
      console.log("\n🔍 Memproses pembayaran...");  
        
      const response = await axios.get("https://api.neoxr.eu/api/topup-dana", {  
        params: {  
          number: number,  
          amount: amount,  
          apikey: API_KEY  
        },  
        timeout: 30000  
      });  

      if (response.data.status && response.data.data) {  
        const paymentData = response.data.data;  
          
        console.clear();
        console.log("\n✅ TOP UP DANA BERHASIL DIPROSES");  
        console.log("══════════════════════════════");  
        console.log(`📌 ID Transaksi: ${paymentData.id}`);  
        console.log(`📱 Nomor: ${paymentData.number}`);  
        console.log(`💳 Jumlah: ${paymentData.price_format}`);  
        console.log(`⏰ Kadaluwarsa: ${paymentData.expired_at}`);  
                console.log("══════════════════════════════")
        if (paymentData.qr_image) {  
          const qrFilename = `dana_qr_${paymentData.id}.png`;  
          const qrPath = path.join(OUTPUT_DIR, qrFilename);  
            
          fs.writeFileSync(qrPath, paymentData.qr_image, 'base64');  
          console.log(`📸 QR Code tersimpan di: ${qrPath}`);  
        }  
      } else {  
        throw new Error("Gagal mendapatkan data pembayaran");  
      }  
    } catch (error) {  
      console.error("\n❌ Error:", error.message);  
      console.log("\n💡 Tips:");  
      console.log("- Pastikan format input benar");  
      console.log("- Cek koneksi internet Anda");  
      console.log("- Coba lagi nanti jika server sibuk");  
    }  
    
    promptMenu();
  });
}

// Music menu unchanged
function musicMenu() {
  console.log("\n🎵 MUSIC DOWNLOADER");
  console.log("1. 🔍 Cari dan Download Lagu");
  console.log("2. 🔙 Kembali ke Menu Utama");

  rl.question("Pilih opsi: ", (choice) => {
    if (choice === "1") {
      searchAndDownloadMusic();
    } else if (choice === "2") {
      promptMenu();
    } else {
      console.log("❌ Pilihan tidak valid");
      musicMenu();
    }
  });
}

async function getTranscript(saveToFile = false) {
  rl.question("\n📝 Masukkan URL YouTube: ", async (url) => {
    if (!url) return transcriptMenu();

    try {  
      console.log("🔍 Mengambil transcript...");  
      const response = await axios.get("https://api.neoxr.eu/api/transcript", {  
        params: { url, apikey: API_KEY },  
        timeout: 30000  
      });  

      if (!response.data.status) throw new Error("Gagal mendapatkan transcript");  

      const transcript = response.data.data.text;  
      console.log("\n📄 Transcript:");  
      console.log("=".repeat(60));  
      console.log(transcript.substring(0, 200) + (transcript.length > 200 ? "..." : ""));  
      console.log("=".repeat(60));  
      console.log(`📊 Total karakter: ${transcript.length}`);  

      if (saveToFile) {  
        const filename = `transcript_${pickRandom("file","hasil")}.txt`;  
        const filePath = path.join(OUTPUT_DIR, filename);  
          
        fs.writeFileSync(filePath, transcript, 'utf8');  
        console.log(`\n✅ Berhasil disimpan di: ${filePath}`);  
      }  
    } catch (error) {  
      console.error("❌ Error:", error.message);  
    }  
    
    transcriptMenu();
  });
}

function transcriptMenu() {
  console.log("\n📝 YOUTUBE TRANSCRIPT");
  console.log("1. 📄 Ambil Transcript");
  console.log("2. 💾 Simpan ke File");
  console.log("3. 🔙 Kembali ke Menu Utama");

  rl.question("Pilih opsi: ", (choice) => {
    if (choice === "1") {
      getTranscript(false);
    } else if (choice === "2") {
      getTranscript(true);
    } else if (choice === "3") {
      promptMenu();
    } else {
      console.log("❌ Pilihan tidak valid");
      transcriptMenu();
    }
  });
}

async function searchAndDownloadMusic() {
  rl.question("\n🎵 Masukkan judul lagu: ", async (query) => {
    if (!query) return musicMenu();

    try {  
      console.log(`🔍 Mencari: "${query}"...`);  
      const response = await axios.get("https://api.neoxr.eu/api/play", {  
        params: { q: query, apikey: API_KEY },  
        timeout: 30000  
      });  

      if (!response.data.status) throw new Error("Lagu tidak ditemukan");  

      const data = response.data;
      console.clear();  
      console.log("\n📀 Informasi Lagu:");  
      console.log("=".repeat(40));  
      console.log(`🎵 Judul: ${data.title}`);  
      console.log(`👤 Artist: ${data.channel}`);  
      console.log(`⏱ Durasi: ${data.fduration}`);  
      console.log("=".repeat(40));  

      rl.question("\n💾 Download lagu ini? (y/n): ", async (answer) => {  
        if (answer.toLowerCase() === 'y') {  
          const filename = `${sanitizeFilename(data.title)}.mp3`;  
          const filePath = path.join(OUTPUT_DIR, filename);  

          console.log("\n⬇️ Mengunduh lagu...");  
          await downloadFile(data.data.url, filePath);  
            
          console.log(`\n✅ Berhasil! File tersimpan di: ${filePath}`);  
        }  
        musicMenu();  
      });  
    } catch (error) {  
      console.error("❌ Error:", error.message);  
      musicMenu();  
    }
  });
}

async function downloadFile(url, filePath) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream',
    timeout: 60000
  });

  const writer = fs.createWriteStream(filePath);
  let downloadedBytes = 0;
  const totalBytes = parseInt(response.headers['content-length']) || 0;

  response.data.on('data', (chunk) => {
    downloadedBytes += chunk.length;
    const progress = totalBytes > 0
      ? ((downloadedBytes / totalBytes) * 100).toFixed(1)
      : downloadedBytes;
    process.stdout.write(`\r📊 Progress: ${progress}${totalBytes > 0 ? '%' : ' bytes'}`);
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// TikTok & Instagram & existing tools unchanged:
function downloadTikTok() {
  rl.question("\nMasukkan link TikTok: ", async (url) => {
    if (!url) return promptMenu();

    try {  
      console.log("🔍 Memproses link TikTok...");  
      const response = await axios.get("https://api.neoxr.eu/api/tiktok", {  
        params: { url, apikey: API_KEY },  
        timeout: 30000  
      });  

      if (!response.data.status) throw new Error("Gagal mendapatkan data TikTok");  

      const data = response.data.data;  

      console.clear();
      console.log("\n📝 Caption:", data.caption);  
      console.log("👤 Author:", data.author.nickname);  

      // Jika ada foto  
      if (data.photo && data.photo.length > 0) {  
        console.log("\n📸 Deteksi konten foto...");  
        for (let i = 0; i < data.photo.length; i++) {  
          const photoUrl = data.photo[i];  
          const filename = `${sanitizeFilename(data.author.nickname)}_${pickRandom("ttfoto","tiktokfoto", "ttimage","ttimg")}_${i + 1}.jpg`;  
          const filePath = path.join(OUTPUT_DIR, filename);  

          console.log(`⬇️ Mengunduh foto ${i + 1}...`);  
          await downloadFile(photoUrl, filePath);  
          console.log(`✅ Foto ${i + 1} tersimpan di: ${filePath}`);  
        }  
      }  
      // Jika ada video  
      else if (data.video || data.videoWM) {  
        const videoUrl = data.video || data.videoWM;  
        const filename = `${sanitizeFilename(data.author.nickname)}_${pickRandom("ttvid","ttvideo","tiktokvid","tiktokvideo")}.mp4`;  
        const filePath = path.join(OUTPUT_DIR, filename);  

        console.log("\n⬇️ Mengunduh video TikTok...");  
        await downloadFile(videoUrl, filePath);  
        console.log(`✅ Video tersimpan di: ${filePath}`);  
      } else {  
        throw new Error("Konten tidak dikenali (bukan video atau foto)");  
      }  
    } catch (error) {  
      console.error("❌ Error:", error.message);  
    }  

    promptMenu();
  });
}

function downloadInstagram() {
  rl.question("\nMasukkan link Instagram: ", async (url) => {
    if (!url) return promptMenu();

    try {  
      console.log("🔍 Memproses link Instagram...");  
      const response = await axios.get("https://api.neoxr.eu/api/ig", {  
        params: { url, apikey: API_KEY },  
        timeout: 30000  
      });  

      if (!response.data.status || !response.data.data.length) {  
        throw new Error("Gagal mendapatkan data Instagram");  
      }  

      const media = response.data.data[0];  
      const filename = `${pickRandom("ig","insta","instagram","ins")}.${media.type}`;  
      const filePath = path.join(OUTPUT_DIR, filename);  

      console.log("\n⬇️ Mengunduh media Instagram...");  
      await downloadFile(media.url, filePath);  
        
      console.log(`\n✅ Berhasil! File tersimpan di: ${filePath}`);  
    } catch (error) {  
      console.error("❌ Error:", error.message);  
    }  
    
    promptMenu();
  });
}

// NGL Spam & OTP spam unchanged
function nglSpamMenu() {
  console.clear();
  console.log("\n🔥 NGL SPAM TOOL");
  rl.question("Masukkan username NGL: ", async (username) => {
    if (!username) return promptMenu();

    rl.question("Masukkan jumlah spam (max 500): ", async (jumlah) => {  
      jumlah = parseInt(jumlah);  
      if (isNaN(jumlah)) {  
        console.log("❌ Jumlah harus angka");  
        return nglSpamMenu();  
      }  
      if (jumlah > 500) {  
        console.log("❌ Maksimal 500 spam per sekali kirim");  
        return nglSpamMenu();  
      }  

      rl.question("Masukkan pesan: ", async (pesan) => {  
        if (!pesan) return nglSpamMenu();  

        console.log(`\n🚀 Memulai spam ke ${username}...`);  
        console.log(`📝 Pesan: ${pesan}`);  
        console.log(`🔢 Jumlah: ${jumlah}`);  

        let sukses = 0, gagal = 0;  
        for (let i = 1; i <= jumlah; i++) {  
          try {  
            const res = await axios.post(`https://ngl.link/api/submit`, {  
              username: username,  
              question: pesan,  
              deviceId: Math.random().toString(36).substring(2, 18)  
            }, {  
              headers: {  
                "Content-Type": "application/json"  
              }  
            });  

            if (res.status === 200) {  
              sukses++;  
              console.log(`[${i}/${jumlah}] Berhasil mengirim ke ${username}`);  
            } else {  
              gagal++;  
              console.log(`[${i}/${jumlah}] Gagal mengirim`);  
            }  
          } catch (e) {  
            gagal++;  
            console.log(`[${i}/${jumlah}] Error: ${e.message}`);  
          }  
          await new Promise(resolve => setTimeout(resolve, 500));  
        }  

        console.clear();
        console.log("\n✅ SPAM SELESAI");  
        console.log("=".repeat(30));  
        console.log(`👤 Username: ${username}`);  
        console.log(`📝 Pesan: ${pesan}`);  
        console.log(`✅ Sukses: ${sukses}`);  
        console.log(`❌ Gagal: ${gagal}`);  
        console.log("=".repeat(30));  

        promptMenu();  
      });  
    });
  });
}

function otpSpamMenu() {
  console.clear();
  console.log("\n📱 OTP SPAM TOOL");
  rl.question("Masukkan nomor target (contoh: 8123456789): ", async (nomor) => {
    if (!nomor) return promptMenu();

    rl.question("Masukkan jumlah spam (max 10): ", async (jumlah) => {  
      jumlah = parseInt(jumlah);  
      if (isNaN(jumlah)) {  
        console.log("❌ Jumlah harus angka");  
        return otpSpamMenu();  
      }  
      if (jumlah > 10) {  
        console.log("❌ Maksimal 10 spam per sekali kirim");  
        return otpSpamMenu();  
      }  

      console.log(`\n🚀 Memulai OTP spam ke ${nomor}...`);  
      console.log(`🔢 Jumlah: ${jumlah}`);  

      let sukses = 0, gagal = 0;  
      for (let i = 1; i <= jumlah; i++) {  
        try {  
          await sendOtpToNumber(nomor);  
          sukses++;  
          console.log(`[${i}/${jumlah}] Berhasil mengirim OTP`);  
        } catch (e) {  
          gagal++;  
          console.log(`[${i}/${jumlah}] Gagal: ${e.message}`);  
        }  
        await new Promise(resolve => setTimeout(resolve, 1000));  
      }  

      console.clear();
      console.log("\n✅ OTP SPAM SELESAI");  
      console.log("=".repeat(30));  
      console.log(`📱 Nomor: ${nomor}`);  
      console.log(`✅ Sukses: ${sukses}`);  
      console.log(`❌ Gagal: ${gagal}`);  
      console.log("=".repeat(30));  

      promptMenu();  
    });
  });
}

async function sendOtpToNumber(nomor) {
  const urls = [
    "https://api102.singa.id/new/login/sendWaOtp?versionName=2.4.8&versionCode=143&model=SM-G965N&systemVersion=9&platform=android&appsflyer_id=",
    "https://titipku.tech/v1/mobile/auth/otp?method=wa",
    "https://api-mobile.bisatopup.co.id/register/send-verification",
    "https://aci-user.bmsecure.id/v2/user/signin-otp/wa/send",
    "https://app.candireload.com/apps/v8/users/req_otp_register_wa",
    "https://sofia.bmsecure.id/central-api/sc-api/otp/generate",
    "https://keranjangbelanja.co.id/api/v1/user/otp",
    `https://irsx.mitradeltapulsa.com:8080/appirsx/appapi.dll/otpreg?phone=${nomor}`,
    "https://agenpayment-app.findig.id/api/v1/user/register",
    "https://agenpayment-app.findig.id/api/v1/user/login"
  ];

  const payloads = [
    JSON.stringify({ mobile_phone: nomor, type: "mobile", is_switchable: 1 }),
    JSON.stringify({ phone_number: "+62" + nomor, message_placeholder: "hehe" }),
    `phone_number=${nomor}`,
    JSON.stringify({ phone_user: nomor }),
    JSON.stringify({ uuid: "b787045b140c631f", phone: nomor }),
    JSON.stringify({ version_name: "6.2.1 (428)", phone: nomor }),
    `---dio-boundary-0879576676\r\ncontent-disposition: form-data; name="phone"\r\n\r\n${nomor}\r\n---dio-boundary-0879576676\r\ncontent-disposition: form-data; name="otp"\r\n\r\n118872\r\n---dio-boundary-0879576676--`,
    "",
    JSON.stringify({ name: "AAD", phone: nomor, pin: "1111", referral_code: "", password: "12345678" }),
    JSON.stringify({ phone: nomor, pin: "1111" })
  ];

  const headers = [
    { "Content-Type": "application/json; charset=utf-8" },
    { "Content-Type": "application/json; charset=UTF-8" },
    { "Content-Type": "application/x-www-form-urlencoded" },
    { "Content-Type": "application/json; charset=UTF-8" },
    { "Content-Type": "application/json" },
    { "Content-Type": "application/json" },
    { "content-type": "multipart/form-data; boundary=--dio-boundary-0879576676" },
    {},
    { "content-type": "application/json; charset=utf-8" },
    { "content-type": "application/json; charset=utf-8" }
  ];

  for (let i = 0; i < urls.length; i++) {
    let url = urls[i];
    let payload = payloads[i];
    let header = Object.assign({}, headers[i]);

    try {  
      if (url.includes("aci-user.bmsecure.id")) {  
        const jogjaTokenResp = await axios.post(  
          "https://aci-user.bmsecure.id/oauth/token",  
          "grant_type=client_credentials&uuid=00000000-0000-0000-0000-000000000000&id_user=0&id_kota=0&location=0.0%2C0.0&via=jogjakita_user&version_code=501&version_name=6.10.1",  
          {  
            headers: {  
              "Authorization": "Basic OGVjMzRmMOGDctOTYyMC00YjQwLTg0YjQtYjM0ZTAwMDAwMDAw",  
              "Content-Type": "application/x-www-form-urlencoded",  
              "User -Agent": "okhttp/4.10.0"  
            }  
          }  
        );  
        const jogjaToken = jogjaTokenResp.data.access_token || "";  
        header["Authorization"] = `Bearer ${jogjaToken}`;  
      }  

      if (url.includes("sofia.bmsecure.id")) {  
        const speedcashTokenResp = await axios.post(  
          "https://sofia.bmsecure.id/central-api/oauth/token",  
          "grant_type=client_credentials",  
          {  
            headers: {  
              "Authorization": "Basic NGFiY2M5ZmkzNWQxQTt3Y2Q0Y2Q0Y2Q0Y2Q0Y2Q0Y2Q0",  
              "Content-Type": "application/x-www-form-urlencoded"  
            }  
          }  
        );  
        const speedcashToken = speedcashTokenResp.data.access_token || "";  
        header["Authorization"] = `Bearer ${speedcashToken}`;  
      }  

      if (Object.keys(header).length > 0) {  
        await axios.post(url, payload, { headers: header, timeout: 15000 });  
      } else {  
        await axios.post(url, payload, { timeout: 15000 });  
      }  

      console.log(`Mengirim OTP ke ${nomor} melalui ${url}...`);  
    } catch (e) {  
      console.log(`Error sending to ${url}: ${e.message}`);  
    }
  }
}

// =================== Fitur Baru: Telegram Search ===================
async function getRealTelegramLink(joinUrl) {
  try {
    const { data } = await axios.get(joinUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
      },
      timeout: 15000
    });

    const $ = cheerio.load(data);
    const realLink = $('a[href^="tg://resolve"]').attr("href");

    if (realLink) {
      const username = realLink.split("tg://resolve?domain=")[1];
      return `https://t.me/${username}`;
    }
  } catch (e) {
    console.error(`💢 Gagal ambil link asli cuks: ${e.message}`);
  }
  return joinUrl; // fallback kalo gagal
}

async function searchTelegramChannels(query) {
  try {
    console.log(`Wett... lagi nyari channel "${query}" nih cuks...`);
    const url = `https://en.tgramsearch.com/search?query=${encodeURIComponent(query)}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
      },
      timeout: 20000
    });

    const $ = cheerio.load(data);
    const results = [];

    for (const el of $(".tg-channel-wrapper").toArray()) {
      const name = $(el).find(".tg-channel-link a").text().trim();
      let link = $(el).find(".tg-channel-link a").attr("href");
      const image = $(el).find(".tg-channel-img img").attr("src");
      const members = $(el).find(".tg-user-count").text().trim();
      const description = $(el).find(".tg-channel-description").text().trim();
      const category = $(el).find(".tg-channel-categories a").text().trim();

      // Biar link join jadi t.me
      if (link?.startsWith("/join/")) {
        link = await getRealTelegramLink(`https://en.tgramsearch.com${link}`);
      } else if (link?.startsWith("tg://resolve?domain=") || link?.includes("tg://")) {
        const username = link.split("tg://resolve?domain=")[1] || link.replace(/tg:\/\/?/, "");
        link = `https://t.me/${username}`;
      } else if (link && link.startsWith("/")) {
        link = `https://en.tgramsearch.com${link}`;
      }

      results.push({ name, link, image, members, description, category });
    }

    if (results.length === 0) {
      console.log("Waduh cuks, nggak nemu channelnya 😭");
    }

    return results;
  } catch (err) {
    console.error(`💢 Error scraping nye cuks: ${err.message}`);
    return [];
  }
}

// Telegram CLI menu
function telegramMenu() {
  console.clear();
  console.log("\n🔍 TELEGRAM CHANNEL SEARCH");
  rl.question("Masukkan kata kunci (contoh: musik, game): ", async (q) => {
    if (!q) return promptMenu();
    try {
      const res = await searchTelegramChannels(q);
      if (!res || res.length === 0) {
        console.log("❌ Tidak ada hasil.");
        return promptMenu();
      }
      console.log("\n🎯 Hasil Pencarian:");
      console.log("=".repeat(60));
      res.forEach((item, i) => {
        console.log(`${i + 1}. ${item.name || "(No name)"}`);
        console.log(`   👥 Members   : ${item.members || "-"}`);
        console.log(`   🏷️ Category : ${item.category || "-"}`);
        console.log(`   📝 Deskripsi : ${item.description || "-"}`);
        console.log(`   🔗 Link      : ${item.link || "-"}`);
        console.log("-".repeat(40));
      });
      // Tawarkan simpan hasil
      rl.question("\n🗃️ Simpan hasil ke file? (y/n): ", async (ans) => {
        if (ans.toLowerCase() === 'y') {
          const filename = `telegram_search_${sanitizeFilename(q)}.json`;
          await saveResultToFile(res, filename);
        }
        promptMenu();
      });
    } catch (e) {
      console.error("❌ Error:", e.message);
      promptMenu();
    }
  });
}

// =================== Fitur Baru: TempMail ===================
const tempmail = {
  api: {
    base: 'https://api.tempmail.lol',
    endpoints: {
      create: '/v2/inbox/create',
      inbox: token => `/v2/inbox?token=${token}`
    }
  },

  headers: {
    'user-agent': 'NB Android/1.0.0'
  },

  create: async (prefix = null) => {
    try {
      const payload = { domain: null, captcha: null };
      if (prefix) payload.prefix = prefix;

      const { data } = await axios.post(
        `${tempmail.api.base}${tempmail.api.endpoints.create}`,
        payload,
        { headers: tempmail.headers }
      );

      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + (60 * 60 * 1000));

      return {
        success: true,
        code: 200,
        result: {
          address: data.address,
          token: data.token,
          expiresAt
        }
      };
    } catch (error) {
      return {
        success: false,
        code: error?.response?.status || 500,
        result: { error: error.message }
      };
    }
  },

  checkInbox: async (token, expiresAt) => {
    try {
      if (!token || token.trim() === '') {
        return {
          success: true,
          code: 200,
          result: {
            token: null,
            emails: [],
            expiresAt: expiresAt.toISOString()
          }
        };
      }

      let attempt = 0;
      let inboxnya;

      while (true) {
        if (new Date() > expiresAt) {
          return {
            success: false,
            code: 410,
            result: { error: 'Token buat email ini udah expired bree, kagak bisa diakses 😂', expiresAt }
          };
        }

        const { data } = await axios.get(
          `${tempmail.api.base}${tempmail.api.endpoints.inbox(token)}`,
          { headers: tempmail.headers }
        );

        if (data.expired) {
          return {
            success: false,
            code: 410,
            result: { error: 'Emailnya udah expired bree.. bikin tempmail yang baru aja gih... ' }
          };
        }

        if (data.emails?.length > 0) {
          inboxnya = data;
          break;
        }

        attempt++;
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      const emails = inboxnya.emails.map(e => ({
        id: e.id || e._id,
        from: e.from,
        to: e.to,
        subject: e.subject,
        body: e.body,
        createdAt: e.createdAt,
        attachments: e.attachments || []
      }));

      return {
        success: true,
        code: 200,
        result: {
          token,
          expired: inboxnya.expired,
          expiresAt: expiresAt.toISOString(),
          emails
        }
      };
    } catch (error) {
      return {
        success: false,
        code: error?.response?.status || 500,
        result: { error: error.message }
      };
    }
  }
};

// TempMail CLI
function tempmailMenu() {
  console.clear();
  console.log("\n📧 TEMPMAIL (Email Sementara)");
  console.log("1. ✨ Buat email sementara");
  console.log("2. 📥 Cek inbox (pakai token)");
  console.log("3. 🔙 Kembali ke Menu Utama");

  rl.question("Pilih opsi: ", (choice) => {
    if (choice === "1") {
      rl.question("\nMasukkan prefix (opsional, tekan enter kosong): ", async (pref) => {
        try {
          console.log("🔄 Membuat tempmail...");
          const res = await tempmail.create(pref ? pref.trim() : null);
          if (!res.success) {
            console.log("❌ Gagal:", res.result.error || "unknown");
            return tempmailMenu();
          }
          console.log("\n✅ Berhasil dibuat:");
          console.log(`📧 Alamat : ${res.result.address}`);
          console.log(`🔑 Token  : ${res.result.token}`);
          console.log(`⏳ Expires : ${res.result.expiresAt}`);
          // simpan ke file
          const filename = `tempmail_${sanitizeFilename(res.result.address)}.json`;
          await saveResultToFile(res.result, filename);
        } catch (e) {
          console.log("❌ Error:", e.message);
        }
        tempmailMenu();
      });
    } else if (choice === "2") {
      rl.question("\nMasukkan token: ", async (token) => {
        rl.question("Masukkan expiresAt (ISO string dari create) : ", async (exp) => {
          try {
            const expiresAt = new Date(exp);
            if (isNaN(expiresAt.getTime())) {
              console.log("❌ Format expiresAt salah. Pastikan ISO string.");
              return tempmailMenu();
            }
            console.log("🔄 Mengecek inbox...");
            const inbox = await tempmail.checkInbox(token.trim(), expiresAt);
            if (!inbox.success) {
              console.log("❌ Gagal:", inbox.result.error || "unknown");
            } else {
              console.log("\n📨 Inbox:");
              console.log(JSON.stringify(inbox.result.emails, null, 2));
              const filename = `tempmail_inbox_${sanitizeFilename(token)}_${Date.now()}.json`;
              await saveResultToFile(inbox.result, filename);
            }
          } catch (e) {
            console.log("❌ Error:", e.message);
          }
          tempmailMenu();
        });
      });
    } else if (choice === "3") {
      promptMenu();
    } else {
      console.log("❌ Pilihan tidak valid");
      tempmailMenu();
    }
  });
}

// =================== Fitur Baru: Luban (Verif SMS) ===================
const luban = {
  api: {
    base: 'https://lubansms.com',
    endpoints: {
      freeCountries: (lang = 'en') =>
        `/v2/api/freeCountries?language=${lang}`,
      freeNumbers: (countryName = 'russia') =>
        `/v2/api/freeNumbers?countries=${countryName}`,
      freeMessages: (countryName, number) =>
        `/v2/api/freeMessage?countries=${countryName}&number=${number}`
    }
  },

  headers: {
    'user-agent': 'NB Android/1.0.0',
    'accept-encoding': 'gzip',
    system: 'Android',
    time: `${Date.now()}`,
    type: '2'
  },

  request: async (countryName = '') => {
    if (typeof countryName !== 'string' || !countryName.trim()) {
      return {
        success: false,
        code: 400,
        result: { error: 'Negaranya mana bree? Aelah 🗿' }
      };
    }

    const url = `${luban.api.base}${luban.api.endpoints.freeNumbers(countryName)}`;

    try {
      const { data } = await axios.get(url, {
        headers: luban.headers,
        timeout: 15000
      });

      if (!data || data.code !== 0 || !Array.isArray(data.msg)) {
        return {
          success: false,
          code: 500,
          result: { error: `Data nokos ${countryName} kagak valid bree.. cari yang lain aja dah 😂` }
        };
      }

      const active = data.msg
        .filter(n => !n.is_archive)
        .map(n => ({
          full: n.full_number.toString(),
          short: n.number.toString(),
          code: n.code,
          country: n.country,
          age: n.data_humans
        }));

      return {
        success: true,
        code: 200,
        result: {
          total: active.length,
          numbers: active,
          created: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        code: error?.response?.status || 500,
        result: { error: 'Error bree 🤙🏻😏' }
      };
    }
  },

  checkMessages: async (countryName = '', number = '') => {
    if (typeof countryName !== 'string' || !countryName.trim() ||
        typeof number !== 'string' || !number.trim()) {
      return {
        success: false,
        code: 400,
        result: { error: 'Negara ama Nokosnya kagak boleh kosong.. input ulang.. ' }
      };
    }

    number = number.replace(/\D/g, '');

    const url = `${luban.api.base}${luban.api.endpoints.freeMessages(countryName, number)}`;

    try {
      const { data } = await axios.get(url, {
        headers: luban.headers,
        timeout: 15000
      });

      if (!data || typeof data !== 'object' || data.code !== 0 || !('msg' in data)) {
        return {
          success: false,
          code: 500,
          result: { error: 'Data pesannya kagak valid bree, coba lagi nanti aja yak :v' }
        };
      }

      const i = Array.isArray(data.msg) ? data.msg : [];

      const messages = i.map(m => ({
        id: m.id,
        from: m.in_number || m.innumber || '',
        to: m.my_number,
        text: m.text,
        code: m.code !== '-' ? m.code : null,
        received: m.created_at,
        age: m.data_humans
      }));

      return {
        success: true,
        code: 200,
        result: {
          total: messages.length,
          messages,
          created: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        code: error?.response?.status || 500,
        result: { error: error.message || 'Yaaakk... error bree 🤙🏻😏' }
      };
    }
  },

  generate: async (countryName = '') => {
    if (typeof countryName !== 'string' || !countryName.trim()) {
      return {
        success: false,
        code: 400,
        result: { error: 'Negaranya kagak boleh bree.. Input ulang kagak lu 🫵🏻' }
      };
    }

    try {
      const i = await axios.get(
        `${luban.api.base}${luban.api.endpoints.freeCountries()}`,
        {
          headers: luban.headers,
          timeout: 15000
        }
      );

      if (!i.data || i.data.code !== 0) {
        return {
          success: false,
          code: 500,
          result: { error: 'Daftar negaranya kagak bisa diambil bree, coba nanti lagi aja yak 🤙🏻😏' }
        };
      }

      const target = i.data.msg.find(
        c => c.name.toLowerCase() === countryName.toLowerCase()
      );

      if (!target) {
        return {
          success: false,
          code: 404,
          result: { error: `Negara ${countryName} mah kagak ada bree.. Cari yang lain aja dah.. ` }
        };
      }

      if (!target.online) {
        return {
          success: false,
          code: 403,
          result: { error: `Negara ${countryName} offline 🚫` }
        };
      }

      const res = await luban.request(countryName);
      if (!res.success) return res;

      const sorted = res.result.numbers.sort((a, b) => {
        const ageA = atom(a.age);
        const ageB = atom(b.age);
        return ageA - ageB;
      });

      return {
        success: true,
        code: 200,
        result: {
          total: sorted.length,
          numbers: sorted.map(n => ({
            ...n,
            countryName: target.locale
          })),
          created: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        code: error?.response?.status || 500,
        result: { error: 'Beuhh... error bree 🤙🏻😏' }
      };
    }
  }
};

function atom(text) {
  const map = {
    minute: 1,
    minutes: 1,
    hour: 60,
    hours: 60,
    day: 1440,
    days: 1440,
    week: 10080,
    weeks: 10080
  };

  const [value, unit] = (text || "").split(' ');
  return parseInt(value) * (map[unit] || 999999);
}

// Luban CLI menu
function lubanMenu() {
  console.clear();
  console.log("\n📱 VERIF SMS (Luban)");
  console.log("1. 🌐 Daftar negara (dapat dipakai)");
  console.log("2. 📥 Ambil nomor gratis dari negara (Data nomor berada di /sdcard/hasil-download bagian code)");
  console.log("3. 📨 Cek pesan untuk nomor");
  console.log("4. 🔙 Kembali ke Menu Utama");

  rl.question("Pilih opsi: ", (choice) => {
    if (choice === "1") {
      // list countries
      (async () => {
        try {
          const res = await axios.get(`${luban.api.base}${luban.api.endpoints.freeCountries()}`, { headers: luban.headers, timeout: 15000 });
          if (!res.data || !Array.isArray(res.data.msg)) {
            console.log("❌ Gagal ambil daftar negara.");
            return lubanMenu();
          }
          console.log("\n🌍 Daftar negara (sample):");
          res.data.msg.forEach(c => {
            console.log(`- ${c.name} (locale: ${c.locale}) ${c.online ? "🟢 online" : "🔴 offline"}`);
          });
        } catch (e) {
          console.log("❌ Error:", e.message);
        }
        lubanMenu();
      })();
    } else if (choice === "2") {
      rl.question("\nMasukkan nama negara (contoh: russia): ", async (country) => {
        if (!country) return lubanMenu();
        try {
          console.log("🔍 Mengambil nomor...");
          const res = await luban.generate(country.trim());
          if (!res.success) {
            console.log("❌ Gagal:", res.result.error || "unknown");
            return lubanMenu();
          }
          console.log("\n📞 Nomor tersedia:");
          console.log(JSON.stringify(res.result.numbers, null, 2));
          const filename = `Numbers_${sanitizeFilename(country)}.json`;
          await saveResultToFile(res.result.numbers, filename);
        } catch (e) {
          console.log("❌ Error:", e.message);
        }
        lubanMenu();
      });
    } else if (choice === "3") {
      rl.question("\nMasukkan nama negara (contoh: russia): ", (country) => {
        rl.question("Masukkan nomor (full atau short): ", async (number) => {
          if (!country || !number) return lubanMenu();
          try {
            console.log("🔎 Mengecek pesan...");
            const res = await luban.checkMessages(country.trim(), number.trim());
            if (!res.success) {
              console.log("❌ Gagal:", res.result.error || "unknown");
            } else {
              console.log("\n📨 Pesan diterima:");
              console.log(JSON.stringify(res.result.messages, null, 2));
              const filename = `Messages_${sanitizeFilename(country)}_${sanitizeFilename(number)}.json`;
              await saveResultToFile(res.result.messages, filename);
            }
          } catch (e) {
            console.log("❌ Error:", e.message);
          }
          lubanMenu();
        });
      });
    } else if (choice === "4") {
      promptMenu();
    } else {
      console.log("❌ Pilihan tidak valid");
      lubanMenu();
    }
  });
}

process.on('SIGINT', () => {
  console.log("\n\n👋 Program dihentikan");
  process.exit(0);
});

login();
