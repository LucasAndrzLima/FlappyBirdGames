let bird;
let pipes = [];
let score = 0;
let gameState = "start";

let jumpSound;
let deathSound;
let alreadyPlayedDeath = false;

function preload() {
  jumpSound = loadSound("jump.mp3");
  deathSound = loadSound("death.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetGame();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
  let gap = 200;
  let topHeight = random(100, height - gap - 100);

  return {
    x: width,
    topHeight: topHeight,
    gap: gap,
    width: 80,
    speed: 4,
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

  if (pipes.length === 0 || pipes[pipes.length - 1].x < width - 300) {
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
  if (bird.y < 0 || bird.y > height) {
    killBird();
  }

  for (let pipe of pipes) {
    let birdLeft = bird.x - bird.size / 2;
    let birdRight = bird.x + bird.size / 2;
    let birdTop = bird.y - bird.size / 2;
    let birdBottom = bird.y + bird.size / 2;

    let pipeLeft = pipe.x;
    let pipeRight = pipe.x + pipe.width;

    let hitX = birdRight > pipeLeft && birdLeft < pipeRight;
    let hitTop = birdTop < pipe.topHeight;
    let hitBottom = birdBottom > pipe.topHeight + pipe.gap;

    if (hitX && (hitTop || hitBottom)) {
      killBird();
    }
  }
}

function killBird() {
  if (!alreadyPlayedDeath) {
    deathSound.play();
    alreadyPlayedDeath = true;
  }

  gameState = "gameover";
}

function drawScore() {
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
}

function drawStartScreen() {
  fill(0);
  textAlign(CENTER);
  textSize(40);
  text("FLAPPY BIRD", width / 2, height / 2 - 50);

  textSize(20);
  text("Clique ou pressione ESPAÇO para começar", width / 2, height / 2);
}

function drawGameOver() {
  fill(0);
  textAlign(CENTER);
  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 50);

  textSize(25);
  text("Score: " + score, width / 2, height / 2);

  textSize(18);
  text("Clique ou pressione ESPAÇO para reiniciar", width / 2, height / 2 + 40);
}

function jumpBird() {
  if (gameState === "start") {
    gameState = "game";
    jumpSound.play();
  } else if (gameState === "game") {
    bird.velocity = bird.jump;
    jumpSound.play();
  } else if (gameState === "gameover") {
    resetGame();
    gameState = "game";
    jumpSound.play();
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
  bird = {
    x: width / 4,
    y: height / 2,
    size: 30,
    velocity: 0,
    gravity: 0.6,
    jump: -10
  };

  pipes = [];
  pipes.push(createPipe());

  score = 0;
  alreadyPlayedDeath = false;
}