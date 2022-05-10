const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4'
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt'
const $body = $('body');

// Uses ID and SECRET to obtain API access token
const getToken = () => {
    $.ajax({
        type: "POST",
        url: "https://api.petfinder.com/v2/oauth2/token",
        data: `grant_type=client_credentials&client_id=${ID}&client_secret=${SECRET}`,
        // Upon Success, passes token information to getAnimals function.
        success: function(data) {
            getAnimals(data);
        },
        dataType: "json"
      });
}

// Uses token to access array of animals, will need to add location query eventually
const getAnimals = (data) => {
    $.ajax({
        type: 'GET',
        url: 'https://api.petfinder.com/v2/animals',
        headers: {
            Authorization: `Bearer ${data.access_token}`
        },
        success: function(animals) {
            // Logs array of animals to console
            console.log(animals.animals)
            displayAnimals(animals.animals);
        }
    })
}

const displayAnimals = (array) => {
    array.forEach(element => {
        let $card = $('<div>');
        $card.addClass('card');

        let $cardImageDiv = getAnimalImage(element);

        $card.append($cardImageDiv);
        $body.append($card);
    });
}

getAnimalImage = (element) => {
    
    let $cardImageDiv = $('<div>');
    let $cardFigure = $('<figure>');
    let $image = $('<img>');

    $cardImageDiv.addClass('card-image');
    $cardFigure.addClass('image is-128x128');

    if (element.primary_photo_cropped === null) {
        return
    } else {
        $image.attr('src', element.primary_photo_cropped.small);
    }


    $cardFigure.append($image);
    $cardImageDiv.append($cardFigure);
    
    return $cardImageDiv;
}

// Currently runs at refresh of page, will eventually be tied to an eventlistener on submit of search
getToken()