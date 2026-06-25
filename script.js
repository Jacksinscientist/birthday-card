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

// --- Interaction Logic ---
const animals = document.querySelectorAll('.animal');
const personalities = ['react-giggle', 'react-surprise', 'react-love', 'react-slinky', 'react-dizzy', 'react-bashful'];
let totalClicks = 0;

animals.forEach(el => {
  el.addEventListener('click', (e) => {
    // Increment tracker
    totalClicks++;
    
    // Animate
    personalities.forEach(p => el.classList.remove(p));
    void el.offsetWidth;
    const choice = personalities[Math.floor(Math.random() * personalities.length)];
    el.classList.add(choice);
    createLocalBurst(e.clientX, e.clientY);
    
    // Check completion (15 taps total triggers final surprise)
    if(totalClicks >= 15 && !intenseCelebration) {
      triggerFinalSurprise();
    }
  });
});

function createLocalBurst(x, y) {
  for(let i=0; i<6; i++) {
    const burst = document.createElement('div');
    burst.style.position = 'fixed'; burst.style.left = x + 'px'; burst.style.top = y + 'px';
    burst.style.width = '8px'; burst.style.height = '8px'; burst.style.background = '#fff';
    burst.style.borderRadius = '50%'; burst.style.pointerEvents = 'none';
    burst.style.animation = 'burst-fade 0.6s forwards';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 600);
  }
}

function triggerFinalSurprise() {
  intenseCelebration = true;
  document.getElementById('surprise-message').classList.remove('hidden');
  document.getElementById('main-message').style.opacity = '0.3';
}