

function gonder() {
    var kullaniciMesaji = document.getElementById("kullanici-mesaji").value;

   
    var sohbetMesajlar = document.getElementById("sohbet-mesajlar");
    sohbetMesajlar.innerHTML += "<p><strong>Kullanıcı:</strong> " + kullaniciMesaji + "</p>";

   
    document.getElementById("kullanici-mesaji").value = "";
}
