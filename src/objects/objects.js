function Objects(constructor){
    this.ctor = constructor
    this.objects = [];
    this.count = 0;
    this.nextID = 0;
};

Objects.prototype = {
    add: function(){
        var args = Array.prototype.slice.call(arguments);
        var obj = new (this.ctor.bind.apply(this.ctor, [null].concat(args)))();
        obj.ID = this.nextID;
        this.objects[this.nextID] = obj;
        this.nextID += 1;
        this.count += 1;
        return obj;
    },
    
    remove: function(obj){
        delete this.objects[obj.ID];
        this.count -= 1;
        if(this.count == 0){
            this.nextID = 0;
        }
    },
    
    clear: function(){
        this.objects = [];
        this.count = 0;
        this.nextID = 0;
    },
    
    update: function(){
        for(var i in this.objects){
            this.objects[i].update();
        }
    },
    
    draw: function(){
        if (offlineProgressOn) return;

        for(var i in this.objects){
            reactor.ctx.save();
            this.objects[i].draw();
            reactor.ctx.restore();
        }
    }
};