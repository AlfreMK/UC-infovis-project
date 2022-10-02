
var CURRENT_CATEGORY = "";

const selectOrder = document.getElementById("selector");
const artistContainer = d3.select("#artists");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


// Definimos el ancho y largo del SVG. CONSTANTES



// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function dataJoinArtist(datos) {
    const maxArtwork = d3.max(datos, d => parseInt(d.Categories[CURRENT_CATEGORY]));
    const artworkScale = d3.scaleLinear().domain([0, maxArtwork]).rangeRound([10, 80]);
    for (let i = 0; i < 10; i++) {
        createSvgArtist(datos[i], artworkScale);
    }
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
}


function createSvgArtist(data, artworkScale) {
    const radius = artworkScale(parseInt(data.Categories[CURRENT_CATEGORY]));
    const container = artistContainer.append("div").attr("class", "artist-container "+ data.Gender);
    const HEIGHT = 200-(radius+data.age);
    const svg = container.append("svg").attr("width", 100).attr("height", 200);
    const tallo = svg.append("rect")
        .attr("x", 50).attr("y", HEIGHT+radius)
        .attr("width", 5)
        .attr("height", data.age)
        .attr("fill", "black");
    const cabeza = svg.append("circle")
        .attr("cx", 52)
        .attr("cy", HEIGHT)
        .attr("r", radius).attr("fill", "#FF5F1F");
    const rama = svg.append("rect")
        .attr("x", 40)
        .attr("y", (HEIGHT)+(data.age)/2)
        .attr("width", 3).attr("height", 12)
        .attr("fill", "black")
        .attr("transform", "rotate(-45, 47, "+((HEIGHT)+(data.age)/2)+")");
    if (data.DeathYear === "-1"){
        const hoja = svg.append("ellipse")
            .attr("cx", 40)
            .attr("cy", (HEIGHT)+(data.age)/2)
            .attr("rx", 14).attr("ry", 5).attr("fill", "black")
            .attr("transform", "rotate(40, 40, "+((HEIGHT)+(data.age)/2)+")");
    }
    const title = container.append("p").text(data.Artist).attr("class", "artist-title");
    
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

// const parsingCategory = (d) => ({
//     category: d.Category,
//     artist: parseInt(d.Artist),
//     artwork: parseInt(d.Artwork),
//     male: parseInt(d.Male),
//     female: parseInt(d.Female),
//   });

// const parsingArtist = (d) => ({

function selectorCode(){
    if (CURRENT_CATEGORY === ""){
        return
    }
    if (selectOrder.value === "Alphabetical"){
        runCodeArtist(CURRENT_CATEGORY, true, false);
    }
    else if (selectOrder.value === "Age"){
        runCodeArtist(CURRENT_CATEGORY, false, true);
    }
    else{
        runCodeArtist();
    }
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

function runCodeArtist(category=CURRENT_CATEGORY, orderAlpha=false, orderAge=false) {
    // hacerlo con enter y exit
    artistContainer.selectAll(".artist-container").remove()
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    let URL = BASE_URL + "16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/";
    URL = URL + "ArtistProcessed.csv";
    d3.csv(URL, parseData).then((data) => {
      CURRENT_CATEGORY = category;
      data = data.filter((d) => d.Categories.hasOwnProperty(category));
    //   data = data.filter((d) => d.Categories.includes(category));
        if (orderAlpha) {
            data = data.sort((a, b) => a.Artist.localeCompare(b.Artist));
        }
        // console.log(data);
        // console.log(CURRENT_CATEGORY)
        if (orderAge) {
            data = data.sort((a, b) => a.age - b.age);
            // console.log(data);
        }
        dataJoinArtist(data);
    }).catch(error => {
      console.log(error);
    })
  }
