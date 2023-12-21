var tickCount = 0;
var tickSynced = true;

var offlineProgressOn = false;
var offlineProgressTicksLeft = 0;
var rapidOfflineProgress = false;

var interval = 16.666666; // ms
var expected = Date.now() + interval;

function start() {
    expected = Date.now() + interval;
    setTimeout(step, interval);
}

function step(depth = 0) {
    var dn = Date.now();
    var dt = dn - expected; // the drift (positive for overshooting)
    if (dt > interval) {
        if (tickSynced) console.log(`delta time exceeded interval by ${Math.round(dt - interval)}ms! re-calculating the missing ~${Math.round(dt / interval)} ticks.`);
        tickSynced = false;
    } else {
        tickSynced = true;
    }

    if (dt > 10000) {
        // woo! it's not good!
        offlineProgressTicksLeft = Math.round(dt / interval / (rapidOfflineProgress ? 10 : 1));
        if (!offlineProgressOn) console.log(`major desync! offline progress for ${offlineProgressTicksLeft} ticks`);

        offlineProgressOn = true;
    } else {
        offlineProgressOn = false;
    }
    // do what is to be done
    tickCount += 1 * (rapidOfflineProgress && offlineProgressOn ? 10 : 1);
    update(!offlineProgressOn);

    if (offlineProgressOn && rapidOfflineProgress) { expected += interval * 10; } else {
        expected += interval;
    }
    newStep = Math.max(0, interval - dt);
    if (newStep == 0 && depth < 33) { step(depth + 1); return; }
    setTimeout(step, newStep); // take into account drift
}