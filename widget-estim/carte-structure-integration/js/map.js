var zf = zf || {};

/* FUNCTIONS
 --------------------------------------------------------------------------------------------------------------------------------------*/

(function ($) {
	// ajuste la hauteur pour remplir l'espace du container
	zf.setHeightCanvas = function (wrapper) {
		var mapH = $(window).height() - $('#form-structures-map').outerHeight();
		$('#map-canvas').height(mapH);
		zf.infoWindowMaxHeight = Math.max(400, mapH - 200);
	};

	zf.mcOptions = {styles: [{
				// pour 2 à 10
				width: 53,
				height: 53,
				url: "./img/gmap-cluster-m1.png",
				textColor: 'white'
			},
			{
				// 11 à 50
				width: 56,
				height: 56,
				url: "./img/gmap-cluster-m2.png",
				textColor: 'white'
			},
			{
				// supérieu à 50
				width: 66,
				height: 66,
				url: "./img/gmap-cluster-m3.png",
				textColor: 'white'
			}
		]
	};

	zf.addEvents = function (points) {
		for (var i in points) {
			var point = points[i];
			var latLng = new google.maps.LatLng(point.lat, point.lng);
			var content = '<div class="infowindow-container"'+zf.stylePopup+'>';
				
			if (point.list.length <= 1) {
				// 1 seul évènement : simple popup
				content += '<div class="title-simple">';
				if (point.url) {
					content += '<a href="'+point.url+'">';
				}
				content += point.title;
				if (point.url) {
					content += '</a>';
				}
				content += '</div>';
				
				if (point.list.length == 1) {
					if (point.list[0].img) {
						content += '<div class="info"><img src="'+point.list[0].img+'" alt=""/></div>';
					}
					content += '<div class="info">';
					if (point.list[0].date) {
						content += '<div class="date">' + point.list[0].date + '</div>';
					}
					if (point.list[0].url) {
						content += '<a class="fancybox text" href="' + point.list[0].url + '">' + point.list[0].title + '</a>';
					} else {
						content += '<span class="text">' + point.list[0].title + '</span>';
					}
					if (point.list[0].desc) {
						content += '<p class="text">' + point.list[0].desc + '</p>';
					}
					if (point.list[0].place) {
						var beforePlace = afterPlace = '';
						if (point.list[0].placeURL) {
							beforePlace = '<a class="place" href="'+point.list[0].placeURL+'" target="_blank">';
							afterPlace = '</a>';
						}
						content += beforePlace + point.list[0].place + afterPlace;
					}
					content += '</div>';
				}
				content += '</div>';
			} else {
				// title
				content += '<div class="title">';
				if (point.url) {
					content += '<a href="'+point.url+'">';
				}
				content += point.title;
				if (point.url) {
					content += '</a>';
				}
				content += '</div>';
				
				content += '<div class="subitems">';
				for (var j in point.list) {
					var item = point.list[j];
					// plusieurs évènement : popup complète
					content += '<div class="subitem">';
					if (item.img) {
						content += '<div class="info"><img src="'+item.img+'" alt=""/></div>';
					}
					content += '<div class="info">';
					content += item.date;
					if (item.url) {
						content += '<a href="' + item.url + '" class="fancybox subtitle-link">' + item.title + '</a>';
						content += '<a href="' + item.url + '" class="fancybox fa fa-angle-right"></a>';
					} else {
						content += '<span class="subtitle-link">' + item.title +'</span>';
					}
					if (item.place) {
						var beforePlace = afterPlace = '';
						if (item.placeURL) {
							beforePlace = '<a class="place" href="'+item.placeURL+'" target="_blank">';
							afterPlace = '</a>';
						}
						content += beforePlace + item.place + afterPlace;
					}
					content += '</div></div>';
				}
				content += '</div></div>';
			}
			//Marker
			var marker = new google.maps.Marker({
				position: latLng,
				map: zf.map,
				title:point.title,
				icon: 'img/icon-red.png',
				description: content
			});
			zf.markers.push(marker);
			// on étend les limites pour pouvoir bien zoomer la map sur tous les éléments à la fin
			zf.bounds.extend(latLng);

			//Click : popups
			google.maps.event.addListener(marker, 'click', function (evt) {
				zf.infoWindow.setContent(this.description);
				zf.infoWindow.open(zf.map, this);
				// ajoute la fancy box sur le contenu de la popin
				$("a.fancybox").fancybox({
					'transitionIn': 'elastic',
					'transitionOut': 'elastic',
					'speedIn': 600,
					'speedOut': 200,
					'overlayShow': false
				});
			});
		}
	}
	zf.parseFile = function () {

		$.getJSON(jsonDataURL)
						.done(function (data) {

							zf.bounds = new google.maps.LatLngBounds();
							zf.markers = [];

							zf.addEvents(data.datas.points);

							// fit the map on the markers
							zf.map.fitBounds(zf.bounds);
							zf.mc = new MarkerClusterer(zf.map, zf.markers, zf.mcOptions);
							// customisation des markers : choix de l'icone du marker pour >= 50, >= 20 ou >= 2
							zf.mc.setCalculator(function(markers, numStyles) {
								var index = 1;
								if (markers.length > 50) {
									index = 3;
								} else if (markers.length > 20) {
									index = 2;
								}
								return {text:markers.length, index:index};
							});
							
						})
						.fail(function () {

						})
						.always(function () {

						});
	};

	zf.mapOptions = {
		center: {lat: 48.8699257, lng: 2.3448712},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: [{"featureType": "poi", "stylers": [{"visibility": "off"}]}]
	};

	// taille de l'écran
	zf.stylePopup = (window.innerWidth <= '480') ? '' : ' style="width:380px;"';
	// definition de la carte
	zf.map = new google.maps.Map(document.getElementById('map-canvas'), zf.mapOptions);
	// definition de la popup
	if (true) {
		zf.infoWindow = new google.maps.InfoWindow();
	} else {
		zf.infoWindow = function() {
			var $infoW = $('#mobileInfoWindow');
			this.setContent = function() {

			}
			this.open = function() {
				
			}
		}
	}
	
	zf.loadMap = function () {
		google.maps.event.addDomListener(window, 'load', zf.parseFile);
	}

	// ----------------------------------- gestion datepicker
	zf.datepicker = function () {

		if ($(document).find('.datepicker').length === 0) {
			return false;
		}

		// Datepicker
		$('.datepicker').datepicker({
			showOn: "button",
			buttonImage: "img/picto-calendar.png",
			buttonImageOnly: true
		});

		// Ajout de la date du jour dans le placeholder des champs textes
		var now = new Date();
		var annee = now.getFullYear();
		var mois = now.getMonth() + 1;
		var jour = now.getDate();
		$('.datepicker-from').attr('placeholder', jour + '/' + mois + '/' + annee);
		$('.datepicker-to').attr('placeholder', (jour + 1) + '/' + mois + '/' + annee);
	}
	/* INIT
	 --------------------------------------------------------------------------------------------------------------------------------------*/

	zf.init = function () {
		zf.setHeightCanvas();
		zf.loadMap();
		zf.datepicker();
	};
	/* DOM READY
	 --------------------------------------------------------------------------------------------------------------------------------------*/

	$(document).ready(zf.init);

})(jQuery);
