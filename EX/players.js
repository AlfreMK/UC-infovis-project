
const mainContainer = d3.select("#main-container");


function dataJoinPlayers(datos) {
    // Vinculamos los datos con cada elemento rect con el comando join
    const container = mainContainer.append("svg")
    maximo = d3.max(datos, d => d.rating_standard);
    minimo = d3.min(datos, d => d.rating_standard);
    const escalaAltura = d3.scaleLinear()
        .domain([0, maximo])
        .range([0, 500])
    const escalaEjeY = d3.scaleLinear()
        .domain([0, maximo])
        .range([500, 0])
    const escalaBarras = d3.scaleBand()
        .domain(datos.map(d => d.name))
        .range([0, 400])
        .padding(0.1);

    const enter_and_update = container
        .selectAll("rect")
        .data(datos)
        .join("rect")
    enter_and_update
        .attr("width", escalaBarras.bandwidth())
        .attr("fill", "orange")  
        .attr("height", (d) => escalaAltura(d.rating_standard)) //Aplicamos nuestra escala
        .attr("y", (d) => escalaEjeY(d.rating_standard)) //Aplicamos nuestra escala
        .attr("x", (d) => escalaBarras(d.name));
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


function runCode() {
    // https://www.kaggle.com/datasets/rohanrao/chess-fide-ratings
    const BASE_URL = "https://gist.githubusercontent.com/AlfreMK/";
    let URL = BASE_URL + "a2ea95d3edc1de632237cd4c2ae0a8f8/raw/9ab4b21d70baa0683428e6bbd6f8262242b7e869/";
    URL = URL + "fide_data_01_2021.csv";
    d3.csv(URL, parseData).then((data) => {
        // data = data.filter(d => Math.random() > 0.7).slice(0, 100000);
        data = divide_players_into_ranges(data);
        data = data.sort((a, b) => a.min - b.min);
        dataJoinGraph(data);
        // dataJoinPlayers(data);
    }).catch(error => {
      console.log(error);
    })
  }


runCode();