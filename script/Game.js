import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.LSDActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = "Gratulálok Drogos!";
    if (gameOver) {
      text = "Mész a dutyiba Drogos!";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 2.5, canvas.width, 100);

    ctx.font = "63px Alkatra center";
    //const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    //gradient.addColorStop("0", "magenta");
    //gradient.addColorStop("0.5", "blue");
    //gradient.addColorStop("1.0", "red");

    ctx.fillStyle = 'white';//gradient;

    ctx.fillText(text, 10, canvas.height / 2);
  }
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);
