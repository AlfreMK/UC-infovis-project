
var CURRENT_PLAYERS_SHOWN = [];
const containerPlayers = playersContainer.append("div")
containerPlayers.attr("class", "container")

function dataJoinPlayers(datos, minim, maxim) {
    // Vinculamos los datos con cada elemento rect con el comando join
    let maximo = d3.max(datos, d => ratingShown(d));
    let minimo = d3.min(datos, d => ratingShown(d));
    const escalaAltura = d3.scaleLinear()
        .domain([minimo, maximo])
        .rangeRound([70, 150])

    const enter_and_update = containerPlayers
        .selectAll("svg")
        .data(datos)
        .join(
            enter => {
                if (enter.gender === "M"){
                    kingsvg(enter, escalaAltura, minim, maxim);
                }
                else{
                    queensvg(enter, escalaAltura, minim, maxim);
                }
            }
            ,

            update => 
                {
                    update.selectAll(".updatable-height")
                        .transition()
                        .duration(1000)
                        .attr("height", d => escalaAltura(ratingShown(d)))
                        .attr("y", d => posicionRect(d, escalaAltura));
                    update.selectAll(".updatable-20")
                        .transition()
                        .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) - 20);
                    update.selectAll(".updatable-12")
                        .transition()
                        .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) - 12);
                    update.selectAll(".updatable--20")
                        .transition()
                        .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) + 20);
                    update.selectAll(".updatable--25")
                    .transition()
                    .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) + 25);
                    update.selectAll(".updatable2-5")
                    .transition()
                    .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) + escalaAltura(ratingShown(d)) - 5);
                    update.selectAll(".updatable2-15")
                    .transition()
                    .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) + escalaAltura(ratingShown(d)) - 15);
                    update.selectAll(".updatable2-20")
                    .transition()
                    .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) + escalaAltura(ratingShown(d)) - 20);
                    update.selectAll(".updatable2--5")
                    .transition()
                    .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) + escalaAltura(ratingShown(d)) + 5);
                    update.selectAll(".updatable2--50")
                    .transition()
                    .duration(1000)
                        .attr("y", d => posicionRect(d, escalaAltura) + escalaAltura(ratingShown(d)) + 50);
                    update.selectAll(".polygon-60")
                    .transition()
                    .duration(1000)
                        .attr("points", d => polygonPoints(d, escalaAltura, 60));
                    update.selectAll(".polygon-20")
                    .transition()
                    .duration(1000)
                        .attr("points", d => polygonPoints(d, escalaAltura, -20));
                }
                ,
                exit => exit.remove()

        );
        
        
    // tooltip(enter_and_update);
    
}

function textTooltip(data) {
    const text = data.name + "\n" + "\n" + 
        "Classic Rating: " + data.rating_standard + "\n" +
        "Rapid Rating: " + data.rating_rapid + "\n" +
        "Blitz Rating: " + data.rating_blitz;
    return text
}


function posicionRect(d, escala) {
    return 154-escala(ratingShown(d))
}

function posicionXrect(num) {
    return 40 + num
}

function polygonPoints(d, escala, integer){
    if (integer===60){
        return `${posicionXrect(-5)},${posicionRect(d, escala)} ${posicionXrect(25)},${posicionRect(d, escala)} ${posicionXrect(10)},${posicionRect(d, escala)+60}`
    }
    else if (integer===-20){
        return `${posicionXrect(-2)},${posicionRect(d, escala)+escala(ratingShown(d))-20} ${posicionXrect(22)},${posicionRect(d, escala)+escala(ratingShown(d))-20} ${posicionXrect(10)},${posicionRect(d, escala)}`
    }
}

function queensvg(svg, escalaAltura, minim, maxim){
    const color = "#202020";
    const queen = svg.append("svg")
        .attr("width", 100)
        .attr("height", 240)
        .attr("class", `king minmax-${minim}-${maxim}`)
        .attr("id", d => "fid-"+ratingShown(d))
        .attr("style", "cursor: pointer;")
        .on("mouseover", function(d) {
            d3.selectAll(".king").style("opacity", "0.6");
            d3.select(this).style("opacity", "1");
        })
        .on("mouseout", function(d) { 
            d3.selectAll(".king").style("opacity", "1");
        })
    queen.append("rect")
        .attr("class", "updatable-height")
        .attr("width", 20)
        .attr("height", (d) => escalaAltura(ratingShown(d)))
        .attr("fill", color)
        .attr("x", posicionXrect(0))
        .attr("y", (d) => posicionRect(d, escalaAltura))
    
}

function kingsvg(svg, escalaAltura, minim, maxim) {
    // svg del rey
    const color = "#202020";
    // tronco del rey
    const rey = svg.append("svg")
        .attr("width", 100)
        .attr("height", 240)
        .attr("class", `king minmax-${minim}-${maxim}`)
        .attr("id", d => "fid-"+ratingShown(d))
        .attr("style", "cursor: pointer;")

    rey.on("mouseover", function(d) {
        d3.selectAll(".king").style("opacity", "0.6");
        d3.select(this).style("opacity", "1");
    })
    .on("mouseout", function(d) { 
        d3.selectAll(".king").style("opacity", "1");
    })

    rey.append("title").text(d => textTooltip(d))
    
    rey.append("rect")
        .attr("class", "updatable-height")
        .attr("width", 20)
        .attr("height", (d) => escalaAltura(ratingShown(d)))
        .attr("fill", color)
        .attr("x", posicionXrect(0))
        .attr("y", (d) => posicionRect(d, escalaAltura))
        
    rey.append("rect")
        .attr("class", "updatable-20")
        .attr("width", 5)
        .attr("height", 20)
        .attr("fill", color)
        .attr("x", posicionXrect(7.5))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 20);
    rey.append("rect")
        .attr("class", "updatable-12")
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(0))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 12);
    
    // cuello del rey
    rey.append("polygon")
        .attr("class", "updatable-20 polygon-60")
        .attr("points", (d) => polygonPoints(d, escalaAltura, 60))
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 20);
    rey.append("rect")
        .attr("class", "updatable--20")
        .attr("width", 40)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-10))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) + 20);
    rey.append("rect")
        .attr("class", "updatable--25")
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) + 25);
    
    // base del rey
    rey.append("rect")
        .attr("class", "updatable2-5")
        .attr("width", 40)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-10))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(ratingShown(d))- 5);
    rey.append("rect")
        .attr("class", "updatable2-15")
        .attr("width", 35)
        .attr("height", 15)
        .attr("fill", color)
        .attr("x", posicionXrect(-7.5))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(ratingShown(d))- 15);
    rey.append("rect")
    .attr("class", "updatable2-20")
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(ratingShown(d))- 20);
    rey.append("polygon")
        .attr("points",(d) => polygonPoints(d, escalaAltura, -20))
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("class", "updatable2-20 polygon-20")
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(ratingShown(d))- 20);

    rey.append("image")
        .attr("class", "updatable2--5")
        .attr("xlink:href", d => flagSvg(d.federation))
        .attr("width", 25)
        .attr("height", 25)
        .attr("x", posicionXrect(-2.5))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(ratingShown(d))+5);
        ;
    rey.append("text")
        .attr("class", "updatable2--50")
        .attr("x", posicionXrect(-20))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(ratingShown(d))+ 50)
        .text((d) => textPlayer(d.name))

}


function textPlayer(name){
    if (name.length > 10){
        return name.substring(0, 7) + "...";
    }
    return name
}


function flagSvg(flag) {
    return "https://ratings.fide.com/svg/" + flag + ".svg";
}

function dataPlayersAll(data, elosRangeActivated){
    // for range in elosRangeActivated
    // const dataPlayers = [];
    // for (let i = 0; i < elosRangeActivated.length; i++) {
    //     const elosRange = elosRangeActivated[i];
    //     const dataFiltered = data.filter(d => ratingShown(d) >= elosRange[0] && ratingShown(d) <= elosRange[1]);
    //     dataPlayers.push(dataFiltered);
    // }
    // // do the same but with map
    const dataPlayers = elosRangeActivated.map(
        elosRange => data.filter(
            d => ratingShown(d) >= elosRange[0] && ratingShown(d) <= elosRange[1]));

    // concat all the arrays
    return [].concat.apply([], dataPlayers);
}

function appendPlayerstoCurrent(data, minim, maxim){
    if (!minMaxInElosRange(elosRangeActivated, minim, maxim)){
        let data_players = data.filter(d => ratingShown(d) >= minim 
                                            && ratingShown(d) <= maxim
                                            && CURRENT_FILTER[d.gender]
                                            && isFedShown(d));
        data_players = data_players.sort(() => Math.random() - 0.5).slice(0, 10);
        CURRENT_PLAYERS_SHOWN.push(...data_players);
        updateMinMaxElo(elosRangeActivated, minim, maxim);
    }
}


function sortPlayers(){
    const select = document.getElementById("selector-order").value;
    d3.selectAll(".king")
        .datum(function() { 
            return this.id.split("-")[1]; })
        .sort(function(a, b) {
            if (select==="2"){
                return a-b;
            }
            return b - a;
            // return CURRENT_PLAYERS_SHOWN.findIndex(d => d.fide_id === a) - CURRENT_PLAYERS_SHOWN.findIndex(d => d.fide_id === b);
        })
        .transition()
        .styleTween("transform", function() { return d3.interpolate("scale(0)", "scale(1)"); })
        .duration(1000);
}

function removePlayersinCurrent(minim, maxim){
    CURRENT_PLAYERS_SHOWN = CURRENT_PLAYERS_SHOWN.filter(d => ratingShown(d) > minim && ratingShown(d) > maxim
                                                        || ratingShown(d) < minim && ratingShown(d) < maxim);
    d3.selectAll(`.minmax-${minim}-${maxim}`).exit();
    d3.selectAll(`.minmax-${minim}-${maxim}`)
        .transition()
        .duration(1000)
        .style("opacity", 0).remove()
    updateMinMaxElo(elosRangeActivated, minim, maxim);
    // dataJoinPlayers(CURRENT_PLAYERS_SHOWN, minim, maxim);
}


function runCodePlayers(minim, maxim) {
    // https://www.kaggle.com/datasets/rohanrao/chess-fide-ratings
    const BASE_URL = "https://gist.githubusercontent.com/AlfreMK/";
    let URL = BASE_URL + "a2ea95d3edc1de632237cd4c2ae0a8f8/raw/9ab4b21d70baa0683428e6bbd6f8262242b7e869/";
    URL = URL + "fide_data_01_2021.csv";
    changeTextHTML("text-players");
    d3.csv(URL, parseData).then((data) => {
        appendPlayerstoCurrent(data, minim, maxim);
        dataJoinPlayers(CURRENT_PLAYERS_SHOWN, minim, maxim);
        sortPlayers();
        changeTextHTML("text-players");
    }).catch(error => {
      console.log(error);
    })
  }

