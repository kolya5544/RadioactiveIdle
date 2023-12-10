function Point(pos, pts){
    reactor.ctx.font = "14px Arial";
    this.text = "+"+stringify(pts);
    this.x = pos.x - reactor.ctx.measureText(this.text).width/2;
    this.y = pos.y+5;
    this.time = 50;
};

Point.prototype = {
    update: function(){
        this.y -= .2;
        this.x += this.time%25<12? .2: -.2
        this.time -= 1;
        if(this.time <= 0){
            reactor.points.remove(this);
        }
    },
    
    draw: function(){
        reactor.ctx.font = "14px Arial";
        reactor.ctx.fillStyle = "rgba(0,0,0,"+this.time/25+")";
        reactor.ctx.beginPath();
        reactor.ctx.fillText(this.text, this.x, this.y);
    }
};