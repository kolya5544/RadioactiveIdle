function Screens(){
    this.tabElem = document.getElementById("tabs");
    this.scroll = document.getElementById("scroll");
    this.screens = {};
    this.numScreens = 0;
};

Screens.prototype = {
    addScreen: function(name, obj, displayName){
        let scr = new Screen(name, this.numScreens, obj, displayName);
        this.screens[name] = scr;
        addTab(this.tabElem, name, displayName);
        scr.tab = document.getElementById(name+"Tab");
        scr.tab.addEventListener("click", scr.click.bind(scr));
        this.numScreens += 1;
        if(typeof this.current === "undefined"){
            this.current = scr;
            scr.click();
        }
    },
    
    hasNew: function(name){
        if(this.current != this.screens[name]){
            this.screens[name].setNew();
        }
    },
    
    show: function(screen){
        this.current.unclick();
        this.scroll.style.left = (-screen.index*1001)+"px";
        this.current = screen;
    },
    
    update: function(){
        for(var i in this.screens){
            this.screens[i].obj.update();
        }
    },
    
    draw: function(){
        this.current.obj.draw();
    }
};

function Screen(name, index, obj){
    this.index = index;
    this.obj = obj;
    this.displayName = "Screen";
};

Screen.prototype = {
    setNew: function(){
        this.tab.className = "button new"
    },
    
    click: function(){
        screens.show(this);
        this.tab.className = "button pressed"
    },
    
    unclick: function(){
        this.tab.className = "button active"
    }
};