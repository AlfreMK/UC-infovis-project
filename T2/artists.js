
var CURRENT_CATEGORY = "";

const selectOrder = document.getElementById("selector");
const artistContainer = d3.select("#artists");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


// Definimos el ancho y largo del SVG. CONSTANTES



// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function dataJoinArtist(datos) {

    for (let i = 0; i < 10; i++) {
        createSvgArtist(datos[i]);
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


function createSvgArtist(data) {
    const container = artistContainer.append("div").attr("class", "artist-container "+ data.Gender);
    const title = container.append("h3").text(data.Artist).attr("class", "category-title");
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
function runCodeArtist(category=CURRENT_CATEGORY, orderAlpha=false, orderAge=false) {
    // hacerlo con enter y exit
    artistContainer.selectAll(".artist-container").remove()
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    let URL = BASE_URL + "16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/";
    URL = URL + "ArtistProcessed.csv";
    d3.csv(URL).then((data) => {
      CURRENT_CATEGORY = category;
      data = data.filter(d => d.Categories.includes(category));
        if (orderAlpha) {
            data = data.sort((a, b) => a.Artist.localeCompare(b.Artist));
        }
        console.log(data);
        console.log(CURRENT_CATEGORY)
        if (orderAge) {
            data = data.sort((a, b) => parseInt(a.BirthYear) - parseInt(b.BirthYear)); // fix
            console.log(data);
        }
        dataJoinArtist(data);
    }).catch(error => {
      console.log(error);
    })
  }
