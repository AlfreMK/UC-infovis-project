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
}

function isFedShown(d){
    return CURRENT_FILTER["FED"] === "ALL" || CURRENT_FILTER["FED"] === d.federation;
}