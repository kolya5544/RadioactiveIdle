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
        //console.log(`${time} - ${this.getNonDeployedCount()} - ${this.explodes.count} - ${(1+this.explodes.count)/this.getNonDeployedCount()}`);
        if(isFinite(time)){
            this.delay += 1;
            if(this.delay > time){
                let vX = this.getTotalCount();
                let dp = Math.floor(vX / Math.sqrt(vX));

                if (this.explodes.count > 10 && vX > 10 && dp > 0) {
                    for (let i = 0; i < dp; i++) {
                        this.balls.add();
                    }
                } else {
                    this.balls.add();
                }
            }
        }else{
            this.delay = 0;
        }
        
        this.width = (this.canvas.width*calc_board_size())/1000;
        this.height = (this.canvas.height*calc_board_size())/1000;
    },
    
    draw: function(){
        if (offlineProgressOn) {
            if (tickCount % 300 != 0 && (!rapidOfflineProgress || tickCount % 123 < 110)) return;
            this.ctx.clearRect(0, 0, reactor.canvas.width, reactor.canvas.height);
            this.ctx.font = "48px serif";
            this.ctx.setTransform(this.canvas.width/this.width, 0,
            0,this.canvas.height/this.height,
            this.canvas.width/2, this.canvas.height/2);

            this.explodes.draw();

            this.ctx.setTransform(1,0,0,1,0,0);

            this.ctx.globalAlpha = 0.2;
            this.ctx.fillRect(0, 0, reactor.canvas.width, reactor.canvas.height);
            this.ctx.globalAlpha = 1.0;
            this.ctx.fillText("Calculating offline progress...", this.canvas.width/2 - this.canvas.width/3.5, this.canvas.height/2);
            this.ctx.fillText(`${offlineProgressTicksLeft} ticks left`, this.canvas.width/2 - this.canvas.width/4 + this.canvas.width/16, this.canvas.height/2+this.canvas.height/12);
            if (!rapidOfflineProgress) this.ctx.fillText(`Press T to toggle fast forward (less accurate)`, this.canvas.width/13, this.canvas.height/2+this.canvas.height/6);
            this.ctx.font = '10px sans-serif';
            return;
        }

        this.ctx.clearRect(0, 0, reactor.canvas.width, reactor.canvas.height);

        this.mouse.draw();
        this.ctx.setTransform(this.canvas.width/this.width, 0,
            0,this.canvas.height/this.height,
            this.canvas.width/2, this.canvas.height/2);
        this.balls.draw();
        this.explodes.draw();
        this.ctx.setTransform(1,0,0,1,0,0);

        if (upgrades.get("meltdown") > 0) { // meltdown! draw very cool graphics
            this.ctx.font = "48px Courier New";
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(0, 0, reactor.canvas.width, reactor.canvas.height);
            this.ctx.globalAlpha = 0.5;
            this.ctx.fillText("Meltdown in process!", this.canvas.width/2 - this.canvas.width/4, this.canvas.height/2);
            this.ctx.font = "24px Courier New";
            this.ctx.fillText(`You generate ~${stringify(calc_meltdown_output())} Energy per second`, this.canvas.width/2 - this.canvas.width/4.2, this.canvas.height/2+this.canvas.height/30);
            this.ctx.globalAlpha = 1.0;
            this.ctx.font = '10px sans-serif';
            this.ctx.fillStyle = "black";
        }

        this.points.draw();
    },
    
    transformed: function(point) {
        return {
            x: point.x * this.canvas.width/this.width + this.canvas.width/2,
            y: point.y * this.canvas.height/this.height + this.canvas.height/2
        }
    },

    getTotalCount: function() {
        if (firstLaunch) return 1-this.balls.count-this.explodes.count;
        return upgrades.get("balls")+10-this.balls.count-this.explodes.count+calc_additional_balls_reward();
    },
    
    spawnDelay: function(){
        var count = this.getTotalCount();

        let multiplier = 10;
        if (calc_faster_explosions() != 0) multiplier = 5;

        return multiplier*(1+this.explodes.count)/count/calc_tickrate();
    },
    
    reset: function(){
        this.balls.clear();
        this.explodes.clear();
        this.points.clear();
    }
};