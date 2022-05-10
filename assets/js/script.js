//im lazy lol
const ID = '5ojBPITunTAqqOTxJtnD0gylUmUo3CCjakTjPZsivTFN5D9wc4'
const SECRET = 'j0E7b0TKzxU0qUmPNSGZJ7dsfKpEkgW7PKhr4bvt'

const getToken = () => {
    $.ajax({
        type: "POST",
        url: "https://api.petfinder.com/v2/oauth2/token",
        data: `grant_type=client_credentials&client_id=${ID}&client_secret=${SECRET}`,
        success: function(data) {
            getAnimals(data);
          //do something when request is successfull
        },
        dataType: "json"
      });
}

const getAnimals = (data) => {
    $.ajax({
        type: 'GET',
        url: 'https://api.petfinder.com/v2/animals',
        headers: {
            Authorization: `Bearer ${data.access_token}`
        },
        success: function(animals) {
            console.log(animals)
        }
    })
}

getToken()