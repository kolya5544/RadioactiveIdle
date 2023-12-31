function Ball(){
    this.radius = calc_actual_explosion_size()*2;
    this.x = randomInt(this.radius-reactor.width/2, reactor.width/2-this.radius);
    this.y = randomInt(this.radius-reactor.height/2, reactor.height/2-this.radius);
    this.ang = Math.random()*Math.PI*2;
    this.color = "hsl("+randomInt(0, 360)+",80%,60%)";
};

Ball.prototype = {
    explode: function(group){
        if(typeof group === "undefined"){
            group = [0];
        }
        reactor.balls.remove(this);
        reactor.explodes.add(this, group);
        var pts = calc_energy_output(group[0]) * calc_extremely_funny_2_reward();
        reactor.points.add(reactor.transformed(this), pts);
        stats.add("energy", pts);
        stats.add("explosions", 1);
        stats.add("chain", 1);
        stats.set("chain", group[0]+1);
    },
    
    update: function(){
        this.radius = calc_actual_explosion_size()*2;
        this.x += Math.cos(this.ang)*calc_actual_speed();
        if(this.x - this.radius <= -reactor.width/2){
            this.ang = Math.PI-this.ang;
            this.x = 2*(this.radius - reactor.width/2) - this.x;
        }else if(this.x + this.radius >= reactor.width/2){
            this.ang = Math.PI-this.ang;
            this.x = 2*(reactor.width/2 - this.radius) - this.x;
        }
        this.y += Math.sin(this.ang)*calc_actual_speed();
        if(this.y - this.radius <= -reactor.height/2){
            this.ang = -this.ang;
            this.y = 2*(this.radius - reactor.height/2) - this.y;
        }else if(this.y + this.radius >= reactor.height/2){
            this.ang = -this.ang;
            this.y = 2*(reactor.height/2 - this.radius) - this.y;
        }
    },
    
    draw: function(){
        if (offlineProgressOn) return;
        
        reactor.ctx.fillStyle = this.color;
        reactor.ctx.beginPath();
        reactor.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        reactor.ctx.fill();
    }
};