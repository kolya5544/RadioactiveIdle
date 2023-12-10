function FPS(){
    this.elem = document.getElementById("fps");
};

FPS.prototype = {
    update: function(){
        /*var now = Date.now();
        var time = (now-this.then)/1000;
        this.then = now;
        if(isFinite(time)){
            this.elem.innerHTML = Math.round(10/time);
        }*/
        var now = Date.now(); var nowTicks = tickCount;
        var time = (now-this.then)/1000; var deltaTicks = tickCount - this.thenTickCount;
        this.then = now; this.thenTickCount = nowTicks;
        if(isFinite(time)){
            this.elem.innerHTML = Math.round(deltaTicks / time);
        }
    }
};