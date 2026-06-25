// --- Reveal Logic ---
const giftBox = document.getElementById('gift-box');
const overlay = document.getElementById('gift-overlay');
const mainContent = document.getElementById('main-content');
const bgMusic = new Audio('my-birthday-song.mp3');
bgMusic.loop = true;

giftBox.addEventListener('click', () => {
  bgMusic.play().catch(e => console.log("Audio blocked"));
  giftBox.classList.add('unwrap');
  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
  }, 800);
});


// --- Particle Engine ---
const canvas = document.getElementById('celebration-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let intenseCelebration = false;

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
    this.size = Math.random() * 8 + 4; this.speedY = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.color = ['#ff9ebb', '#d8b4fe', '#bae6fd', '#fef3c7'][Math.floor(Math.random() * 4)];
    this.opacity = Math.random() * 0.6 + 0.2;
  }
  update() { 
    this.y += this.speedY * (intenseCelebration ? 3 : 1); 
    this.x += this.speedX * (intenseCelebration ? 2 : 1); 
    if (this.y > canvas.height) this.reset(); 
  }
  draw() { ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
}
for (let i = 0; i < 100; i++) particles.push(new Particle());
function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
animate();






// --- Merged Logic ---
const giftBox = document.getElementById('gift-box');
const overlay = document.getElementById('gift-overlay');
const mainContent = document.getElementById('main-content');
const glow = document.querySelector('.ambient-glow');
const animals = document.querySelectorAll('.animal');
const bgMusic = new Audio('my-birthday-song.mp3');
bgMusic.loop = true;

let totalClicks = 0;
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(50); };

// Gift Unwrapping
giftBox.addEventListener('click', () => {
  bgMusic.play().catch(e => console.log("Audio blocked"));
  vibrate();
  giftBox.classList.add('unwrap');
  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
  }, 800);
});

// Animal Interactions
animals.forEach((el, index) => {
  el.addEventListener('click', (e) => {
    vibrate();
    totalClicks++;

    if (totalClicks % 2 === 0 && index < animals.length) {
      animals[index].classList.remove('hidden');
    }

    const intensity = Math.min(totalClicks * 5, 60); 
    glow.style.background = `radial-gradient(circle, rgba(255,182,193,0.${intensity}) 0%, rgba(255,182,193,0) 70%)`;

    el.classList.add('react-giggle');
    setTimeout(() => el.classList.remove('react-giggle'), 800);
  });
});