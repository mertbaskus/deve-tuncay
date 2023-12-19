// const ejs = require("ejs");
const express = require("express");
const http = require("http");
const path = require("path");
const sqlite3 = require("sqlite3");
const socketIo = require("socket.io");


// Initialization Kodları
const app = express();
const server = http.createServer(app);
const io = socketIo(server)

const db = new sqlite3.Database("mesajlar.db");

// app.use komutları
app.use(express.urlencoded({ extended: false }));

// EJS kullanımını belirtiyoruz
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.get("/yuksahibi", (req, res) => {
  res.sendFile(__dirname + "/public/yuksahibi.html");
});

app.get("/tirci", (req, res) => {
  res.sendFile(__dirname + "/public/tirci.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.post("/gonder", (req, res) => {
  var {
    konum,
    hedefKonum,
    yukMiktari,
    fiyatTeklifi,
    sonTeslimatTarihi,
    sigortaIstegi,
    isTanimi,
  } = req.body;
  console.log(
    konum,
    hedefKonum,
    yukMiktari,
    fiyatTeklifi,
    sonTeslimatTarihi,
    sigortaIstegi,
    isTanimi
  );

  db.run(
    "INSERT INTO yuk_sahibi_ilanlari (konum, hedef_konum, yuk_miktari, fiyat_teklifi, son_teslimat_tarihi, sigorta_istegi, is_tanimi) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      konum,
      hedefKonum,
      yukMiktari,
      fiyatTeklifi,
      sonTeslimatTarihi,
      sigortaIstegi,
      isTanimi,
    ],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Bilgiler eklendi`);
    }
  );

  res.sendFile(__dirname + "/public/yuksahibi.html");
});

app.post("/gonder2", (req, res) => {
  var {
    konum,
    hedefKonum,
    yukMiktari,
    fiyatTeklifi,
    sonTeslimatTarihi,
    sigortaIstegi,
    isTanimi,
  } = req.body;
  console.log(
    konum,
    hedefKonum,
    yukMiktari,
    fiyatTeklifi,
    sonTeslimatTarihi,
    sigortaIstegi,
    isTanimi
  );

  db.run(
    "INSERT INTO tirci_ilanlari (konum, hedef_konum, yuk_miktari, fiyat_teklifi, son_teslimat_tarihi, sigorta_istegi, is_tanimi) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      konum,
      hedefKonum,
      yukMiktari,
      fiyatTeklifi,
      sonTeslimatTarihi,
      sigortaIstegi,
      isTanimi,
    ],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Bilgiler eklendi`);
    }
  );

  res.sendFile(__dirname + "/public/tirci.html");
});
  

const columnNames = [
  "id",
  "konum",
  "hedef_konum",
  "yuk_miktari",
  "fiyat_teklifi",
  "son_teslimat_tarihi",
  "sigorta_istegi",
  "is_tanimi",
];

let allColumnDataFixed;

function a2() {
  let sayi = 0;
  db.all("SELECT * FROM yuk_sahibi_ilanlari", [], (err, rows) => {
    if (err) {
      throw err;
    }

    // Tüm sütun verilerini içeren bir dizi oluştur
    const allColumnData = rows.map((row) => {
      const rowData = {};
      columnNames.forEach((column) => {
        rowData[column] = row[column];
      });
      return rowData;
    });

    // Sonuçları yazdır veya başka bir şey yapabilirsiniz
    console.log(allColumnData);
    allColumnData.shift()
    sayi = allColumnData.length;
    allColumnDataFixed = JSON.stringify(allColumnData);  // json a çevrilecek 
    console.log(allColumnDataFixed);

    // Veriyi işledikten sonra, socket üzerinden istemciye gönder
    io.emit("send", allColumnDataFixed);
  });
}

io.on("connection", (socket) => {
  socket.on("test", (recieve) => {
    // tirci.html dosyasını gönder
    res.sendFile(__dirname + "/public/tirci.html");
    
    // Veriyi gönder
    a2();
  });
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/tirci.html");
});

server.listen(3000, () => {
  console.log("Sunucu 3000 portunda çalışıyor...");
});

