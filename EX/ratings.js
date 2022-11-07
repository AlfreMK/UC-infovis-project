
const mainContainer = d3.select("#main-container");
const playersContainer = d3.select("#players-container");
const svgDataInBrush = d3.select("#data-in-brush");
const elosRangeActivated = [];

function dataJoinGraph(datos) {
    const container = d3.select("#main-svg");
    maximoelo = d3.max(datos, d => d.max);
    minimoelo = d3.min(datos, d => d.min);
    maximo = d3.max(datos, d => d.length);
    minimo = d3.min(datos, d => d.length);
    container.attr("width", 435).attr("height", 345);
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


    const brush = d3.brushX()
        .extent( [ [0,0], [400,300] ] )
        .on("end", (e) => brushed(e, escalaBarras, datos))

    const enter_and_update = container
        .selectAll("rect")
        .data(datos)
        .join("rect");
        
    enter_and_update
        .attr("width", escalaBarras.bandwidth())
        .attr("fill", "#b58863")
        .attr("height", (d) => escalaAltura(d.length)) //Aplicamos nuestra escala
        .attr("y", (d) => escalaEjeY(d.length)) //Aplicamos nuestra escala
        .attr("x", (d) => escalaBarras(avg_rating(d)))
        
        ;
    const brushSelectedItemsContainer = container.append("g")
        .attr("class", "brush")
        .call(brush);

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

function brushed(event, escalaBarras, datos) {
    const selection = event.selection; 
    if (selection) {
        const filteredData = datos.filter(d => {
            if (escalaBarras(avg_rating(d)) >= selection[0] && escalaBarras(avg_rating(d)) <= selection[1])
                return d;
        })
        // datajoin of svgdatabrush
        svgDataInBrush.selectAll("rect").remove();
        svgDataInBrush.selectAll("g").remove();
        const maximo = d3.max(filteredData, d => d.length);
        const escalaAltura = d3.scaleLinear()
        .domain([0, maximo])
        .rangeRound([5, 300])
        const escalaEjeY = d3.scaleLinear()
        .domain([0, maximo])
        .rangeRound([300, 5])
        const escalaBarras1 = d3.scaleBand()
        .domain(filteredData.map(d => avg_rating(d)))
        .rangeRound([0, 400])
        .padding(0.1);
        
        const enter_and_update = svgDataInBrush
            .selectAll("rect")
            .data(filteredData)
            .join("rect");
        enter_and_update
            .attr("width", escalaBarras1.bandwidth())
            .attr("fill", (d) => {
                if (minMaxInElosRange(d.min, d.max)) {
                    return "red";
                    }
                return "#b58863";
                })
            .attr("height", (d) => escalaAltura(d.length)) //Aplicamos nuestra escala
            .attr("y", (d) => escalaEjeY(d.length)) //Aplicamos nuestra escala
            .attr("x", (d) => escalaBarras1(avg_rating(d)))
            // add hover
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "red");
            })

            .on("mouseout", function(event, d) {
                if (!minMaxInElosRange(d.min, d.max)) {
                    d3.select(this).attr("fill", "#b58863");
                }
            })
            .on("click", function(event, d) {
                if (updateMinMaxElo(d.min, d.max)===true) {
                    d3.select(this).attr("fill", "red");
                }
                else {
                    d3.select(this).attr("fill", "#b58863");
                }
                runCodePlayers();
                
            })
            // cursor pointer
            .style("cursor", "pointer")
            .append("title")
            .text(d => textTitleGraph(d));
        const maximoelo = d3.max(filteredData, d => d.max);
        const minimoelo = d3.min(filteredData, d => d.min);
        const escalaAbajo = d3.scaleLinear()
            .domain([minimoelo, maximoelo])
            .rangeRound([0, 400])
        const axis_x = d3.axisBottom(escalaAbajo);
        svgDataInBrush.append("g")
            .attr("transform", "translate(0, 310)")
            .call(axis_x)
            .append("text")
            .text("ELO Rating")
            .attr("fill", "#000")
            .attr("transform", "translate(200, 30)");
            const axis = d3.axisLeft(escalaEjeY);
            svgDataInBrush.append("g")
                .attr("transform", "translate(410, 0)")
                .call(axis)
                .append("text")
                .text("Cantidad de personas")
                .attr("transform", "rotate(-90)")
                .attr("y", 15)
                .attr("x", -150)
                .attr("fill", "#000");
    }
}


function minMaxInElosRange(min, max) {
    const index = elosRangeActivated.findIndex(elo => elo[0] == min && elo[1] == max);
    if (index === -1) {
        return false;
    }
    return true;
}

function updateMinMaxElo(minim, maxim){
    // if [minim, maxim] in elosRangeActivated pop it
    // else push it
    if (minMaxInElosRange(minim, maxim)) {
        const index = elosRangeActivated.findIndex(elo => elo[0] == minim && elo[1] == maxim);
        elosRangeActivated.splice(index, 1);
        return false;
    }
    elosRangeActivated.push([minim, maxim]);
    return true;
}


///////////////////////////////////////
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

    // map version
    
    // list from 0 to num_ranges
    let list_ranges = Array.from(Array(num_ranges).keys());

    list_ranges.map(
        (i) => {
            let minimum = minimo + i * range_size;
            let maximum = minimo + (i + 1) * range_size;
            ranges.push(
                data.filter(
                    (d) => d.rating_standard >= minimum && d.rating_standard < maximum
                )
            );
        }
    )
    
    // create an array of structs with max and min values, length
    let ranges_struct = [];
    ranges.map((d, i) => {
        ranges_struct.push({
            id: i,
            min: minimo + i * range_size,
            max: minimo + (i + 1) * range_size,
            length: d.length,
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
        // sort descending
        data = divide_players_into_ranges(data);
        data = data.sort((a, b) => a.min - b.min);
        dataJoinGraph(data);
    }).catch(error => {
      console.log(error);
    })
  }


runCode();