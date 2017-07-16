"use strict";
/**
* "Espace de nommage" global de toutes les portlets.
* 
* Tous le code des portlets se doit d'être mis dans cet "espace de nomamge".
* @param $
*/

if( typeof( window.estim_car_res_b_scripts ) == 'undefined' ){(
// <NAMESPACE>>>>>>>>>>
/**
 * @param $
 */
function($){
	
	/*********** GLOBALS **********/
	var isMobile = false;
	var sliderRessources = [];
	var bxOptions = {};
		
	/*********** SLIDERS **********/
	var reloadSlidersRes = function() {
		if (sliderRessources.length > 0) {
			sliderRessources.reloadSlider(bxOptions);
		} else {
			sliderRessources = $('.slider-res-b').bxSlider(bxOptions);
		}
	};
		
	/*
	 * Restore content of slider en fonction
	 * des filtres sélectionnés. 
	 */
	function showRessources($slider, categories) {
		var $cloneSlider = getCloneSlider($slider);
		// vide le slider
		$slider.html('');
		if (categories.length) {
			// ajoute les items dans le slider
			$cloneSlider.find(categories.join(',')).each(function() {
				$slider.append($(this)[0].outerHTML);
			});
		} else {
			// pas de filtre, montre tout
			$slider.html($cloneSlider.html());
		}
		reloadSlidersRes();
	}
	
	/*
	 * permet de faire un clone du slider.
	 */
	function getCloneSlider($slider) {
		var $cloneSlider = [];
		if ( typeof($slider.data("clone")) == "undefined" ) {
			var $cloneSlider = $slider.clone();
			$slider.data("clone", $cloneSlider);				
		} else {
			$cloneSlider = $slider.data("clone");
		}
		return $cloneSlider;
	}
	
	function initCarRes() {
				
		// Select des categories.
		var $catSelect = $('.header select');
		$catSelect.change(function(e) {
			e.preventDefault();
			var $slider = $(this).closest('.w-car-res-b').find('.slider-res-b');	
			var cat = $(this).val();
			var categories = [];
			if (cat) {
				// affiche uniquement les li de la cat choisie
				categories.push('.cat-'+cat);
			}
			showRessources($slider, categories);
		});
		
		if( $.fn.chosen ){
			// Skin select
			$catSelect.chosen({
				// desactivation du champs de recherche si moins de n=5 élément
				disable_search_threshold: 5
			});
			// accessibilité du composant 'chosen' :
			//   affiche le select classique, et le sort de l'écran
			//   au focus sur le select (clavier), on masque chosen, on bouge le select pour le rendre visible
			$catSelect.show()
				.addClass('hidden')
				.focus(function() {
					// au focus sur le select classique, on cache le 'chosen', pas accessible
					$(this).next().hide();
				}).blur(function() {
					// au focus sur le select classique, on cache le 'chosen', pas accessible
					$(this).next().show();
				});
		}
			
	}
	
	/* MEDIA QUERIES
	--------------------------------------------------------------------------------------------------------------------------------------*/
	function carEnterFull() {
		isMobile = false;
		bxOptions = {
			slideWidth: 191,
			slideMargin: 28,
			minSlides: 1,
			maxSlides: 4,
			pager: false,
			/* controls: true, */
			infiniteLoop: false,
			auto:false,
			mode: 'horizontal',
			nextText : '',
			prevText : ''
		};
		reloadSlidersRes(bxOptions);
		$('body').removeClass('mobile');
		$('body').removeClass('tablette');
	};

	function carEnterTablet() {
		isMobile = false;
	    bxOptions = {
			slideWidth: 191,
			slideMargin: 9,
			maxSlides: 4,
			pager: false,
			infiniteLoop: true,
			nextText: '',
			prevText: ''
		};
		reloadSlidersRes(bxOptions);
		$('body').addClass('tablette');
		$('body').removeClass('mobile');
	};

	function carEnterMobile() {
		isMobile = true;
	    bxOptions = {
			slideWidth: 191,
			slideMargin: 9,
			maxSlides: 4,
			pager: false,
			infiniteLoop: true,
			nextText: '',
			prevText: ''
		};
		reloadSlidersRes(bxOptions);
		$('body').addClass('mobile');
		$('body').removeClass('tablette');
	};
	

	/* INIT
	--------------------------------------------------------------------------------------------------------------------------------------*/
	$(function () {
		
		$('body').addClass('js');
		isMobile = false;
		
		if (window.matchMedia) {
			// Breakpoints
			$.breakpoint({
				condition: function(){
					return window.matchMedia('only screen and (min-width:768px)').matches;
				},
				enter: carEnterFull
			});
			$.breakpoint({
				condition: function(){
					return window.matchMedia('only screen and (min-width:481px) and (max-width:768px)').matches;
				},
				enter: carEnterTablet
			});
			$.breakpoint({
				condition: function(){
					return window.matchMedia('only screen and (max-width:480px)').matches;
				},
				enter: carEnterMobile
			});
		}
		
		initCarRes();
		
	});
	
	
	//<<<<<<<<<</NAMESPACE>
})(jQuery); window.estim_car_res_b_scripts="loaded";}