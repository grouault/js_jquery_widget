"use strict";
/**
* "Espace de nommage" global de toutes les portlets.
* 
* Tous le code des portlets se doit d'être mis dans cet "espace de nomamge".
* @param $
*/

if( typeof( window.estim_car_res_scripts ) == 'undefined' ){(
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
			sliderRessources = $('.slider-res-l').bxSlider(bxOptions);
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
		
		// select pour mobilite a la place des boutons
		$('.select-nav-mobile').change(function() {
			var $slider = $(this).closest('.w-car-res-l').find('.slider-res-l');
			var categories = [];
			if ($(this).val()) {
				categories.push('li.cat-'+$(this).val());
			}
			showRessources($slider, categories);
		});
		
		// gestion des boutons de choix de catégories du slider top
		$('.w-car-res-l .nav button').click(function(e) {
			
			e.preventDefault();
			var $slider = $(this).closest('.w-car-res-l').find('.slider-res-l');
			
			var $elf = $(this);
			$elf.parent().toggleClass('current');
			
			// construit la liste des categories à afficher
			var $currentLis = $('.w-car-res-l .nav li.current');
			var categories = [];
			$currentLis.each(function() {
				var cat = $('button', this).attr('class');
				categories.push('li.cat-' + cat);
			});
			showRessources($slider, categories);
			
		});
		
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
})(jQuery); window.estim_car_res_scripts="loaded";}