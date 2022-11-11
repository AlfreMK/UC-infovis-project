var CURRENT_RATING = 1;

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