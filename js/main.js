/*jshint expr:true */
jQuery(function($) {
	function debouncer(func, timeout) {
		var timeoutID;
		timeout = timeout || 200;
		return function() {
			var scope = this,
				args = arguments;
			clearTimeout(timeoutID);
			timeoutID = setTimeout(function() {
				func.apply(scope, Array.prototype.slice.call(args));
			}, timeout);
		};
	}

	function exist(o) {
		d = ($(o).length > 0) ? true : false;
		return d;
	}

	function goToTarget(target) {
		var v = $('html, body'),
			o = $(target).offset().top;
		v.animate({
			scrollTop: o - $('.c-topbar').height() - 40
		}, {
			duration: 500,
			easing: 'easeOutCubic'
		});
	}

	function window_smaller_than(num) {
		var ww = $(window).width();
		if (ww < num) {
			return true;
		} else {
			return false;
		}
	}
	var L = {
		accordion: function() {
			var o = $('.c-contact'),
				l = $('li', o),
				open = 'is-open';
			l.on('click', function() {
				if ($(window).width() <= 670) {
					_t = $(this);
					if ($(this).hasClass(open)) {
						_t.removeClass(open);
					} else {
						if (o.find('.' + open).length > 0) {
							o.find('.' + open).removeClass(open);
							_t.addClass(open);
						} else {
							_t.addClass(open);
						}
					}
				}
			});
		},
		googleMap: function() {
			function initMap() {
				var myLatLng = {
					lat: parseFloat($('#map').attr('data-lat')),
					lng: parseFloat($('#map').attr('data-lng'))
				};
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
				google.load('maps', '3', {
					other_params: 'sensor=false&libraries=places',
					callback: function() {
						initMap();
					}
				});
			});
		},
		relocations: function() {
			function event_date() {
				var el = $('.c-about__lead'),
					status = false;

				function init() {
					el.detach();
					$('.c-header').after(el);
					status = true;
				}
				$(window).resize(debouncer(function(e) {
					if (window_smaller_than(901)) {
						if (status === false) {
							init();
						}
					} else {
						if (status === true) {
							el.detach();
							$('.c-about__video').prepend(el);
							status = false;
						}
					}
				}));
				if (window_smaller_than(901)) {
					init();
				}
			}

			function social() {
				var el = $('.c-social'),
					status = false;

				function init() {
					el.detach();
					$('.c-nav-submenu').append(el);
					status = true;
				}
				$(window).resize(debouncer(function(e) {
					if (window_smaller_than(1024)) {
						if (status === false) {
							init();
						}
					} else {
						if (status === true) {
							el.detach();
							$('.c-bottom').append(el);
							status = false;
						}
					}
				}));
				if (window_smaller_than(1024)) {
					init();
				}
			}

			function submenu() {
				var el = $('.c-nav-primary__item--submenu'),
					status = false;
				$('.c-topbar .o-wrap').append('<nav class="c-nav-submenu"><ul class="c-nav-submenu__content"></ul></nav>');

				function init() {
					el.detach();
					$('.c-nav-submenu .c-nav-submenu__content').append(el);
					status = true;
				}
				$(window).resize(debouncer(function(e) {
					if (window_smaller_than(1024)) {
						if (status === false) {
							init();
						}
					} else {
						if (status === true) {
							el.detach();
							$('.c-nav-primary__btn').before(el);
							status = false;
						}
					}
				}));
				if (window_smaller_than(1024)) {
					init();
				}
				social();
			}
			submenu();
			event_date();
		},
		video: function() {
			$('.js-video').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				iframe: {
					patterns: {
						youtube_short: {
							index: 'youtu.be/',
							id: 'youtu.be/',
							src: '//www.youtube.com/embed/%id%?autoplay=1'
						}
					}
				},
				preloader: false
			});
		},
		init: function() {
			L.accordion();
			L.relocations();
			exist('.js-video') && L.video();
		}
	};
	var N = {
		goTo: function() {
			$('.js-goto').on('click', function(e) {
				e.preventDefault();
				$('.c-nav-primary').find('.is-active').removeClass('is-active');
				$(this).parent().addClass('is-active');
				var t = $(this).attr('href');
				if ($('.c-nav-submenu').hasClass('is-visible')) {
					$('.c-nav-submenu').removeClass('is-visible');
				}
				goToTarget(t);
			});
		},
		navControl: function() {
			// Cache selectors
			var lastId, topMenu = $('.c-nav-primary'),
				topMenuHeight = topMenu.outerHeight() + 215,
				// All list items
				menuItems = topMenu.find("a"),
				// Anchors corresponding to menu items
				scrollItems = menuItems.map(function() {
					var item = $($(this).attr("href"));
					if (item.length) {
						return item;
					}
				});
			// Bind to scroll
			$(window).scroll(function() {
				// Get container scroll position
				var fromTop = $(this).scrollTop() + topMenuHeight;
				// Get id of current scroll item
				var cur = scrollItems.map(function() {
					if ($(this).offset().top < fromTop) return this;
				});
				// Get the id of the current element
				cur = cur[cur.length - 1];
				var id = cur && cur.length ? cur[0].id : "";
				if (lastId !== id) {
					lastId = id;
					// Set/remove active class
					menuItems.parent().removeClass("is-active").end().filter("[href='#" + id + "']").parent().addClass("is-active");
				}
			});
		},
		openSubmenu: function() {
			var el = $('.js-opensubmenu'),
				s = $('.c-nav-submenu');
			el.on('click', function(e) {
				e.preventDefault();
				$(this).toggleClass('is-active');
				s.toggleClass('is-visible');
			})
		},
		init: function() {
			N.navControl();
			N.openSubmenu();
			exist('.c-map') && L.googleMap();
			exist('.js-goto') && N.goTo();
		}
	}
	var S = {
		partners: function() {
			var owl = $('.owl-carousel'),
				status;
				

			function startOwl() {
				owl.owlCarousel({
					dots: true,
					loop: true,
					nav: false,
					items: 4,
					responsive: {
						0: {
							items: 2
						},
						480: {
							items: 4
						}
					},
				});
			}

			function init() {
				if (window_smaller_than(700)) {
					if (status === false) {
						setTimeout(function() {
							startOwl();
						}, 10);
						status = true;
					}
				} else {
					if (status === true) {
						owl.trigger('destroy.owl.carousel');
						status = false;
					}
					
					
				}
			}			

			$(window).resize(debouncer(function(e) {
				init();
			}));

			if (window_smaller_than(700)) {
				status = true;
				startOwl();
			} else {
				$('.owl-carousel').show();
				status = false;
			}
		}
	}
	$(document).ready(function() {
		L.init();
		N.init();
		S.partners();
	});
});