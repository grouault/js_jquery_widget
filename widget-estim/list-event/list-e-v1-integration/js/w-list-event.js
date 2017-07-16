var wdgLstEventSearch = {};

if (typeof (window.estim_wdg_listevent_script) == 'undefined'){ 
(function($){
	
	var equals = function (param1, param2) {
		var isEquals = false;
		if (param1.toLowerCase() == param2.toLowerCase()) {
			isEquals = true;
		}
		if (param1.toLowerCase().indexOf(param2.toLowerCase()) != -1) {
			isEquals = true;
		}
		return isEquals;
	};
	
	var checkPeriod = function($article, dateDebValue, dateFinValue) {
		var isSearchEvent = false;
		// recuperation de la date de debut de l event.
		var $ventDateDeb = $article.find(".date-debut").text();
		// recuperation de la date de fin de l event.
		var $ventDateFin = $article.find(".date-fin").text();
		var compareDateDeb = dateCompare(getDate($ventDateDeb), getDate(dateDebValue));
		var compareDateFin = dateCompare(getDate($ventDateFin), getDate(dateFinValue));
		if ( compareDateDeb >= 0 && compareDateFin <= 0) {
			isSearchEvent = true;
		}
		return isSearchEvent;
	};		
	
	var getDate = function(dateString) {
		var elem = dateString.split('/');
		jour = elem[0];
		mois = elem[1] - 1;
		annee = elem[2];  
		var date = new Date(annee, mois, jour);	  
		return date;
	};
	  
	/**
	 * Comparaison des dates : 
	 * 0 si date_1 == date_2
	 * 1 si date_1 > date_2
	 * -1 si date_1 < date_2
	 */
	var dateCompare = function(date_1, date_2) {
		var diff = date_1.getTime()-date_2.getTime();
		return (diff==0 ? diff : diff/Math.abs(diff));
	};		
	
	/**
	 * Permet d afficher la zone des resultats.
	 */
	var showZoneResults = function(nbResult) {
		var $earchResult = $('.search-result');
		$earchResult.find('span.number').text(nbResult);
		$earchResult.show();
	};
		
	/** init-widget */
	wdgLstEventSearch = (function () {
		
		var __articles = [];
		var __wdgSearch;
		var __searchText;
		var __searchStartDate;
		var __searchEndDate;
		var __pagerSelector;
		
		var launchPager = function() {
			__pagerSelector.pagerItems({
				nbItemsPerPage: 2,
				nbPagerSelector : 2
			});
		};
		
		var showArticleByCriteria = function ( searchText, searchStartDate, searchEndDate) {
			
			var articlesToShow = [];
			var nbResult = 0;
			
			if (searchText.length > 0 ||
					(searchStartDate.length > 0 && searchEndDate.length > 0)) {
				$.each(__articles, function(index, article) {
					
					var $article = $(article).hide();
					var bShowArticle = false;
					if (searchText.length > 0) {
						//
						// RECHERCHE PAR TEXTE 
						//
						// verifier si le titre contient le mot.
						var $itle = $article.find(".title");
						if (equals($itle.text(), searchText)) {
							bShowArticle = true;
						}
						// verifier si la structure d'accueil contient le mot.
						var $tructure = $article.find(".structure");
						if (!bShowArticle && equals($tructure.text(), searchText)) {
							bShowArticle = true;
						}
						// verifier si la localisation contient le mot.
						/*
						var $localisation = $article.find(".localisation");
						if (!bShowArticle && equals($localisation.text(), searchText)) {
							bShowArticle = true;
						}
						*/							
						// verifier si la description contient le mot.
						var $escription = $article.find(".description");
						if (!bShowArticle && equals($escription.text(), searchText)) {
							bShowArticle = true;
						}
						// verifier la recherche par date.
						if (bShowArticle && searchStartDate.length > 0 && searchEndDate.length > 0) {
							bShowArticle = checkPeriod($article, searchStartDate, searchEndDate);
						}							
						
					} else if (searchStartDate.length > 0 && searchEndDate.length > 0) {
						bShowArticle = checkPeriod($article, searchStartDate, searchEndDate);
					}
	
					if (bShowArticle) {
						articlesToShow.push($article);
						nbResult ++;
					}
				
				}); 
			} else {
				articlesToShow = __articles;
				nbResult = __articles.length;
			}
				
			
			// cacher tous les articles
			__articles.each(function(){
				$(this).removeClass("visible");
			});
			// afficher les articles qui matchent
			if ( articlesToShow.length > 0) {	
				$.each(articlesToShow, function(index, article){
					$(article).show().addClass("visible"); // cet event est un resultat de la recherche.
				});	
			}
			// pagination a relancer.
			$('.wdg_pagination').remove();
			launchPager();
			
		};
	
		return {
			init : function () {
				__wdgSearch = $('.events-list-widget');
				__articles = __wdgSearch.find("article").parent().addClass("visible");
				__searchText = __wdgSearch.find('input[name="search"]');
				__searchStartDate = __wdgSearch.find('input[name="date-debut"]');
				__searchEndDate = __wdgSearch.find('input[name="date-fin"]');
				__pagerSelector = __wdgSearch.find('.articles-list-widget-events-list');
				launchPager();
			},
			filter : function() {
				showArticleByCriteria(
					__searchText.val(),
					__searchStartDate.val(),
					__searchEndDate.val()
				);
				return false;
			}
		}
		
	})();
	
	/*---------- INIT ---------*/
	$(function(){
		
		// ----------------------------------- gestion datepicker
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
		$('input[name="date-debut"]').attr('placeholder', jour + '/' + mois + '/' + annee);
		$('input[name="date-fin"]').attr('placeholder', (jour + 1) + '/' + mois + '/' + annee);
		// bouton rechercher
		$('input[name="search-btn"]').click(function(){
			window.open($(this).data("urlsearchevent"), '_blank');
		});
		// recherche
		wdgLstEventSearch.init();
			
	});
	
})(jQuery);window.estim_wdg_listevent_script="loaded";}