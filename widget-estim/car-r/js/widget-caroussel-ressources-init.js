var zf = zf || {};

/* FUNCTIONS
--------------------------------------------------------------------------------------------------------------------------------------*/

(function($) {

	// recharge le slider avec les paramètres de marge et nombre de slides
	// utilisé chaque fois que le mode responsive change
	zf.reloadSlider = function(slideMargin) {
		var bxOpts = {
			slideWidth: 191,
			slideMargin: slideMargin,
			pager: false,
			minSlides:1,
			maxSlides:4,
			infiniteLoop: false,
			auto: false,
			mode: 'horizontal',
			nextText: '',
			prevText: ''
		}
		if (!zf.sliderResources) {
			zf.sliderResources = $('.last-resources .slider').bxSlider(bxOpts);
		} else {
			zf.sliderResources.reloadSlider(bxOpts);
		}
	}
	/*********** MEDIA QUERIES **********/

	zf.carEnterFull = function(){
		zf.isMobile = false;
		zf.reloadSlider(28);
		$('body').removeClass('mobile');
		$('body').removeClass('tablette');
	};

	zf.mqEnterTablet = function(){
		zf.isMobile = false;
		zf.reloadSlider(9);
		$('body').addClass('tablette');
		$('body').removeClass('mobile');
	};

	zf.mqEnterMobile = function(){
		zf.isMobile = true;
		zf.reloadSlider(9);
		$('body').addClass('mobile');
		$('body').removeClass('tablette');
	};

	// gestion des filtres d'affichage
	zf.showRessources = function ($slider, categories) {

		// met tout en cache
		if (!zf.storedSliderResources) {
			zf.storedSliderResources = $slider.clone();
		}

		// restore content of slider
		if (categories.length) {
			// vide le slider
			$slider.html('');

			// ajoute les items dans le slider
			zf.storedSliderResources.find(categories.join(',')).each(function() {
				$slider.append($(this)[0].outerHTML);
			});

		} else {
			// pas de filtre, montre tout
			$slider.html(zf.storedSliderResources.html());
		}
		zf.sliderResources.reloadSlider();
	}
	// select pour mobilite a la place des boutons
	$('.select-nav-mobile').change(function() {
		var $slider = $(this).closest('.last-resources').find('.slider-home .slider');
		var categories = [];
		if ($(this).val()) {
			categories.push('li.cat-'+$(this).val());
		}
		zf.showRessources($slider, categories);
	});

	// gestion des boutons de choix de catégories du slider top
	$('.last-resources .nav button').click(function(e) {
		e.preventDefault();
		var $slider = $(this).closest('.last-resources').find('.slider-home .slider');

		$(this).parent().toggleClass('current');

		// construit la liste des categories à afficher
		var $currentLis = $('.last-resources .nav li.current');
		var categories = [];
		$currentLis.each(function() {
			var cat = $('button', this).attr('class');
			categories.push('li.cat-' + cat);
		});

		zf.showRessources($slider, categories);
	});


	/* INIT
	--------------------------------------------------------------------------------------------------------------------------------------*/

	zf.init = function(){
		$('body').addClass('js');
		zf.isMobile = false;

		// Breakpoints
		$.breakpoint({
			condition: function(){
				return window.matchMedia('only screen and (min-width:768px)').matches;
			},
			enter: zf.carEnterFull
		});
		$.breakpoint({
			condition: function(){
				return window.matchMedia('only screen and (min-width:481px) and (max-width:768px)').matches;
			},
			enter: zf.mqEnterTablet
		});
		$.breakpoint({
			condition: function(){
				return window.matchMedia('only screen and (max-width:480px)').matches;
			},
			enter: zf.mqEnterMobile
		});

	};

	/* DOM READY
	--------------------------------------------------------------------------------------------------------------------------------------*/

	$(document).ready(zf.init);
})(jQuery);
