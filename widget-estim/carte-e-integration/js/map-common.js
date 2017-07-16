var zf = zf || {};

/* FUNCTIONS
 --------------------------------------------------------------------------------------------------------------------------------------*/

(function ($) {
	
	var $formMap = $('form[name="form-map"]');
	var $searchItem = $formMap.find('input[name="searchText"]');
	var $searchStartDate = $formMap.find("input[name=searchStartDate]");
	var $searchEndDate = $formMap.find("input[name=searchEndDate]");
	
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
	 * renvoie les infos d'un item pour l'affichage du bloc texte.
	 * - item : event, structure ... 
	 */
	function getInfoItem(point, item) {
		if ( typeof(point.type) != 'undefined' ) {
			if(point.type == 'structure') {
				return getInfoItemStructure(item);
			} else if (point.type == 'evenement') {
				return getInfoItemEvenement(item);
			}else {
				return getInfoItemDefault(item);	
			}
		} else {
			return getInfoItemDefault(item);
		}
	}
	
	function getInfoItemDefault(item) {
		var content = '';
		if (item.vignetteUrl) {
			content += '<div class="info"><img src="'+item.vignetteUrl+'" alt=""/></div>';
		}
		content += '<div class="info">';
		if ( item.urlDetail ) {
			content += '<a target="_blank" href="' + item.urlDetail + '">' + item.title + '</a>';
		} else {
			content += '<span class="text">' + item.title + '</span>';
		}
		if (item.startDate) {
			content += '<div class="date"><span class="infoDate">Du ' + item.startDate + ' au ' + item.endDate + '</span></div>';
		}
		content += '</div>';
		return content;
	}	

	function getInfoItemEvenement(item){
		var content = '';
		if (item.vignetteUrl) {
			content += '<div class="info"><img src="'+item.vignetteUrl+'" alt=""/></div>';
		}
		content += '<div class="info">';
		if ( item.urlDetail ) {
			content += '<a target="_blank" href="' + item.urlDetail + '">' + item.title + '</a>';
		} else {
			content += '<span class="text">' + item.title + '</span>';
		}
		if (item.startDate) {
			content += '<div class="date"><span class="infoDate">Du ' + item.startDate + ' au ' + item.endDate + '</span></div>';
		}
		content += '</div>';
		return content;	
	}
	
	function getInfoItemStructure(item){
		var content = '';
		if (item.vignetteUrl) {
			content += '<div class="info"><img src="'+item.vignetteUrl+'" alt=""/></div>';
		}
		content += '<div class="info">';
		if ( item.urlDetail ) {
			content += '<a target="_blank" href="' + item.urlDetail + '">' + item.nom + '</a>';
		} else {
			content += '<span class="text">' + item.nom + '</span>';
		}
		if (item.startDate) {
			content += '<div class="date"><span class="infoDate">Du ' + item.startDate + ' au ' + item.endDate + '</span></div>';
		}
		content += '</div>';
		return content;		
	}
		
	/* 
	 * objet permettant de gerer les items de recherche
	 * Chaque item est converti en itemBag.
	 * L'item est caractérisé par son marker.
	 */
	var searchItemsBag = (function(){
		var __searchItemsBag = [];
		var __buildItemBag = function(point, item, marker) {
			var itemBag;
			if (typeof(point.type) == 'undefined') {
				point.type = 'default';
			}
			if (point.type=='structure') {
				itemBag = {
					"title" : typeof(item.nom) != 'undefined' ? item.nom : '',
					"desc" : typeof(item.description) != 'undefined' ? item.description : '',
					"nomStructure" : typeof(item.nomStructure) != 'undefined' ? item.nomStructure : '',
					"startDate" : item.startDate,
					"endDate" : item.endDate,
					"marker" : marker,
					"latitude" : item.latitude,
					"longitude" : item.longitude
				};		
			} else {
				itemBag = {
					"title" : typeof(item.title) != 'undefined' ? item.title : '',
					"desc" : typeof(item.description) != 'undefined' ? item.description : '',
					"nomStructure" : typeof(item.nomStructure) != 'undefined' ? item.nomStructure : '',
					"startDate" : item.startDate,
					"endDate" : item.endDate,
					"marker" : marker,
					"latitude" : item.latitude,
					"longitude" : item.longitude
				};					
			}
			return itemBag;
		};
		return {
			addItemBag : function (point, item, marker) {
				if (typeof(item) != "undefined") {
					var itemBag = __buildItemBag(point, item, marker);			
					__searchItemsBag.push(itemBag);					
				}
			},
			showMarkersByCriterias : function ( searchText, searchStartDate, searchEndDate) {
				var markersToShow = [];
				var latlngbounds = new google.maps.LatLngBounds();
				for (var i = 0 ; i<__searchItemsBag.length ; i++) {
					var itemBag = __searchItemsBag[i];
					var curMarker = itemBag.marker;
					var bVisible = true;
					// criteria text.
					if (searchText.length > 0) {
						if ( itemBag.title.toLowerCase().indexOf( searchText.toLowerCase() ) == -1 
								&& itemBag.desc.toLowerCase().indexOf( searchText.toLowerCase()) == -1
								&& itemBag.nomStructure.toLowerCase().indexOf( searchText.toLowerCase()) == -1
						) {
							bVisible = false;
						}
					}
					// criteria date deb.
					if (typeof(searchStartDate) != 'undefined') {
						if (bVisible && searchStartDate.length > 0) {
							if ( toDate(itemBag.startDate) < toDate(searchStartDate) ) {
								bVisible = false;
							} 					
						}						
					}
					// criteria date fin
					if (typeof(searchEndDate) != 'undefined') {
						if (bVisible && searchEndDate.length > 0) {
							if (toDate(itemBag.endDate) > toDate(searchEndDate) ) {
								bVisible = false;
							}							
						}
					}
					// visible.
					if (bVisible) {
						markersToShow.push( curMarker );
						latlngbounds.extend( new google.maps.LatLng(itemBag.latitude, itemBag.longitude) );
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
		var mapH = $(window).height() - $formMap.outerHeight();
		$('#map-canvas').height(mapH);
		zf.infoWindowMaxHeight = Math.max(400, mapH - 200);
	};

	zf.mcOptions = {
			styles: [{
				// pour 2 à 10
				width: 53,
				height: 53,
				url: "img/gmap-cluster-m1.png",
				textColor: 'white'
			},
			{
				// 11 à 50
				width: 56,
				height: 56,
				url: "img/gmap-cluster-m2.png",
				textColor: 'white'
			},
			{
				// supérieu à 50
				width: 66,
				height: 66,
				url: "img/gmap-cluster-m3.png",
				textColor: 'white'
			}
		]
	};

	zf.addItems = function (points) {
		for (var i in points) {
			
			var point = points[i];
			var latLng = new google.maps.LatLng(point.latitude, point.longitude);
			var content = '<div class="infowindow-container"'+zf.stylePopup+'>';
			var items = []; // liste des items associé au point.
			
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
					var item = point.list[0];
					items.push(item);
					content += getInfoItem(point, item);
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
					var item = point.list[j];
					items.push(item);
					// plusieurs évènement : popup complète
					content += '<div class="subitem">';
					content += getInfoItem(point, item);
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
			
			for (var i=0; i<items.length; i++) {
				searchItemsBag.addItemBag(point, items[i], marker);				
			}

			zf.markers.push(marker);
			// on étend les limites pour pouvoir bien zoomer la map sur tous les éléments à la fin
			zf.bounds.extend(latLng);

			//Click : popups
			google.maps.event.addListener(marker, 'click', function (evt) {
				zf.infoWindow.setContent(this.description);
				zf.infoWindow.open(zf.map, this);
			});
		}
	}
	
	zf.parseFile = function () {
		if ( typeof(datasItemsJSon) != 'undefined' ) {
			var data = $.parseJSON( datasItemsJSon );
			zf.bounds = new google.maps.LatLngBounds();
			zf.markers = [];
			zf.addItems(data.datas.points);
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
		} else {
			alert("Aucune donnée n'est remontée par l'application. La carte ne peut être initialisée.");
		}			
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
	zf.filterItem = function(){
		// initialement on cache tous les events.
		var searchTextValue = $searchItem.val();
		var startDateValue = $searchStartDate.val();
		var endDateValue = $searchEndDate.val();
		if (searchTextValue.length > 0 
				|| ( (typeof(startDateValue) != 'undefined') && startDateValue.length > 0 )
				|| ( (typeof(endDateValue) != 'undefined') && endDateValue.length > 0) ) {
			// on cache tous les markers.
			for ( var i = 0; i < zf.markers.length; i++) {
				zf.markers[i].setVisible(false);
		    }
			// gestion de l'affichage des bulles		
			searchItemsBag.showMarkersByCriterias(
				searchTextValue, startDateValue, endDateValue );			
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
			buttonImageOnly: true,
		    changeMonth: true,
		    changeYear: true,
		    showTime : true,
		    dateFormat: 'dd/mm/yy',
		    dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
		    monthNamesShort: ['Jan','Fev','Mar','Avr','Mai','Jui','Juil','Aou','Sep','Oct','Nov','Dec']		
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
