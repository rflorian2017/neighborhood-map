/* create an array with the initial locations */
const initialLocations = [{
        title: 'Water Tower',
        location: {
            lat: 44.629859,
            lng: 22.6499349
        },
        caption: 'Turnul de apa drobeta',
        captionFlickr: 'castelul de apa drobeta'
    },
    {
        title: 'Cinetic Fountain',
        location: {
            lat: 44.624336,
            lng: 22.6521189
        },
        caption: 'Fantana cinetica drobeta',
        captionFlickr: 'Fantana cinetica drobeta'
    },
    {
        title: '16,50',
        location: {
            lat: 44.6256027,
            lng: 22.6477736
        },
        caption: '16,50 Drobeta',
        captionFlickr: 'Restaurant 16,50 Drobeta'
    },
    {
        title: 'Railroad station',
        location: {
            lat: 44.6220939,
            lng: 22.6419639
        },
        caption: 'Gara Drobeta',
        captionFlickr: 'Gara Drobeta'
    },
    {
        title: 'Traian\'s bridge',
        location: {
            lat: 44.6237118,
            lng: 22.6649434
        },
        caption: 'Piciorul podului',
        captionFlickr: 'Traian bridge drobeta'
    },
    {
        title: 'Iron Gates Museum',
        location: {
            lat: 44.6237118,
            lng: 22.6649434
        },
        caption: 'Iron Gates Museum Drobeta',
        captionFlickr: 'Muzeu Portile de Fier drobeta'
    }

];

let map;
let infowindow;
/* client Id and secret for Foursquare API request */
const clientId = "PLKEOUJEJ3BRRWWUDCPMBCPZHWOYKDGEHUDTPOZQPVFMGU15";
const clientSecret = "ZS2XQVPW1JZLHQYRJD50JTX4PPNGV1LEENOEVJGVZSFM5L0U";
/* API Key for Flick API service */
const flickrApiKey = '314de7a5eaa02b76ab2438beaefe1898';

/* Dr. Babes street, the place where I spent my childhood. It has wonderful memories.
Thanks to my parents, especially to my mom, who made me what I am today ! */
var myHomeLocation = {
    lat: 44.6335713,
    lng: 22.6699706
};

/* The model contains information related to the name of the location, search text for both Flickr and Foursquare, and all the functions called from View Model */
var NeighborhodLocation = function(data) {
    var self = this;
    this.title = data.title;
    this.location = data.location;
    this.visible = ko.observable(true);
    this.caption = data.caption;
    this.captionFlickr = data.captionFlickr;
    this.venueName = '';

    /* create a marker for each location and add a Drop Down animation when the page is loaded */
    this.marker = new google.maps.Marker({
        position: this.location,
        title: this.title,
        animation: google.maps.Animation.DROP
    });

    /* add click listener for each marker */
    this.marker.addListener('click', function() {
        self.populateInfoWindow(self.marker, infowindow);
    });

    /* put markers on the map */
    this.marker.setMap(map);
    this.placeDescription = '';

    /* declare foursquare URL and create it based on the information from the API page */
    let foursquareRequestUr = 'https://api.foursquare.com/v2/venues/search?ll=' + this.location.lat + ',' + this.location.lng + '&client_id=' +
        clientId + '&client_secret=' + clientSecret + '&query=' + this.caption + '&v=20170801' + '&limit=1';

    /* AJAX request and fail */
    $.getJSON(foursquareRequestUr).done(function(data) {
        /* if the information is not found, provide a fail safe situation */
        if (data.response.venues[0]) {
            self.venueName = data.response.venues[0].name;
            self.placeDescription = data.response.venues[0].categories[0].name;
        } else {
            self.venueName = self.title;
        }
    }).fail(function() {
        self.venueName = 'Not available!';
    });

    this.imgSrc = '';

    /* create the flickr URl for the API and make the AJAX request */
    let flickrRequestUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrApiKey + '&text=' + this.captionFlickr + '&format=json&nojsoncallback=1';
    $.getJSON(flickrRequestUrl).done(function(data) {
        /* again, make sure to provide a fail safe */
        if (data.photos && data.photos.photo[0]) {
            self.imgSrc = '<img src="https://farm' + data.photos.photo[0].farm + '.staticflickr.com/' + data.photos.photo[0].server + '/' + data.photos.photo[0].id + '_' + data.photos.photo[0].secret + '_q.jpg"></img>';
        } else {
            self.imgSrc = '<p>Picture is not available</p>';
        }

    }).fail(function() {
        self.imgSrc = '<p>Picture is not available</p>';
    });

    this.populateInfoWindow = function() {
        let idOfVenue = '';
        /* make map focus on the marker */
        map.panTo(self.location);

        /* set an animation for the marker to bounce aproximately twice */
        if (self.marker.getAnimation() !== null) {
            self.marker.setAnimation(null);
        } else {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                self.marker.setAnimation(null);
            }, 1500);
        }
        // Check to make sure the infowindow is not already opened on this marker. And populate the content
        if (infowindow.marker != self.marker) {
            infowindow.marker = self.marker;
            infowindow.setContent('<h4>' + self.venueName + '</h4><div>' + self.placeDescription + '<div>' + self.imgSrc);
            infowindow.open(map, self.marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
                self.marker.setAnimation(null);
            });
        }
    };

    /* the toggle of the marker visibility when a filter is applied */
    this.toggleVisibility = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
    }, this);
};

/* initial function, linked from the HTML for creating the map item and applying KO bindings*/
function initMap() {
    var markers = [];
    map = new google.maps.Map(document.getElementById('map'), {
        center: myHomeLocation,
        zoom: 14
    });

    ko.applyBindings(new ViewModel());
}

var ViewModel = function() {
    var self = this;
    /* make sure to create KO observables based on the data that is updating */
    this.neighborhoodLocations = ko.observableArray([]);
    infowindow = new google.maps.InfoWindow();
    this.filterForLocations = ko.observable("");

    for (var locationItem of initialLocations) {
        self.neighborhoodLocations.push(new NeighborhodLocation(locationItem));
    }

    /* quite a challenge here !!!. Create a filter on the items. Convert them all to lower case to find the searched text in the names */
    this.filterLocations = ko.pureComputed(function() {
        var filter = self.filterForLocations();
        if (!filter) {
            self.neighborhoodLocations().forEach(function(location) {
                /* here, we need to make all the markers visible again when the filter is cleared */
                location.visible(true);
            });
            return self.neighborhoodLocations();
        } else {
            return ko.utils.arrayFilter(self.neighborhoodLocations(), function(item) {
                let filterResult = item.title.toLowerCase().includes(filter.toLowerCase());
                item.visible(filterResult);
                return filterResult;
            });
        }
    }, self);
};

function errorCall() {
    document.getElementById("map").innerHTML = "The map could not be loaded";
}