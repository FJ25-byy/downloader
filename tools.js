const _0x340588=_0x33c1;(function(_0x25f108,_0x1d6217){const _0x42e888=_0x33c1,_0x3134e8=_0x25f108();while(!![]){try{const _0x34361e=-parseInt(_0x42e888(0x1c4))/0x1+-parseInt(_0x42e888(0x1af))/0x2+-parseInt(_0x42e888(0x1a3))/0x3+parseInt(_0x42e888(0x1b5))/0x4*(parseInt(_0x42e888(0x1d7))/0x5)+parseInt(_0x42e888(0x1d5))/0x6+-parseInt(_0x42e888(0x1b1))/0x7*(-parseInt(_0x42e888(0x1e4))/0x8)+-parseInt(_0x42e888(0x1cd))/0x9*(parseInt(_0x42e888(0x1da))/0xa);if(_0x34361e===_0x1d6217)break;else _0x3134e8['push'](_0x3134e8['shift']());}catch(_0x3851c8){_0x3134e8['push'](_0x3134e8['shift']());}}}(_0x473e,0x4b069));const axios=require(_0x340588(0x1c0)),fs=require('fs'),path=require(_0x340588(0x1c2)),readline=require(_0x340588(0x1e1)),cfonts=require('cfonts'),rl=readline[_0x340588(0x1c9)]({'input':process[_0x340588(0x1d3)],'output':process[_0x340588(0x1ce)]}),OUTPUT_DIR=_0x340588(0x1d4),API_KEY=_0x340588(0x1be);function showTitle(){const _0x388e8b=_0x340588;console[_0x388e8b(0x1b3)](),cfonts['say'](_0x388e8b(0x1b9),{'font':_0x388e8b(0x1a1),'align':'center','gradient':[_0x388e8b(0x1ab),_0x388e8b(0x1c8)],'transitionGradient':!![],'env':'node'}),cfonts[_0x388e8b(0x1a7)](_0x388e8b(0x1e0),{'font':_0x388e8b(0x1e5),'align':_0x388e8b(0x1a0),'gradient':[_0x388e8b(0x1d0),'cyan'],'transitionGradient':!![],'env':'node'});}function sanitizeFilename(_0x3827c1){const _0x55523f=_0x340588;return _0x3827c1[_0x55523f(0x1e3)](/[^a-zA-Z0-9-_]/g,'_');}function _0x33c1(_0x315319,_0xa0dbfe){const _0x473e61=_0x473e();return _0x33c1=function(_0x33c1e7,_0x5daae2){_0x33c1e7=_0x33c1e7-0x1a0;let _0x39697c=_0x473e61[_0x33c1e7];return _0x39697c;},_0x33c1(_0x315319,_0xa0dbfe);}function pickRandom(..._0x319386){const _0x4ebc18=_0x340588;return _0x319386[Math[_0x4ebc18(0x1aa)](Math[_0x4ebc18(0x1d2)]()*_0x319386['length'])];}function promptMenu(){const _0x21407e=_0x340588;console[_0x21407e(0x1b2)](_0x21407e(0x1dd)),console['log']('1.\x20TikTok'),console[_0x21407e(0x1b2)](_0x21407e(0x1ac)),console['log']('Ketik\x20\x27exit\x27\x20untuk\x20keluar.'),rl[_0x21407e(0x1c3)](_0x21407e(0x1a4),_0x3ff22c=>{const _0x4ffe89=_0x21407e;if(_0x3ff22c==='1')downloadTikTok();else{if(_0x3ff22c==='2')downloadInstagram();else _0x3ff22c[_0x4ffe89(0x1bb)]()===_0x4ffe89(0x1c5)?(console[_0x4ffe89(0x1b2)](_0x4ffe89(0x1d6)),rl[_0x4ffe89(0x1a9)]()):(console[_0x4ffe89(0x1b2)](_0x4ffe89(0x1d9)),promptMenu());}});}function downloadTikTok(){const _0xb4f57e=_0x340588;rl[_0xb4f57e(0x1c3)](_0xb4f57e(0x1b6),async _0x17ce8f=>{const _0x118094=_0xb4f57e;if(!_0x17ce8f||_0x17ce8f[_0x118094(0x1bb)]()===_0x118094(0x1c7))return promptMenu();try{const _0x2e57fb=await axios[_0x118094(0x1cc)](_0x118094(0x1db),{'params':{'url':_0x17ce8f,'apikey':API_KEY}}),_0x3fc3d6=_0x2e57fb[_0x118094(0x1cb)];if(!_0x3fc3d6[_0x118094(0x1de)])throw new Error('Gagal\x20mendapatkan\x20data\x20TikTok.');const _0x5bc8d7=_0x3fc3d6['data'],_0x7e83c3=_0x5bc8d7[_0x118094(0x1ba)],_0x3bec11=_0x5bc8d7['video'],_0x40814f=sanitizeFilename(_0x5bc8d7[_0x118094(0x1a2)][_0x118094(0x1d1)])+_0x118094(0x1ad),_0x29354b=path['join'](OUTPUT_DIR,_0x40814f);if(!fs['existsSync'](OUTPUT_DIR))fs[_0x118094(0x1bd)](OUTPUT_DIR,{'recursive':!![]});const _0x331abe=await axios[_0x118094(0x1cc)](_0x3bec11,{'responseType':'stream'}),_0x1966ee=fs[_0x118094(0x1c6)](_0x29354b);console[_0x118094(0x1b2)]('\x0aCaption:\x20',_0x7e83c3),console[_0x118094(0x1b2)](_0x118094(0x1cf)),_0x331abe[_0x118094(0x1cb)][_0x118094(0x1b4)](_0x1966ee),_0x1966ee['on'](_0x118094(0x1ca),()=>{const _0x488a2a=_0x118094;console[_0x488a2a(0x1b2)](_0x488a2a(0x1b8)+_0x29354b+'\x0a'),promptMenu();});}catch(_0x4d028c){console['error']('❌\x20Error:',_0x4d028c[_0x118094(0x1a8)]),promptMenu();}});}function _0x473e(){const _0x59a253=['1897284vCnfyT','👋\x20Keluar\x20dari\x20program.','22515qOXkse','\x0aMasukkan\x20link\x20Instagram\x20(atau\x20ketik\x20\x27back\x27\x20untuk\x20kembali):\x20','❌\x20Pilihan\x20tidak\x20valid.','10FVQAkS','https://api.neoxr.eu/api/tiktok','insta','\x0aPilih\x20menu:','status','length','Downloader','readline','error','replace','27536DXjfOK','console','center','block','author','1288008Rqsmir','Masukkan\x20pilihan\x20Anda:\x20','https://api.neoxr.eu/api/ig','gramIns','say','message','close','floor','blue','2.\x20Instagram','.mp4','join','495022VxALTz','type','1134uzmvFu','log','clear','pipe','404aLkNjk','\x0aMasukkan\x20link\x20TikTok\x20(atau\x20ketik\x20\x27back\x27\x20untuk\x20kembali):\x20','instagram','✅\x20Disimpan\x20sebagai:\x20','YUJI','caption','toLowerCase','instagram_dl','mkdirSync','yujixd','Gagal\x20mendapatkan\x20data\x20Instagram.','axios','igdl','path','question','177092zGqvGv','exit','createWriteStream','back','cyan','createInterface','finish','data','get','1506393SFTsyQ','stdout','\x0a⬇️\x20\x20Mengunduh\x20video\x20TikTok...\x0a','green','nickname','random','stdin','/sdcard/hasil-download'];_0x473e=function(){return _0x59a253;};return _0x473e();}function downloadInstagram(){const _0x59193e=_0x340588;rl['question'](_0x59193e(0x1d8),async _0x4088f4=>{const _0x501e97=_0x59193e;if(!_0x4088f4||_0x4088f4[_0x501e97(0x1bb)]()===_0x501e97(0x1c7))return promptMenu();try{const _0x510fc2=await axios['get'](_0x501e97(0x1a5),{'params':{'url':_0x4088f4,'apikey':API_KEY}}),_0x1a9abc=_0x510fc2['data'];if(!_0x1a9abc[_0x501e97(0x1de)]||!_0x1a9abc[_0x501e97(0x1cb)][_0x501e97(0x1df)])throw new Error(_0x501e97(0x1bf));const _0x4aacaf=_0x1a9abc[_0x501e97(0x1cb)][0x0],_0x55817a=pickRandom(_0x501e97(0x1b7),'ig',_0x501e97(0x1dc),_0x501e97(0x1c1),_0x501e97(0x1bc),_0x501e97(0x1a6))+'.'+_0x4aacaf[_0x501e97(0x1b0)],_0x3061bd=path[_0x501e97(0x1ae)](OUTPUT_DIR,_0x55817a);if(!fs['existsSync'](OUTPUT_DIR))fs[_0x501e97(0x1bd)](OUTPUT_DIR,{'recursive':!![]});const _0x363f3f=await axios[_0x501e97(0x1cc)](_0x4aacaf['url'],{'responseType':'stream'}),_0x3c7fcb=fs[_0x501e97(0x1c6)](_0x3061bd);console[_0x501e97(0x1b2)]('\x0a⬇️\x20\x20Mengunduh\x20video\x20Instagram...\x0a'),_0x363f3f[_0x501e97(0x1cb)][_0x501e97(0x1b4)](_0x3c7fcb),_0x3c7fcb['on'](_0x501e97(0x1ca),()=>{const _0x2e6157=_0x501e97;console[_0x2e6157(0x1b2)](_0x2e6157(0x1b8)+_0x3061bd+'\x0a'),promptMenu();});}catch(_0x2ef7e8){console[_0x501e97(0x1e2)]('❌\x20Error:',_0x2ef7e8[_0x501e97(0x1a8)]),promptMenu();}});}showTitle(),promptMenu();function pickRandom(...list) {
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
