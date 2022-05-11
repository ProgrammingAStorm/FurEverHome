const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4'
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt'

const $tokenButton = $('#get-token');

// Uses ID and SECRET to obtain API access token
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
    //   After completion of request, then rerun getAnimals
      .then(() => {
          getAnimals();
      });
};

// // Uses token to access array of animals, will need to add location query eventually
const getAnimals = () => {
    let TOKEN = localStorage.getItem('token');

    $.ajax({
        type: 'GET',
        url: 'https://api.petfinder.com/v2/animals',
        headers: {
            Authorization: `Bearer ${TOKEN}`
        },
        // Logs animals object if request is successful
        success: function(animals) {
            console.log(animals)
        },
        // If request unsuccessful, run getToken to initiate or renew stored token
        error: function(error) {
            getToken()
        }
    })
};

// Currently runs at refresh of page, will eventually be tied to an eventlistener on submit of search
$tokenButton.on('click', getAnimals);