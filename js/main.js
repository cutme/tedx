/*jshint expr:true */

jQuery(function($) {
	function exist(o) {
		d = ($(o).length>0) ? true : false;
		return d;
	}
	
	function goToTarget(target) {
		var v = $('html, body'), o = $(target).offset().top;
		v.animate({
			scrollTop: o - $('.c-topbar').height() - 40
		}, {
			duration: 500,
			easing: 'easeOutCubic'
		});
	}


       
          
	var L = {
		googleMap: function() {

			function initMap() {
				var myLatLng = {lat: parseFloat($('#map').attr('data-lat')), lng: parseFloat($('#map').attr('data-lng'))};

				var map = new google.maps.Map(document.getElementById('map'), {
					zoom: 14,
					center: myLatLng,
					scrollwheel: false
				});
				
				var marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					title: 'Hello World!'
				});
				
				google.maps.event.addDomListener(window, 'resize', function() {
                   map.setCenter(myLatLng);

                });
                
                marker.setMap(map);
			}

            $.getScript('https://www.google.com/jsapi', function() {
                google.load('maps', '3', { other_params: 'sensor=false&libraries=places', callback: function() {
                   initMap();                   
                }});
            });
        },
		video: function() {
			$('.js-video').magnificPopup({
				disableOn: 700,
				//fixedContentPos: false,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				gallery: {
					enabled: true
				},
				iframe: {
					patterns: {
						youtube_short: {
							index: 'youtu.be/',
							id: 'youtu.be/',
							src: '//www.youtube.com/embed/%id%?autoplay=1'
						}
					}
				},
				preloader: false,
			});
		},
		init: function() {
			exist('.js-video') && L.video();
		}
	};
	
	var N = {
		goTo: function() {
			$('.js-goto').on('click', function(e) {
				e.preventDefault();
				var t = $(this).attr('href');
				goToTarget(t);
			});
		},
		init: function() {
			exist('.c-map') && L.googleMap();
			exist('.js-goto') && N.goTo();
		}
	}

	$(document).ready(function() {
		L.init();
		N.init();
	});
});