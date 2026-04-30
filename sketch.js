let bird;
let pipes = [];
let score = 0;
let gameState = "start";

function setup() {
  createCanvas(600, 400);

  bird = {
    x: 120,
    y: 200,
    size: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -8
  };

  pipes.push(createPipe());
}

function draw() {
  background(135, 206, 235);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "game") {
    playGame();
  } else if (gameState === "gameover") {
    drawGameOver();
  }
}

function playGame() {
  updateBird();
  drawBird();

  updatePipes();
  drawPipes();

  drawScore();

  checkCollisions();
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
}

function drawBird() {
  fill("yellow");
  stroke(0);
  circle(bird.x, bird.y, bird.size);

  fill("orange");
  triangle(
    bird.x + 10, bird.y,
    bird.x + 25, bird.y - 7,
    bird.x + 25, bird.y + 7
  );

  fill(0);
  circle(bird.x + 6, bird.y - 6, 4);
}

function createPipe() {
  let gap = 120;
  let topHeight = random(50, height - gap - 80);

  return {
    x: width,
    topHeight: topHeight,
    gap: gap,
    width: 60,
    speed: 3,
    scored: false
  };
}

function updatePipes() {
  for (let i = pipes.length - 1; i >= 0; i--) {
    let pipe = pipes[i];

    pipe.x -= pipe.speed;

    if (pipe.x + pipe.width < 0) {
      pipes.splice(i, 1);
    }

    if (!pipe.scored && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.scored = true;
    }
  }

  if (pipes.length === 0 || pipes[pipes.length - 1].x < width - 220) {
    pipes.push(createPipe());
  }
}

function drawPipes() {
  fill("green");

  for (let pipe of pipes) {
    rect(pipe.x, 0, pipe.width, pipe.topHeight);

    rect(
      pipe.x,
      pipe.topHeight + pipe.gap,
      pipe.width,
      height - pipe.topHeight - pipe.gap
    );
  }
}

function checkCollisions() {
  if (bird.y - bird.size / 2 < 0 || bird.y + bird.size / 2 > height) {
    gameState = "gameover";
  }

  for (let pipe of pipes) {
    let birdLeft = bird.x - bird.size / 2;
    let birdRight = bird.x + bird.size / 2;
    let birdTop = bird.y - bird.size / 2;
    let birdBottom = bird.y + bird.size / 2;

    let pipeLeft = pipe.x;
    let pipeRight = pipe.x + pipe.width;

    let hitPipeX = birdRight > pipeLeft && birdLeft < pipeRight;
    let hitTopPipe = birdTop < pipe.topHeight;
    let hitBottomPipe = birdBottom > pipe.topHeight + pipe.gap;

    if (hitPipeX && (hitTopPipe || hitBottomPipe)) {
      gameState = "gameover";
    }
  }
}

function drawScore() {
  fill(0);
  noStroke();
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 35);
}

function drawStartScreen() {
  fill(0);
  textAlign(CENTER);
  textSize(32);
  text("FLAPPY BIRD", width / 2, height / 2 - 50);

  textSize(18);
  text("Clique ou aperte ESPAÇO para começar", width / 2, height / 2);
  text("Desvie dos canos para ganhar pontos", width / 2, height / 2 + 30);
}

function drawGameOver() {
  fill(0);
  textAlign(CENTER);
  textSize(36);
  text("GAME OVER", width / 2, height / 2 - 40);

  textSize(22);
  text("Score: " + score, width / 2, height / 2);

  textSize(16);
  text("Clique ou aperte ESPAÇO para reiniciar", width / 2, height / 2 + 40);
}

function jumpBird() {
  if (gameState === "start") {
    gameState = "game";
  } else if (gameState === "game") {
    bird.velocity = bird.jump;
  } else if (gameState === "gameover") {
    resetGame();
    gameState = "game";
  }
}

function mousePressed() {
  jumpBird();
}

function keyPressed() {
  if (key === " ") {
    jumpBird();
  }
}

function resetGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  pipes.push(createPipe());
  score = 0;
}