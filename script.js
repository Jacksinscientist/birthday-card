const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const giftBox = document.getElementById('gift-box');
const overlay = document.getElementById('gift-overlay');
const mainContent = document.getElementById('main-content');
const animals = document.querySelectorAll('.animal');
let unlockedAnimals = 0;
let totalClicks = 0;

const animalReactions = {
  'bunny': 'react-bunny-jump', 'cat': 'react-cat-pounce',
  'lion': 'react-lion-roar', 'buffalo': 'react-buffalo-charge',
  'sheep': 'react-sheep-wiggle', 'cow': 'react-cow-sway'
};

function playTone(freq, dur) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain); gain.connect(audioContext.destination);
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + dur);
  osc.start(); osc.stop(audioContext.currentTime + dur);
}

function unlockNextAnimal() {
  if (unlockedAnimals < animals.length) {
    animals[unlockedAnimals].classList.remove('hidden');
    unlockedAnimals++;
  }
}

giftBox.addEventListener('click', () => {
  giftBox.classList.add('unwrap');
  setTimeout(() => {
    overlay.classList.add('hidden');
    mainContent.classList.remove('hidden');
    unlockNextAnimal(); // Reveal first
  }, 800);
});

animals.forEach(el => {
  el.addEventListener('click', () => {
    if (navigator.vibrate) navigator.vibrate(50);
    totalClicks++;
    
    // Animate
    const type = Object.keys(animalReactions).find(k => el.classList.contains(k));
    el.classList.add(animalReactions[type]);
    setTimeout(() => el.classList.remove(animalReactions[type]), 500);
    
    // Sound
    playTone(300 + (totalClicks * 50), 0.2);
    
    // Unlock next
    unlockNextAnimal();
  });
});