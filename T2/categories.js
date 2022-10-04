

var CATEGORY_COLORS = {
  "Drawings": "#C8566B",
  "Prints & Illustrated Books": "#9D75BF",
  "Photography": "#4c9141",
  "Architecture & Design": "#F2D48F",
  "Painting & Sculpture": "#86AED1",
  "Film": "#E78963",
  "Media and Performance Art": "#FFA500",
};

// "#FF5F1F"

const categoryContainer = d3.select("#categories");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


// Definimos el ancho y largo del SVG. CONSTANTES


// Creamos una función que se encarga de actualizar el SVG según los datos que llegan.
function dataJoinCategory(datos) {
    // Definimos el ancho y largo del SVG.
    const maxArtwork = d3.max(datos, d => d.artwork);
    const maxArtist = d3.max(datos, d => d.artist);
    const artworkScale = d3.scaleLinear().domain([0, maxArtwork]).rangeRound([0, 50]);
    const artistScale = d3.scaleLinear().domain([0, maxArtist]).rangeRound([0, 30]);
    categoryContainer.selectAll("div")
      .data(datos, d => createSvgCategory(d, artworkScale, artistScale));
}

function transformNameintoClass(name){
  name = name.replace(/[#_,.;(){}:+?$%&/]/g, "");
    return name.replace(/ /g, "-").toLowerCase();
}

function createSvgCategory(data, artworkScale, artistScale) {
    const MfScale = d3.scaleLinear().domain([0, data.male+data.female]).rangeRound([0, 100]);
    const container = categoryContainer.append("div")
      .attr("class", "category-container " + transformNameintoClass(data.category))
      .attr("onclick", `runCodeArtist("${data.category}");`);
      // .attr("title", "Femenino: "+MfScale(data.female)+"%"+"\nMasculino: "+MfScale(data.male)+"%" );
    const title = container.append("h3").text(data.category).attr("class", "category-title");
    
    const svg = container.append("svg").attr("width", 50).attr("height", 100).attr("style",
    `border: ${artistScale(data.artist)}px solid ${CATEGORY_COLORS[data.category]};`+
    `padding: ${artworkScale(data.artwork)}px;`+
    `background-color: white;`
    ) ;

    const rectMale = svg.append("rect");
    const rectFemale = svg.append("rect");
    rectFemale.attr("width", 50).attr("height", MfScale(data.female)).attr("fill", "#ff629d");
    rectMale.attr("y", MfScale(data.female))
    rectMale.attr("width", 50).attr("height", MfScale(data.male)).attr("fill", "#088F8F");

    svg.on("mouseover", function(event, d) {
        // const[x, y] = d3.pointer(event);		
        Tooltip.transition()		
            .duration(200)		
            .style("opacity", .9);		
        Tooltip
            .style("left", (event.pageX) + "px")		
            .style("top", (event.pageY) + "px");	
        Tooltip.html(infoCategoryHTML(MfScale(data.female), MfScale(data.male)));
        })					
      .on("mouseout", function(d) {		
        Tooltip.transition()		
            .duration(500)		
            .style("opacity", 0);	
    });
}

function infoCategoryHTML(female, male){
  return "<span>Femenino: "+female+"%"+"</span> <span>Masculino: "+male+"%</span>"
}

const parsingCategory = (d) => ({
    category: d.Category,
    artist: parseInt(d.Artist),
    artwork: parseInt(d.Artwork),
    male: parseInt(d.Male),
    female: parseInt(d.Female),
  });

// const parsingArtist = (d) => ({



function runCode() {
    const BASE_URL = "https://gist.githubusercontent.com/Hernan4444/";
    let URL = BASE_URL + "16a8735acdb18fabb685810fc4619c73/raw/d16677e2603373c8479c6535df813a731025fd4a/";
    URL = URL + "CategoryProcessed.csv";
    console.log(URL)
    d3.csv(URL, parsingCategory).then((data) => {
      dataJoinCategory(data)
    }).catch(error => {
      console.log(error)
    })
    
  }
runCode();