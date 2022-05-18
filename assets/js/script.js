const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4';
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt';
const $cardContainer = $('#card-container');


const $tokenButton = $('#get-token');
const $modal = $('.modal');
var favorites = [];
var TOKEN;
let $animalCard = $('.card');



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

// // Uses token to access array of animals, will need to add location query eventually
const getAnimals = () => {

    $.ajax({
        type: 'GET',
        url: `https://api.petfinder.com/v2/animals?limit=16&page=1`,
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
        // Logs animals object if request is successful
        success: function(animals) {
            displayAnimals(animals.animals)
            setPagination(animals.pagination)
        },
        // If request unsuccessful, log error
        error: function(error) {
            console.log(error)
        }
    })    

};

// Function to dynamically create cards and append them to #card-container DIV
const displayAnimals = (array) => {

    $cardContainer.html('');
    // Maps over each animal in animal array
    array.forEach(element => {
        
        let $column = $('<div>');
        $column.addClass('column is-one-quarter-desktop is-full-touch');

        let $card = $('<div>');
        $card.addClass('card ml-5');
        $card.attr('data-id', element.id);

        // Saves returned values of each function to variables
        let $cardHeaderHeader = getAnimalHeader(element)
        let $cardImageDiv = getAnimalImage(element);
        let $cardContentDiv = getAnimalContent(element);
        let $cardTagsDiv = getAnimalTags(element)

        // Build card and append to cardContainer DIV
        $card.append($cardHeaderHeader);
        $card.append($cardImageDiv);
        $card.append($cardContentDiv);

        if ($cardTagsDiv) {
            $cardTagsDiv.addClass('pb-1');
            $card.append($cardTagsDiv);
        
        }

        $column.append($card)
        $cardContainer.append($column);
    });
}

// Function that returns cardHeaderHeader with animal name and favorite icon
const getAnimalHeader = (element) => {

    let $cardHeaderHeader = $('<header>');
    let $headerTitle = $('<h3>');
    let $modalButton = $('<button>')
    let $iconSpan = $('<span>');
    let $favIcon = $('<i>');

    $cardHeaderHeader.addClass('card-header');

    $headerTitle.addClass('card-header-title');
    $headerTitle.text(element.name);

    $modalButton.addClass('button is-info is-small mr-5 mt-3');
    $modalButton.text('More Info');
    $modalButton.attr('data-id', element.id);
    $modalButton.on('click', getModalInfo);

    $iconSpan.addClass('icon');

    $favIcon.addClass('fas fa-heart')

    $cardHeaderHeader.append($headerTitle);
    $cardHeaderHeader.append($modalButton);
    $cardHeaderHeader.append($iconSpan);
    $iconSpan.append($favIcon);

    return $cardHeaderHeader
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

    let $cardContentContainer = $('<div>');
    let $cardContent = $('<div>');
    let $flexDiv = $('<div>');
    let $breed = $('<p>');
    let $gender = $('<p>');

    $cardContentContainer.addClass('card-content p-2');
    $cardContent.addClass('content');
    $flexDiv.addClass('is-flex is-justify-content-space-around');

    $breed.addClass('subtitle is-6 m-0');
    $gender.addClass('subtitle is-6 m-0');

    $breed.text(element.breeds.primary);
    $gender.text(element.gender);

    $cardContentContainer.append($cardContent);
    $cardContent.append($flexDiv);
    $flexDiv.append($breed);
    $flexDiv.append($gender);
    
    return $cardContentContainer;
}

// Builds tag elements from within object
const getAnimalTags = (element) => {
    let $tagsDiv = $('<div>')
    let tagsArray = element.tags;
    let $tagList = $('<ul>');
    
    $tagList.addClass('is-flex is-justify-content-space-evenly m-0');

    // If no tags in array, then function returns empty string
    if (!tagsArray.length) {

        return;

    // If there are more than 3 tags in array, limit the tags displayed to the first 3
    } else if (tagsArray.length > 3) {

        for (let i = 0; i < 3; i++) {

            let $tag = $('<li>');

            $tag.addClass('tag');

            $tag.text(tagsArray[i]);

            $tagList.append($tag);
        }

        $tagsDiv.append($tagList)
        return $tagsDiv;

    // Makes a tag element for each tag in array, will trigger when (0 < array.length < 3).
    } else {

        for (let i = 0; i < tagsArray.length; i++) {

            let $tag = $('<li>');

            $tag.addClass('tag');

            $tag.text(tagsArray[i])

            $tagList.append($tag);

        };

        $tagsDiv.append($tagList)
        return $tagsDiv;

    }
}

// Function to request modal information on single animal using ID
const getModalInfo = (event) => {
    let animalID = event.target.dataset.id;
    
    $.ajax({
        type: "GET",
        url: `https://api.petfinder.com/v2/animals/${animalID}`,
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
        success: function(data) {
            displayModal(data.animal);
        },
        dataType: "json"
    })
}

// Funtion to display the modal and add click events to close modal
const displayModal = (data) => {

    let $modalCloseBtn = $('.delete');
    let $modalBackground = $('.modal-background');

    $modal.addClass('is-active');

    generateInfo(data);

    $modalCloseBtn.on('click', closeModal);
    $modalBackground.on('click', closeModal);

}

// Removes is-active class from modal, closing the modal
const closeModal = () => {
    let $modal = $('.modal');

    $modal.removeClass('is-active')

}

const generateInfo = (data) => {
    
    console.log(data);
    let $name = $('.modal-card-title');

    let $img = $('#modal-image');

    let $description = $('.description');
    let $tags = $('.tags');

    let $status = $('.status');
    let $age = $('.age');
    let $gender = $('.gender');
    let $size = $('.size');

    let $primaryBreed = $('#primary-breed');
    let $secondaryBreed = $('#secondary-breed');
    let $isMixedBreed = $('#is-mixed');
    let $unknownBreed = $('#unknown');

    let $primaryColor = $('#primary-color');
    let $secondaryColor = $('#secondary-color');
    let $tertiaryColor = $('#tertiary-color');

    let $coat = $('.coat');

    let $isDeclawed = $('#is-declawed');
    let $isHouseTrained = $('#is-house-trained');
    let $hasShots = $('#has-shots');
    let $isFixed = $('#is-fixed');
    let $isSpecialNeeds = $('#is-special-needs');

    let $catEnv = $('#cat-env');
    let $dogEnv = $('#dog-env');
    let $childEnv = $('child-env');

    let $publishDate = $('#publish-date');

    let $adoptUrlBtn = $('#adopt-url');

    if (data.tags) {
        $tags.html('')

        let tagsArray = data.tags;
        tagsArray.forEach((tag) => {
            let $tag = $('<li>');
            $tag.addClass('tag');
            $tag.text(tag);

            $tags.append($tag);
        })
    }

    $name.text(data.name);
    $img.attr('src', data.primary_photo_cropped.full)
    $description.text(data.description);
    $status.text(data.status);
    $age.text(data.age);
    $gender.text(data.gender);
    $size.text(data.size);
    $primaryBreed.text(data.breeds.primary);
    
    if (data.breeds.unknown) {
        $primaryBreed.text('Unknown');
        $secondaryBreed.text('Unknown');
        $isMixedBreed.text('Unknown');
        $unknownBreed.text('The breed of this pet is unknown');

    }
    else if (data.breeds.mixed) {
        $secondaryBreed.text(data.breeds.secondary);
        $isMixedBreed.text('Yes');
        $unknownBreed.text('');

    } else {
        $secondaryBreed.text('N/A');
        $isMixedBreed.text('No');
        $unknownBreed.text('');
    }

    $primaryColor.text(data.colors.primary);
    $secondaryColor.text(data.colors.secondary);
    $tertiaryColor.text(data.colors.tertiary);

    $coat.text(data.coat);

    if (data.attributes.declawed) {
        $isDeclawed.text(data.attributes.declawed);
    } else {
        $isDeclawed.text('N/A');
    }

    if (data.attributes.house_trained) {
        $isHouseTrained.text('Yes');
    } else {
        $isHouseTrained.text('No');
    }

    if (data.attributes.spayed_neutered) {
        $isFixed.text('Yes');
    } else {
        $isFixed.text('No');
    }

    if (data.attributes.shots_current) {
        $hasShots.text('Yes');
    } else {
        $hasShots.text('No');
    }

    if (data.attributes.special_needs) {
        $isSpecialNeeds.text('Yes');
    } else {
        $isSpecialNeeds.text('No');
    }

    if (data.environment.cats) {
        $catEnv.text('Yes');
    } else {
        $catEnv.text('No');
    }

    if (data.environment.dogs) {
        $dogEnv.text('Yes');
    } else {
        $dogEnv.text('No');
    }

    if (data.environment.children) {
        $childEnv.text('Yes');
        $childEnv.text('No');
    }

    $publishDate.text(dayjs(data.published_at).format('YYYY-MM-DD'));

    $adoptUrlBtn.attr('href', data.url)
}

const setPagination = (data) => {

    let paginationLinks = data._links;
    let $previous = $('.pagination-previous');
    let $next = $('.pagination-next');

    if (data.current_page === 1) {

        $previous.addClass('is-disabled');

    } else if (data.current_page === 2) {

        $previous.removeClass('is-disabled');
        $previous.attr('data-page', paginationLinks.previous.href);

    } else {

        $previous.attr('data-page', paginationLinks.previous.href);
        
    }

    if (data.current_page === data.total_pages) {

        $next.addClass('is-disabled');

    } else if (data.current_page === (data.total_pages - 1)) {

        $next.removeClass('is-disabled');
        $next.attr('data-page', paginationLinks.next.href);

    } else {

        $next.attr('data-page', paginationLinks.next.href);

    }

    $previous.on('click', goToNewPage);
    $next.on('click', goToNewPage);

}

const goToNewPage = function (event) {

    $.ajax({
    type: 'GET',
    url: `https://api.petfinder.com${this.dataset.page}`,
    headers: {
        Authorization: `Bearer ${TOKEN}`
    },
    // Logs animals object if request is successful
    success: function(animals) {
        displayAnimals(animals.animals)
        setPagination(animals.pagination)
    },
    // If request unsuccessful, log error
    error: function(error) {
        console.log(error)
    }
})    

}


// getToken runs on load, with a setInterval to overwrite each hour
getToken() 

setInterval(() => {
    getToken()
}, (3600 * 1000));


//Loads the favorites on page-load to populate #favorites from previously saved favorites.
loadFavorites();
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

setTimeout(() => {
    getAnimals()
}, 1000);

$(".card").on("click", "i", function() {
    console.log($(this).closest(".card").attr("data-id"));
});

$modal.on("click", ".modal-background, .close", function() {
    $modal.removeClass("is-active");
    $("html").removeClass("is-clipped");
});
