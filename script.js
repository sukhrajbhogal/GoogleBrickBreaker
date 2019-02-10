//Get the canvas area. Set constants
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ball = new Object(); //Position based on center
var img = new Image();
img.src = "images/bar.png";
ball.radius = 10;
//Ball position
ball.x = canvas.width / 2;
ball.y = canvas.height - 30;
ball.speed = 10;
ball.dx = Math.sin(Math.PI/4)*ball.speed;
ball.dy = -ball.dx;
var paddle = Object(); //Position based on top left corner
paddle.height = 65;
paddle.width = 600;
paddle.x = (canvas.width - paddle.width) / 2;
var rightPressed = false;
var leftPressed = false;
var BRICKROWCOUNT = 26;
var BRICKCOLUMNCOUNT = 1;
var BRICKWIDTH = 43;
var BRICKHEIGHT = 20;
var BRICKPADDING = 10;
var BRICKOFFSETTOP = 50;
var BRICKOFFSETLEFT = 30;
var brickimg = [];
var searchQuery = "Test lmfao";
var searched = false;

//Initialize bricks
var bricks = [];
for (var c = 0; c < BRICKCOLUMNCOUNT; c++) {
    bricks[c] = [];
    for (var r = 0; r < BRICKROWCOUNT; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//Add controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

//Adding collision for bricks
function collisionDetection() {
    for (var c = 0; c < BRICKCOLUMNCOUNT; c++) {
        for (var r = 0; r < BRICKROWCOUNT; r++) {
            var brick = bricks[c][r];
            if (brick.status == 1) {
                if (ball.x > brick.x && ball.x < brick.x + BRICKWIDTH && ball.y > brick.y && ball.y < brick.y + BRICKHEIGHT) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                }
            }
        }
    }
}

function makeImg() {
    for (var i = 1; i < 27; i++) {
        img2 = new Image();
        img_path = "images/brick";
        img_path = img_path.concat(parseInt(i));
        img_path = img_path.concat(".jpg");
        img2.src = img_path;
        console.log(img2);
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
    ctx.drawImage(img, paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.font = "30px Arial";
    // Just using arbitrary numbers for now
    ctx.fillText(searchQuery, paddle.x + 15, canvas.height - (paddle.height / 2) + 8);
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for (var c = 0; c < BRICKCOLUMNCOUNT; c++) {
        for (var r = 0; r < BRICKROWCOUNT; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (r * (BRICKWIDTH + BRICKPADDING)) + BRICKOFFSETLEFT;
                var brickY = (c * (BRICKHEIGHT + BRICKPADDING)) + BRICKOFFSETTOP;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                console.log(brickimg[r]);
                ctx.drawImage(brickimg[r], brickX, brickY, BRICKWIDTH, BRICKHEIGHT); 
                ctx.fill();
                ctx.closePath();
            }
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
    }
    else if (ball.y > canvas.height - ball.radius) {//Check if ball hits the bottom of the screen
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            var xDiff = ball.x-(paddle.x+paddle.width/2); //Difference between ball center and paddle center
            //Scale the ball distance away from the paddle center to an angle between 0 and 89
            //NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
            var angle = ((xDiff) * (89)) / ((paddle.width / 2));
            ball.dx = Math.sin(angle*Math.PI/180)*ball.speed;
            ball.dy = -(Math.cos(angle*Math.PI/180)*ball.speed);
            console.log(ball.dx);
            console.log(ball.dy);
        }
        else {
            window.open("https://www.google.com/search?q=" + searchQuery, "_self");
            searched = true;
        }
    }

    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += 7;
    }
    else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }
    if (!searched) {
        requestAnimationFrame(draw);
    }
}
makeImg();
draw();