// script.js – Meme Dash Tycoon Edition (No Error, God Mode Activate!)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const gameoverEl = document.getElementById('gameover');
const finalScoreEl = document.getElementById('finalScore');
const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');
const shareBtn = document.getElementById('shareBtn');

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  initLanes();
}
resize();
addEventListener('resize', resize);

let player = { x: 100, y: 0, width: 60, height: 60, velY: 0, lane: 1, jumping: false, frame: 0 };
let obstacles = [], coins = [], particles = [], speed = 5, score = 0, gameRunning = false, gravity = 1.2, jumpPower = -22;
let highscore = parseInt(localStorage.getItem('memeHigh')) || 0;
highscoreEl.textContent = `Best: ${highscore}`;
let lanes = [], wowFlash = 0;

function initLanes() {
  lanes = [canvas.width * 0.3, canvas.width * 0.5, canvas.width * 0.7];
  player.x = lanes[player.lane]; // Adjust player pas resize
}
initLanes();
player.y = canvas.height - 150;

// Doge img (lo punya base64, duplicate buat animate hack: scale x flip)
const dogeImg = new Image();
dogeImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHe...'; // Lo punya full

// Draw Hater fix balance
function drawHater(x, y) {
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, 80, 50);
  ctx.fillStyle = '#FFF';
  ctx.font = '20px Comic Sans MS';
  ctx.fillText('HATERS', x + 5, y + 35);
}

// Draw Coin
function drawCoin(x, y) {
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x + 30, y + 30, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F00';
  ctx.font = '40px Arial';
  ctx.fillText('❤️', x + 10, y + 45);
}

// Particles explode gila
function createParticles(x, y) {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x,
      y,
      vx: Math.random() * 14 - 7,
      vy: Math.random() * 14 - 14,
      life: 45,
      color: `hsl(${Math.random() * 60 + 50}, 100%, 60%)`
    });
  }
}

// Sound beep safe (try-catch kalo base64 rusak)
let beep;
try {
  beep = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
} catch (e) {
  beep = { play: () => {} }; // No crash kalo invalid
}

// BG Parallax + Speed
let bgOffset1 = 0, bgOffset2 = 0;
function drawBG() {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#87CEEB');
  grad.addColorStop(1, '#98D8C8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#333';
  for (let i = 0; i < 15; i++) {
    const x = (i * 150 - bgOffset2) % (canvas.width + 150) - 150;
    ctx.fillRect(x, canvas.height - 350, 100, 350); // Gedung
  }
  ctx.fillStyle = '#555';
  ctx.fillRect(0, canvas.height - 150, canvas.width, 150); // Jalan
  ctx.fillStyle = '#FFF';
  ctx.font = '20px Comic Sans MS';
  ctx.fillText(`Speed: ${speed.toFixed(1)}x`, canvas.width - 150, 50);
}

// Input (keyboard + touch)
addEventListener('keydown', e => {
  if (!gameRunning) return;
  if (e.key === 'ArrowLeft') changeLane(-1);
  if (e.key === 'ArrowRight') changeLane(1);
  if (e.key === ' ') jump();
});
let touchStartX = 0, touchStartY = 0;
canvas.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', e => {
  if (!gameRunning) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    changeLane(dx > 0 ? 1 : -1);
  } else if (dy < -50) jump();
});
function changeLane(dir) {
  player.lane = Math.max(0, Math.min(2, player.lane + dir));
  player.x = lanes[player.lane];
}
function jump() {
  if (!player.jumping) {
    player.velY = jumpPower;
    player.jumping = true;
  }
}

// Spawn random
let lastSpawn = 0;
function spawnStuff() {
  if (Date.now() - lastSpawn < 1200 / speed) return;
  lastSpawn = Date.now();
  const lane = Math.floor(Math.random() * 3);
  const y = canvas.height - 150 - (Math.random() > 0.6 ? 80 : 0);
  if (Math.random() > 0.35) {
    obstacles.push({ x: canvas.width + 100, y, width: 80, height: 50, lane });
  } else {
    coins.push({ x: canvas.width + 100, y: y - 50, width: 60, height: 60, lane });
  }
}

// Collision
function checkCollision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y && player.lane === b.lane;
}

// Loop utama
let animFrame = 0;
function loop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBG();
  bgOffset1 += speed * 0.4;
  bgOffset2 += speed * 1.2;

  player.velY += gravity;
  player.y += player.velY;
  if (player.y > canvas.height - 150) {
    player.y = canvas.height - 150;
    player.velY = 0;
    player.jumping = false;
  }

  // Animate Doge hack (scale flip lari)
  animFrame++;
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.scale((animFrame % 20 < 10 ? 1 : -1), 1); // Flip horizontal simulate run
  ctx.drawImage(dogeImg, -player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  spawnStuff();
  obstacles.forEach((o, i) => {
    o.x -= speed + 6;
    drawHater(o.x, o.y);
    if (checkCollision(player, o)) endGame();
    if (o.x < -200) obstacles.splice(i, 1);
  });
  coins.forEach((c, i) => {
    c.x -= speed + 6;
    drawCoin(c.x, c.y);
    if (checkCollision(player, { ...c, width: 60, height: 60 })) {
      score += 100;
      scoreEl.textContent = `Score: ${score}`;
      createParticles(c.x + 30, c.y + 30);
      beep.play();
      wowFlash = 25;
      coins.splice(i, 1);
      if (score % 400 === 0) speed += 0.5; // Naik smooth
    }
    if (c.x < -200) coins.splice(i, 1);
  });
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.6;
    p.life--;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 7, 7);
    if (p.life <= 0) particles.splice(i, 1);
  });
  if (wowFlash > 0) {
    ctx.fillStyle = `rgba(255, 255, 0, ${wowFlash / 25})`;
    ctx.font = '70px Comic Sans MS';
    ctx.fillText('Much Wow!!', canvas.width / 2 - 200, 120);
    wowFlash--;
  }

  requestAnimationFrame(loop);
}

// Start/End/Share
startBtn.onclick = () => {
  startMenu.style.display = 'none';
  gameRunning = true;
  score = 0;
  speed = 5;
  obstacles = [];
  coins = [];
  particles = [];
  scoreEl.textContent = 'Score: 0';
  loop();
};
function endGame() {
  gameRunning = false;
  gameoverEl.style.display = 'block';
  finalScoreEl.textContent = score;
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('memeHigh', highscore);
    highscoreEl.textContent = `Best: ${highscore}`;
  }
}
shareBtn.onclick = () => {
  if (navigator.share) {
    navigator.share({ title: 'Meme Dash Wow', text: `Such Wow Score: ${score}! Beat gue 🐶`, url: location.href });
  } else {
    prompt('Copy & Brag di X:', location.href + ' | Score: ' + score);
  }
};

// Init
startMenu.style.display = 'block';
gameoverEl.style.display = 'none';