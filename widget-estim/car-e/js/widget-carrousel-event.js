"use strict";
/**
* "Espace de nommage" global de toutes les portlets.
* 
* Tous le code des portlets se doit d'être mis dans cet "espace de nomamge".
* @param $
*/

if( typeof( window.estim_car_e_scripts ) == 'undefined' ){(
// <NAMESPACE>>>>>>>>>>
function($){

	/*********** GLOBALS **********/
	var isMobile = false;
	var sliderEvents = [];
	var bxOptions = {};
		
	var  categoriesForms = function(wrapper) {
		
		/* checkbox */
		var checkables = (function(sel){
			return typeof wrapper !== "undefined" && wrapper.length > 0 
				? $(sel, wrapper)
				: $(sel);
		})('input[type="checkbox"]');
				
		checkables.each(function() {
			
			var checkable = $(this);
			
			// style sur les checkbox
			checkable.css({
				"position": "absolute",
				"left": "-999em"
			})
			.wrap('<span class="' + $.trim( "new-checkbox " + checkable.attr('class') ) + '" />')
			.prop('checked', false);;

			// initialement, on coche les deux cases.
			checkable.closest(".new-checkbox").toggleClass("check", !checkable.prop('checked'));
			checkable.prop('checked', true);
			
			// gestionnaire event sur le bloc li.parent
			checkable.parent().parent().click(function(){
				// gestion du check des input.
				var $input = $(this).find('input');
				var toggleValue = !$input.prop('checked');
				$(this).find(".new-checkbox").toggleClass("check", toggleValue);
				$input.prop('checked', toggleValue);		
				// repaint du slider
				var categories = [];
				var $checkeds = $(this).siblings().andSelf().find('input:checked');
				if ( $checkeds.length ) {
					var catClass = $checkeds.map(function(){
						return  "." + $(this).attr('id');
					}).get().join(',');
					categories.push(catClass);
				}
				var $slider = $input.closest('.w-car-e').find('.slider-e');
				showRessources($slider, categories);
			});
			
		});
		
	};
	
	/*********** SLIDERS **********/
	var reloadSlidersEvts = function() {
		if (sliderEvents.length > 0) {
			sliderEvents.reloadSlider(bxOptions);
		} else {
			sliderEvents = $('.slider-e').bxSlider(bxOptions);
			var stop = "stop";
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
		reloadSlidersEvts();
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
	
	function initCarEvent() {
		categoriesForms('.form-cats');
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
		reloadSlidersEvts(bxOptions);
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
	    reloadSlidersEvts(bxOptions);
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
	    reloadSlidersEvts(bxOptions);
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
		
		initCarEvent();
		
	});	

	//<<<<<<<<<</NAMESPACE>
})(jQuery); window.estim_car_e_scripts="loaded";}