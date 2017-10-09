var initialLocations = [
	{
		title: 'Water Tower',
		location: 
		{
			lat:44.629859,
			lng:22.6499349
		},
		caption: 'Water Castle Drobeta'
	}, 
	{
		title: 'Cinetic Fountain',
		location: 
		{
			lat:44.624336,
			lng:22.6521189
		},
		caption: 'Fountain'
	}	
];

var map;
var infowindow;

/* Dr. Babes street, the place where I spent my childhood. It has wonderful memories.
Thanks to my parents, especially to my mom, who made me what I am today ! */
var myHomeLocation = {lat: 44.6335713, lng: 22.6699706}; 

var NeighborhodLocation = function(data) {
	var self = this;
	this.title = data.title;
	this.location = data.location;
	this.visible = true;
	this.caption = data.caption;
	
	this.marker = new google.maps.Marker({
            position: this.location,
            title: this.title,
			animation: google.maps.Animation.DROP
    });
	
	this.marker.addListener('click', function() {
            self.populateInfoWindow(self.marker,infowindow);
    });
	
	this.marker.setMap(map);
	
	$.getJSON(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=314de7a5eaa02b76ab2438beaefe1898&text=${this.caption}&format=json`).done(function(data) {
		console.log(data);
	});
	
	this.populateInfoWindow = function() {
		console.log("first");
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
            infowindow.setContent('<div>' + this.marker.title + '</div>');
            infowindow.open(map, this.marker);
          // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
				self.marker.setAnimation(null);
			});
        }
    }
}
	
function initMap() {
	
	var markers = [];
	console.log("here");
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
	
	for(locationItem of initialLocations) {
		self.neighborhoodLocations.push(new NeighborhodLocation(locationItem));
	}
	
	this.currentLocation = ko.observable(this.neighborhoodLocations()[0]);
	
	this.filterResults = function() {
		//todo
	}
	 
	 //initMap();
	
};