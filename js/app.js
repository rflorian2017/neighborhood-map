var initialLocations = [
	{
		title: 'Water Tower',
		location: 
		{
			lat:44.629859,
			lng:22.6499349
		},
		caption: 'Water Castle'
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

/* Dr. Babes street, the place where I spent my childhood. It has wonderful memories.
Thanks to my parents, especially to my mom, who made me what I am today ! */
var myHomeLocation = {lat: 44.6335713, lng: 22.6699706}; 

var NeighborhodLocation = function(data) {
	this.title = data.title;
	this.location = data.location;
	
	this.marker = new google.maps.Marker({
            position: this.location,
            title: this.title,
			animation: google.maps.Animation.DROP
    });
	
	this.marker.setMap(map);
	
	this.populateInfoWindow = function(infowindow) {
		console.log("first");
		if (this.marker.getAnimation() !== null) {
          this.marker.setAnimation(null);
        } else {
          this.marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        // Check to make sure the infowindow is not already opened on this marker.
        // if (infowindow.marker != marker) {
          // infowindow.marker = marker;
          // infowindow.setContent('<div>' + marker.title + '</div>');
          // infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          // infowindow.addListener('closeclick', function() {
            // infowindow.marker = null;
			// marker.setAnimation(null);
          // });
        // }
    }
}
	
function initMap() {
	
	var markers = [];
	console.log("here");
    map = new google.maps.Map(document.getElementById('map'), {
    center: myHomeLocation,
    zoom: 14
    });
       
	// for (var i = 0; i < initialLocations.length; i++) {
		
        // Push the marker to our array of markers.
        // markers.push(marker);
		// marker.setMap(map);
		// var largeInfowindow = new google.maps.InfoWindow();
		
        // Create an onclick event to open the large infowindow at each marker.
        // marker.addListener('click', function() {
            // populateInfoWindow(this, largeInfowindow);
        // });
	// }
	
	ko.applyBindings(new ViewModel());
}
	 
var ViewModel = function() {
	var self = this;
	this.neighborhoodLocations = ko.observableArray([]);
	
	for(locationItem of initialLocations) {
		self.neighborhoodLocations.push(new NeighborhodLocation(locationItem));
	}
	
	this.filterResults = function() {
		//todo
	}
	
	this.populateMarkerInfo = function() {
		self.printSomething();
		
	}
	 
	 //initMap();
	
};