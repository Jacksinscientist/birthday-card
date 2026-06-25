// --- Audio context setup ---
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// --- Background Music ---
const bgMusic = new Audio('my-birthday-song.mp3');
bgMusic.loop = true;

// --- Sound synthesis functions ---
function playTone(frequency, duration, type = 'sine') {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Enhanced tone with frequency slide for more natural sound
function playSlide(startFreq, endFreq, duration, type = 'sine', startGain = 0.3) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + duration);
  
  gainNode.gain.setValueAtTime(startGain, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// --- ENHANCED CUTE ANIMAL SOUNDS ---
function playAnimalSound(animalType) {
  switch(animalType) {
    case 'bunny':
      // Cute high-pitched squeak
      playTone(1400, 0.12);
      setTimeout(() => playTone(1200, 0.1), 80);
      setTimeout(() => playTone(1600, 0.15), 140);
      break;
    
    case 'cat':
      // Playful meow with chirp
      playTone(1100, 0.25);
      setTimeout(() => playTone(900, 0.2), 200);
      setTimeout(() => playTone(1300, 0.12), 350);
      break;
    
    case 'lion':
      // Deep powerful roar with multiple layers
      playSlide(220, 120, 0.6, 'sawtooth', 0.35);
      setTimeout(() => playSlide(180, 100, 0.5, 'square', 0.25), 150);
      setTimeout(() => playTone(80, 0.4, 'triangle'), 500);
      setTimeout(() => playTone(300, 0.15, 'sawtooth'), 700);
      break;
    
    case 'buffalo':
      // Low grunting snort with chest rumble
      playSlide(150, 80, 0.5, 'square', 0.35);
      setTimeout(() => playTone(120, 0.2, 'sawtooth'), 450);
      setTimeout(() => playSlide(110, 90, 0.4, 'triangle', 0.3), 650);
      setTimeout(() => playTone(140, 0.15, 'sawtooth'), 1050);
      break;
    
    case 'sheep':
      // Cute baa sound with harmonic
      playTone(700, 0.3);
      setTimeout(() => playTone(550, 0.25), 280);
      setTimeout(() => playTone(850, 0.2), 500);
      break;
    
    case 'cow':
      // FIXED: Simple clear moo sounds
      // First moo - loud and clear
      playSlide(200, 100, 0.8, 'sine', 0.4);
      // Second moo - with more energy
      setTimeout(() => playSlide(220, 110, 0.8, 'sine', 0.4), 850);
      break;
  }
}

function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
}

// --- Reveal Logic ---
const giftBox = document.getElementById('gift-box');
const overlay = document.getElementById('gift-overlay');
const mainContent = document.getElementById('main-content');

giftBox.addEventListener('click', () => {
  triggerHaptic();
  playTone(523, 0.1);
  bgMusic.play().catch(e => console.log("Audio blocked"));
  giftBox.classList.add('unwrap');
  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
    animals[0].classList.add('visible');
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
    this.x = Math.random() * canvas.width; 
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 8 + 4; 
    this.speedY = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.color = ['#ff9ebb', '#d8b4fe', '#bae6fd', '#fef3c7'][Math.floor(Math.random() * 4)];
    this.opacity = Math.random() * 0.6 + 0.2;
  }
  update() { 
    this.y += this.speedY * (intenseCelebration ? 3 : 1); 
    this.x += this.speedX * (intenseCelebration ? 2 : 1); 
    if (this.y > canvas.height) this.reset(); 
  }
  draw() { 
    ctx.globalAlpha = this.opacity; 
    ctx.fillStyle = this.color; 
    ctx.beginPath(); 
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
    ctx.fill(); 
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animate() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  particles.forEach(p => { p.update(); p.draw(); }); 
  requestAnimationFrame(animate); 
}

animate();

// --- Confetti Function ---
function createConfetti(x, y, count = 12) {
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    const colors = ['#ff9ebb', '#d8b4fe', '#bae6fd', '#fef3c7', '#ff7675'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.background = randomColor;
    confetti.style.borderRadius = '50%';
    
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = Math.random() * -200 - 100;
    
    confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`;
    confetti.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

// --- Interaction Logic ---
const animals = document.querySelectorAll('.animal');
let totalClicks = 0;
let unlockedCount = 0;

// Define distinct reactions for each animal
const animalReactions = {
  bunny: 'react-bunny-jump',
  cat: 'react-cat-pounce',
  lion: 'react-lion-roar',
  buffalo: 'react-buffalo-charge',
  sheep: 'react-sheep-wiggle',
  cow: 'react-cow-sway'
};

animals.forEach((el, index) => {
  el.addEventListener('click', (e) => {
    // Only respond to visible animals
    if (!el.classList.contains('visible')) return;
    
    triggerHaptic();
    totalClicks++;
    
    // Get animal type
    const animalType = Array.from(el.classList).find(c => Object.keys(animalReactions).includes(c));
    
    // Play sound
    playAnimalSound(animalType);
    
    // Play reaction
    const reactionClass = animalReactions[animalType];
    el.classList.remove(reactionClass);
    void el.offsetWidth;
    el.classList.add(reactionClass);
    
    // Confetti burst
    const rect = el.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
    
    // Unlock next animal
    if (unlockedCount < animals.length - 1) {
      unlockedCount++;
      animals[unlockedCount].classList.add('visible');
    }
    
    // Final surprise at 15 clicks
    if(totalClicks >= 15 && !intenseCelebration) {
      triggerFinalSurprise();
    }
  });
});

function triggerFinalSurprise() {
  intenseCelebration = true;
  playTone(523, 0.2);
  setTimeout(() => playTone(659, 0.2), 150);
  setTimeout(() => playTone(784, 0.3), 300);
  
  document.getElementById('surprise-message').classList.remove('hidden');
  document.getElementById('main-message').style.opacity = '0.3';
  
  createConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
}