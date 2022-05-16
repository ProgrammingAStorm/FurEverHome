const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4';
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt';
const $tokenButton = $('#get-token');
const $modal = $('.modal');
var favorites = [];
var TOKEN;

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