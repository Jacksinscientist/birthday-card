// --- Initial Setup ---
const giftBox = document.getElementById('gift-box');
const overlay = document.getElementById('gift-overlay');
const mainContent = document.getElementById('main-content');
const glow = document.querySelector('.ambient-glow');
const animals = document.querySelectorAll('.animal');
const bgMusic = new Audio('my-birthday-song.mp3');
bgMusic.loop = true;

let totalClicks = 0;
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(50); };

// --- Particle Engine ---
const canvas = document.getElementById('celebration-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

// --- Updated Gift Unwrapping Logic ---
giftBox.addEventListener('click', () => {
  bgMusic.play().catch(e => console.log("Audio blocked"));
  vibrate();
  giftBox.classList.add('unwrap');
  
  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // ADD THIS LOOP TO SHOW ALL ANIMALS IMMEDIATELY
    animals.forEach(animal => animal.classList.remove('hidden'));
    
  }, 800);
});

animals.forEach((el, index) => {
  el.addEventListener('click', (e) => {
    vibrate();
    totalClicks++;

    // Sequential Unlocking: Show next animal every 2 clicks
    if (totalClicks % 2 === 0 && index < animals.length) {
      animals[index].classList.remove('hidden');
    }

    // Glow Intensity
    const intensity = Math.min(totalClicks * 5, 60); 
    glow.style.background = `radial-gradient(circle, rgba(255,182,193,0.${intensity}) 0%, rgba(255,182,193,0) 70%)`;

    // Animation
    el.classList.add('react-giggle');
    setTimeout(() => el.classList.remove('react-giggle'), 800);
  });
});