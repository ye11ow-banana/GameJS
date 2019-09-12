var para = document.querySelector('p');
var count = 0;

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;//(true / false)
}

function Ball(x, y, velX, velY, exists, color, size) {
	Shape.call(this, x, y, velX, velY, exists);

	this.color = color;
	this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function() {
  ctx.beginPath();//хотим нарисовать фигуру на бумаге
  ctx.fillStyle = this.color;//определяем какой цвет нам нужен 
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);//№1 параметр - это центр шара, №2 - это радиус, №3 - не понятно, №4 - дает нам полный круг (360 градусов) 
  ctx.fill();//мы используем метод fill(), который утверждает: «Закончите рисование пути, начатого с beginPath(), и заполните область, которую он занимает с цветом, указанным ранее в fillStyle».
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) { 
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
};

function EvilCircle(x, y, exists){
	Shape.call(this, x, y, 20, 20, exists);

	this.color = 'white';
	this.size = 10;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath();//хотим нарисовать фигуру на бумаге
  ctx.strokeStyle = this.color;//определяем какой цвет нам нужен 
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);//№1 параметр - это центр шара, №2 - это радиус, №3 - не понятно, №4 - дает нам полный круг (360 градусов) 
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
  	this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
  	this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
  	this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
  	this.y += this.size;
  }
};

EvilCircle.prototype.setControls = function() {
	var _this = this;
	window.onkeydown = function(e) {
	    if (e.keyCode === 65) {
	      _this.x -= _this.velX;
	    } else if (e.keyCode === 68) {
	      _this.x += _this.velX;
	    } else if (e.keyCode === 87) {
	      _this.y -= _this.velY;
	    } else if (e.keyCode === 83) {
	      _this.y += _this.velY;
	    }
	};
};

EvilCircle.prototype.collisionDetect = function() {
 for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = 'Ball count: ' + count;
      }
    }
  }
};

var balls = [];

while (balls.length < 25) {
	var size = random(10, 20); 
  	var ball = new Ball(
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

var evil = new EvilCircle(random(0,width), random(0,height), true);
evil.setControls();

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);//четыре параметра обеспечивают начальную координату, а ширину и высоту для рисованного прямоугольника

  for (var i = 0; i < balls.length; i++) {
  	if (balls[i].exists){
    	balls[i].draw();
    	balls[i].update();
    	balls[i].collisionDetect();
    }
  }

  evil.draw();
  evil.checkBounds();
  evil.setControls();
  evil.collisionDetect();

  requestAnimationFrame(loop);
}

loop();