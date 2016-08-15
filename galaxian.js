var imageRepository = new function(){
    this.background = new Image();
    this.spaceship = new Image();
    this.bullet = new Image();
	this.enemy = new Image();
	this.enemyBullet = new Image();    
	var numImages = 5;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	};
	this.spaceship.onload = function() {
		imageLoaded();
	};
	this.bullet.onload = function() {
		imageLoaded();
	};
	this.enemy.onload = function() {
		imageLoaded();
	}
	this.enemyBullet.onload = function() {
		imageLoaded();
	}	
    this.background.src = "imgs/bg.png";
	this.spaceship.src = "imgs/ship.png";
	this.bullet.src = "imgs/bullet.png";
	this.enemy.src = "imgs/enemy.png";
	this.enemyBullet.src = "imgs/bullet_enemy.png";	
};

function Drawable(){
    this.init = function(x,y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.collidableWith = "";
    this.isColliding = false;
    this.type = "";

    this.draw = function(){
    };
    this.move = function(){
    };

    this.isCollidableWith = function(objects){
        return (this.collidableWith === this.type);
    };

}

function Pool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];

	this.init = function(object) {

		if(object === "bullet"){
			for (var i = 0; i < size; i++) {
				// Initalize the bullet object
				var bullet = new Bullet("bullet");
				bullet.init(0,0, imageRepository.bullet.width,
				            imageRepository.bullet.height);
				pool[i] = bullet;
			}			
		}
		else if (object == "enemy") {
			for (var i = 0; i < size; i++) {
				var enemy = new Enemy();
				enemy.init(0,0, imageRepository.enemy.width, imageRepository.enemy.height);
				pool[i] = enemy;
			}
		}
		else if (object == "enemyBullet") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("enemyBullet");
				bullet.init(0,0, imageRepository.enemyBullet.width, imageRepository.enemyBullet.height);
				pool[i] = bullet;
			}
		}		

	};

	this.get = function(x,y,speed){
		if(!pool[size - 1].in_use){
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}

	};

	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].in_use &&
		   !pool[size - 2].in_use) {
				this.get(x1, y1, speed1);
				this.get(x2, y2, speed2);
			 }
	};

	this.animate = function(){
		for(var i = 0; i < size; i++){
			if(pool[i].in_use){
				if(pool[i].draw()){
					pool[i].clear(); //no idea
					pool.push((pool.splice(i,1))[0]); //verify
				}
			}
			else{
				break;
			}
		}
	}	
}



function Bullet(object){
	this.in_use = false;
	var self = object;

	this.spawn = function(x, y, speed){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.in_use = true;

	};

	this.draw = function(){
		this.context.clearRect(this.x-1, this.y-1, this.width+1, this.height+1); //to avoid the blur ?
		this.y -= this.speed; 



		if(self === "bullet" && this.y + this.height <= 0){
			return true;
		}
		else if(self === "enemyBullet" && this.y >= this.canvasHeight){
			return true;
		}		
		else{
			if(self === "bullet"){
				this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}
			else if(self === "enemyBullet"){
				this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
			}
			return false;
		}

	};

	this.clear = function(){
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.in_use = false;
        this.isColliding = false;
	};

}

Bullet.prototype = new Drawable();

function Ship(){
	this.speed = 3;
	this.bulletPool = new Pool(30);
	this.bulletPool.init("bullet");

	var fireRate = 15; //why
	var counter = 0;

    this.collidableWith = "enemyBullet";
    this.type = "ship";

	this.draw = function(){
		this.context.drawImage(imageRepository.spaceship, this.x,this.y);
	};

	this.move = function(){
		counter++;
		if(KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.up || KEY_STATUS.down){
			this.context.clearRect(this.x, this.y, this.width, this.height);

			if(KEY_STATUS.left){
				this.x -= this.speed;
				if(this.x <= 0){
					this.x = 0;
				}
			}
			else if(KEY_STATUS.right){
				this.x += this.speed;
				if(this.x + this.width >= this.canvasWidth){
					this.x = this.canvasWidth - this.width;
				}
			}
			else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/4*3)
					this.y = this.canvasHeight/4*3;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}		

            if(!this.isColliding){
                this.draw();
            }

		}

		if(KEY_STATUS.space && counter >= fireRate){
			this.fire();
			counter = 0;
		}


	};

	this.fire = function(){
		this.bulletPool.getTwo(this.x+6, this.y, 3,
		                       this.x+33, this.y, 3); //change values and test
	};
}

Ship.prototype = new Drawable();

function Enemy(){
	var percentFire = .01;
	var chance = 0;
	this.in_use = false;

    this.collidableWith = "bullet";
    this.type = "enemy";

	this.spawn = function(x, y, speed){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.in_use = true;

		this.speedX = 0;
		this.speedY = speed; //why // because intially the enemy ship moves down

		this.leftEdge = this.x - 90; //why //each enemy ship can move 90 to the left
		this.rightEdge = this.x + 90;// why //each enemy ship can move 90 to the right
		this.bottomEdge = this.y + 140;//why //change values and test

	};

	this.draw = function(){
		this.context.clearRect(this.x-1, this.y, this.width + 1, this.height);
		this.x += this.speedX; //why //simple addition of speed
		this.y += this.speedY; //why

		if(this.x <= this.leftEdge){
			//you have crossed the left edge limit //add therefore go in the rightmost direction
			this.speedX = this.speed;
		}
		else if(this.x >= this.rightEdge + this.width){
			//you have crossed the right edge limit// also you want to include the width //go in the leftmost direction
			this.speedX -= this.speed;
		}
		else if(this.y >= this.bottomEdge){
			this.speedY = 0;
			this.speed = 1.5; //why not directly speedx
			this.y -= 5; //why
			this.speedX = -this.speed; // go left first
		}
        if(!this.isColliding){
            this.context.drawImage(imageRepository.enemy, this.x, this.y);
            //verify formula
            chance = Math.floor(Math.random()*101);
            if (chance/100 < percentFire) {
                this.fire();
            }
            return false;
        }
        else{
            return true;
        }

	};

	//why
	this.fire = function() {
		game.enemyBulletPool.get(this.x+this.width/2, this.y+this.height, -2.5); // minus because it will incresase y value.. just the way it is
	}	;

	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.in_use = false;
        this.isColliding = false;
	};	

}

Enemy.prototype = new Drawable();


function Background(){
    this.speed = 1;
    this.draw = function() {
        this.y += this.speed;
        this.context.drawImage(imageRepository.background, this.x, this.y);
        this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

        if (this.y >= this.canvasHeight) {
            this.y = 0;
        }

    };
}

Background.prototype = new Drawable();


function Game() {

	this.init = function() {
		this.bgCanvas = document.getElementById('background');
		this.shipCanvas = document.getElementById('ship');
		this.mainCanvas = document.getElementById('main');

		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Ship.prototype.context = this.shipContext;
			Ship.prototype.canvasWidth = this.shipCanvas.width;
			Ship.prototype.canvasHeight = this.shipCanvas.height;

			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;

			Enemy.prototype.context = this.mainContext;
			Enemy.prototype.canvasWidth = this.mainCanvas.width;
			Enemy.prototype.canvasHeight = this.mainCanvas.height;				


			this.background = new Background();
			this.background.init(0,0); 
			this.ship = new Ship();
			var shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
			var shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height*2;
			this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);

			this.enemyPool = new Pool(30);
			this.enemyPool.init("enemy");
			//intialize the enemy
			var height = imageRepository.enemy.height;
			var width = imageRepository.enemy.width;
			var x = 100;
			var y = -height;
			var spacer = y*1.5;
			for(var i = 1; i <= 18; i++){
				this.enemyPool.get(x,y,2);
				x += width +25;
				if(i % 6 == 0){
					x = 100;
					y += spacer;
				}
			}
			this.enemyBulletPool = new Pool(50);
			this.enemyBulletPool.init("enemyBullet");			

			return true;
		} else {
			return false;
		}
	};
	// Start the animation loop
	this.start = function() {
		this.ship.draw(); //why?? // intial position
		animate();
	};
}

function animate() {
	requestAnimFrame( animate );
	game.background.draw();
	game.ship.move();
	game.ship.bulletPool.animate();
	game.enemyPool.animate();
	game.enemyBulletPool.animate();
}

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

var game = new Game();
function init() {
	if(game.init())
		game.start();
}

// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}
// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}