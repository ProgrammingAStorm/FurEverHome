const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4';
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt';
const $cardContainer = $('#card-container');

var favorites = [];
var TOKEN;

//Updates favorites array, saves the array to localStorage, then updates the elements.
function addFavorites(name, id) {
    //If the array is full then the first favorite is shifted out and the new one is pushed in.
    if(favorites.length === 8) {
        favorites.shift();
        favorites.push({
            name: name,
            id: id
        });

        saveFavorites();

        loadFavorites();
    }
    else {
        $("#favorites").append(
            $("<button>")
            .addClass("button is-dark")
            .text(name)
            .attr("data-pos", favorites.length)
        );

        favorites.push({
            name: name,
            id: id
        });

        saveFavorites();
    }
}
//Gets the favorites from localStorage and updates #favorites.
function loadFavorites() {
    favorites = JSON.parse(localStorage.getItem("favorites"))

    if(!favorites) {
        favorites = [];
    }
    if(favorites.length === 0) {
        return;
    }

    //If #favorites is empty then it will append a button for each element in favorites.
    if($("#favorites").children().length === 0) {
        for(var x = 0; x < favorites.length; x++) {    
            $("#favorites").append(
                $("<button>")
                .addClass("button is-dark")
                .text(favorites[x].name)
                .attr("data-pos", x)
                //The buttons are given the ID of the pet they represent.
                .attr("data-id", favorites[x].id)
            );
        }
    }
    //If #favorites isn't empty, it goes through each button and updates their data.
    else {
        $(".button is-dark").each(function(index) {
            $(this).text(favorites[index].name),
            $(this).attr("data-id", favorites[x].id)
        });
    }
}
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}
// Uses ID and SECRET to obtain API access token
const getToken = () => {
        $.ajax({
        type: "POST",
        url: "https://api.petfinder.com/v2/oauth2/token",
        data: `grant_type=client_credentials&client_id=${ID}&client_secret=${SECRET}`,
        // Upon Success, stores token with a key of 'token'.
        success: function(data) {
            TOKEN = data.access_token;
        },
        dataType: "json"
    })
};

// // Uses token to access array of animals, will need to add location query eventually
const getAnimals = () => {

    $.ajax({
        type: 'GET',
        url: 'https://api.petfinder.com/v2/animals',
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
        // Logs animals object if request is successful
        success: function(animals) {
            console.log(animals.animals)
            displayAnimals(animals.animals)
        },
        // If request unsuccessful, log error
        error: function(error) {
            console.log(error)
        }
    })    

};

// Function to dynamically create cards and append them to #card-container DIV
const displayAnimals = (array) => {

    // Maps over each animal in animal array
    array.forEach(element => {
        
        let $column = $('<div>');
        $column.addClass('column is-half-mobile is-one-third-tablet is-one-quarter-desktop is-one-fifth-widescreen');

        let $card = $('<div>');
        $card.addClass('card ml-5');
        $card.attr('data-id', element.id);

        // Saves returned values of each function to variables
        let $cardImageDiv = getAnimalImage(element);
        let $cardContentDiv = getAnimalContent(element);

        // Build card and append to cardContainer DIV
        $card.append($cardImageDiv);
        $card.append($cardContentDiv);
        $column.append($card)
        $cardContainer.append($column);
    });
}

// Function that returns cardImageDiv with the primary photo for the pet if one is available
const getAnimalImage = (element) => {

    let $cardImageDiv = $('<div>');
    let $cardFigure = $('<figure>');
    let $image = $('<img>');

    $cardImageDiv.addClass('card-image');
    $cardFigure.addClass('image is-square');

    // Check if there is a primary photo, if not return from function
    if (element.primary_photo_cropped === null) {

        return

    } else {
        // If image then set image src to hyperlink
        $image.attr('src', element.primary_photo_cropped.medium);

    }


    $cardFigure.append($image);
    $cardImageDiv.append($cardFigure);
    
    return $cardImageDiv;
}

// Builds elements within card-content section of card
const getAnimalContent = (element) => {

    let $cardContentDiv = $('<div>');
    let $cardMediaContainer = $('<div>');
    let $cardMediaContent = $('<div>');
    let $name = $('<p>');
    let $breed = $('<p>');
    let $tags = getAnimalTags(element);

    $cardContentDiv.addClass('card-content');
    $cardMediaContainer.addClass('media');
    $cardMediaContent.addClass('media-content');

    $name.addClass('title is-4');
    $breed.addClass('subtitle is-6');

    // Checks to see if a tags array is true...an empty string returned to $tags is false, then adds class
    if ($tags) {

        $tags.addClass('content');

    }

    $name.text(element.name);
    $breed.text(element.breeds.primary);

    $cardContentDiv.append($cardMediaContainer);
    $cardMediaContainer.append($cardMediaContent);
    $cardMediaContent.append($name);
    $cardMediaContent.append($breed);
    
    // Checks to see if $tags not an empty string
    if ($tags) {

        $cardContentDiv.append($tags);

    }

    return $cardContentDiv;
}

// Builds tag elements from within object
const getAnimalTags = (element) => {

    let tagsArray = element.tags;
    let $tagList = $('<div>');
    
    $tagList.addClass('tags');

    // If no tags in array, then function returns empty string
    if (!tagsArray.length) {

        return;

    // If there are more than 3 tags in array, limit the tags displayed to the first 3
    } else if (tagsArray.length > 3) {

        for (let i = 0; i < 3; i++) {

            let $tag = $('<span>');

            $tag.addClass('tag');
            $tag.text(tagsArray[i]);

            $tagList.append($tag);
        }

        return $tagList;

    // Makes a tag element for each tag in array, will trigger when (0 < array.length < 3).
    } else {

        tagsArray.forEach((tag) => {

            let $tag = $('<span>');

            $tag.addClass('tag');
            $tag.text(tag)

            $tagList.append($tag);

        });

        return $tagList;

    }
}

// getToken runs on load, with a setInterval to overwrite each hour
getToken() 

setInterval(() => {
    getToken()
}, (3600 * 1000));


//Loads the favorites on page-load to populate #favorites from previously saved favorites.
loadFavorites();


//When the heart icon is clicked, it adds the name and ID to the favorites.
$(".icon").on("click", function() {
    var $petContent = $(this).closest(".card-content");
    
    addFavorites(
        $petContent.children(".name").text(),
        $petContent.attr("data-id")
    );
});

//When a favorites button is pressed it uses the attached ID to query the specifc animal.
$("#favorites").on("click", "button", function() {
    getToken()

    $.ajax({
        type: "GET",
        url: `https://api.petfinder.com/v2/animals/${$(this).attr("data-id")}`,
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
        success: function(data) {
            /*****************************TO DO*********************************
            *On success the data needs to be used to open and populate a modal.*
            *******************************************************************/
            console.log(data)
        },
        dataType: "json"
    })
});
//         },
//         dataType: "json"
//       })
// };
setTimeout(() => {
    getAnimals()
}, 1000)
