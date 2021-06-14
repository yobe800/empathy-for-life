import { DIRECTIONS } from "../../../constants/constants";

class PersonCharacter {
  constructor(character = "person0", userName = "") {
    this.TYPE = "person";
    this.characterNumber = character.split("person")[1];
    this.name = userName;
    this.lastDirection = "down";
    this.SIZE = 32;
    this.sx = 0;
    this.sy = this.characterNumber * this.SIZE;
    this.sWidth = this.sHeight = this.SIZE;
    this.dx = 0;
    this.dy = 0;
    this.dWidth = this.dHeight = this.SIZE * 2;

    const getXAxises = (x1, x2) => {
      return {
        initX: this.SIZE * x1,
        maxX: this.SIZE * x2,
      };
    };

    this.up = getXAxises(8, 11);
    this.right = getXAxises(4, 7);
    this.down = getXAxises(0, 3);
    this.left = getXAxises(12, 15);
  }

  walk(canvasSize, key, distance) {
    const direction = DIRECTIONS[key];

    if (!direction) {
      return;
    }

    switch (direction) {
      case "up":
        this.walkToUp(distance);
        break;
      case "right":
        this.walkToRight(canvasSize.width, distance);
        break;
      case "down":
        this.walkToDown(canvasSize.height, distance);
        break;
      case "left":
        this.walkToLeft(distance);
        break;
      default:
        return;
    }
  }

  walkToUp(distance) {
    if (this.lastDirection === "up") {
      if (this.sx === this.up.maxX) {
        this.sx = this.up.initX;
      } else {
        this.sx += this.SIZE;
      }
    } else {
      const firstStepImageX = this.up.initX + this.SIZE;
      this.sx = firstStepImageX;
    }

    if (0 < this.dy) {
      this.dy -= distance;
    }

    this.lastDirection = "up";
  }
  walkToRight(canvasWidth, distance) {
    if (this.lastDirection === "right") {
      if (this.sx === this.right.maxX) {
        this.sx = this.right.initX;
      } else {
        this.sx += this.SIZE;
      }
    } else {
      const firstStepImageX = this.right.initX + this.SIZE;
      this.sx = firstStepImageX;
    }

    if (this.dx < canvasWidth - this.SIZE) {
      this.dx += distance;
    }

    this.lastDirection = "right";
  }
  walkToDown(canvasHeight, distance) {
    if (this.lastDirection === "down") {
      if (this.sx === this.down.maxX) {
        this.sx = this.down.initX;
      } else {
        this.sx += this.SIZE;
      }
    } else {
      const firstStepImageX = this.down.initX + this.SIZE;
      this.sx = firstStepImageX;
    }

    if (this.dy < canvasHeight - this.SIZE) {
      this.dy += distance;
    }

    this.lastDirection = "down";
  }
  walkToLeft(distance) {
    if (this.lastDirection === "left") {
      if (this.sx === this.left.maxX) {
        this.sx = this.left.initX;
      } else {
        this.sx += this.SIZE;
      }
    } else {
      const firstStepImageX = this.left.initX + this.SIZE;
      this.sx = firstStepImageX;
    }

    if (0 < this.dx) {
      this.dx -= distance;
    }

    this.lastDirection = "left";
  }

  stop() {
    const { lastDirection } = this;
    this.sx = this[lastDirection].initX;
  }
}

export default PersonCharacter;
