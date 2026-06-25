// --- Audio context setup ---
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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

function playAnimalSound(animalType) {
  const now = audioContext.currentTime;
  
  switch(animalType) {
    case 'bunny':
      playTone(800, 0.15); // chirp
      setTimeout(() => playTone(950, 0.15), 100);
      break;
    case 'cat':
      playTone(1200, 0.2); // meow
      setTimeout(() => playTone(900, 0.25), 150);
      break;
    case 'lion':
      playTone(150, 0.5); // roar (low)
      setTimeout(() => playTone(200, 0.4), 200);
      break;
    case 'buffalo':
      playTone(120, 0.6); // deep bellow
      setTimeout(() => playTone(140, 0.4), 300);
      break;
    case 'sheep':
      playTone(600, 0.25); // baa
      setTimeout(() => playTone(520, 0.25), 200);
      break;
    case 'cow':
      playTone(200, 0.4); // moo
      setTimeout(() => playTone(180, 0.5), 250);
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
const animalParade = document.getElementById('animal-parade');

giftBox.addEventListener('click', () => {
  triggerHaptic();
  playTone(523, 0.1); // C5 note
  giftBox.classList.add('unwrap');
  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
    hideAllAnimals(); // Hide all animals initially
  }, 800);
});

// --- Hide all animals initially ---
function hideAllAnimals() {
  const animals = document.querySelectorAll('.animal');
  animals.forEach(animal => {
    animal.style.opacity = '0';
    animal.style.pointerEvents = 'none';
  });
}

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
    
    confetti.style.setProperty('--tx', randomX + 'px');
    confetti.style.setProperty('--ty', randomY + 'px');
    
    confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s ease-out forwards`;
    
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

// --- Interaction Logic ---
const animals = document.querySelectorAll('.animal');
let totalClicks = 0;
let unlockedAnimals = 0;

// Define distinct reactions for each animal
const animalReactions = {
  bunny: 'react-bunny-jump',
  cat: 'react-cat-pounce',
  lion: 'react-lion-roar',
  buffalo: 'react-buffalo-charge',
  sheep: 'react-sheep-wiggle',
  cow: 'react-cow-sway'
};

// Unlock animals one by one on click
function unlockNextAnimal() {
  if (unlockedAnimals < animals.length) {
    const animalEl = animals[unlockedAnimals];
    const animalType = Array.from(animalEl.classList).find(c => Object.keys(animalReactions).includes(c));
    
    animalEl.style.opacity = '1';
    animalEl.style.pointerEvents = 'auto';
    animalEl.style.animation = `fade-in 0.6s ease forwards`;
    
    unlockedAnimals++;
  }
}

// Initialize first animal as unlocked
unlockNextAnimal();

animals.forEach(el => {
  el.addEventListener('click', (e) => {
    if (el.style.pointerEvents === 'none') return;
    
    triggerHaptic();
    totalClicks++;
    
    // Unlock next animal
    unlockNextAnimal();
    
    // Get animal type and play sound
    const animalType = Array.from(el.classList).find(c => Object.keys(animalReactions).includes(c));
    playAnimalSound(animalType);
    
    // Play reaction animation
    const reactionClass = animalReactions[animalType];
    el.classList.remove(reactionClass);
    void el.offsetWidth; // Trigger reflow
    el.classList.add(reactionClass);
    
    // Create confetti
    const rect = el.getBoundingClientRect();
    createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
    
    // Check completion (6 animals = all unlocked + 9 bonus clicks)
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
  
  // Create big confetti burst
  createConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
}