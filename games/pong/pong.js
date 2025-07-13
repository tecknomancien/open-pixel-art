const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const paddleHeight = 50;
const paddleWidth = 10;
const paddleSpeed = 4;

const leftPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
const rightPaddle = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };

const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: 3, size: 5 };

function drawRect(x, y, w, h) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, w, h);
}

function drawBall() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(ball.x - ball.size, ball.y - ball.size, ball.size * 2, ball.size * 2);
}

function update() {
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // Keep paddles in bounds
  leftPaddle.y = Math.max(Math.min(leftPaddle.y, canvas.height - paddleHeight), 0);
  rightPaddle.y = Math.max(Math.min(rightPaddle.y, canvas.height - paddleHeight), 0);

  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.y < ball.size || ball.y > canvas.height - ball.size) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (ball.x < leftPaddle.x + paddleWidth && ball.y > leftPaddle.y && ball.y < leftPaddle.y + paddleHeight) {
    ball.dx = Math.abs(ball.dx);
  }
  if (ball.x > rightPaddle.x - ball.size && ball.y > rightPaddle.y && ball.y < rightPaddle.y + paddleHeight) {
    ball.dx = -Math.abs(ball.dx);
  }

  // Reset if out of bounds
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
  drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);
  drawBall();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function keyDown(e) {
  if (e.key === 'w') leftPaddle.dy = -paddleSpeed;
  if (e.key === 's') leftPaddle.dy = paddleSpeed;
  if (e.key === 'ArrowUp') rightPaddle.dy = -paddleSpeed;
  if (e.key === 'ArrowDown') rightPaddle.dy = paddleSpeed;
}

function keyUp(e) {
  if (e.key === 'w' || e.key === 's') leftPaddle.dy = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') rightPaddle.dy = 0;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

requestAnimationFrame(loop);
