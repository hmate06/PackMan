import MovingDirection from "./MovingDirection.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.madeFirstMove = false;

    this.LSDActive = false;
    this.LSDAboutToExpire = false;
    this.timers = [];

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#move();
    }
    this.#eatJoint();
    this.#eatLSD();
    this.#eatGhost(enemies);
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      this.x,
      this.y,
      this.tileSize,
      this.tileSize
    );
  }

  #loadPacmanImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = "../források/mate-mini.jpg"; 
    this.pacmanImages = [pacmanImage1];
    this.pacmanImageIndex = 0; 
  }

  #keydown = (event) => {
    //up
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
      this.madeFirstMove = true;
    }
    //down
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
      this.madeFirstMove = true;
    }
    //left
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
      this.madeFirstMove = true;
    }
    //right
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
      this.madeFirstMove = true;
    }
  };

  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      return;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        break;
    }
  }

  #eatJoint() {
    if (this.tileMap.eatJoint(this.x, this.y)) {
    }
  }

  #eatLSD() {
    if (this.tileMap.eatLSD(this.x, this.y)) {
      this.LSDActive = true;
      this.LSDAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let LSDTimer = setTimeout(() => {
        this.LSDActive = false;
        this.LSDAboutToExpire = false;
        const pacmanImage1 = new Image();
        pacmanImage1.src = "../források/mate-mini.jpg";
        this.pacmanImages = [pacmanImage1];
        this.pacmanImageIndex = 0;
      }, 1000 * 6);

      this.timers.push(this.LSDTimer);

      let LSDAboutToExpireTimer = setTimeout(() => {
        this.LSDAboutToExpire = true;
      }, 1000 * 3);

      this.timers.push(LSDAboutToExpireTimer);
    }
  }
  #eatGhost(enemies) {
    if (this.LSDActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
      });
      const pacmanImage2 = new Image()
      pacmanImage2.src = "../források/mate-lsd.jpg"; 
      this.pacmanImages = [pacmanImage2];
      this.pacmanImageIndex = 0;
    }
  }
}
