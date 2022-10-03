
var CURRENT_CATEGORY = "";
var CURRENT_DATA = [];
const selectOrder = document.getElementById("selector");
const selectOrder2 = document.getElementById("selector-2");
const artistContainer = d3.select("#artists");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


// Definimos el ancho y largo del SVG. CONSTANTES



// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function dataJoinArtist(datos) {
    const maxArtwork = d3.max(datos, d => parseInt(d.Categories[CURRENT_CATEGORY]));
    const artworkScale = d3.scaleLinear().domain([0, maxArtwork]).rangeRound([10, 48]);
    // datos.map(d => createSvgArtist(d, artworkScale));

    artistContainer.selectAll("div")
        .data(datos, d => createSvgArtist(d, artworkScale));
    
}

function onlyFM(genderInput){
    if (genderInput === 0){
        artistContainer.selectAll(`.Male`).style("display", "none");
        artistContainer.selectAll(`.Female`).style("display", "block");
    }
    else if (genderInput === 1){
        artistContainer.selectAll(`.Female`).style("display", "none");
        artistContainer.selectAll(`.Male`).style("display", "block");
    }
    else if (genderInput===-1){
        artistContainer.selectAll(`.Male`).style("display", "block");
        artistContainer.selectAll(`.Female`).style("display", "block");
    }
}
function changeOpacity(id, leave=false){
    if (leave){
        artistContainer.selectAll(`.artist-container`)
        .style("opacity", 1)
        .style("transition", "opacity 0.5s");
    }
    else{
        artistContainer.selectAll(`.artist-container`)
        .style("opacity", 0.2)
        .style("transition", "opacity 0.5s");
        artistContainer.select(`#${id}`).style("opacity", 1);
    }
}

function createSvgArtist(data, artworkScale) {
    const radius = artworkScale(parseInt(data.Categories[CURRENT_CATEGORY]));
    const idContainer = "artist-"+data.aid;
    const container = artistContainer.append("div")
        .attr("class", "artist-container "+ data.Gender)
        .attr("id", idContainer)
        .attr("title", infoArtist(data));
    const HEIGHT = 200-(radius+data.age);
    const svg = container.append("svg")
        .attr("width", 100).attr("height", 200)
        .attr("onmouseover", "changeOpacity('"+ idContainer+ "');")
        .attr("onmouseleave", "changeOpacity('"+ idContainer+ "', true);");
    const tallo = svg.append("rect")
        .attr("x", 50).attr("y", HEIGHT+radius)
        .attr("width", 5)
        .attr("height", data.age)
        .attr("fill", "black");
    const cabeza = svg.append("circle")
        .attr("cx", 52)
        .attr("cy", HEIGHT)
        .attr("r", radius).attr("fill", "#FF5F1F");
    const rama_position = (HEIGHT)+(data.age+radius)/2;
    const rama = svg.append("rect")
        .attr("x", 40)
        .attr("y", rama_position)
        .attr("width", 3).attr("height", 12)
        .attr("fill", "black")
        .attr("transform", "rotate(-45, 47, "+rama_position+")");
    if (data.DeathYear === "-1"){
        const hoja = svg.append("ellipse")
            .attr("cx", 40)
            .attr("cy", rama_position)
            .attr("rx", 14).attr("ry", 5).attr("fill", "black")
            .attr("transform", "rotate(40, 40, "+rama_position+")");
    }
    const title = container.append("p").text(textArtist(data.Artist)).attr("class", "artist-title");
    return container;
}

function infoArtist(data){
    final_string = "";
    final_string += "Name: " + data.Artist + "\n";
    final_string += "Gender: " + data.Gender + "\n";
    final_string += "Nacionality: " + data.Nacionality + "\n";
    final_string += "Birth Year: " + data.BirthYear + "\n";
    final_string += "Age: " + data.age + "\n";
    return final_string;
}


function textArtist(name){
    if (name.length > 10){
        return name.substring(0, 7) + "...";
    }
    return name
}

function ageArtist(data){
    const CURRENT_YEAR = 2022;
    if (data.DeathYear === "-1"){
        return (CURRENT_YEAR - parseInt(data.BirthYear))
    }
    else{
        return (parseInt(data.DeathYear) - parseInt(data.BirthYear))
    }
}



// Artist: "Robert Arneson"
// BirthYear: "1930"
// Categories: "{'Drawings': 1, 'Prints & Illustrated Books': 1}"
// DeathYear: "1992"
// Gender: "Male"
// Nacionality: "American"
// TotalArtwork: "2"


function selectorCode(reset=false){
    if (reset){
        onlyFM(-1);
        CURRENT_DATA.sort((a, b) => (a.aid > b.aid) ? 1 : -1);
        selectOrder.value = "Default";
        selectOrder2.value = "Ascending";
    }
    if (CURRENT_CATEGORY === ""){
        return
    }
    
    if (selectOrder.value === "Alphabetical"){
        CURRENT_DATA.sort((a, b) => (a.Artist > b.Artist) ? 1 : -1);
        // change order of containers
    }
    else if (selectOrder.value === "Age"){
        CURRENT_DATA.sort((a, b) => (a.age > b.age) ? 1 : -1);
    }
    else if (selectOrder.value === "Artwork"){
        CURRENT_DATA.sort((a, b) => (a.Categories[CURRENT_CATEGORY] > b.Categories[CURRENT_CATEGORY]) ? 1 : -1);
    }
    else{
        CURRENT_DATA.sort((a, b) => (a.aid > b.aid) ? 1 : -1);
    }
    if (selectOrder2.value === "Descending"){
        CURRENT_DATA.reverse();
    }
    sortDivs();

}

function sortDivs() {
    artistContainer.selectAll("div")
        .datum(function() { 
            return this.id.split("-")[1]; })
        .sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);
            return CURRENT_DATA.findIndex(d => d.aid === a) - CURRENT_DATA.findIndex(d => d.aid === b);
        }).transition()
        .duration(500)
        // https://stackoverflow.com/questions/32520950/animated-sort-stacked-bar-chart-d3-js
    
        
}

const parseData = (d) => ({
    ...d,
    Categories: parseDict(d.Categories),
    age: ageArtist(d),
  });


function parseDict(string){
    // change ' to "
    string = string.replace(/'/g, '"');
    return JSON.parse(string);
}

function runCodeArtist(category=CURRENT_CATEGORY) {
    // hacerlo con enter y exit
    d3.select("#categories").selectAll(".category-container")
        .attr("style", "filter: opacity(50%)");
    d3.select("#categories").select("."+transformNameintoClass(category)).attr("style", "filter: opacity(100%)");
    artistContainer.selectAll(".artist-container").remove()
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    let URL = BASE_URL + "16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/";
    URL = URL + "ArtistProcessed.csv";
    d3.csv(URL, parseData).then((data) => {
      CURRENT_CATEGORY = category;
      data = data.filter((d) => d.Categories.hasOwnProperty(category));
      data = data.filter(d => Math.random() > 0.7).slice(0, 100);
      let id = 0;
      data = data.map((d) => ({ ...d, aid: id++ }));
      CURRENT_DATA = data;
        dataJoinArtist(data);
        selectorCode();
    }).catch(error => {
      console.log(error);
    })
  }
