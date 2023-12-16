function Explosion(ball, group = null){
    this.x = ball.x;
    this.y = ball.y;
    this.color = ball.color;
    this.radius = ball.radius;
    this.dr = calc_actual_explosion_size();
    this.inner = 0;
    this.timeLeft = calc_actual_explosion_time();
    this.group = group == null ? ball.group : group;
    this.group[0]+=1;
};

Explosion.prototype = {
    update: function(){
        this.radius += this.dr;
        this.dr /= 1.1;
        this.timeLeft -= 1;
        if(this.timeLeft <= 0){
            this.inner += (this.radius+5*this.inner)/50 * calc_tickrate();
            if(this.inner >= this.radius){
                reactor.explodes.remove(this);
            }
        }
        for(var i in reactor.balls.objects){
            var ball = reactor.balls.objects[i];
            if(collided(this, ball)){
                ball.explode(this.group);
            }
        }
    },
    
    draw: function(){
        if (offlineProgressOn) return;

        reactor.ctx.strokeStyle = this.color;
        reactor.ctx.lineWidth = (this.radius-this.inner);
        reactor.ctx.beginPath();
        reactor.ctx.arc(this.x, this.y, (this.radius+this.inner)/2, 0, Math.PI*2);
        reactor.ctx.stroke();
    }
};