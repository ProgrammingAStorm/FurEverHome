//Data Constants
const ID = 'h68edtg6sdq3zVMM21DYy23u8vH1KHbYsGmeSCLA56vGMGQrwF';
const SECRET = 'WWfvgjXJd7Hhph0hWwaYSb9XxkyRet8xFCCmfW2p';

//JQ Connstants
const $cardContainer = $('#card-container');
const $modal = $('.modal');
const $favDrop = $('#fav-drop');
const $favSec = $('#fav-sec');
const $favs = $('.favorites');
const $window = $(window);
const $formCont = $('#form-content');
const $main = $('main');

//JQ Variable
var $animalCard = $('.card');

//Data Variables
var favorites = [];
var TOKEN;
var wasMobile;

//Checks the width of the window. Whether or not the width is within the mobile breakpoint threshold, it updates the favorites elements appropriately.
function checkFavEL() {
    if(wasMobile === undefined) {
        if($window.width() <= 768) {    
            wasMobile = true;
    
            $favSec.remove();
        }
        else {
            wasMobile = false;
        
            $favDrop.remove();
        }
    }
    else {
        if($window.width() <= 768) {
            if(wasMobile) {
                return;
            }
    
            wasMobile = true;
    
            $favSec.remove();
            $formCont.append($favDrop);
        }
        else {
            if(!wasMobile) {
                return;
            }
        
            wasMobile = false;
        
            $favDrop.remove();
            $main.prepend($favSec); 
        }
    }

    loadFavorites();
}
// Uses ID and SECRET to obtain API access token
function getToken() {
    $.ajax({
        type: "POST",
        url: "https://api.petfinder.com/v2/oauth2/token",
        data: `grant_type=client_credentials&client_id=${ID}&client_secret=${SECRET}`,
        // Upon Success, stores token with a key of 'token'.
        success: function (data) {
            TOKEN = data.access_token;
        },
        dataType: "json"
    });
}

//Updates favorites array, saves the array to localStorage, then updates the elements.
function addFavorites(name, id, distance) {
    //If the array is full then the first favorite is shifted out and the new one is pushed in.
    if(favorites.length === 8) {
        favorites.shift();
        favorites.push({
            name: name,
            id: id,
            distance: distance
        });

        saveFavorites();

        loadFavorites();
    }
    else {
        $(".favorites").each(function() {
            if($(this).hasClass("dropdown-content")) {
                if(favorites.length != 0) {
                    $(this).append(
                        $('<hr>')
                        .addClass('dropdown-divider')
                    )
                }

                $(this).append(
                    $('<div>')
                    .addClass("dropdown-item button is-link is-light")
                    .attr("data-pos", favorites.length)
                    .attr('data-id', id)
                    .attr('data-dis', distance)
                    .append(
                        $("<a>")
                        .addClass('fav-text is-size-5')
                        .text(name)
                    )
                );
            }
            else {
                $(this).append(
                    $("<button>")
                    .addClass("button is-dark is-size-5 m-2 fav-text")
                    .text(name)
                    .attr("data-pos", favorites.length)
                    .attr('data-id', id)
                    .attr('data-dis', distance)
                );
            }
        })

        favorites.push({
            name: name,
            id: id,
            distance: distance
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
        if($('.favorites').children('.dropdown-item').length === 0
            ||
            $(".favorites").children().length === 0) {
            $('.favorites').empty();
        }
        return;
    }

    if($('.favorites').hasClass('dropdown-content')) {
        if($('.favorites').children('.dropdown-item').length === 0) {
            for(var x = 0; x < favorites.length - 1; x++) {
                $(".favorites").append(
                    $('<div>')
                    .addClass("dropdown-item button is-link is-light")
                    .attr("data-pos", x)
                    .attr('data-id', favorites[x].id)
                    .attr('data-dis', favorites[x].distance)
                    .append(
                        $("<a>")
                        .addClass('fav-text')
                        .text(favorites[x].name)
                    ).append(
                        $('<hr>')
                        .addClass('dropdown-divider')
                    )
                );
            }

            $(".favorites").append(
                $('<div>')
                .addClass("dropdown-item button is-link is-light")
                .attr("data-pos", x)
                .attr('data-id', favorites[x].id)
                .attr('data-dis', favorites[x].distance)
                .append(
                    $("<a>")
                    .addClass('fav-text')
                    .text(favorites[x].name)
                )
            )
        }
        else {
            for(var x = 0; x < favorites.length; x++) {
                $('.dropdown-item').each(function() {
                    $(this).attr("data-id", favorites[x].id)
                    .attr('data-dis', favorites[x].distance);
                })
                $(".fav-text").each(function(index) {
                    $(this).text(favorites[index].name);
                });
            }
        }
    }
    else {
        if($(".favorites").children().length === 0) {
            for(var x = 0; x < favorites.length; x++) {    
                $(".favorites").append(
                    $("<button>")
                    .addClass("button is-dark is-size-5 m-2 fav-text ")
                    .text(favorites[x].name)
                    .attr("data-pos", x)
                    .attr("data-id", favorites[x].id)
                    .attr('data-dis', favorites[x].distance)
                );
            }
        }
        else{
            for(var x = 0; x < favorites.length; x++) {
                $('.button').each(function() {
                    $(this).attr("data-id", favorites[x].id)
                    .attr('data-dis', favorites[x].distance)
                })
                $(".fav-text").each(function(index) {
                    $(this).text(favorites[index].name)
                    .addClass('is-size-5');
                });
            }
        }
    }

    $('.button.fav-text, .dropdown-item').click(function(event) {
        event.preventDefault();

        $.when(getModalInfo(
            $(this).attr('data-id'),
            $(this).attr('data-dis')
        )).done(function() {
            $modal.addClass("is-active");
            $("html").addClass("is-clipped");
        })
    })
}
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorites();
}

// Function to request modal information on single animal using ID
async function getModalInfo(id, dis) {  
    return await $.ajax({
        type: "GET",
        url: `https://api.petfinder.com/v2/animals/${id}`,
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
        dataType: "json"
    }).then(function(data) {
        generateInfo(data.animal, dis);
    });

    function generateInfo(data, dis) {
        let $name = $('.modal-card-title');
    
        let $img = $('#modal-image');
        $img.attr('src', '');
    
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
    
        $('#street').text(data.contact.address.address1);
        $('#city-state').text(data.contact.address.city + " " + data.contact.address.state);
        $('#zip').text(data.contact.address.postcode);
        $('#phone').text(data.contact.phone);
        $('#email').text(data.contact.email).attr('href', `mailto:${data.contact.email}`);
    
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
            let tagsArray = data.tags;
            tagsArray.forEach((tag) => {
                let $tag = $('<li>');
                $tag.addClass('tag');
                $tag.text(tag);
    
                $tags.append($tag);
            });
        }

        $('.distance').text(Math.round(dis) + " Miles")
    
        $name.text(data.name);
        if (data.primary_photo_cropped) {
            $img.attr('src', data.primary_photo_cropped.full);
        }
        $description.text(data.description);
        $status.text(data.status.replace(
            data.status.substring(0,1),
            data.status.substring(0,1).toUpperCase()
        ));
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
    
        if(data.colors.primary) {
            $primaryColor.text(data.colors.primary);
        } else {
            $primaryColor.text('N/A');
        }
        if(data.colors.secondary) {
            $secondaryColor.text(data.colors.secondary);
        } else {
            $secondaryColor.text('N/A');
        }
        if(data.colors.tertiary) {
            $tertiaryColor.text(data.colors.tertiary);
        } else {
            $tertiaryColor.text('N/A');
        }
    
        if(data.coat) {
            $coat.text(data.coat);
        }
        else {
            $coat.text('N/A');
        }        
    
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
    
        $adoptUrlBtn.attr('href', data.url);
    }
}

search_api.create("search", {
    on_result: function(data) {
        getAnimals(data.result.properties.Lat, data.result.properties.Lon)

        function getAnimals(lat, lon) {
            $.ajax({
                type: 'GET',
                url: 'https://api.petfinder.com/v2/animals',
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                },
                data: {
                    location: `${lat},${lon}`,
                    distance: 10,
                    limit: 16,
                    page: 1
                },
                // Logs animals object if request is successful
                success: function (animals) {
                    displayAnimals(animals.animals);
                    setPagination(animals.pagination)

                    $(".card").click(function (event) {
                        if ($(event.target)[0] === $(this).find("i")[0]) {
                            return;
                        }

                        $.when(getModalInfo(
                                $(this).attr('data-id'),
                                $(this).attr('data-dis')
                            )
                        ).done(function () {
                            $modal.addClass("is-active");
                            $("html").addClass("is-clipped");
                        });
                    });
                    //When the heart icon is clicked, it adds the name and ID to the favorites.
                    $(".heart").on("click", function() {
                        var $petContent = $(this).closest(".card");

                        console.log($petContent.attr('data-dis'))
                        
                        addFavorites(
                            $petContent.children(".card-header").children(".card-header-title").text(),
                            $petContent.attr("data-id"),
                            $petContent.attr('data-dis')
                        );
                    });
                },
                // If request unsuccessful, log error
                error: function (error) {
                    console.log(error);
                }
            });

            // Function to dynamically create cards and append them to #card-container DIV
            function displayAnimals(array) {

                // Maps over each animal in animal array
                array.forEach(element => {

                    let $column = $('<div>');
                    $column.addClass('column is-one-quarter-desktop is-half-touch');

                    let $card = $('<div>');
                    $card.addClass('card');
                    $card.attr('data-id', element.id)
                    .attr('data-dis', element.distance);

                    // Saves returned values of each function to variables
                    let $cardHeaderHeader = getAnimalHeader(element);
                    let $cardImageDiv = getAnimalImage(element);
                    let $cardContentDiv = getAnimalContent(element);
                    let $cardTagsDiv = getAnimalTags(element);

                    // Build card and append to cardContainer DIV
                    $card.append($cardHeaderHeader);
                    $card.append($cardImageDiv);
                    $card.append($cardContentDiv);

                    if ($cardTagsDiv) {
                        $cardTagsDiv.addClass('pb-1');
                        $card.append($cardTagsDiv);

                    }

                    $column.append($card);
                    $cardContainer.append($column);
                });

                // Function that returns cardHeaderHeader with animal name and favorite icon
                function getAnimalHeader(element) {
                    let $cardHeaderHeader = $('<header>');
                    let $headerTitle = $('<h3>');
                    let $iconSpan = $('<span>');
                    let $favIcon = $('<i>');

                    $cardHeaderHeader.addClass('card-header flex-column-mobile');

                    $headerTitle.addClass('card-header-title is-size-6-mobile');
                    $headerTitle.text(element.name);

                    $iconSpan.addClass('icon heart');

                    $favIcon.addClass('fas fa-heart');

                    $cardHeaderHeader.append($headerTitle);
                    $cardHeaderHeader.append($iconSpan);
                    $iconSpan.append($favIcon);

                    return $cardHeaderHeader;
                }
                // Function that returns cardImageDiv with the primary photo for the pet if one is available
                function getAnimalImage(element) {

                    let $cardImageDiv = $('<div>');
                    let $cardFigure = $('<figure>');
                    let $image = $('<img>')
                        .attr('onerror', "this.src='./assets/images/clipart2339515.png';");

                    $cardImageDiv.addClass('card-image');
                    $cardFigure.addClass('image is-square');

                    // Check if there is a primary photo, if not return from function
                    if (!element.primary_photo_cropped) {
                        $image.attr('src', '');
                    } else {
                        // If image then set image src to hyperlink
                        $image.attr('src', element.primary_photo_cropped.medium);

                    }


                    $cardFigure.append($image);
                    $cardImageDiv.append($cardFigure);

                    return $cardImageDiv;
                }
                // Builds elements within card-content section of card
                function getAnimalContent(element) {

                    let $cardContentContainer = $('<div>');
                    let $cardContent = $('<div>');
                    let $flexDiv = $('<div>');
                    let $breed = $('<p>');
                    let $gender = $('<p>');

                    $cardContentContainer.addClass('card-content p-2');
                    $cardContent.addClass('content');
                    $flexDiv.addClass('is-flex flex-column-mobile is-justify-content-space-around');

                    $breed.addClass('subtitle is-6 m-0 has-text-weight-semibold');
                    $gender.addClass('subtitle is-6 m-0 has-text-weight-semibold');

                    $breed.text(element.breeds.primary);
                    $gender.text(element.gender);

                    $cardContentContainer.append($cardContent);
                    $cardContent.append($flexDiv);
                    $flexDiv.append($breed);
                    $flexDiv.append($gender);

                    return $cardContentContainer;
                }
                // Builds tag elements from within object
                function getAnimalTags(element) {
                    let $tagsDiv = $('<div>');
                    let tagsArray = element.tags;
                    let $tagList = $('<ul>');

                    $tagList.addClass('is-flex flex-column-mobile is-justify-content-space-evenly m-0');

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

                        $tagsDiv.append($tagList);
                        return $tagsDiv;

                        // Makes a tag element for each tag in array, will trigger when (0 < array.length < 3).
                    } else {

                        for (let i = 0; i < tagsArray.length; i++) {

                            let $tag = $('<li>');

                            $tag.addClass('tag');

                            $tag.text(tagsArray[i]);

                            $tagList.append($tag);

                        };
                      
                        $tagsDiv.append($tagList);
                        return $tagsDiv;
                    }
                }
            }

            //Sets the page buttons to the links returned from the API.
            function setPagination(data) {
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
            //Queries the API for more pages.
            function goToNewPage() {
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
        }
    }
})

checkFavEL();

// getToken runs on load, with a setInterval to overwrite each hour
getToken() 

setInterval(() => {
        getToken()
    }, (3600 * 1000)
);

//Opens and closes the dropdown
$(".dropdown").click(function(event) {
    event.preventDefault();

    if($(this).find(".dropdown-content").children().length === 0) {
        return;
    }

    if($(this).hasClass("is-active")) {
        $(this).removeClass("is-active");
    }
    else {
        $(this).addClass("is-active")
    }
});
//Clears the favorites
$('#clear').click(function(event) {
    event.preventDefault();
    
    localStorage.removeItem('favorites');

    loadFavorites();
})

//Closes the modal
$modal.on("click", ".modal-background, .close", function() {
    $modal.removeClass("is-active");
    $("html").removeClass("is-clipped");
    window.scrollTo(0, 0);
});

//Everytime the window is resized, checkFavEl() is run to update according to the window's width.
$window.resize(checkFavEL);
