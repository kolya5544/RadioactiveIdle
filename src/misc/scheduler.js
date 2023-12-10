function Scheduler(){
    this.events = [];
};

Scheduler.prototype = {    
    add: function(func, delay){
        this.events.push({
            func:func,
            time:0,
            delay:delay
        });
    },
    
    update: function(){
        for(var i in this.events){
            var event = this.events[i];
            event.time += 1;
            if(event.time >= event.delay){
                event.time = 0;
                event.func();
            }
        }
    }
};