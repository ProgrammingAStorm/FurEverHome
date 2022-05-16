const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4';
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt';
const $tokenButton = $('#get-token');
const $modal = $('.modal');
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
            .addClass("button is-dark m-2")
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
                .addClass("button is-dark m-2")
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
// Uses token to access array of animals, will need to add location query eventually
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
        },
        // If request unsuccessful, log error
        error: function(error) {
            console.log(error)
        }
    })
};

//!!!!!!!!!Replace the $.ajax in #favorites click listener to this function.!!!!!!!//
async function getAnimal(id) {
    return $.ajax({
        type: "GET",
        url: `https://api.petfinder.com/v2/animals/${id}`,
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
        dataType: "json"
    });
}

getToken();

setInterval(() => { getToken() },
(3600 * 1000));


//Refator to have a get animal function that can be passed an ID to get any animal.
$(".card").click(function (event) {
    if($(event.target)[0] === $(this).find("i")[0]) {
        return;
    }

//When the heart icon is clicked, it adds the name and ID to the favorites.
$(".icon").on("click", function() {
    var $petContent = $(this).closest(".card");

    console.log($(this).closest(".card"))
    
    addFavorites(
        $petContent.children(".card-header").children(".card-header-title").text(),
        $petContent.attr("data-id")
    );
});


    $modal.addClass("is-active");
    $("html").addClass("is-clipped");
});

$(".card").on("click", "i", function() {
    console.log($(this).closest(".card").attr("data-id"));
});

$modal.on("click", ".modal-background, .close", function() {
    $modal.removeClass("is-active");
    $("html").removeClass("is-clipped");
});