function Reactor(){
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    
    this.width = (this.canvas.width*calc_board_size())/1000;
    this.height = (this.canvas.height*calc_board_size())/1000;
    
    this.balls = new Objects(Ball);
    this.explodes = new Objects(Explosion);
    this.points = new Objects(Point);
    
    this.mouse = new Mouse(this.canvas);
    
    this.delay = 0;
};

Reactor.prototype = {
    update: function(){
        this.balls.update();
        this.explodes.update();
        this.points.update();
        
        var time = this.spawnDelay();
        if(isFinite(time)){
            this.delay += 1;
            if(this.delay > time){
                this.balls.add();
            }
        }else{
            this.delay = 0;
        }
        
        this.width = (this.canvas.width*calc_board_size())/1000;
        this.height = (this.canvas.height*calc_board_size())/1000;

        this.ctx.font = "48px serif";
    },
    
    draw: function(){
        this.ctx.clearRect(0, 0, reactor.canvas.width, reactor.canvas.height);
        
        if (offlineProgressOn) {
            this.ctx.setTransform(this.canvas.width/this.width, 0,
            0,this.canvas.height/this.height,
            this.canvas.width/2, this.canvas.height/2);

            this.explodes.draw();

            this.ctx.setTransform(1,0,0,1,0,0);

            this.ctx.globalAlpha = 0.2;
            this.ctx.fillRect(0, 0, reactor.canvas.width, reactor.canvas.height);
            this.ctx.globalAlpha = 1.0;
            this.ctx.fillText("Calculating offline progress...", this.canvas.width/2 - this.canvas.width/4, this.canvas.height/2);
            this.ctx.fillText(`${offlineProgressTicksLeft} ticks left`, this.canvas.width/2 - this.canvas.width/4 + this.canvas.width/8, this.canvas.height/2+this.canvas.height/12);
            return;
        }

        this.mouse.draw();
        this.ctx.setTransform(this.canvas.width/this.width, 0,
            0,this.canvas.height/this.height,
            this.canvas.width/2, this.canvas.height/2);
        this.balls.draw();
        this.explodes.draw();
        this.ctx.setTransform(1,0,0,1,0,0);
        this.points.draw();
    },
    
    transformed: function(point) {
        return {
            x: point.x * this.canvas.width/this.width + this.canvas.width/2,
            y: point.y * this.canvas.height/this.height + this.canvas.height/2
        }
    },
    
    spawnDelay: function(){
        var count = upgrades.get("balls")+10-this.balls.count-this.explodes.count+calc_additional_balls_reward();
        return 10*(1+this.explodes.count)/count;
    },
    
    reset: function(){
        this.balls.clear();
        this.explodes.clear();
        this.points.clear();
    }
};