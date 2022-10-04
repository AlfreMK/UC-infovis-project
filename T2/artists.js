
var CURRENT_CATEGORY = "";
var CURRENT_DATA = [];
var CURRENT_FILTERS = {"Alive": true, "Dead": true, "Male": true, "Female": true};

const selectOrder = document.getElementById("selector");
const selectOrder2 = document.getElementById("selector-2");
const artistContainer = d3.select("#artists");
// https://github.com/PUC-Infovis/codigos-2022-2/blob/main/Clase%2011%20-%20Utilidades%20D3%20I/programa_desarrollo_clases.js


function dataJoinArtist(datos) {
    const maxArtwork = d3.max(datos, d => parseInt(d.Categories[CURRENT_CATEGORY]));
    const artworkScale = d3.scaleLinear().domain([0, maxArtwork]).rangeRound([10, 48]);

    artistContainer.selectAll("div")
        .data(datos, d => createSvgArtist(d, artworkScale))
        .enter()
    
}


function onlyAlive(){
    const aliveBool = document.getElementById("checkbox-alive").checked;
    const deadBool = document.getElementById("checkbox-dead").checked;
    CURRENT_FILTERS["Alive"] = aliveBool;
    CURRENT_FILTERS["Dead"] = deadBool;
    if(aliveBool && !deadBool){
        removeAllDivs(".Dead");
        CURRENT_DATA.map(d => {
            string = AliveOrDeath(d);
            if (string === "Dead"){
                d.show = false;
                d.wasRemoved = true;
            }
            if (string === "Alive"){
                d.show = true;
            }
        });
        joinBaseOnCurrentDataShow(CURRENT_DATA);
    }
    else if(!aliveBool && deadBool){
        removeAllDivs(".Alive");
        CURRENT_DATA.map(d => {
            string = AliveOrDeath(d);
            if (string === "Alive"){
                d.show = false;
                d.wasRemoved = true;
            }
            if (string === "Dead"){
                d.show = true;
            }
        });
        joinBaseOnCurrentDataShow(CURRENT_DATA);
    }
    else if (aliveBool && deadBool){
        CURRENT_DATA.map(d => {
            d.show = true;
        });
        joinBaseOnCurrentDataShow(CURRENT_DATA);
    }
    else if (!aliveBool && !deadBool){
        removeAllDivs(".Alive");
        removeAllDivs(".Dead");
        CURRENT_DATA.map(d => {
            d.show = false;
            d.wasRemoved = true;
        });
    }
}


function onlyFM(){
    const femaleBool = document.getElementById("checkbox-female").checked;
    const maleBool = document.getElementById("checkbox-male").checked;
    CURRENT_FILTERS["Male"] = maleBool;
    CURRENT_FILTERS["Female"] = femaleBool;
    if (femaleBool && !maleBool){
        removeAllDivs(".Male");
        CURRENT_DATA.map(d => {
            if (d.Gender === "Male"){
                d.show = false;
                d.wasRemoved = true;
            }
            if (d.Gender === "Female"){
                d.show = true;
            }
        });
        joinBaseOnCurrentDataShow(CURRENT_DATA);
    }
    else if (!femaleBool && maleBool){
        removeAllDivs(".Female");
        CURRENT_DATA.map(d => {
            if (d.Gender === "Female"){
                d.show = false;
                d.wasRemoved = true;
            }
            if (d.Gender === "Male"){
                d.show = true;
            }
        });
        joinBaseOnCurrentDataShow(CURRENT_DATA);
    }
    else if (femaleBool && maleBool){
        CURRENT_DATA.map(d => {
            d.show = true;
        });
        joinBaseOnCurrentDataShow(CURRENT_DATA);
    }
    else if (!femaleBool && !maleBool){
        removeAllDivs(".Male");
        removeAllDivs(".Female");
        CURRENT_DATA.map(d => {
            d.show = false;
            d.wasRemoved = true;
        });
    }
}

function removeAllDivs(string){
    artistContainer.selectAll(string)
            .transition()
            .duration(1000)
            .styleTween("transform", function() { return d3.interpolate("scale(1)", "scale(0)"); })
            .remove();
}

function joinBaseOnCurrentDataShow(data){
    const maxArtwork = d3.max(data, d => parseInt(d.Categories[CURRENT_CATEGORY]));
        const artworkScale = d3.scaleLinear().domain([0, maxArtwork]).rangeRound([10, 48]);
        data.map(d => {
            if (checkFilters(d)){
                createSvgArtist(d, artworkScale);
                d.wasRemoved = false;
            }
        });
}

function checkFilters(data){
    if (CURRENT_FILTERS[AliveOrDeath(data)] && CURRENT_FILTERS[data.Gender] && data.show === true && data.wasRemoved === true){
        return true;
    }
    return false;
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
        .attr("class", "artist-container "+ data.Gender + " " + AliveOrDeath(data))
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
    const title = container.append("p").text(textArtist(data.Artist)).attr("class", "artist-title title-" + data.Gender);
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

function AliveOrDeath(data){
    if (data.DeathYear === "-1"){
        return "Alive";
    }
    else{
        return "Dead";
    }
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
        CURRENT_DATA.map(d => {
            d.show = true;
        });
        CURRENT_FILTERS = {"Alive": true, "Dead": true, "Male": true, "Female": true};
        document.getElementById("checkbox-alive").checked = true;
        document.getElementById("checkbox-dead").checked = true;
        document.getElementById("checkbox-male").checked = true;
        document.getElementById("checkbox-female").checked = true;
        joinBaseOnCurrentDataShow(CURRENT_DATA);
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
        })
        .transition()
        .styleTween("transform", function() { return d3.interpolate("scale(0)", "scale(1)"); })
        .duration(1000);
    
        // https://stackoverflow.com/questions/32520950/animated-sort-stacked-bar-chart-d3-js
    
        
}

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
