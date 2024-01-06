
const express = require("express");
const http = require("http");
const path = require("path");
const sqlite3 = require("sqlite3");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");



const app = express();
const server = http.createServer(app);
const io = socketIo(server)

const db = new sqlite3.Database("mesajlar.db");


app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/gonder", (req, res) => {
  var {
    konum,
    hedefKonum,
    yukMiktari,
    dorseTipi,
    yuklemeTarihleri,
    sonTeslimatTarihleri,
    isTanimi,
    fiyatTeklifi,
  } = req.body;
  console.log(
    konum,
    hedefKonum,
    yukMiktari,
    dorseTipi,
    yuklemeTarihleri,
    sonTeslimatTarihleri,
    isTanimi,
    fiyatTeklifi,
  );

  db.run(
    "INSERT INTO yuk_sahibi_ilanlari (konum, hedef_konum, yuk_miktari, dorse_tipi, yukleme_tarihleri, son_teslimat_tarihleri, is_tanimi, fiyat_teklifi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      konum,
      hedefKonum,
      yukMiktari,
      dorseTipi,
      yuklemeTarihleri,
      sonTeslimatTarihleri,
      isTanimi,
      fiyatTeklifi,
    ],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Bilgiler eklendi`);
    }
  );

  res.sendFile(__dirname + "/public/arayuz.html");
});

app.post("/gonder2", (req, res) => {
  var {
    konum,
    hedefKonum,
    dorseTipi,
    yukTipi,
    aciklama,

  } = req.body;
  console.log(
    konum,
    hedefKonum,
    dorseTipi,
    yukTipi,
    aciklama,
  );

  db.run(
    "INSERT INTO tirci_ilanlari (konum, hedef_konum, dorse_tipi, yuk_tipi, aciklama) VALUES (?, ?, ?, ?, ?)",
    [
      konum,
    hedefKonum,
    dorseTipi,
    yukTipi,
    aciklama,
    ],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Bilgiler eklendi`);
    }
  );

  res.sendFile(__dirname + "/public/arayuz.html");
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

   
    const allColumnData = rows.map((row) => {
      const rowData = {};
      columnNames.forEach((column) => {
        rowData[column] = row[column];
      });
      return rowData;
    });

   
    console.log(allColumnData);
    allColumnData.shift()
    sayi = allColumnData.length;
    allColumnDataFixed = JSON.stringify(allColumnData);  
    console.log(allColumnDataFixed);

    
    io.emit("send", allColumnDataFixed);
  });
}

io.on("connection", (socket) => {
  socket.on("test", (recieve) => {
    
    res.sendFile(__dirname + "/public/tirci.html");
    
   
    a2();
  });
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/tirci.html");
});



app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get('/arayuz', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/arayuz.html'));
});

app.post('/giris', (req, res) => {
  const { email, parola } = req.body;

  db.get('SELECT * FROM kullanicilar WHERE email = ? AND parola = ?', [email, parola], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ deneme: false, mesaj: 'Server hatası, kaydol veya yeniden dene' });
    } else if (row) {
     
      res.redirect('/arayuz');
    } else {
      res.json({ deneme: false, mesaj: 'Kullanıcı adı veya parola yanlış' });
    }
  });
});



app.post("/kaydol", (req, res) => {
  var {
    tc,
    ad,
    soyad,
    email,
    parola,
  } = req.body;
  console.log(
    tc,
    ad,
    soyad,
    email,
    parola,
  );

  db.run(
    "INSERT INTO kullanicilar (tc, ad, soyad, email, parola) VALUES (?, ?, ?, ?, ?)",
    [
    tc,  
    ad,
    soyad,
    email,
    parola,
    ],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`kayıt başarılı`);
    }
  );

  res.sendFile(__dirname + "/public/login.html");
});
  



server.listen(3000, () => {
  console.log("Sunucu 3000 portunda çalışıyor...");
});

