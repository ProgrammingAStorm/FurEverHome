var favorites = [];

function addFavorites(name, id) {
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
function loadFavorites() {
    favorites = JSON.parse(localStorage.getItem("favorites"))

    if(!favorites) {
        favorites = [];
    }
    if(favorites.length === 0) {
        return;
    }

    if($("#favorites").children().length === 0) {
        for(var x = 0; x < favorites.length; x++) {    
            $("#favorites").append(
                $("<button>")
                .addClass("button is-dark")
                .text(favorites[x].name)
                .attr("data-pos", x)
                .attr("data-id", favorites[x].id)
            );
        }
    }
    else {
        $(".button is-dark").each(function(index) {
            $(this).text(favorites[index].name),
            $(this).text(favorites[index].id)
        });
    }
}
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

loadFavorites();

$(".icon").on("click", function() {
    var $petContent = $(this).closest(".card-content");
    
    addFavorites(
        $petContent.children(".name").text(),
        $petContent.attr("data-id")
    );
});