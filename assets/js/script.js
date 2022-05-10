const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4'
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt'
const $displaySect = $('#display-animals');

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
        let $cardContentDiv = getAnimalContent(element);

        $card.append($cardImageDiv);
        $card.append($cardContentDiv);
        $displaySect.append($card);
    });
}

getAnimalImage = (element) => {

    let $cardImageDiv = $('<div>');
    let $cardFigure = $('<figure>');
    let $image = $('<img>');

    $cardImageDiv.addClass('card-image');
    $cardFigure.addClass('image is-square');

    if (element.primary_photo_cropped === null) {
        return
    } else {
        $image.attr('src', element.primary_photo_cropped.medium);
    }


    $cardFigure.append($image);
    $cardImageDiv.append($cardFigure);
    
    return $cardImageDiv;
}

const getAnimalContent = (element) => {
    let $cardContentDiv = $('<div>');
    let $name = $('<p>');
    let $breed = $('<p>');
    let $age = $('<p>');
    let $gender = $('<p>');

    $cardContentDiv.addClass('card-content');
    $name.addClass('title');
    $breed.addClass('subtitle');
    $age.addClass('subtitle');
    $gender.addClass('subtitle');

    $name.text(element.name);
    $breed.text(element.breeds.primary);
    $age.text(element.age);
    $gender.text(element.gender);

    $cardContentDiv.append($name);
    $cardContentDiv.append($breed);
    $cardContentDiv.append($age);
    $cardContentDiv.append($gender);

    return $cardContentDiv;
}

// Currently runs at refresh of page, will eventually be tied to an eventlistener on submit of search
getToken()