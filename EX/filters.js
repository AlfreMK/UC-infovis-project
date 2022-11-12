var CURRENT_RATING = 1;
var CURRENT_FILTER = {"M": true, "F": true, "FED": "ALL"};

function ratingShown(d){
    if (CURRENT_RATING === 1){
        return d.rating_standard;
    }
    else if (CURRENT_RATING === 2){
        return d.rating_rapid;
    }
    else if (CURRENT_RATING === 3){
        return d.rating_blitz;
    }
}


function filterChangeRating(){
    let rating = d3.select("#selector-rating").property("value");
    if (rating === "Classic"){
        CURRENT_RATING = 1;
    }
    else if (rating === "Rapid"){
        CURRENT_RATING = 2;
    }
    else if (rating === "Blitz"){
        CURRENT_RATING = 3;
    }
}

function filterChangeGender(gender){
    if (gender === 1){
        CURRENT_FILTER["F"] = !CURRENT_FILTER["F"];
    }
    else if (gender === 2){
        CURRENT_FILTER["M"] = !CURRENT_FILTER["M"];
    }
}


function filterChangeFed(){
    CURRENT_FILTER["FED"] = d3.select("#selector-federation").property("value");
    // change url of image to the flag of the federation
    const not_found = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Fidelogo.svg/1200px-Fidelogo.svg.png";
    const image = new Image();
    image.onload = () => {
        d3.select("#fed-shown")
            .attr("xlink:href", image.src);
    }
    image.onerror = () => {
        d3.select("#fed-shown")
            .attr("xlink:href", not_found);
    }
    image.src = flagSvg(CURRENT_FILTER["FED"]);
}

function isFedShown(d){
    return CURRENT_FILTER["FED"] === "ALL" || CURRENT_FILTER["FED"] === d.federation;
}



function showCountriesSelect(){
    let url = "https://restcountries.com/v2/all?fields=name,cioc";
    d3.json(url).then((data) => {
      const select = document.getElementById("selector-federation");
      data.forEach(country => {
        if (country.cioc !== "" && country.cioc !== undefined) {
          const option = document.createElement("option");
          option.value = country.cioc;
          option.text = country.name;
          select.appendChild(option);
        }
    });
}).catch(error => {
    console.log(error);
    })
}


function textCountry(name){
    if (name.length > 20){
        return name.substring(0, 17) + "...";
    }
    return name
}

showCountriesSelect();