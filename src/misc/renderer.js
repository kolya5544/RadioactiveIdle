function addTab(tabContainer, name, displayName) {
    var iSpan = document.createElement('span');
    iSpan.id = `${name}Tab`;
    iSpan.className = "button active";
    iSpan.innerText = displayName;

    tabContainer.appendChild(iSpan);
}

function renderReactor() {
    // <canvas id="canvas" width="1000" height="750"></canvas>
    let reactorCont = document.getElementById("reactor");

    let iCanvas = document.createElement("canvas");
    iCanvas.id = "canvas";
    iCanvas.width = 1000;
    iCanvas.height = 750;

    reactorCont.appendChild(iCanvas);
}

function renderUpgrade(name, displayName, upgradeCont = null, additionalClassContainer = "", description = null, upgr_instance = null) {
    if (upgradeCont == null) upgradeCont = document.getElementById("upgradeContainer");

    let iDiv = document.createElement("div");
    iDiv.className = "upgrade-item";
    if (additionalClassContainer.length > 0) iDiv.classList.add(additionalClassContainer);
    iDiv.id = name;

    let iSpan = document.createElement("span");
    iSpan.className = "nameText lowMargin";
    iSpan.innerText = `${displayName}: `;
    iDiv.appendChild(iSpan);

    iSpan = document.createElement("span");
    iSpan.className = "res";
    iSpan.innerText = `0`;
    iDiv.appendChild(iSpan);

    iSpan = document.createElement("span");
    iSpan.className = "group";
    let iBtn = document.createElement("span"); iBtn.className = "button"; iBtn.innerText = "1";
    iSpan.appendChild(iBtn);
    iBtn = document.createElement("span"); iBtn.className = "button"; iBtn.innerText = "10";
    iSpan.appendChild(iBtn);
    iBtn = document.createElement("span"); iBtn.className = "button"; iBtn.innerText = "max";
    iSpan.appendChild(iBtn);

    iDiv.appendChild(iSpan);

    iSpan = document.createElement("span");
    iSpan.innerText = ` cost: `;
    iDiv.appendChild(iSpan);

    iSpan = document.createElement("span");
    iSpan.innerText = `0`;
    iDiv.appendChild(iSpan);

    let iP = document.createElement("p");
    iP.className = "lowMargin subtext";
    iP.innerText = "(1 → 1.1)";
    iDiv.appendChild(iP);

    if (description) {
        iP = document.createElement("p");
        iP.className = "lowMargin subtext";
        iP.innerText = description;
        iDiv.appendChild(iP);
    }

    if (upgr_instance != null) {
        if (upgr_instance.currency_requirement != null) {
            if (stats.get(upgr_instance.currency) < upgr_instance.currency_requirement) iDiv.style.display = "none";
        }
    }

    upgradeCont.appendChild(iDiv);

    return iDiv;
}

function renderHeatUpgrade(upgrade) {
    let heatCont = document.getElementById("prestigeContainer");
    return renderUpgrade(upgrade.res, upgrade.displayName, heatCont, "heatUpgradeContainer", upgrade.description, upgrade);
}

function renderMatterUpgrade(upgrade) {
    let matterCont = document.getElementById("matterContainer");
    if (stats.getAll("matter")[1] <= 0) matterCont.style.visibility = "hidden";
    return renderUpgrade(upgrade.res, upgrade.displayName, matterCont, "matterUpgradeContainer", upgrade.description, upgrade);
}

function renderStats() {
    let statsCont = document.getElementById("statsContainer");

    var keys = Object.keys(stats.stats);
    keys.forEach(key => {
        let iTr = document.createElement("tr");

        let iTd = document.createElement("td");
        iTd.innerText = `Max ${toTitleCase(key)}: `;
        iTr.appendChild(iTd);
        iTd = document.createElement("td");
        iTd.innerText = `0`;
        iTd.id = `${key}Max`;
        iTr.appendChild(iTd);

        statsCont.appendChild(iTr);

        iTr = document.createElement("tr");

        iTd = document.createElement("td");
        iTd.innerText = `Total ${toTitleCase(key)}: `;
        iTr.appendChild(iTd);
        iTd = document.createElement("td");
        iTd.innerText = `0`;
        iTd.id = `${key}Total`;
        iTr.appendChild(iTd);

        statsCont.appendChild(iTr);

        if (key != "energy") { // ignore
            iTr = document.createElement("tr");

            iTd = document.createElement("td");
            iTd.innerText = `Current ${toTitleCase(key)}: `;
            iTr.appendChild(iTd);
            iTd = document.createElement("td");
            iTd.innerText = `0`;
            iTd.id = `${key}`;
            iTr.appendChild(iTd);

            statsCont.appendChild(iTr);
        }

        stats.stats[key].elems = [document.getElementById(key),
            null,
            document.getElementById(key+"Max"),
            null,
            null,
            document.getElementById(key+"Total")
        ];
    });

    // render playtime stat
    let iTr = document.createElement("tr");

    let iTd = document.createElement("td");
    iTd.innerText = `Total Playtime: `;
    iTr.appendChild(iTd);
    iTd = document.createElement("td");
    iTd.innerText = `0`;
    iTd.id = `playtimeTotal`;
    iTr.appendChild(iTd);

    statsCont.appendChild(iTr);
}

function renderPrestige() {
    let prestigeCont = document.getElementById("prestigeContainer");

    if (!isSacrificeUnlocked()) {
        prestigeCont.style.visibility = "hidden";
    }

    let iP = document.createElement("p");
    iP.id = "matterCount";
    iP.className = "lowMargin matterPointsColorText";
    iP.innerHTML = "You have <span id=\"matterZ\">0</span> Matter Units";
    if (stats.getAll("matter")[2] < 1) iP.style.display = "none";

    prestigeCont.prepend(iP);

    // <p id="heatCount" class="lowMargin"></p>
    iP = document.createElement("p");
    iP.id = "heatCount";
    iP.className = "lowMargin heatPointsColorText";
    iP.innerHTML = "You have <span id=\"heatZ\">0</span> Heat Points";
    if (stats.getAll("heat")[2] < 1) iP.style.display = "none";

    prestigeCont.prepend(iP);

    iP = document.createElement("p");
    iP.id = "energyCount";
    iP.className = "lowMargin energyColorText";
    iP.innerHTML = "You have <span id=\"energyDisplay\">0</span> Energy";
    if (stats.getAll("energy")[2] < 1) iP.style.display = "none";

    prestigeCont.prepend(iP);

    //prestigeCont.appendChild(iP);
    

    // <p class="lowMargin"><span id="prestige" class="button active">Sacrifice</span> all upgrades and reset board size to gain <span id="heatup">0</span> Heat Points.</p>
    iP = document.createElement("p");
    iP.className = "medium_margin_top heatPrestige";
    //iP.className = "no_upper_margin";

    let iSpan = document.createElement("span");
    iSpan.id = "prestige";
    iSpan.className = "button active";
    iSpan.innerText = "Sacrifice";

    iP.appendChild(iSpan);
    iP.appendChild(document.createTextNode(" normal upgrades and reset board size to gain "));

    iSpan = document.createElement("span");
    iSpan.id = "heatup";
    iSpan.innerText = "0";

    iP.appendChild(iSpan);
    iP.appendChild(document.createTextNode(" Heat Point(s)."))

    prestigeCont.appendChild(iP);

    // <p class="medium_margin_top"><span id="prestige" class="button active">Destroy the reactor</span> to reset Heat Points, Heat Upgrades, normal upgrades and reactor size to get <span id="heatup">1</span> Matter Unit(s).</p>

    iP = document.createElement("p");
    iP.id = "matterPrestigeElm";
    iP.className = "medium_margin_top matterPrestige";
    
    iSpan = document.createElement("span");
    iSpan.id = "destroyReactor";
    iSpan.className = "button active";
    iSpan.innerText = "Destroy the reactor";

    iP.appendChild(iSpan);
    iP.appendChild(document.createTextNode(" to reset Heat Points, Heat Upgrades, normal upgrades and reactor size to get "));
    
    iSpan = document.createElement("span");
    iSpan.id = "matterup";
    iSpan.innerText = "0";
    iSpan.className = "matterAmount";

    iP.appendChild(iSpan);
    iP.appendChild(document.createTextNode(" Matter Unit(s)."));

    if (!checkCanMatter()) iP.style.display = "none";

    prestigeCont.appendChild(iP);

    // update upgrades
    upgrades.newBonusElem = document.getElementById("heatup");
    upgrades.heatCount = document.getElementById("heatZ");
    document.getElementById("prestige").addEventListener("click", prestige);

    // update Matter Unit
    upgrades.newMatterElem = document.getElementById("matterup");
    upgrades.matterCount = document.getElementById("matterZ");
    document.getElementById("destroyReactor").addEventListener("click", destroyReactor);

    upgrades.energyCount = document.getElementById("energyDisplay");

    // add the ultimate checkbox for automata minion
    //<input type="checkbox" id="automataCheckbox" name="automataCheckbox" value="">
    //<label for="automataCheckbox"> Enable Automata Minions</label>

    
    let iInput = document.createElement("input");
    iInput.type = "checkbox";
    iInput.id = "automataCheckbox";
    iInput.name = "automataCheckbox";
    iInput.style.display = "none";
    if (achievements.get("Nuclear Automaton")) { iInput.style.display = ""; }

    prestigeCont.appendChild(iInput);

    let iLabel = document.createElement("label");
    iLabel.for = "automataCheckbox";
    iLabel.innerText = " Enable Automata Minions - automatically buy essential Normal Upgrades";
    iLabel.id = "automataLabel";
    iLabel.style.display = "none";
    if (achievements.get("Nuclear Automaton")) { iLabel.style.display = ""; }

    prestigeCont.appendChild(iLabel);

    document.getElementById("automataCheckbox").addEventListener("change", automataCheckboxHandle);
    
}

function showPrestige() {
    let prestigeCont = document.getElementById("prestigeContainer");
    prestigeCont.style.visibility = "";
}