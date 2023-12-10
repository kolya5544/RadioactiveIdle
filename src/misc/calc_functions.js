function calc_prestige() {
    //return Math.floor(Math.max(Math.log10(Math.max((stats.get("energy") - 10000) / 68500, 0)), 0)); //Math.floor(stats.get("energy")/100)/100;
    return Math.floor(Math.max(logBase((stats.getAll("energy")[3] + 10000000) / 7130000, 1.5), 0));
}

function calc_board_size() {
    return (stats.get("explodes")-stats.get("clicks")+200) * 0.85;
}

function calc_actual_speed(current_speed = null) {
    if (current_speed == null) current_speed = upgrades.get("speed");
    return ((current_speed+5)/15);
}

function calc_actual_explosion_time(current_expl = null) {
    if (current_expl == null) current_expl = upgrades.get("time");
    return (current_expl+5)*12;
}

function calc_actual_explosion_size(current_size = null) {
    if (current_size == null) current_size = upgrades.get("size");
    return (current_size+5)/10;
}