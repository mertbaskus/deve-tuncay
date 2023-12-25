const giris = document.getElementById("kaydol");
const girisButonu = document.getElementById("kaydolButonu")
const kaydol = document.getElementById("giris")
const kaydolButonu = document.getElementById("girisButonu")


girisButonu.addEventListener("click", () => {
    giris.style.display = "block"
})

kaydolButonu.addEventListener("click", () => {
    kaydol.style.display = "block"
})

var email = document.querySelector(".giris input[name='email']").value;
var parola = document.querySelector(".giris input[name='parola']").value;