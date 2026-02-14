const gameGrid = document.getElementById('gameGrid');
const toastEl = document.getElementById('toast');
const btnSound = document.getElementById('btnSound');

let soundOn = true;
let audioCtx = null;

function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 1400);
}

function beep(){
  if(!soundOn) return;
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    const now = audioCtx.currentTime;
    o.frequency.setValueAtTime(740, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.10, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(now); o.stop(now + 0.16);
  }catch(e){}
}

const GAMES = [
  {
    id: "memory",
    title: "Eşleştirme Oyunu",
    desc: "Kartları çevir, aynı olanları bul!",
    icon: "🧠",
    badge: "3+",
    url: "games/memory/index.html"
  },
  {
    id: "coloring",
    title: "Boyama",
    desc: "Renk seç, boya, sil ve temizle!",
    icon: "🎨",
    badge: "3+",
    url: "games/coloring/index.html"
  },
  {
    id: "sort",
    title: "Meyveleri Sepete Koy",
    desc: "Doğru meyveyi doğru sepete sürükle!",
    icon: "🍓",
    badge: "4+",
    url: "games/sort/index.html"
  },
  {
  id: "balloon",
  title: "Balon Patlat",
  desc: "Balonlara dokun, patlat ve puan kazan!",
  icon: "🎈",
  badge: "4+",
  url: "games/balloon/index.html"
},
{
  id: "color-catch",
  title: "Renk Yakala",
  desc: "Ortadaki renkle aynı butona bas!",
  icon: "🟦",
  badge: "4+",
  url: "games/color-catch/index.html"
},
{
  id: "lab_kacis",
  title: "Labirentten Kaçış",
  desc: "Labirentten kaçmak için yuvarlağı hareket ettir.",
  icon: "🎯",
  badge: "4+",
  url: "games/lab_kacis/index.html"
}
  // Buraya yeni oyun ekledikçe bir obje daha ekleyeceksin.
];

// Buraya yeni oyun ekledikçe bir obje daha ekleyeceksin.
function render(){
  gameGrid.innerHTML = "";
  for(const g of GAMES){
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role","button");
    card.setAttribute("aria-label", g.title);

    card.innerHTML = `
      <div class="cardTop">
        <div class="badge">${g.badge}</div>
        <div class="icon" aria-hidden="true">${g.icon}</div>
      </div>
      <h2>${g.title}</h2>
      <p class="desc">${g.desc}</p>
    `;

    const go = () => {
      beep();
      // Kendi içinde aç (uygulama gibi)
      window.location.href = g.url + "?from=hub";
    };

    card.addEventListener("click", go, {passive:true});
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        go();
      }
    });

    gameGrid.appendChild(card);
  }
}

btnSound.addEventListener("click", async () => {
  soundOn = !soundOn;
  btnSound.setAttribute("aria-pressed", String(soundOn));
  btnSound.textContent = soundOn ? "🔊 Ses" : "🔇 Ses";
  if(soundOn){
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if(audioCtx.state === "suspended") await audioCtx.resume();
    }catch(e){}
    showToast("Ses açık");
  }else{
    showToast("Ses kapalı");
  }
});

render();
showToast("Bir oyun seç 🎮");




