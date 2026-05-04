// =========================
// VARIÁVEIS GLOBAIS
// =========================

// objeto do pássaro
let bird;

// array que guarda todos os canos (usei array pra poder ter vários ao mesmo tempo)
let pipes = [];

// pontuação atual
let score = 0;

// melhor pontuação salva
let bestScore = 0;

// controla em qual tela o jogo está
// start = tela inicial
// game = jogando
// gameover = perdeu
let gameState = "start";

// sons
let jumpSound;
let deathSound;

// controle pra não tocar o som de morte várias vezes
let alreadyPlayedDeath = false;


// =========================
// PRELOAD
// =========================

// preload roda antes do setup, usei pra carregar os sons
function preload() {
  jumpSound = loadSound("jump.mp3");
  deathSound = loadSound("death.mp3");
}


// =========================
// SETUP
// =========================

function setup() {
  // canvas ocupa tela inteira
  createCanvas(windowWidth, windowHeight);

  // pega o best score salvo no navegador
  bestScore = getItem("bestScore");

  // se não tiver nada salvo ainda
  if (bestScore === null) {
    bestScore = 0;
  }

  // inicia o jogo
  resetGame();
}


// se redimensionar a tela, o canvas acompanha
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// =========================
// LOOP PRINCIPAL (DRAW)
// =========================

// draw roda várias vezes por segundo (tipo um loop infinito)
function draw() {
  // fundo azul (céu)
  background(135, 206, 235);

  // aqui eu controlo qual tela mostrar usando o estado do jogo
  if (gameState === "start") {
    drawStartScreen();
  } 
  else if (gameState === "game") {
    playGame();
  } 
  else if (gameState === "gameover") {
    drawGameOver();
  }
}


// =========================
// GAMEPLAY
// =========================

// função principal do jogo
function playGame() {
  updateBird();   // atualiza física do pássaro
  drawBird();     // desenha ele

  updatePipes();  // move os canos
  drawPipes();    // desenha os canos

  drawScore();    // mostra score

  checkCollisions(); // verifica se perdeu
}


// =========================
// PÁSSARO
// =========================

// física do pássaro
function updateBird() {
  // gravidade aumenta a velocidade pra baixo
  bird.velocity += bird.gravity;

  // posição muda baseado na velocidade
  bird.y += bird.velocity;
}

// desenho do pássaro (usei formas simples)
function drawBird() {
  fill("yellow");
  stroke(0);
  circle(bird.x, bird.y, bird.size);

  // bico
  fill("orange");
  triangle(
    bird.x + 10, bird.y,
    bird.x + 25, bird.y - 7,
    bird.x + 25, bird.y + 7
  );

  // olho
  fill(0);
  circle(bird.x + 6, bird.y - 6, 4);
}


// =========================
// CANOS
// =========================

// cria um novo cano
function createPipe() {
  let gap = 200; // espaço entre os canos (onde o pássaro passa)

  // altura aleatória do cano de cima
  let topHeight = random(100, height - gap - 100);

  return {
    x: width, // começa na direita da tela
    topHeight: topHeight,
    gap: gap,
    width: 80,
    speed: 4,
    scored: false // pra não contar ponto duas vezes
  };
}


// atualiza posição dos canos
function updatePipes() {
  // percorro o array de trás pra frente
  // isso evita problema quando removo elementos
  for (let i = pipes.length - 1; i >= 0; i--) {
    let pipe = pipes[i];

    // move pra esquerda
    pipe.x -= pipe.speed;

    // se saiu da tela, remove
    if (pipe.x + pipe.width < 0) {
      pipes.splice(i, 1);
    }

    // pontuação: quando passa do pássaro
    if (!pipe.scored && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.scored = true;
    }
  }

  // cria novos canos automaticamente
  if (pipes.length === 0 || pipes[pipes.length - 1].x < width - 300) {
    pipes.push(createPipe());
  }
}


// desenha os canos
function drawPipes() {
  fill("green");

  for (let pipe of pipes) {
    // cano de cima
    rect(pipe.x, 0, pipe.width, pipe.topHeight);

    // cano de baixo
    rect(
      pipe.x,
      pipe.topHeight + pipe.gap,
      pipe.width,
      height - pipe.topHeight - pipe.gap
    );
  }
}


// =========================
// COLISÃO
// =========================

function checkCollisions() {
  // se sair da tela
  if (bird.y < 0 || bird.y > height) {
    killBird();
  }

  // checa colisão com cada cano
  for (let pipe of pipes) {

    // limites do pássaro
    let birdLeft = bird.x - bird.size / 2;
    let birdRight = bird.x + bird.size / 2;
    let birdTop = bird.y - bird.size / 2;
    let birdBottom = bird.y + bird.size / 2;

    // limites do cano
    let pipeLeft = pipe.x;
    let pipeRight = pipe.x + pipe.width;

    // colisão no eixo X
    let hitX = birdRight > pipeLeft && birdLeft < pipeRight;

    // colisão nos canos
    let hitTop = birdTop < pipe.topHeight;
    let hitBottom = birdBottom > pipe.topHeight + pipe.gap;

    // se colidir, perde
    if (hitX && (hitTop || hitBottom)) {
      killBird();
    }
  }
}


// quando perde
function killBird() {

  // atualiza best score
  if (score > bestScore) {
    bestScore = score;
    storeItem("bestScore", bestScore); // salva no navegador
  }

  // toca som só uma vez
  if (!alreadyPlayedDeath) {
    deathSound.play();
    alreadyPlayedDeath = true;
  }

  gameState = "gameover";
}


// =========================
// INTERFACE
// =========================

function drawScore() {
  fill(0);
  textSize(24);
  textAlign(LEFT);

  text("Score: " + score, 20, 30);
  text("Best: " + bestScore, 20, 60);
}

function drawStartScreen() {
  fill(0);
  textAlign(CENTER);

  textSize(40);
  text("FLAPPY BIRD", width / 2, height / 2 - 70);

  textSize(24);
  text("Best Score: " + bestScore, width / 2, height / 2 - 20);

  textSize(18);
  text("Clique ou pressione ESPAÇO para jogar", width / 2, height / 2 + 30);
}

function drawGameOver() {
  fill(0);
  textAlign(CENTER);

  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 70);

  textSize(25);
  text("Score: " + score, width / 2, height / 2 - 20);
  text("Best: " + bestScore, width / 2, height / 2 + 15);

  textSize(18);
  text("Clique ou pressione ESPAÇO para reiniciar", width / 2, height / 2 + 60);
}


// =========================
// CONTROLES
// =========================

// lógica do pulo
function jumpBird() {

  if (gameState === "start") {
    gameState = "game";
    jumpSound.play();
  } 
  else if (gameState === "game") {
    // faz o pássaro subir (velocidade negativa)
    bird.velocity = bird.jump;
    jumpSound.play();
  } 
  else if (gameState === "gameover") {
    resetGame();
    gameState = "game";
    jumpSound.play();
  }
}

// clique do mouse
function mousePressed() {
  jumpBird();
}

// tecla espaço
function keyPressed() {
  if (key === " ") {
    jumpBird();
  }
}


// =========================
// RESET DO JOGO
// =========================

function resetGame() {
  // reinicia o pássaro
  bird = {
    x: width / 4,
    y: height / 2,
    size: 30,
    velocity: 0,
    gravity: 0.6,
    jump: -10
  };

  // limpa e cria os canos
  pipes = [];
  pipes.push(createPipe());

  // zera score
  score = 0;

  alreadyPlayedDeath = false;
}