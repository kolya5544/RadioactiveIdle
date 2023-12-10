function Scheduler(){
    this.events = [];
};

Scheduler.prototype = {    
    add: function(func, delay, runOnce = false){
        this.events.push({
            func:func,
            time:0,
            delay:delay,
            runOnce:runOnce
        });
    },
    
    update: function(){
        let toRemove = [];
        for(var i in this.events){
            var event = this.events[i];
            event.time += 1;
            if(event.time >= event.delay){
                event.time = 0;
                event.func();

                if (event.runOnce) toRemove.push(event);
            }
        }
        for (var i in toRemove) {
            this.events = this.events.filter(function (item) { return item.func !== i.func; });
        }
    }
};