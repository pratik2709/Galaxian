function Quadtree(boundBox, lvl){
    var maxObjects = 10;
    this.bounds = boundBox || {
        x:0,
        y:0,
        width:0,
        height:0
    };
    var objects = [];
    this.nodes = [];
    var level = lvl || 0;
    var maxLevels = 5;

    //return all objects from last to first (backwards)
    //pass in an empty array in the beginning
    //somewhat understood
    this.getAllObjects = function(returnedObjects){
        for(var i = 0; i < this.nodes.length; i++){
            this.nodes[i].getAllObjects(returnedObjects);
        }
        for(var i = 0, len = objects.length; i < len; i++){
            returnedObjects.push(objects[i]);
        }
        return returnedObjects;
    };

    this.getIndex = function(){
        var index = -1;
        var verticalMidpoint = this.bounds.x + this.bounds.width/2;
        var horizontalMidpoint = this.bounds.y + this.bounds.height/2;

        var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
        var bottomQuadrant = (obj.y > horizontalMidpoint);
		if (obj.x < verticalMidpoint &&
				obj.x + obj.width < verticalMidpoint) {
			if (topQuadrant) {
				index = 1;
			}
			else if (bottomQuadrant) {
				index = 2;
			}
		}
		// Object can fix completely within the right quandrants
		else if (obj.x > verticalMidpoint) {
			if (topQuadrant) {
				index = 0;
			}
			else if (bottomQuadrant) {
				index = 3;
			}
		}
		return index;

    };

    this.split = function(){
        var subwidth = (this.bounds.width/2) | 0;
        var subheight = (this.bounds.height/2) | 0;

        //unclear about the level
        this.nodes[0] = new Quadtree({
            x: this.bounds.x + subwidth,
            y: this.bounds.y,
            width: subwidth,
            height: subheight
        }, level+1);
        this.nodes[1] = new Quadtree({
            x: this.bounds.x + subwidth,
            y: this.bounds.y,
            width: subwidth,
            height: subheight
        }, level+1);
        this.nodes[2] = new Quadtree({
            x: this.bounds.x + subwidth,
            y: this.bounds.y,
            width: subwidth,
            height: subheight
        }, level+1);
        this.nodes[3] = new Quadtree({
            x: this.bounds.x + subwidth,
            y: this.bounds.y,
            width: subwidth,
            height: subheight
        }, level+1);
    }



}