
const artistContainer = d3.select("#artists");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


// Definimos el ancho y largo del SVG. CONSTANTES



// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function dataJoinArtist(datos) {

    for (let i = 0; i < 10; i++) {
        createSvgArtist(datos[i]);
    }
}



function createSvgArtist(data, artworkScale, artistScale) {
    const container = artistContainer.append("div").attr("class", "artist-container");
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



function runCodeArtist(category) {
    artistContainer.selectAll(".artist-container").remove()
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    let URL = BASE_URL + "16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/";
    URL = URL + "ArtistProcessed.csv";
    console.log(URL);
    d3.csv(URL).then((data) => {
      console.log(data);
      data = data.filter(d => d.Categories.includes(category));
        dataJoinArtist(data);
    }).catch(error => {
      console.log(error);
    })
  }
