var imageRepository = new function(){
    this.background = new Image();
    this.background.src = "imgs/background.png"
}

function Drawable(){
    this.init = function(x,y){
        this.x = x;
        this.y = y;
    }
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;

    this.draw = function(){

    };

}
