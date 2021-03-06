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

	this.clear = function() {
		objects = [];
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].clear();
		}
		this.nodes = [];
	};

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

    this.findObjects = function (returnedObjects, obj) {
        if(typeof obj === "undefined"){
            return;
        }
        var index = this.getIndex(obj);
        if(index != -1 && this.nodes.length){
            this.nodes[index].findObjects(returnedObjects, obj);
        }
        for(var i = 0, len = objects.length; i < len; i++){
            returnedObjects.push(objects[i]);
        }
    };

    this.insert = function(obj){
        if(typeof obj === "undefined"){
            return;
        }
        if(obj instanceof Array){
            for(var i = 0, len=obj.length; i < len; i++){
                this.insert(obj[i]);
            }
            return;
        }
        if(this.nodes.length){
            var index = this.getIndex(obj);
            if(index != -1){
                this.nodes[index].insert(obj);
                return;
            }
        }
        objects.push(obj);
        // where is level getting updated
        if(objects.length > maxObjects && level < maxLevels){
            if(this.nodes[0] == null){
                this.split();
            }
            var i = 0;
            while(i < objects.length){
                var index = this.getIndex(objects[i]);
                if(index != -1){
                    this.nodes[index].insert(objects.splice(i,1)[0]);
                }
                else{
                    i++;
                }

            }
        }


    };

    this.getIndex = function(obj){
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
        this.nodes[3] = new Quadtree({
            x: this.bounds.x + subwidth,
            y: this.bounds.y + subheight,
            width: subwidth,
            height: subheight
        }, level+1);
        this.nodes[2] = new Quadtree({
            x: this.bounds.x,
            y: this.bounds.y + subheight,
            width: subwidth,
            height: subheight
        }, level+1);
        this.nodes[1] = new Quadtree({
            x: this.bounds.x,
            y: this.bounds.y,
            width: subwidth,
            height: subheight
        }, level+1);
    }



}