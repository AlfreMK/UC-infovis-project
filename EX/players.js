
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
    maximo = d3.max(datos, d => d.length);
    minimo = d3.min(datos, d => d.length);
    const escalaAltura = d3.scaleLinear()
        .domain([0, maximo])
        .range([0, 500])
    const escalaEjeY = d3.scaleLinear()
        .domain([0, maximo])
        .range([500, 0])
    const escalaBarras = d3.scaleBand()
        .domain(datos.map(d => d.min))
        .range([0, 400])
        .padding(0.1);
    const enter_and_update = container
        .selectAll("rect")
        .data(datos)
        .join("rect")
    enter_and_update
        .attr("width", escalaBarras.bandwidth())
        .attr("fill", "orange")  
        .attr("height", (d) => escalaAltura(d.length)) //Aplicamos nuestra escala
        .attr("y", (d) => escalaEjeY(d.length)) //Aplicamos nuestra escala
        .attr("x", (d) => escalaBarras(d.min));
}

function divide_players_into_ranges(data){
    let ranges = [];
    let range = [];
    let maximo = d3.max(data, d => d.rating_standard);
    let minimo = d3.min(data, d => d.rating_standard);
    let num_ranges = 50;
    let range_size = (maximo - minimo) / num_ranges;
    for (let i = 0; i < num_ranges; i++){
        range = data.filter(d => d.rating_standard >= minimo + i * range_size && d.rating_standard < minimo + (i + 1) * range_size);
        ranges.push(range);
    }
    // create an array of structs with max and min values, length
    let ranges_struct = [];
    for (let i = 0; i < ranges.length; i++){
        let range_struct = {
            min: minimo + i * range_size,
            max: minimo + (i + 1) * range_size,
            length: ranges[i].length
        }
        ranges_struct.push(range_struct);
    }
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
        data = data.filter(d => Math.random() > 0.7).slice(0, 1000);
        data = divide_players_into_ranges(data);
        data = data.sort((b, a) => a.min - b.min);
        dataJoinGraph(data);
        // dataJoinPlayers(data);
    }).catch(error => {
      console.log(error);
    })
  }


runCode();