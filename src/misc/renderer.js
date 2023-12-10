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

function renderUpgrade(name, displayName) {
    let upgradeCont = document.getElementById("upgradeContainer");
    
    // <tr id="size">
    /*let iTr = document.createElement("tr");
    iTr.id = name;*/

    /*
    <td>Larger Explosions: </td>
                                <td class="res">0</td>
                                <td class='group'><span class='button'>1</span><span class='button'>max</span></td>
                                <td>cost: </td>
                                <td>0</td>
    */
   //upgradeCont.appendChild(iTr);

    let iDiv = document.createElement("div");
    iDiv.className = "upgrade-item";
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

    upgradeCont.appendChild(iDiv);
   
   /*let iTd = document.createElement("td");
   iTd.innerText = `${displayName}: `;
   iTr.appendChild(iTd);
   iTd = document.createElement("td");
   iTd.className = "res";
   iTd.innerText = "0";
   iTr.appendChild(iTd);
   iTd = document.createElement("td");
   iTd.className = "group";
   iTr.appendChild(iTd);
   let iBtn = document.createElement("span"); iBtn.className = "button"; iBtn.innerText = "1";
   iTd.appendChild(iBtn);
   iBtn = document.createElement("span"); iBtn.className = "button"; iBtn.innerText = "max";
   iTd.appendChild(iBtn);
   iTd = document.createElement("td");
   iTd.innerText = "cost: ";
   iTr.appendChild(iTd);
   iTd = document.createElement("td");
   iTd.innerText = "0";
   iTr.appendChild(iTd);
   iTd = document.createElement("td");
   iTd.innerText = "1 → 1.1";
   iTr.appendChild(iTd);*/
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
            document.getElementById(key+"Total"),
            document.getElementById(key+"Max")];
    });
}

function renderPrestige() {
    let prestigeCont = document.getElementById("prestigeContainer");

    if (!isSacrificeUnlocked()) {
        prestigeCont.style.visibility = "hidden";
    }

    // <p id="heatCount" class="lowMargin"></p>
    let iP = document.createElement("p");
    iP.id = "heatCount";
    iP.className = "lowMargin";
    iP.innerHTML = "You have <span id=\"heat\">0</span> Heat Points";
    if (stats.get("heat") < 1) iP.style.display = "none";

    prestigeCont.appendChild(iP);
    

    // <p class="lowMargin"><span id="prestige" class="button active">Sacrifice</span> all upgrades and reset board size to gain <span id="heatup">0</span> Heat Points.</p>
    iP = document.createElement("p");
    iP.className = "lowMargin";

    let iSpan = document.createElement("span");
    iSpan.id = "prestige";
    iSpan.className = "button active";
    iSpan.innerText = "Sacrifice";

    iP.appendChild(iSpan);
    iP.appendChild(document.createTextNode(" all upgrades and reset board size to gain "));

    iSpan = document.createElement("span");
    iSpan.id = "heatup";
    iSpan.innerText = "0";

    iP.appendChild(iSpan);
    iP.appendChild(document.createTextNode(" Heat Point(s)."))

    prestigeCont.appendChild(iP);

    // update upgrades
    upgrades.newBonusElem = document.getElementById("heatup");
    upgrades.heatCount = document.getElementById("heat");
    document.getElementById("prestige").addEventListener("click", prestige);
}

function showPrestige() {
    let prestigeCont = document.getElementById("prestigeContainer");
    prestigeCont.style.visibility = "";
}