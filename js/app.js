var locations = [
	{
		title: 'Water Tower',
		location: 
		{
			lat:44.629859,
			lng:22.6499349
		}
	}, 
	{
		title: 'Cinetic Fountain',
		location: 
		{
			lat:44.624336,
			lng:22.6521189
		}
	}	
];

/* Dr. Babes street, the place where I spent my childhood. It has wonderful memories.
Thanks to my parents, especially to my mom, who made me what I am today ! */
var myHomeLocation = {lat: 44.6335713, lng: 22.6699706}; 

var map;
	
function initMap() {
	
	var markers = [];
	console.log("here");
    map = new google.maps.Map(document.getElementById('map'), {
    center: myHomeLocation,
    zoom: 15
    });
       
	for (var i = 0; i < locations.length; i++) {
		var marker = new google.maps.Marker({
            position: locations[i].location,
            title: locations[i].title,
            animation: google.maps.Animation.DROP,
           // icon: makeMarkerIcon('0091ff'),
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
		marker.setMap(map);
		var largeInfowindow = new google.maps.InfoWindow();
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        // marker.addListener('mouseover', function() {
          // this.setIcon(highlightedIcon);
        // });
        // marker.addListener('mouseout', function() {
          // this.setIcon(defaultIcon);
        // });
	}
			
	//var bounds = new google.maps.LatLngBounds();
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
    }

}
	 
var ViewModel = function() {
	var self = this;
	
	this.filterResults = function() {
		//todo
	}
	
	this.populateMarkerInfo = function() {
		//todo
	}
	 
	 //initMap();
	
};

ko.applyBindings(new ViewModel());