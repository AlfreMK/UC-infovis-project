
var CURRENT_CATEGORY = "";
var CURRENT_DATA = [];
var Tooltip = d3.select("#tooltip")

var artistContainer = d3.select("#artists");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


function dataJoinArtist(datos) {
    const maxArtwork = d3.max(datos, d => parseInt(d.Categories[CURRENT_CATEGORY]));
    const artworkScale = d3.scaleLinear().domain([0, maxArtwork]).rangeRound([10, 48]);

    artistContainer.selectAll("div")
        .data(datos, d => createSvgArtist(d, artworkScale))
        .enter()
    
}

function createSvgArtist(data, artworkScale) {
    const color = CATEGORY_COLORS[CURRENT_CATEGORY];
    const radius = artworkScale(parseInt(data.Categories[CURRENT_CATEGORY]));
    const idContainer = "artist-"+data.aid;
    const container = artistContainer.append("div")
        .attr("class", "artist-container "+ data.Gender + " " + AliveOrDeath(data))
        .attr("id", idContainer);
        // .attr("title", infoArtist(data));
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
        .attr("r", radius).attr("fill", color);
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
    const title = container.append("p").text(textArtist(data.Artist)).attr("class", "artist-title title-" + data.Gender);
        
    container
        .on("mouseover", function(event, d) {
            // const[x, y] = d3.pointer(event);		
            Tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            Tooltip
                .style("left", (event.pageX) + "px")		
                .style("top", (event.pageY) + "px");	
            Tooltip.html(infoArtistHTML(data));
            })					
        .on("mouseout", function(d) {		
            Tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
    return container;
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


function infoArtist(data){
    final_string = "";
    final_string += "Name: " + data.Artist + "\n";
    final_string += "Gender: " + data.Gender + "\n";
    final_string += "Nacionality: " + data.Nacionality + "\n";
    final_string += "Birth Year: " + data.BirthYear + "\n";
    final_string += "Age: " + data.age + "\n";
    return final_string;
}


function infoArtistHTML(data){
    final_string = "";
    final_string += "<span> Name: " + data.Artist + "</span>";
    final_string += "<span> Gender: " + data.Gender + "</span>";
    final_string += "<span> Nacionality: " + data.Nacionality + "</span>";
    final_string += "<span> Birth Year: " + data.BirthYear + "</span>";
    final_string += "<span> Age: " + data.age + "</span>";
    return final_string;
}

function AliveOrDeath(data){
    if (data.DeathYear === "-1"){
        return "Alive";
    }
    else{
        return "Dead";
    }
}




// Artist: "Robert Arneson"
// BirthYear: "1930"
// Categories: "{'Drawings': 1, 'Prints & Illustrated Books': 1}"
// DeathYear: "1992"
// Gender: "Male"
// Nacionality: "American"
// TotalArtwork: "2"



const parseData = (d) => ({
    ...d,
    Categories: parseDict(d.Categories),
    age: ageArtist(d),
    show: true,
    wasRemoved: false,
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
