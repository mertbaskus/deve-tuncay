const profil = document.getElementById("prpfil");
const profilButonu = document.getElementById("profilButonu");
const mesajlar = document.getElementById("mesajlar");
const mesajlarButonu = document.getElementById("mesajlarButonu");

profilButonu.addEventListener("click", () => {
    profil.style.display = "block"
})

mesajlarButonu.addEventListener("click", () => {
    mesajlar.style.display = "block"
})


const ilanVer = document.getElementById("ilanVer");
const ilanVerButonu = document.getElementById("ilanVerButonu")

ilanVerButonu.addEventListener("click", () => {
    ilanVer.style.display = "block"
})

const ilanVer2 = document.getElementById("ilanVer2");
const ilanVerButonu2 = document.getElementById("ilanVerButonu2")
const yukAriyorum = document.getElementById("yukAriyorum")
const yukAriyorumButonu = document.getElementById("yukAriyorumButonu")


ilanVerButonu2.addEventListener("click", () => {
    ilanVer2.style.display = "block"
})

yukAriyorumButonu.addEventListener("click", () => {
    yukAriyorum.style.display = "block"
})


function fonksiyon() {
    fetch("http://127.0.0.1:1234/get_data")
        .then(response => {
            console.log("first_then", response)
            if (!response.ok) {
                throw new Error(`HTTP Hatası! Durum Kodu: ${response.status}`);
            }
            
            console.log(response.json())

            return response.json();
        })
        .then(allColumnData => {
           
            console.log('GET İsteği Sonucu:', allColumnData);
            sayi = allColumnData.length;

            for (i = 1; i <= sayi; i++) {
                const gelenIlanVerisi = document.getElementById("gelenIlanVerisi");
                let yeniDiv = document.createElement("div");
                yeniDiv.id = `gelenveri${i}`;
                yeniDiv.innerHTML = `
          <div>
                  <span id="v1">Konum: ${i[1]}</span>
                  <span id="v2">Hedef Konum: ${i[2]}</span>
                  <span id="v3">Yük Miktarı: ${i[3]}</span>
                  <span id="v4">Fiyat Tekifi: ${i[4]}</span>
                  <span id="v5">Son Teslimat Tarihi ${i[5]}</span>
                  <span id="v6">Sigorta İsteği: ${i[6]}</span>
                  <span id="v7">İş Tanımı: ${i[7]}</span>
          </div>
          `;
                gelenIlanVerisi.appendChild("yeniDiv");
            }
        })
        .catch(error => {
           
            console.error('Hata Oluştu:', error.message);
        });




}

function gonder() {
    var kullaniciMesaji = document.getElementById("kullanici-mesaji").value;

   
    var sohbetMesajlar = document.getElementById("sohbet-mesajlar");
    sohbetMesajlar.innerHTML += "<p><strong>Kullanıcı:</strong> " + kullaniciMesaji + "</p>";

   
    document.getElementById("kullanici-mesaji").value = "";
}
