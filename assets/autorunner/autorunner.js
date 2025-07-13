const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 200;

const ground = canvas.height - 20;
const player = { x: 50, y: ground - 20, w: 20, h: 20, vy: 0 };
const gravity = 0.5;
const jump = 8;
const speed = 2;

let level = 1;
const maxLevel = 10;
let lives = 5;
let timeLeft = 120;
let obstacles = [];
let lastTime = null;
let distSinceLast = 0;
let nextGap = gap();
let playing = true;

function gap() {
  return 20 + Math.random() * 10;
}

function updateHud() {
  document.getElementById('level').textContent = level;
  document.getElementById('time').textContent = Math.ceil(timeLeft);
  document.getElementById('lives').textContent = lives;
}

function resetLevel() {
  player.y = ground - player.h;
  player.vy = 0;
  obstacles = [];
  distSinceLast = 0;
  nextGap = gap();
  timeLeft = 120;
  updateHud();
}

function nextLevel() {
  if (level >= maxLevel) {
    playing = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px sans-serif';
    ctx.fillText('Victoire !', canvas.width / 2 - 60, canvas.height / 2);
    return;
  }
  level++;
  resetLevel();
}

function loseLife() {
  lives--;
  if (lives <= 0) {
    playing = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '24px sans-serif';
    ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    return;
  }
  resetLevel();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && player.y >= ground - player.h) {
    player.vy = -jump;
  }
});

function update(dt) {
  player.vy += gravity;
  player.y += player.vy;
  if (player.y > ground - player.h) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  obstacles.forEach((o) => {
    o.x -= speed;
  });
  obstacles = obstacles.filter((o) => o.x + o.w > 0);

  distSinceLast += speed;
  if (distSinceLast >= nextGap) {
    obstacles.push({ x: canvas.width, y: ground - 20, w: 20, h: 20 });
    distSinceLast = 0;
    nextGap = gap();
  }

  obstacles.forEach((o) => {
    if (
      player.x < o.x + o.w &&
      player.x + player.w > o.x &&
      player.y + player.h > o.y
    ) {
      loseLife();
    }
  });

  timeLeft -= dt / 1000;
  if (timeLeft <= 0) {
    nextLevel();
  }
  updateHud();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = '#333';
  obstacles.forEach((o) => {
    ctx.fillRect(o.x, o.y, o.w, o.h);
  });
}

function loop(timestamp) {
  if (!playing) return;
  if (!lastTime) lastTime = timestamp;
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

resetLevel();
requestAnimationFrame(loop);
