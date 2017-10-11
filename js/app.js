const initialLocations = [
	{
		title: 'Water Tower',
		location: 
		{
			lat:44.629859,
			lng:22.6499349
		},
		caption: 'Turnul de apa drobeta',
		captionFlickr: 'castelul de apa drobeta'
	}, 
	{
		title: 'Cinetic Fountain',
		location: 
		{
			lat:44.624336,
			lng:22.6521189
		},
		caption: 'Fantana cinetica drobeta',
		captionFlickr: 'Fantana cinetica drobeta'
	}	
];

var map;
var infowindow;
const clientId = "PLKEOUJEJ3BRRWWUDCPMBCPZHWOYKDGEHUDTPOZQPVFMGU15";
const clientSecret = "ZS2XQVPW1JZLHQYRJD50JTX4PPNGV1LEENOEVJGVZSFM5L0U";
const flickrApiKey = '314de7a5eaa02b76ab2438beaefe1898';

/* Dr. Babes street, the place where I spent my childhood. It has wonderful memories.
Thanks to my parents, especially to my mom, who made me what I am today ! */
var myHomeLocation = {lat: 44.6335713, lng: 22.6699706}; 

var NeighborhodLocation = function(data) {
	var self = this;
	this.title = data.title;
	this.location = data.location;
	this.visible = ko.observable(true);
	this.caption = data.caption;
	this.captionFlickr = data.captionFlickr;
	this.venueName = '';
	
	this.marker = new google.maps.Marker({
            position: this.location,
            title: this.title,
			animation: google.maps.Animation.DROP
    });
	
	this.marker.addListener('click', function() {
            self.populateInfoWindow(self.marker,infowindow);
    });
	
	this.marker.setMap(map);
	this.placeDescription = '';
	
	let foursquareRequestUr = 'https://api.foursquare.com/v2/venues/search?ll=' + this.location.lat+',' + this.location.lng + '&client_id='+ 
			 clientId + '&client_secret=' + clientSecret + '&query=' + this.caption + '&v=20170801' + '&limit=1';
		
	$.getJSON(foursquareRequestUr).done(function(data) {
		
		self.venueName = data.response.venues[0].name;
		self.placeDescription = data.response.venues[0].categories[0].name;
		if(self.venueName==='undefined') {
			self.venueName = self.title;
		}
	}).fail(function() {
		this.contentOfInfoWindow = 'The request could not be completed';
	});
	
	this.imgSrc = '';
	
	let flickrRequestUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+flickrApiKey+'&text='+this.captionFlickr+'&format=json&nojsoncallback=1';
	$.getJSON(flickrRequestUrl).done(function(data) {
		self.imgSrc = 'https://farm'+data.photos.photo[0].farm+'.staticflickr.com/'+data.photos.photo[0].server +'/'+data.photos.photo[0].id+'_'+data.photos.photo[0].secret+'_q.jpg';
	}).fail(function() {
		this.contentOfInfoWindow = 'The request could not be completed';
	});
	
	this.populateInfoWindow = function() {
		let contentOfInfoWindow = '';
		let idOfVenue = '';
		map.panTo(self.location);
		
		if (self.marker.getAnimation() !== null) {
          self.marker.setAnimation(null);
        } else {
          self.marker.setAnimation(google.maps.Animation.BOUNCE);
		  setTimeout(function() {
			  self.marker.setAnimation(null);
		  },1500);
        }
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != self.marker) {
			infowindow.marker = self.marker;
            infowindow.setContent('<h4>' + self.venueName + '</h4><div>' + self.placeDescription + '<div>' + '<img src='+ self.imgSrc +'></img>');
            infowindow.open(map, self.marker);
          // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
				self.marker.setAnimation(null);
			});
        }
    }
	
	this.toggleVisibility = ko.computed(function() {
		if(this.visible()===true) {
			this.marker.setMap(map);
		}
		else {
			this.marker.setMap(null);
		}
	},this);
}
	
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
	this.neighborhoodLocations = ko.observableArray([]);
	infowindow = new google.maps.InfoWindow();
	this.filterForLocations = ko.observable("");
	
	for(locationItem of initialLocations) {
		self.neighborhoodLocations.push(new NeighborhodLocation(locationItem));
	}
	
	this.filterLocations = ko.pureComputed(function() {
		var filter = self.filterForLocations();
        if(!filter) {
			self.neighborhoodLocations().forEach(function(location){
				location.visible(true);
			});
            return self.neighborhoodLocations(); 
        } else {
            return ko.utils.arrayFilter(self.neighborhoodLocations(), function(item) {
				let filterResult = item.title.toLowerCase().includes(filter);
				item.visible(filterResult);
                return filterResult;
            });
        }
    },self);	
};