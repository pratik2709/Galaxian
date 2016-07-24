var imageRepository = new function(){
    this.background = new Image();
    this.spaceship = new Image();
    this.bullet = new Image();
	var numImages = 3;
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
    this.background.src = "imgs/bg.png";
	this.spaceship.src = "imgs/ship.png";
	this.bullet.src = "imgs/bullet.png";
};

function Drawable(){
    this.init = function(x,y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

}

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
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');

			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0
			return true;
		} else {
			return false;
		}
	};
	// Start the animation loop
	this.start = function() {
		animate();
	};
}

function animate() {
	requestAnimFrame( animate );
	game.background.draw();
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