const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4'
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt'
const $cardContainer = $('#card-container');

const $tokenButton = $('#get-token');

// Uses ID and SECRET to obtain API access token
const getToken = () => {
    $.ajax({
        type: "POST",
        url: "https://api.petfinder.com/v2/oauth2/token",
        data: `grant_type=client_credentials&client_id=${ID}&client_secret=${SECRET}`,
        // Upon Success, stores token with a key of 'token'.
        success: function(data) {
            getAnimals(data);
        },
        dataType: "json"
      })
};

// // Uses token to access array of animals, will need to add location query eventually
const getAnimals = (data) => {

    $.ajax({
        type: 'GET',
        url: 'https://api.petfinder.com/v2/animals',
        headers: {
            Authorization: `Bearer ${data.access_token}`
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

const displayAnimals = (array) => {

    array.forEach(element => {
        
        let $column = $('<div>');
        $column.addClass('column is-half-mobile is-one-third-tablet is-one-quarter-desktop is-one-fifth-widescreen');

        let $card = $('<div>');
        $card.addClass('card ml-5');

        let $cardImageDiv = getAnimalImage(element);
        let $cardContentDiv = getAnimalContent(element);

        $card.append($cardImageDiv);
        $card.append($cardContentDiv);
        $column.append($card)
        $cardContainer.append($column);
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
    $tags.addClass('content');

    $name.text(element.name);
    $breed.text(element.breeds.primary);

    $cardContentDiv.append($cardMediaContainer);
    $cardMediaContainer.append($cardMediaContent);
    $cardMediaContent.append($name);
    $cardMediaContent.append($breed);
    $cardContentDiv.append($tags);

    return $cardContentDiv;
}

const getAnimalTags = (element) => {
    let $tagList = $('<div>');
    $tagList.addClass('tags');

    element.tags.forEach((tag) => {
        let $tag = $('<span>');
        $tag.addClass('tag');
        $tag.text(tag)
        $tagList.append($tag);
    })

    return $tagList;
}
// Currently runs at refresh of page, will eventually be tied to an eventlistener on submit of search
$tokenButton.on('click', getToken);
