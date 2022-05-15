const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4';
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt';
const $tokenButton = $('#get-token');
var favorites = [];
var TOKEN;

function fillModal() {
    
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

getToken();

setInterval(() => { getToken() },
(3600 * 1000));

$(".card").click(function (event) {
    if($(event.target)[0] === $(this).find("i")[0]) {
        return;
    }

    $(".modal").addClass("is-active");
    $("html").addClass("is-clipped");

    console.log($(this).attr("data-id"))
});

$(".card").on("click", "i", function() {
    console.log($(this).closest(".card").attr("data-id"));
});

$(".modal").on("click", ".modal-background, .close", function() {
    $(this).closest(".modal").removeClass("is-active");
    $("html").removeClass("is-clipped");
});