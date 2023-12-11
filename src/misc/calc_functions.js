function calc_prestige() {
    //return Math.floor(Math.max(Math.log10(Math.max((stats.get("energy") - 10000) / 68500, 0)), 0)); //Math.floor(stats.get("energy")/100)/100;
    let en = stats.getAll("energy")[3];
    let correction = calc_heat_up() * calc_more_hp_reward();
    if (en < (6.95 * Math.pow(10, 5) / correction)) return 0;
    let a = logBase((en + 10_000_000) / 7_130_000, 1.5);
    if (en >= 1.1813 * Math.pow(10, 8)) a = logBase((en - 100_000_000)/7_130_000, 1.14);
    return Math.floor(Math.max(a, 0) * correction + calc_eight_bits_of_heat_reward());
}

function calc_heat_up(current_h = null) {
    if (current_h == null) current_h = upgrades.get("heat_up");
    return current_h+1;
}

function calc_board_size() {
    return Math.max((stats.get("explosions")-stats.get("clicks")+200+calc_reactor_delay_reward()) * 0.85, 173);
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
    return (current_size+5)/10 * calc_bigger_explosion_reward();
}

function calc_upgrade_cost_growth(factor, base, currentPrice, num = 1) {
    return factor*(Math.pow(base,currentPrice)-Math.pow(base,currentPrice+num))/(1-base);
}

function calc_upgrade_cost_max(factor, base, money, currentPrice) {
    return Math.floor(Math.log(Math.pow(base,currentPrice)-money*(1-base)/factor)/Math.log(base) - currentPrice);
}

function calc_actual_multiplier(current_mult = null){
    if (current_mult == null) current_mult = upgrades.get("multiplier");
    let sV = logBase((current_mult * 1.5), 1.9);
    if (current_mult > 5) sV = logBase((current_mult - 5) * 1.9, 1.1) + 4;
    return Math.max(0, sV * calc_no_longer_needed_reward());
}

function calc_additional_balls_reward() {
    return achievements.get("All It Takes Is A Spark") ? 2 : 0;
}

function calc_reactor_delay_reward() {
    return achievements.get("Confined Space") ? -100 : 0;
}

function calc_bigger_explosion_reward() {
    return achievements.get("We Need To Go BIGGER") ? 1.1 : 1;
}

function calc_more_hp_reward() {
    return achievements.get("Speedrun") ? 2 : 1;
}

function calc_get_hours_of_playtime() {
    return Math.floor((parseInt(Date.now()) - this.stats.time_of_beginning)/1000) / 3600;
}

function calc_no_longer_needed_reward() {
    return achievements.get("No Longer Needed") ? 1.1 : 1;
}

function calc_eight_bits_of_heat_reward() {
    return achievements.get("Eight Bits of Heat") ? 0.01 * calc_get_hours_of_playtime() : 0;
}

function calc_enrichment(current_enr = null) {
    if (current_enr == null) current_enr = upgrades.get("enrichment");
    return Math.max(0, logBase((stats.get("heat")+1) * current_enr, 1.2));
}

function calc_energy_output(group = 0) {
    return group*(1+calc_actual_multiplier()+calc_enrichment()+calc_eight_bits_of_heat_reward()*2);
}