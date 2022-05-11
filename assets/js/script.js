const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4'
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt'
var favorites = [];

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
//Copy-Paste Replace this comment with the original comment.
const getToken = () => {
    $.ajax({
        type: "POST",
        url: "https://api.petfinder.com/v2/oauth2/token",
        data: `grant_type=client_credentials&client_id=${ID}&client_secret=${SECRET}`,
        // Upon Success, stores token with a key of 'token'.
        success: function(data) {
            localStorage.setItem('token', data.access_token);
        },
        dataType: "json"
    })
};

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

    let TOKEN = localStorage.getItem('token');

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