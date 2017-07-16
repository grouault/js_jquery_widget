var wdgLstEventSearch = {};

if (typeof (window.estim.wdg_listevent_script) == 'undefined'){ 
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
		
		var showArticleByCriteria = function ( searchText, searchStartDate, searchEndDate) {
			
			var articlesToShow = [];
			var bShowArticle = true;
			var nbResult = 0;
			
			$.each(__articles, function(index, article) {
				
				var $article = $(article);
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
					var $tuctureAccueil = $article.find(".structure-accueil");
					if (!bShowArticle && equals($tuctureAccueil.text(), searchText)) {
						bShowArticle = true;
					}
					// verifier si la localisation contient le mot.
					var $localisation = $article.find(".localisation");
					if (!bShowArticle && equals($localisation.text(), searchText)) {
						bShowArticle = true;
					}							
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
			
			if ( articlesToShow.length > 0) {
				
				// afficher les articles
				$.each(articlesToShow, function(index, article){
					$(article).addClass("search"); // cet event est un resultat de la recherche.
				});
				
				// pagination a relancer.
				
				// afficher le nombre de résultats.
				showZoneResults(nbResult); // a ameliorer
				
			}
			
		};
	
		return {
			init : function () {
				__wdgSearch = $('.events-list-widget');
				__articles = __wdgSearch.find("article");
				__searchText = __wdgSearch.find('input[name="search"]');
				__searchStartDate = __wdgSearch.find('input[name="date-debut"]');
				__searchEndDate = __wdgSearch.find('input[name="date-fin"]');
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
		wdgLstEventSearch.init();
	});
	
})(jQuery);window.estim.wdg_listevent_script="loaded";}