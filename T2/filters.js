
var CURRENT_FILTERS = {"Alive": true, "Dead": true, "Male": true, "Female": true};


const selectOrder = document.getElementById("selector");
const selectOrder2 = document.getElementById("selector-2");

// FILTERS
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
        sortDivs();
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
        sortDivs();
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
