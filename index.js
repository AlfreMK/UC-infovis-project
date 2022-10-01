

const categoryContainer = d3.select("#category");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


// Definimos el ancho y largo del SVG. CONSTANTES



// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function joinDeDatos(datos) {
    // Definimos el ancho y largo del SVG.
    for (let i = 0; i < datos.length; i++) {
        createSvg(datos[i]);

  }
}
function createSvg(data) {
    const container = categoryContainer.append("div").attr("class", "category-container");
    const title = container.append("h3").text(data.category);
    const svg = container.append("svg");
    svg.attr("width", 200).attr("height", 200);

    const rectMale = svg.append("rect");
    const rectFemale = svg.append("rect");
    const MfScale = d3.scaleLinear().domain([0, data.male+data.female]).range([0, 100]);
    rectFemale.attr("width", 50).attr("height", MfScale(data.female)).attr("fill", "red");
    rectMale.attr("y", MfScale(data.female))
    rectMale.attr("width", 50).attr("height", MfScale(data.male)).attr("fill", "blue");
    
}


const parsing = (d) => ({
    category: d.Category,
    artist: parseInt(d.Artist),
    artwork: parseInt(d.Artwork),
    male: parseInt(d.Male),
    female: parseInt(d.Female),
  });

function runCode(option) {
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    let URL = BASE_URL + "16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/";
    if (option == 1) {
        URL = URL + "CategoryProcessed.csv";
    }
    else if (option == 2) {
        URL = URL + "ArtistProcessed.csv";
    }
    // Esta opción no requiere hacer python3 -m http.server.
    console.log(URL)
    d3.csv(URL, parsing).then((data) => {
      console.log(data)
      joinDeDatos(data)
    }).catch(error => {
      console.log(error)
    })
  }
OPTION = 1
runCode(OPTION);