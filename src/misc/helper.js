var requestAnimFrame = 
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(f){
        window.setTimeout(f, 1000/60);
    };

CanvasRenderingContext2D.prototype.setLineDash =
    CanvasRenderingContext2D.prototype.setLineDash ||
    function(){};

function distance(obj1, obj2){
    var x = obj1.x-obj2.x;
    var y = obj1.y-obj2.y;
    return Math.sqrt(x*x+y*y);
};

function collided(obj1, obj2){
    var dist = obj1.radius + obj2.radius;
    var x = obj1.x - obj2.x;
    var y = obj1.y - obj2.y;
    if(x > -dist && x < dist && y > -dist && y < dist){
        return x*x+y*y < dist*dist;
    }else{
        return false;
    }
};

function randomInt(a, b){
    return Math.floor(Math.random()*(a-b)+b);
};

prefixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
function stringify(val){
    place = 0;
    while(val>1000){
        val/=1000;
        place += 1
    }
    if(place > prefixes.length - 1){
        place = prefixes.length - 1;
    }
    return Math.floor(val*100)/100+prefixes[place];
};

function logBase(n, base) {
    return Math.log(n) / Math.log(base);
}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

function forHumans ( seconds ) {
    var levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    var returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
        if ( levels[i][0] === 0 ) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
    };
    return returntext.trim();
}