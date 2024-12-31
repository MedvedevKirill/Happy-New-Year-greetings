const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imagesStrings = [
  "berries-alt",
  "berries",
  "candy-alt",
  "candy-stick",
  "christmas-tree-red-star-alt",
  "christmas-tree-red-star",
  "christmas-tree-small-red-star",
  "christmas-tree-small-white-star",
  "christmas-tree-white-star",
  "christmas-tree-white-star-alt",
  "green-red-gift",
  "green-red-nosok-alt",
  "green-white-gift",
  "green-white-nosok-alt",
  "green-white-nosok",
  "red-green-gift",
  "red-green-nosok",
  "red-tall-gift",
  "red-white-nosok-alt",
  "red-white-nosok",
  "red-white-tall-gift"
];
let images = document.getElementsByClassName("canvas__image");
const confettiImage = document.querySelector(".canvas__image_heart");
let backgroundDynamicIcons = [];
let confetti = [];
const speedOfIcons = 1;
const imageScaleFactor = 0.5;
const confettiScaleFactor = 0.3;
const spaceBetweenIcons = 130 * imageScaleFactor;
const resizeDelay = 50;
const buttonClickMe = document.getElementById("button-click-me");
const header = document.querySelector(".header");
const audio = document.querySelector("audio");
const maxConfettiVelocity = 10;
const confettiGravity = 0.03;
let freeConfettiCount;

function init() {
  for (let i = 0; i < images.length; i += 1) {
    images[i].width = images[i].width * imageScaleFactor;
    images[i].height = images[i].height * imageScaleFactor;
  }
  confettiImage.width *= confettiScaleFactor;
  confettiImage.height *= confettiScaleFactor;
  resize();
  window.addEventListener("resize", debounce(resize, resizeDelay));
  buttonClickMe.addEventListener("click", () => {
    buttonClickMe.classList.add("button_hidden", "button_locked");
    header.classList.remove("header_hidden");
    audio.play();
    draw();
    header.addEventListener("click", headerClickEventHandler);
  });
  generateConfetti(30);
}

function headerClickEventHandler(event) {
  if (event.target !== event.currentTarget) {
    document.addEventListener("click", bombConfetti);
    header.removeEventListener("click", headerClickEventHandler);
  }
}

function generateBackgroundIcons(num) {
  let lastIconY = -spaceBetweenIcons;
  for (let i = 0; i < num; i += 1) {
    const image = images[Math.floor(Math.random() * images.length)];
    const x = Math.random() * (canvas.width - image.width);
    const y = -spaceBetweenIcons + lastIconY
    lastIconY = y;
    backgroundDynamicIcons[i] = new Icon(x, y, image);
  }
}

function generateConfetti(num) {
  for (let i = 0; i < num; i += 1) {
    const currConfetti = new ConfettiParticiple(0, 0, confettiImage, { x: 0, y: 0 });
    confetti.push(currConfetti);
  }
  freeConfettiCount = num;
}

function bombConfetti(event) {
  for (let i = confetti.length - 1; i >= 0; i -= 1) {
    if (confetti[i].isFree) {
      const angle = Math.random() * 2 * Math.PI;
      const vectorLength = Math.random() * maxConfettiVelocity;
      confetti[i].velocity.x = Math.cos(angle) * vectorLength;
      confetti[i].velocity.y = Math.sin(angle) * vectorLength;
      confetti[i].x = event.clientX;
      confetti[i].y = event.clientY;
      confetti[i].isFree = false;
    }
  }
  freeConfettiCount = 0;
}

function ConfettiParticiple(x, y, image, velocity) {
  this.x = x;
  this.y = y;
  this.image = image;
  this.velocity = velocity;
  this.isFree = true;

  this.move = () => {
    if (this.y > canvas.height || this.x > canvas.width || this.x + this.image.width < 0) {
      this.isFree = true;
      freeConfettiCount += 1;
    }
    else {
      this.x += velocity.x;
      this.y += velocity.y;
      velocity.y += confettiGravity;
      ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    }
  }
}

function Icon(x, y, img) {
  this.x = x;
  this.y = y;
  this.image = img;

  this.move = () => {
    if (this.y > canvas.height) {
      this.image = images[Math.floor(Math.random() * images.length)];
      this.x = Math.random() * (canvas.width - this.image.width);
      this.y = -spaceBetweenIcons;
    }
    else {
      this.y += speedOfIcons;
    }
    ctx.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height + 200);
  backgroundDynamicIcons.forEach((icon) => icon.move());
  if (freeConfettiCount < confetti.length) {
    confetti.forEach((currConfetti) => {
      if (!currConfetti.isFree) {
        currConfetti.move();
      }
    }
    );
  }
  requestAnimationFrame(draw);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateBackgroundIcons(Math.floor(canvas.height / spaceBetweenIcons) * 2);
}

function debounce(callback, delay) {
  let timer;
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback();
    }, delay)
  }
}


window.addEventListener("load", init);