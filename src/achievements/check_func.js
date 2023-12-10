function check_new_beginnings() {
    return stats.get("energy") > 0;
}

function check_chain_reaction() {
    return stats.getAll("chain")[0] > 2000;
}

function check_reactor_incremental() {
    return stats.get("heat") > 0;
}