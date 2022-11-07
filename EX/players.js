
const containerPlayers = playersContainer.append("div")


function dataJoinPlayers(datos) {
    // Vinculamos los datos con cada elemento rect con el comando join
    maximo = d3.max(datos, d => d.rating_standard);
    minimo = d3.min(datos, d => d.rating_standard);
    containerPlayers
        .attr("class", "container")
    const escalaAltura = d3.scaleLinear()
        .domain([minimo, maximo])
        .rangeRound([70, 150])

    const enter_and_update = containerPlayers
        .selectAll("div")
        .data(datos)
        .join("div");
    kingsvg(enter_and_update, escalaAltura);
    // tooltip(enter_and_update);
    enter_and_update.on("mouseover", function(d) {
        d3.selectAll(".king").style("opacity", "0.6");
        d3.select(this).select(".king").style("opacity", "1");
    })
    .on("mouseout", function(d) { 
        d3.selectAll(".king").style("opacity", "1");
    });
    
}

function textTooltip(data) {
    const text = data.name + "\n" + "\n" + 
        "Classic Rating: " + data.rating_standard + "\n" +
        "Rapid Rating: " + data.rating_rapid + "\n" +
        "Blitz Rating: " + data.rating_blitz;
    return text
}


function posicionRect(d, escala) {
    return 154-escala(d.rating_standard)
}

function posicionXrect(num) {
    return 40 + num
}

function kingsvg(svg, escalaAltura){
    // svg del rey
    const color = "#202020";
    // tronco del rey
    const rey = svg.append("svg")
        .attr("width", 100).attr("class", "king").attr("style", "cursor: pointer;")
        .attr("height", 200)
    
    rey.append("title").text(d => textTooltip(d))
    
    rey.append("rect")
        .attr("width", 20)
        .attr("height", (d) => escalaAltura(d.rating_standard))
        .attr("fill", color)
        .attr("x", posicionXrect(0))
        .attr("y", (d) => posicionRect(d, escalaAltura))
        
    rey.append("rect")
        .attr("width", 5)
        .attr("height", 20)
        .attr("fill", color)
        .attr("x", posicionXrect(7.5))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 20);
    rey.append("rect")
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(0))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 12);
    
    // cuello del rey
    rey.append("polygon")
        .attr("points", (d) => `${posicionXrect(-5)},${posicionRect(d, escalaAltura)} ${posicionXrect(25)},${posicionRect(d, escalaAltura)} ${posicionXrect(10)},${posicionRect(d, escalaAltura)+60}`)
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 20);
    rey.append("rect")
        .attr("width", 40)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-10))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) + 20);
    rey.append("rect")
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("y", (d, i) => posicionRect(d, escalaAltura) + 25);
    
    // base del rey
    rey.append("rect")
        .attr("width", 40)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-10))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 5);
    rey.append("rect")
        .attr("width", 35)
        .attr("height", 15)
        .attr("fill", color)
        .attr("x", posicionXrect(-7.5))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 15);
    rey.append("rect")
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 20);
    rey.append("polygon")
        .attr("points",(d) => `${posicionXrect(-2)},${posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)-20} ${posicionXrect(22)},${posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)-20} ${posicionXrect(10)},${posicionRect(d, escalaAltura)}`)
        .attr("fill", color)
        .attr("x", posicionXrect(-5))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 20);

    rey.append("image")
        .attr("xlink:href", d => flagSvg(d.federation))
        .attr("width", 25)
        .attr("height", 25)
        .attr("x", posicionXrect(-2.5))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)+5);
        ;
    rey.append("text")
        .attr("x", posicionXrect(-20))
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)+ 50)
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



function runCodePlayers() {
    // https://www.kaggle.com/datasets/rohanrao/chess-fide-ratings
    const BASE_URL = "https://gist.githubusercontent.com/AlfreMK/";
    let URL = BASE_URL + "a2ea95d3edc1de632237cd4c2ae0a8f8/raw/9ab4b21d70baa0683428e6bbd6f8262242b7e869/";
    URL = URL + "fide_data_01_2021.csv";
    d3.csv(URL, parseData).then((data) => {
        // sort descending
        // query last element from array
        const minMax = elosRangeActivated.slice(-1)[0]
        console.log(minMax)
        data_players = data.filter(d => d.rating_standard >= minMax[0] && d.rating_standard <= minMax[1]);
        data_players = data_players.sort((a, b) => b.rating_standard - a.rating_standard);
        data_players = data_players.slice(0, 10);
        dataJoinPlayers(data_players);
    }).catch(error => {
      console.log(error);
    })
  }

