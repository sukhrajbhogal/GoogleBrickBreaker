//Get the canvas area. Set constants
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ball = new Object(); //Position based on center
var img = new Image();
img.src = "images/bar.png";
ball.radius = 10;
//Ball position
ball.x = canvas.width / 2;
ball.speed = 10;
ball.dx = 0;
ball.dy = 0;
var paddle = Object(); //Position based on top left corner
paddle.height = 65;
paddle.width = 600;
paddle.x = (canvas.width - paddle.width) / 2;
paddle.y = 35;
ball.y = canvas.height - 1.5*paddle.height - ball.radius;
var rightPressed = false;
var leftPressed = false;
var BRICKCOUNT = 26;
var BRICKWIDTH = 60;
var BRICKHEIGHT = 60;
var BRICKPADDING = 10;
var BRICKOFFSETTOP = 50;
var BRICKOFFSETLEFT = 400;
var brickimg = [];
var searchQuery = "";
var searched = false;
var clicked = false;
var scrollbarWidth = 17;
var body = document.body;
var html = document.documentElement;

canvas.height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

canvas.width = Math.max(
  body.scrollWidth,
  body.offsetWidth,
  html.clientWidth,
  html.scrollWidth,
  html.offsetWidth
  ) + scrollbarWidth;

  document.body.scrollTop = 0;
  document.body.style.overflow = 'hidden';

//Initialize bricks
var bricks = [];
for (var b = 0; b < BRICKCOUNT; b++) {
  bricks[b] = { x: 0, y: 0, status: 1, char: getChar(b) };
}

//Add controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

function mouseClickHandler(e) {
  if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
    var xDiff = ball.x - (paddle.x + paddle.width / 2); //Difference between ball center and paddle center
    //Scale the ball distance away from the paddle center to an angle between 0 and 89
    //NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
    var angle = (xDiff * 89) / (paddle.width / 2);
    ball.dx = Math.sin((angle * Math.PI) / 180) * ball.speed;
    ball.dy = -(Math.cos((angle * Math.PI) / 180) * ball.speed);
    document.removeEventListener("click", mouseClickHandler, false);
    clicked = true;
  }
}
//Adding collision for bricks
function collisionDetection() {
  for (var b = 0; b < BRICKCOUNT; b++) {
    var brick = bricks[b];
    if (brick.status == 1) {
      if (
        ball.y + ball.radius > brick.y &&
        ball.y - ball.radius < brick.y + BRICKHEIGHT &&
        ball.x > brick.x &&
        ball.x < brick.x + BRICKWIDTH
      ) {
        ball.dy = -ball.dy;
        brick.status = 0;
        searchQuery += brick.char;
      } else if (
        ball.x + ball.radius > brick.x &&
        ball.x - ball.radius < brick.x + BRICKWIDTH &&
        ball.y > brick.y &&
        ball.y < brick.y + BRICKHEIGHT
      ) {
        ball.dx = -ball.dx;
        brick.status = 0;
        searchQuery += brick.char;
      }
    }
  }
}

function makeImg() {
  for (var i = 1; i < 27; i++) {
    var img2 = new Image();
    var img_path = "images/brick";
    img_path = img_path.concat(parseInt(i));
    img_path = img_path.concat(".jpg");
    img2.src = img_path;
    brickimg.push(img2);
  }
}

//Draw all the objects
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.drawImage(
    img,
    paddle.x,
    canvas.height - paddle.height - paddle.y,
    paddle.width,
    paddle.height
  );
  ctx.font = "30px Arial";
  // Just using arbitrary numbers for now
  ctx.fillText(
    searchQuery,
    paddle.x + 15,
    canvas.height - paddle.height / 2 - paddle.y + 8
  );
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  var yOffset = 0;
  var weirdassXOffset = 0;
  var keyboardOffset = 0;
  for (var b = 0; b < BRICKCOUNT; b++) {
    if (b == 10 || b == 19) {
      yOffset++;
      weirdassXOffset = b;
      keyboardOffset += 15;
    }
    if (bricks[b].status == 1) {
      var brickX = (b - weirdassXOffset) * (BRICKWIDTH + BRICKPADDING) + BRICKOFFSETLEFT + keyboardOffset;
      var brickY = yOffset * (BRICKHEIGHT + BRICKPADDING) + BRICKOFFSETTOP;
      bricks[b].x = brickX;
      bricks[b].y = brickY;
      ctx.beginPath();
      ctx.drawImage(brickimg[b], brickX, brickY, BRICKWIDTH, BRICKHEIGHT);
      ctx.fill();
      ctx.closePath();
    }
  }
}

//Main loop
function draw() {
  //Refresh and draw all canvas objects
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Check if ball has hit the left or right edge of the screen
  if (ball.x > canvas.width - ball.radius || ball.x < ball.radius) {
    ball.dx = -ball.dx;
  }

  //Check if ball has hit the top edge of the screen
  if (ball.y < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y > canvas.height - ball.radius - paddle.y - paddle.height && ball.y - ball.dy < canvas.height - ball.radius - paddle.y - paddle.height ) {
    //Check if ball hits the bottom of the screen
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      var xDiff = ball.x - (paddle.x + paddle.width / 2); //Difference between ball center and paddle center
      //Scale the ball distance away from the paddle center to an angle between 0 and 89
      //NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
      var angle = (xDiff * 89) / (paddle.width / 2);
      ball.dx = Math.sin((angle * Math.PI) / 180) * ball.speed;
      ball.dy = -(Math.cos((angle * Math.PI) / 180) * ball.speed);
    }
  }
  //&& ball.x < paddle.x + paddle.width
  else if (ball.y > canvas.height - ball.radius - paddle.y - paddle.height && ball.x+ball.radius > paddle.x && ball.x+ball.radius - Math.abs(ball.dx) < paddle.x){
      ball.dx = -Math.abs(ball.dx);
      console.log("Left");
  }
  else if (ball.y > canvas.height - ball.radius - paddle.y - paddle.height && ball.x-ball.radius < paddle.x + paddle.width && ball.x-ball.radius + Math.abs(ball.dx) > paddle.x + paddle.width){
    console.log("Right");
    ball.dx = Math.abs(ball.dx);
    }

  if (ball.y > canvas.height) {
    window.open("https://www.google.com/search?q=" + searchQuery, "_self");
    searched = true;
  }

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 15;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 15;
  }
  if (!searched) {
    requestAnimationFrame(draw);
  }
  if (!clicked){
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        var xDiff = ball.x - (paddle.x + paddle.width / 2); //Difference between ball center and paddle center
        //Scale the ball distance away from the paddle center to an angle between 0 and 89
        //NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
        var angle = (xDiff * 89) / (paddle.width / 2);
      }
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    var x = Math.sin((angle * Math.PI) / 180) * 200;
    var y = -(Math.cos((angle * Math.PI) / 180) * 200);
    ctx.lineTo(ball.x + x, ball.y + y);
    ctx.stroke();
    ctx.font="30px Comic Sans MS";
    ctx.fillText("Search", 30, canvas.height-60);
    ctx.fillText("Search", canvas.width-300, canvas.height-60);
    ctx.textAlign = "center";
    ctx.fillText("V", 75, canvas.height-30);
    ctx.fillText("V", canvas.width-255, canvas.height-30);
    ctx.textAlign = "left";
  }
}

// Hard-coded part :((
function getChar(brickNum) {
  switch (brickNum) {
    case 0:
      return "q";
      break;
    case 1:
      return "w";
      break;
    case 2:
      return "e";
      break;
    case 3:
      return "r";
      break;
    case 4:
      return "t";
      break;
    case 5:
      return "y";
      break;
    case 6:
      return "u";
      break;
    case 7:
      return "i";
      break;
    case 8:
      return "o";
      break;
    case 9:
      return "p";
      break;
    case 10:
      return "a";
      break;
    case 11:
      return "s";
      break;
    case 12:
      return "d";
      break;
    case 13:
      return "f";
      break;
    case 14:
      return "g";
      break;
    case 15:
      return "h";
      break;
    case 16:
      return "j";
      break;
    case 17:
      return "k";
      break;
    case 18:
      return "l";
      break;
    case 19:
      return "z";
      break;
    case 20:
      return "x";
      break;
    case 21:
      return "c";
      break;
    case 22:
      return "v";
      break;
    case 23:
      return "b";
      break;
    case 24:
      return "n";
      break;
    case 25:
      return "m";
      break;
  }
}

makeImg();
draw();