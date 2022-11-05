
const mainContainer = d3.select("#main-container");
const playersContainer = d3.select("#players-container");


function dataJoinPlayers(datos) {
    // Vinculamos los datos con cada elemento rect con el comando join
    const container = playersContainer.append("div")

    maximo = d3.max(datos, d => d.rating_standard);
    minimo = d3.min(datos, d => d.rating_standard);
    container
        .attr("class", "container")
    const escalaAltura = d3.scaleLinear()
        .domain([minimo, maximo])
        .rangeRound([70, 150])

    const enter_and_update = container
        .selectAll("div")
        .data(datos)
        .join("div");
    // enter_and_update
    //     .attr("x", (d, i) => (i%8)*75)
    //     .attr("y", (d, i) => 200-escalaAltura(d.rating_standard)+Math.floor(i/8)*110);
    kingsvg(enter_and_update, escalaAltura);
    // tooltip(enter_and_update);
    enter_and_update.on("mouseover", function(d) {
        d3.selectAll(".king").style("opacity", "0.6");
        d3.select(this).select(".king").style("opacity", "1");
        // d3.select(this).select(".tooltip").style("visibility", "visible");
    })
    .on("mouseout", function(d) { 
        d3.selectAll(".king").style("opacity", "1");
        // d3.select(this).select(".tooltip").style("visibility", "hidden");
    });
    
    // enter_and_update.append("image")
    //     .attr("xlink:href", d => flagSvg(d.federation))
    //     .attr("width", 25)
    //     .attr("height", 25)
    //     .attr("x", (d) => escalaX(d.name)%2)
    //     .attr("y", (d) => Math.floor(escalaX(d.name)/2))
}

// function tooltip(container){
//     const tooltip = container.append("div")
//         .attr("class", "tooltip")
//         .attr("x", 0)
//         .attr("y", 0)
    
//     const nameflag = tooltip.append("div")
//         .attr("class", "nameflag")
//     const svg = nameflag.append("svg")
//         .attr("width", 25)
//         .attr("height", 25)
//     svg.append("image")
//         .attr("xlink:href", d => flagSvg(d.federation))
//         .attr("width", 25)
//         .attr("height", 25);
//     nameflag.append("div")
//         .text((d) => textTooltip(d)[0])
//     tooltip.append("div")
//         .text((d) => textTooltip(d)[1])
//     tooltip.append("div")
//         .text((d) => textTooltip(d)[2])
//     tooltip.append("div")
//         .text((d) => textTooltip(d)[3]);

// }
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

function kingsvg(svg, escalaAltura){
    // svg del rey
    const color = "#383838";
    // tronco del rey
    const rey = svg.append("svg")
        .attr("width", 100).attr("class", "king").attr("style", "cursor: pointer;")
        .attr("height", 200)
    
    rey.append("title").text(d => textTooltip(d))
    
    rey.append("rect")
        .attr("width", 20)
        .attr("height", (d) => escalaAltura(d.rating_standard))
        .attr("fill", color)
        .attr("y", (d) => posicionRect(d, escalaAltura))
        
    rey.append("rect")
        .attr("width", 5)
        .attr("height", 20)
        .attr("fill", color)
        .attr("x", 7.5)
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 20);
    rey.append("rect")
        .attr("width", 20)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", 0)
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 12);
    
    // cuello del rey
    rey.append("polygon")
        .attr("points", (d) => `-5,${posicionRect(d, escalaAltura)} 25,${posicionRect(d, escalaAltura)} 10,${posicionRect(d, escalaAltura)+60}`)
        .attr("fill", color)
        .attr("x", -5)
        .attr("y", (d, i) => posicionRect(d, escalaAltura) - 20);
    rey.append("rect")
        .attr("width", 40)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", -10)
        .attr("y", (d, i) => posicionRect(d, escalaAltura) + 20);
    rey.append("rect")
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", -5)
        .attr("y", (d, i) => posicionRect(d, escalaAltura) + 25);
    
    // base del rey
    rey.append("rect")
        .attr("width", 40)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", -10)
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 5);
    rey.append("rect")
        .attr("width", 35)
        .attr("height", 15)
        .attr("fill", color)
        .attr("x", -7.5)
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 15);
    rey.append("rect")
        .attr("width", 30)
        .attr("height", 5)
        .attr("fill", color)
        .attr("x", -5)
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 20);
    rey.append("polygon")
        .attr("points",(d) => `-2,${posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)-20} 22,${posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)-20} 10,${posicionRect(d, escalaAltura)}`)
        .attr("fill", color)
        .attr("x", -5)
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)- 20);

    rey.append("image")
        .attr("xlink:href", d => flagSvg(d.federation))
        .attr("width", 25)
        .attr("height", 25)
        .attr("x", -2.5)
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)+5);
        ;
    rey.append("text")
        .attr("x", -20)
        .attr("y", (d) => posicionRect(d, escalaAltura)+escalaAltura(d.rating_standard)+ 50)
        .text((d) => textPlayer(d.name))

}


function textPlayer(name){
    if (name.length > 10){
        return name.substring(0, 7) + "...";
    }
    return name
}

function dataJoinGraph(datos) {
    const container = mainContainer.append("svg");
    maximoelo = d3.max(datos, d => d.max);
    minimoelo = d3.min(datos, d => d.min);
    maximo = d3.max(datos, d => d.length);
    minimo = d3.min(datos, d => d.length);
    container.attr("width", 500).attr("height", 350);
    const escalaAltura = d3.scaleLinear()
        .domain([0, maximo])
        .rangeRound([5, 300])
    const escalaEjeY = d3.scaleLinear()
        .domain([0, maximo])
        .rangeRound([300, 5])
    const escalaBarras = d3.scaleBand()
        .domain(datos.map(d => avg_rating(d)))
        .rangeRound([0, 400])
        .padding(0.1);

    const enter_and_update = container
        .selectAll("rect")
        .data(datos)
        .join("rect");
    enter_and_update
        .attr("width", escalaBarras.bandwidth())
        .attr("fill", "orange")  
        .attr("height", (d) => escalaAltura(d.length)) //Aplicamos nuestra escala
        .attr("y", (d) => escalaEjeY(d.length)) //Aplicamos nuestra escala
        .attr("x", (d) => escalaBarras(avg_rating(d)))
        // add hover
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "red");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", "orange");
        })
        // cursor pointer
        .style("cursor", "pointer")
        ;
    // append a title element to each rect
    enter_and_update.append("title")
        .text(d => textTitleGraph(d));
    // add axis
    const axis = d3.axisLeft(escalaEjeY);
    container.append("g")
        .attr("transform", "translate(410, 0)")
        .call(axis)
        .append("text")
        .text("Cantidad de personas")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -150)
        .attr("fill", "#000");

    // add axis x
    const escalaAbajo = d3.scaleLinear()
        .domain([minimoelo, maximoelo])
        .rangeRound([0, 400])

    const axis_x = d3.axisBottom(escalaAbajo);
    container.append("g")
        .attr("transform", "translate(0, 310)")
        .call(axis_x)
        .append("text")
        .text("ELO Rating")
        .attr("fill", "#000")
        .attr("transform", "translate(200, 30)");

}

function textTitleGraph(data) {
    text = "ELO Range: " + Math.round(data.min) + " - " + Math.round(data.max) + "\n"
    text += "Number of players: " + data.length;
    // text += "AVG Rating: " + avg_rating(data) + "\n";
    // text += "Frequency: " + data.length + "\n";
    return text;
}

function avg_rating(data){
    return Math.round((data.max + data.min) / 2)
}

function divide_players_into_ranges(data){
    let ranges = [];
    let range = [];
    let maximo = d3.max(data, d => d.rating_standard);
    let minimo = d3.min(data, d => d.rating_standard);
    let num_ranges = 30;
    let range_size = (maximo - minimo) / num_ranges;
    for (let i = 0; i < num_ranges; i++){
        range = data.filter(d => d.rating_standard >= minimo + i * range_size && d.rating_standard < minimo + (i + 1) * range_size);
        ranges.push(range);
    }
    // create an array of structs with max and min values, length
    let ranges_struct = [];
    ranges.map((d, i) => {
        ranges_struct.push({
            id: i,
            min: minimo + i * range_size,
            max: minimo + (i + 1) * range_size,
            length: d.length
        })
    })
    return ranges_struct;
}


const parseData = (d) => ({
    ...d,
    rating_standard: parseInt(d.rating_standard),
    rating_rapid: parseInt(d.rating_rapid),
    rating_blitz: parseInt(d.rating_blitz),
    yob: parseInt(d.yob),
  });


function flagSvg(flag) {
    return "https://ratings.fide.com/svg/" + flag + ".svg";
}


function runCode() {
    // https://www.kaggle.com/datasets/rohanrao/chess-fide-ratings
    const BASE_URL = "https://gist.githubusercontent.com/AlfreMK/";
    let URL = BASE_URL + "a2ea95d3edc1de632237cd4c2ae0a8f8/raw/9ab4b21d70baa0683428e6bbd6f8262242b7e869/";
    URL = URL + "fide_data_01_2021.csv";
    d3.csv(URL, parseData).then((data) => {
        // sort descending
        data_players = data.sort((a, b) => b.rating_standard - a.rating_standard);
        data_players = data_players.slice(0, 10);
        dataJoinPlayers(data_players);
        data = divide_players_into_ranges(data);
        data = data.sort((a, b) => a.min - b.min);
        dataJoinGraph(data);
    }).catch(error => {
      console.log(error);
    })
  }


runCode();