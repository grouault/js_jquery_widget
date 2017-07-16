var zf = zf || {};

/* FUNCTIONS
 --------------------------------------------------------------------------------------------------------------------------------------*/

(function ($) {
	
	var $formEventMap = $('#form-structures-map');
	var $nomEvt = $formEventMap.find("input[name=searchEvent]");
	var $startDate = $formEventMap.find("input[name=searchStartDate]");
	var $endDate = $formEventMap.find("input[name=searchEndDate]");
	
	/**
	* Permet de creer un objet Date. 
	* @param : strDateString au format dd/mm/yyyy.
	*/
	function toDate(strDateString) {
	  var tabDate = strDateString.split("/");
	  var newDate = new Date(tabDate[2], (tabDate[1]-1), tabDate[0]);
	  return newDate;
	}
	
	/**
	 * renvoie les infos d'un évènement pour l'affichage du bloc texte.
	 */
	function getInfoItem(event) {
		var content = '';
		var urlDetailEvent = 'undefined';
		if (typeof(urlPageDetailEvent) != 'undefined') {
			urlDetailEvent = urlPageDetailEvent + "/" + encodeURIComponent((event.title).toLowerCase()) + '/' + event.id;
		}
		if (event.vignetteUrl) {
			content += '<div class="info"><img src="'+event.vignetteUrl+'" alt=""/></div>';
		}
		content += '<div class="info">';

		if ( typeof(urlDetailEvent) != 'undefined' ) {
			content += '<a target="_blank" href="' + urlDetailEvent + '">' + event.title + '</a>';
		} else {
			content += '<span class="text">' + event.title + '</span>';
		}
		if (event.startDate) {
			content += '<div class="date"><span class="infoDate">Du ' + event.startDate + ' au ' + event.endDate + '</span></div>';
		}
		/*
		if (event.description) {
			content += '<p class="text">' + event.description + '</p>';
		}
		*/
		/*
		if (event.place) {
			var beforePlace = afterPlace = '';
			if (event.placeURL) {
				beforePlace = '<a class="place" href="'+event.placeURL+'" target="_blank">';
				afterPlace = '</a>';
			}
			content += beforePlace + event.place + afterPlace;
		}
		*/
		content += '</div>';
		return content;
	}
	
	// permet de gerer la recherche.
	var searchEventBag = (function(){
		
		var __searchEventBag = [];
				
		return {
			addEventBag : function (event, marker) {
				if (typeof(event) != "undefined") {
					var eventBag = {
							"title" : typeof(event.title) != 'undefined' ? event.title : '',
							"desc" : typeof(event.description) != 'undefined' ? event.description : '',
							"nomStructure" : typeof(event.nomStructure) != 'undefined' ? event.nomStructure : '',
							"startDate" : event.startDate,
							"endDate" : event.endDate,
							"marker" : marker,
							"latitude" : event.latitude,
							"longitude" : event.longitude
						};
					__searchEventBag.push(eventBag);					
				}
			},
			showMarkersByCriterias : function ( searchText, searchStartDate, searchEndDate) {
				
				var markersToShow = [];
				var latlngbounds = new google.maps.LatLngBounds();
				
				for (var i = 0 ; i<__searchEventBag.length ; i++) {
					
					var eventBag = __searchEventBag[i];
					var curMarker = eventBag.marker;
					var bVisible = true;
					
					// criteria text.
					if (searchText.length > 0) {
						if ( eventBag.title.toLowerCase().indexOf( searchText.toLowerCase() ) == -1 
								&& eventBag.desc.toLowerCase().indexOf( searchText.toLowerCase()) == -1
								&& eventBag.nomStructure.toLowerCase().indexOf( searchText.toLowerCase()) == -1
						) {
							bVisible = false;
						}
					}
					// criteria date deb.
					if (bVisible && searchStartDate.length > 0) {
						if ( toDate(eventBag.startDate) < toDate(searchStartDate) ) {
							bVisible = false;
						} 					
					}
					// criteria date fin
					if (bVisible && searchEndDate.length > 0) {
						if (toDate(eventBag.endDate) > toDate(searchEndDate) ) {
							bVisible = false;
						}							
					}
					// visible.
					if (bVisible) {
						markersToShow.push( curMarker );
						latlngbounds.extend( new google.maps.LatLng(eventBag.latitude, eventBag.longitude) );
					}
				}
				
				// affichage des markers.
				for (var i = 0; i<markersToShow.length; i++) {
					markersToShow[i].setVisible(true);
				}
				
				// redéfiniation de la plage des latiudes/longitude.
				zf.map.fitBounds(latlngbounds);
				
			}
		}
		
	})();
	
	
	// ajuste la hauteur pour remplir l'espace du container
	zf.setHeightCanvas = function (wrapper) {
		var mapH = $(window).height() - $formEventMap.outerHeight();
		$('#map-canvas').height(mapH);
		zf.infoWindowMaxHeight = Math.max(400, mapH - 200);
	};

	zf.mcOptions = {
			styles: [{
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
			var latLng = new google.maps.LatLng(point.latitude, point.longitude);
			var content = '<div class="infowindow-container"'+zf.stylePopup+'>';
			var events = []; // liste des events associé au point.
			
			if (point.list.length <= 1) {
				// ONE EVENT : simple popup
				// title
				content += '<div class="title-simple">';
				if (point.url) {
					content += '<a href="' + point.url + '">';
				}
				content += point.title;
				if (point.url) {
					content += '</a>';
				}
				content += '</div>';
				
				if (point.list.length == 1) {
					var event = point.list[0];
					events.push(event);
					content += getInfoItem( event );
				}
				content += '</div>';
			} else {
				// PLUSIEURS EVENEMENTS.
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
					var event = point.list[j];
					events.push(event);
					// plusieurs évènement : popup complète
					content += '<div class="subitem">';
					content += getInfoItem(event);
					content += '</div>';
				}
				content += '</div></div>';
			}
			//Marker
			var marker = new google.maps.Marker({
				position: latLng,
				map: zf.map,
				title: point.title,
				icon: 'img/icon-red.png',
				description: content
			});
			
			for (var i=0; i<events.length; i++) {
				searchEventBag.addEventBag(events[i], marker);				
			}

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

		var data = $.parseJSON( datasEventsJSon );
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

	// ----------------------------------- gestion des filtres.
	zf.filterEvent = function(){
		
		// initialement on cache tous les events.
		var nomEvtValue = $nomEvt.val();
		var startDateValue = $startDate.val();
		var endDateValue = $endDate.val();
		if (nomEvtValue.length > 0 
				|| startDateValue.length > 0
				|| endDateValue.length > 0) {
			// on cache tous les markers.
			for ( var i = 0; i < zf.markers.length; i++) {
				zf.markers[i].setVisible(false);
		    }
			// gestion de l'affichage des bulles		
			searchEventBag.showMarkersByCriterias(
				nomEvtValue, startDateValue, endDateValue );			
		} else {
			// on affiche tous les markers.
			zf.map.fitBounds( zf.bounds );
			for ( var i = 0; i < zf.markers.length; i++) {
				zf.markers[i].setVisible(true);
		    }
		}
		
		// map resize en prenant en compte les nouveaux markers
		google.maps.event.trigger(zf.map, 'resize');
		
		return false;

	};
	
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
