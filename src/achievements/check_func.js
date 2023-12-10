function check_new_beginnings() {
    return stats.get("energy") > 0;
}

function check_chain_reaction() {
    return stats.getAll("chain")[0] > 2000;
}

function check_reactor_incremental() {
    return stats.get("heat") > 0;
}

function check_all_it_takes_is_a_spark() {
    return upgrades.get("multiplier") >= 5;
}

function check_confined_space() {
    return stats.getAll("explosions")[1] >= 50000;
}

function check_nine_circles_of_hell() {
    return stats.getAll("sacrifices")[1] >= 9;
}

function check_cookie_clicker() {
    return stats.getAll("clicks")[1] >= 1000;
}