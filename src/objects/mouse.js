function Mouse(canvas){
    this.onCanvas = false;
    canvas.addEventListener("mousedown", this.click.bind(this));
    //canvas.addEventListener("touchstart", this.click.bind(this), false);
    //canvas.addEventListener("touchend", function(e) {e.preventDefault();}, false);
    canvas.addEventListener("mousemove", this.move.bind(this));
    canvas.addEventListener("mouseout", this.move.bind(this));
};

Mouse.prototype = {
    nearest: function(){
        var minDist = 75 + upgrades.get("speed");
        var minBall;
        for(var i in reactor.balls.objects){
            var ball = reactor.balls.objects[i];
            var dist = distance(this, reactor.transformed(ball));
            if(dist < minDist){
                minDist = dist;
                minBall = ball;
            }
        }
        return minBall;
    },
    
    click: function(event){
        this.move(event);
        var ball = this.nearest();
        if(typeof ball !== "undefined"){
            ball.explode();
            stats.add("clicks", 1);
        }
        event.preventDefault();
    },
    
    move: function(event){
        var rect = reactor.canvas.getBoundingClientRect();
        this.x = event.clientX - rect.left;
        this.y = event.clientY - rect.top;
        this.onCanvas = !(this.x<=0 || this.x>=reactor.canvas.width || this.y<=0 || this.y>=reactor.canvas.height);
    },
    
    draw: function(){
        if (offlineProgressOn) return;

        if(this.onCanvas){
            var ball = this.nearest();
            if(typeof ball !== "undefined"){
                pos = reactor.transformed(ball);
                reactor.ctx.save();
                reactor.ctx.setLineDash([3, 5]);
                reactor.ctx.beginPath();
                reactor.ctx.moveTo(pos.x, pos.y);
                reactor.ctx.lineTo(this.x, this.y);
                reactor.ctx.stroke();
                reactor.ctx.restore();
            }
        }
    }
};