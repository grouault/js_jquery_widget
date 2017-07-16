"use strict";
/**
* "Espace de nommage" global de toutes les portlets.
* 
* Tous le code des portlets se doit d'être mis dans cet "espace de nomamge".
* @param $
*/
if( typeof( window.estim_commons_scripts ) == 'undefined' && 
	typeof ( window.old_commons_scripts ) == 'undefined' ){(function($){
// <NAMESPACE>>>>>>>>>>
/*********** GLOBALS **********/
var isMobile =false;
var isHome = false;
var hasSliderRes = false;
var bxOptions = {};
/*********** SLIDERS **********/
var sliders=(function(){
	var __sliders = [];
	var __cloneSliders = [];
	var __initialized = false;
	function __addWidget( options, selector, cssClass){
		if ( $(selector).length > 0) {
			var sliderClass = "slider-" + cssClass;
			var slider = $(selector).addClass(sliderClass).bxSlider(options);
			__sliders.push( slider );
			var cloneSlider = slider.clone();
			__cloneSliders.push ( cloneSlider );
			return slider;
		}
	};
	function __enhanceEvents(selector, ref){
		$(selector+' .bx-prev').click(function() {
			ref.goToPrevSlide();
		});
		$(selector+' .bx-next').click(function() {
			ref.goToNextSlide(); 
		});
	}
	return {
		init: function( options, full ){
			if( __initialized ){
				for( var i=0; i < __sliders.length; i++ ){
					__sliders[i].reloadSlider(options);
				}
			}else{
				if( $.fn.bxSlider ){
					__initialized =true;
					var sliderHomeRes = __addWidget( options, '.widgetcarrouselressource-portlet .slider', 'last-ressources');
					var sliderHomeEvt = __addWidget( options, '.widgetcarrouselevent-portlet .slider', 'next-events' );
					var sliderHomeNextEvt = __addWidget( options, '.widgetcarrouselnextevent-portlet .slider', 'next-events');
					var sliderHomeBestRes = __addWidget( options, '.widgetcarrouselressourcebest-portlet .slider', 'best-ressources');
					if( full ){
						__enhanceEvents('.next-events', sliderHomeEvt );
						__enhanceEvents('.next-events', sliderHomeNextEvt );
						__enhanceEvents('.last-ressources', sliderHomeRes );
						__enhanceEvents('.best-ressources', sliderHomeBestRes );
					}
				}
			}
		},
		destroy : function(){
			while( __sliders.length ){
				__sliders.shift().destroySlider();
			}
		},
		getSlider: function(cssClass) {
			var slider = '';
			for( var i=0; i < __sliders.length; i++ ){
				if ( __sliders[i].hasClass("slider-" + cssClass) ){
					slider = __sliders[i];
				}
			}
			return slider;
		},
		getCloneSlider : function(cssClass) {
			var cloneSlider = '';
			for( var i=0; i < __cloneSliders.length; i++ ){
				if ( __cloneSliders[i].hasClass("slider-" + cssClass) ){
					cloneSlider = __cloneSliders[i];
				}
			}			
			return cloneSlider;
		},
		reloadSlider: function(slider) {
			slider.destroySlider();
			slider.bxSlider(bxOptions);
		}
	};
	})();

/*********** CRITERES DE RECHERCHE **********/
function initActionsForCriteria(ref, crit ){
	var lst = $(".wdg_search_filter .box ul[name=\""+crit+"\"]");
	var box = lst.closest(".box");
	// action select.
	//Ajout d'un élément dans un multiselect et relance de la recherche
	box.find('.fancytree-container li').click(function() {		
		window.location.href = ref[$(this).find('.fancytree-title').text().trim()];		
	});	
	//Gère la déselection dun élément dans les multiselects et relance de la recherche
	box.find('.search-container li .search-choice-close').click(function() {		
		window.location.href = ref[$(this).parent().text().trim()];		
	});
}	

/*********** FORMS **********/
/**
* Cette fonction semble gérer les cases à cocher des formulaires,
* y compris les filtres de recherche.
* La maquette Buzzaka reposait sur une recherche déclenchée en Ajax.
* Or la version implémentée déclenche un rechargement de la page.
* Il semble donc que cette fonction soit obsolète (il n'est plus utile
* de mettre à jour les cases à cocher si l'on recharge la page).
* Toutefois cette fonction cible des 'input' de type 'radio'. Elle semble
* donc affecter d'autres formulaires que celui de recherche. C'est
* la raison pour laquelle cette fonction est conservée pour l'instant.
*/
function styleForms(wrapper) { 
	/* Input radio / checkbox */
	var checkables = (function(sel){
		return typeof wrapper !== "undefined" && wrapper.length > 0 
			? $(sel, wrapper)
			: $(sel);
	})( 'input[type="radio"], input[type="checkbox"]' );
	checkables.each(function() {
		// variables de la fonction 
		var checkable = $(this);
		function checkable_change_event(e) {
			// clic dans l'input ou le label
			e.stopPropagation();
			if (newClass == "new-radio") {
				$('[name="'+checkable.attr("name")+'"]').parent().removeClass("check");
				checkable.prop('checked', true);//.change();
				checkable.trigger("new-radio-event");
			}
			checkable.parent().toggleClass("check", checkable.is(":checked") );
		}
		function wrapper_click_event(e) {
			// click dans le parent, on envoie sur le input
			e.stopPropagation();
			var inp = $(this).find('input');
			inp.prop('checked', !checkable.is(":checked")  ).change();   
			// declenche un evenement qui peut etre attraper pour un 
			// traitement particulier sur au click suivant le contexte.
			inp.trigger("input-check-box-event");
		}
		// Code de la fonction
		var newClass = checkable.is(":checkbox") ? "new-checkbox" : "new-radio";
		checkable
			.css({
				"position": "absolute",
				"left": "-999em"
			})
			.wrap('<span class="' + $.trim( newClass + " " + checkable.attr('class') ) + '" />')
			.bind("change", checkable_change_event );
		var closest=checkable
				.closest("." + newClass)
				.toggleClass("check", checkable.is(":checked") );
		closest.parent().bind("click", wrapper_click_event );
	});
};

/*********** PLACEHOLDER SUPPORT **********/
function testPlaceholderSupport() {
	var i = document.createElement('input');
	return 'placeholder' in i;
};

/*********** EQUAL HEIGHT ELEMENTS **********/
$.fn.equalHeight=function () {
	var maxHeight = 0;
	this.each(function() {
		maxHeight = Math.max( maxHeight, $(this).height() );
	}).height(maxHeight);
};

/*********** INIT PAGES **********/
function reloadSlider ($slider, $cloneSlider, categories) {
	// restore content of slider
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
	sliders.reloadSlider($slider);
}

// initialisation de la homepage
function initHome() {
	
	// gestion des select dans les listes '.top'
	// carrousel des BEST RESSOURCES
	$('.top select').change(function(e) {
		e.stopPropagation();
		var cat = $(this).val();
		var categories = [];
		if (cat) {
			// affiche uniquement les li de la cat choisie
			categories.push('.cat-'+cat);
		}
		
		// relancer le slider
		var curSlider = sliders.getSlider("best-ressources");
		var curCloneSlider = sliders.getCloneSlider("best-ressources");
		reloadSlider(curSlider, curCloneSlider, categories);
	});
	
};

function initRes() {
	var piste = $.Deferred();
	piste.then(function(){
		// égalisation des hauteurs des box de chaque liste
		$.each([ '.last-ressources ', '.next-events' ], function(i, item){
			$(item+".slider-home .box").equalHeight();
		});
		$('.home-tops .top').each(function() {
			$(this).find('.slider .box').equalHeight();
		});
	});
	// setTimeout hack pour chrome et safari
	setTimeout(function() { piste.resolve(); }, 100);
	
	piste.then( function(){
		// ouverture du menu en mode smartphone
		$('.carrousel .nav .title').click(function() {
			$(this).parent().toggleClass('open');
		});
		
		// gestion des boutons de choix de catégories du slider top
		$('.last-ressources .nav button').click(function(e) {
			e.stopPropagation();
			var $elf = $(this);
			$elf.parent().toggleClass('current');
			// construit la liste des categories à afficher
			var $currentLis = $('.last-ressources .nav li.current');
			var categories = [];
			$currentLis.each(function() {
				var cat = $('button', this).attr('class');
				categories.push('li.cat-' + cat);
			});
			
			// relancer le slider
			var curSlider = sliders.getSlider("last-ressources");
			var curCloneSlider = sliders.getCloneSlider("last-ressources");
			reloadSlider(curSlider, curCloneSlider, categories);
		
		});

		// filtre sur le widget Next-Event.
		// Click sur check-Box.
		$('.form-cats li input').change(function(evt) {
			
			var $elf=$(this);
			evt.stopPropagation();
			var categories = [];
			var $checkeds = $elf.closest('li').siblings().andSelf().find('input:checked');
			if ( $checkeds.length ) {
				var catClass = $checkeds.map(function(){
					return  "."+$(this).attr('id');
				}).get().join(',');
				categories.push(catClass);
			}

			// relancer le slider
			var curSlider = sliders.getSlider("next-events");
			var curCloneSlider = sliders.getCloneSlider("next-events");
			reloadSlider(curSlider, curCloneSlider, categories);
			
		});		
		
	});
};

function initResults() {
	// Mobile menu
	(function($idebarLeft){
		$idebarLeft.find('.mobile-title').click(function() {
			$(this).parent().toggleClass('open');
		});
		
		// Code pour les mobiles ?
		var mobileBack = $idebarLeft.find('.mobile-back') ;
		$idebarLeft.find('.cat-title').on('click', function () {
			if (isMobile) {
				$(this).parent().addClass('current').siblings().removeClass('current').addClass('hide');
				$idebarLeft.find('.box:not(.list)').removeClass('current').addClass('hide');
				mobileBack.show();
			}
		});

		$idebarLeft.find('.title').click(function() {
			if (isMobile) {
				$(this).parent().addClass('current').siblings().removeClass('current').addClass('hide');
				mobileBack.show();
			}
		});

		mobileBack.click(function() {
			$(this).hide();
			$idebarLeft.find('.form-cats > li, .box').removeClass('hide current');
		});
		
		//gestion du focus
		$idebarLeft.find('input[type=checkbox]').focus(function() {
			$(this).parent().parent().addClass('focus');
		});
		$idebarLeft.find('input[type=checkbox]').focusout(function() {
			$(this).parent().parent().removeClass('focus');
		});
		$idebarLeft.find('.datesPredef div').click(function() {
			var $elf = $(this);
			if($elf.hasClass("predefDejaPasses")) {
				$('#date-to').datepicker('setDate', -1);
				$('#date-from').datepicker('setDate', null);
			}
			if($elf.hasClass("predefAujd")) {
				$('.datepicker').datepicker('setDate', new Date());
			}
			if($elf.hasClass("predefDemain")) {
				$('.datepicker').datepicker('setDate', +1);
			}
			if($elf.hasClass("predefSeptJours")) {
				$('.datepicker').datepicker('setDate', +7);
			}
		});
	})($('#sidebar-left'));
		
	/**
	* evenement gerant les filtres de recherche 
	* pour le formulaire de recherche.
	*/
	$('.wdg_search_filter input[type=checkbox],.wdg_search_filter input[type=radio]').change(function() {
		window.location.href = $(this).val();
	});
		
	$.each([["themRef", "thematiques"],           ["publRef", "publics_cibles"], 
			["structRef", "structures"],          ["regRef", "region"], 
			["domactRef", "domaines_d_activite"], ["domexpRef", "domaines_d_expertise"]], 
		function(){ 
			window[ this[0] ] && initActionsForCriteria.apply(window, this); 
		});
	
	$('.remove-all-filters').click( function(e) {
		var url = $(this).children('button').attr("data-url");
		window.location.href = url ;    	  
	});
	$('#search-filters .search-choice-close').click( function(e) {
		var dataId = $(this).parent().data('id');
		var dataUrl = $(this).parent().data('url');
		if ($(this).parent().parent().hasClass('resource-type')) {
			window.location.href = dataUrl ;
		} else {
			dataId = '0-2';
			var numForm = dataId.split('-');
			var form = $('div[data-tree-id="' + numForm[0] + '"]');
			if (form.find('li#fancytree-Cb' + numForm[0] + '-' + numForm[1] + ' > span').hasClass('fancytree-selected')) {
				form.find('li#fancytree-Cb' + numForm[0] + '-' + numForm[1] + ' span.fancytree-checkbox').trigger('click');
			}
		}
		$(this).parent().remove();
	});
};

function initFiche() {
	// Tabs
	$('.std-tabs .nav a').click(function(e) {
		e.preventDefault();
		var $elf = $(this);
		$elf.parent().addClass('current').siblings().removeClass('current');
		$elf.parents('.std-tabs').find('.tab').hide();
		$($elf.attr('href')).show();
	});

	$('.std-tabs h3.mobile-only').click(function() {
		$(this).parent().find('.tab').slideUp(300);
		$(this).next().stop(true, true).slideDown(300);
		$(this).addClass('current').siblings('h3').removeClass('current');
	});
};

function initSliderZoom() {
	$('#slider-zoom-thumbs .slider').bxSlider({
		slideWidth:150,
		slideMargin:10,
		maxSlides: 4,
		minSlides: 1,
		pager: false,
		infiniteLoop: true,
		nextText: 'Suivant',
		prevText: 'Précédent' 
	});
	$('#slider-zoom-thumbs a').click(function(e) {
		e.preventDefault();
		$('#slider-zoom li').eq( parseInt($(this).data('slide'),10) ).addClass('current').siblings().removeClass('current');
	});
};

function initWidget() {
	var $widget = $('#widget');

	$widget.find('a.step').click(function(e) {
		e.preventDefault();
		var that = $(this);
		$('html,body').animate({ // html,body pour corriger un bug webkit ?
			scrollTop: $widget.offset().top
		}, 500, function () {
			$widget.find('.nav a[href="'+that.attr('href')+'"]').trigger('click');
		});
		$etape2.find('#results').hide();
	});

	// ------------------ etape 2
	var $etape2 = $widget.find('#etape2');
	$etape2.find('input[type=submit]').click(function () {
		var $result = $etape2.find('#results');
		$result.hide();
		$.ajax('widget-results.php').done(function(data) {
		$result.html(data);
		if ($('input#statique').prop('checked')) {
		$result.find('.list input').remove();
		} else {
		styleForms($result);
		}
		$result.slideDown();
		});
	});

};

/*********** MEDIA QUERIES **********/
function mqEnterFull() {
	isMobile = false;
	$('#form-search').show();
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
		nextText : 'Suivant',
		prevText : 'Précédent'
	};
	if ( isHome || hasSliderRes ) {
		sliders.init(bxOptions, true);
		// calcule la largeur totale des li d'une liste '.top' et l'applique au ul.slider parent
		$('.home-tops .top').each(function() {
			var sliderLastChild  = $(this).find('.slider li:last-child').outerWidth(true);
			var sliderLength     = $(this).find('.slider li').length;
			var sliderTotalWidth = 1 + sliderLastChild * sliderLength;
			$(this).find('.slider').width(sliderTotalWidth);
		});
	}
};

function mqEnterTablet() {
	isMobile = false;
	$('#form-search').show();
    bxOptions = {
		slideWidth: 191,
		slideMargin: 9,
		maxSlides: 4,
		pager: false,
		infiniteLoop: true,
		nextText: 'Suivant',
		prevText: 'Précédent'
	};
    
	if (isHome || hasSliderRes) {
		sliders.init(bxOptions);
		$('.home-tops .top').each(function() {
			var sliderLastChild  = $(this).find('.slider li:last-child').outerWidth(true);
			var sliderLength     = $(this).find('.slider li').length;
			var sliderTotalWidth = 1 + sliderLastChild * sliderLength;
			$(this).find('.slider').width(sliderTotalWidth);
		});
	}
};

function mqEnterMobile() {
	isMobile = true;
	$('#form-search').hide();
	if (isHome || hasSliderRes) {
		sliders.destroy();
	}	
};


/* INIT
--------------------------------------------------------------------------------------------------------------------------------------*/
$(function () {
	var closeTimeout = false;	
	
	$('body').addClass('js');

	// toolbox buttons
	if ($.fn.tools) {
		$('.opts').tools({
			subject : 'ESTIM',
			content : 'Un ami a pens\u00E9 que cette page pourrait vous int\u00E9resser : '
		});		
	}

	// Placeholder fallback
	if (!testPlaceholderSupport()) {
		$('input[placeholder]').each(function(i, el) {
			el.defaultValue = $(el).attr('placeholder');
			$(el).attr('value', el.defaultValue);
		}).focus(function() {
			if ($(this).attr('value') == this.defaultValue){
				$(this).attr('value', '');
			}
		}).blur(function() {
			if ($.trim(this.value) == ''){
				this.value = (this.defaultValue ? this.defaultValue : '');
			}
		});
	}

	// Blank links
	$('a[rel=external]').click(function() {
		window.open($(this).attr('href'));
		return false;
	});

	// Btn top
	$('.btn-top').click( function () {
		$('html,body').animate({ // html,body pour bug chrome ??
			scrollTop: 0
		}, 500);
	});

	// Header menu
	$('#menu > li > a').hover(function() {
		$(this).parent().siblings().removeClass('focus');
	});
	$('#menu > li > a').focus(function() {
		closeTimeout && clearTimeout(closeTimeout);
		$(this).parent().addClass('focus').siblings().removeClass('focus');
	}).blur(function() {
		closeTimeout && clearTimeout(closeTimeout);
		var $menuItem = $(this).parent();
		closeTimeout = setTimeout(function() {$menuItem.removeClass('focus');}, 100);
	});
	$('#menu > li li > a').focus(function() {
		closeTimeout && clearTimeout(closeTimeout);
		$(this).parent().parent().closest('li').addClass('focus').siblings().removeClass('focus');
	}).blur(function() {
		closeTimeout && clearTimeout(closeTimeout);
		var $menuItem = $(this).closest('.focus');
		closeTimeout = setTimeout(function() {$menuItem.removeClass('focus');}, 100);
	});

	if( $.fn.chosen ){
		// Skin select
		$('select.chosen').chosen({
			// desactivation du champs de recherche si moins de n=5 élément
			disable_search_threshold: 5
		});
		// accessibilité du composant 'chosen' :
		//   affiche le select classique, et le sort de l'écran
		//   au focus sur le select (clavier), on masque chosen, on bouge le select pour le rendre visible
		$('select.chosen').show().addClass('hidden');
		$('select.chosen').focus(function() {
			// au focus sur le select classique, on cache le 'chosen', pas accessible
			$(this).next().hide();
		}).blur(function() {
			// au focus sur le select classique, on cache le 'chosen', pas accessible
			$(this).next().show();
		});
	}
	
	// Btn search mobile
	$('#header .search').click(function() {
		$('#form-search').slideToggle(300);
	});

	// Slider
	if ( $('#time-slider').length ) {
		var $timeSlider = $('#time-slider');
		var dureeMin = $('#dureeMin');
		var dureeMax = $('#dureeMax');
		var labelArr = new Array("0min", "15min", "30min", "45min", "1h", "1h 15min", "1h 30min", "1h 45min", "2h");
		var values = [0, 8];

		if (dureeMin.val() == "") {
			dureeMin.val("0");
		}
		if (dureeMax.val() == "") {
			dureeMax.val("8");
		}

		var $wdg_filter = $('.wdg_search_filter');
		var $formSearchFilter = $wdg_filter.closest('form[name=form-search-filter]');

		if( $timeSlider.slider ){
			$timeSlider.slider({
				values: [dureeMin.val(), dureeMax.val()],
				min: 0,
				max: 8,
				step: 1,
				range: true,
				create: function(event, ui) {
					$timeSlider.find('a').eq(0).html('<span>' + labelArr[dureeMin.val()] + '</span>');
					$timeSlider.find('a').eq(1).html('<span>' + labelArr[dureeMax.val()] + '</span>');
				},
				stop: function(event, ui) {
					console.log(ui);
					$timeSlider.find('a').eq(0).html('<span>' + labelArr[ui.values[0]] + '</span>');
					$timeSlider.find('a').eq(1).html('<span>' + labelArr[ui.values[1]] + '</span>');
					dureeMin.val(ui.values[0]);
					dureeMax.val(ui.values[1]);
					$formSearchFilter.submit();
				}
			});
			//TODO : appel ajax
			$timeSlider.find('a').eq(0).html('<span>' + labelArr[values[0]] + '</span>');
			$timeSlider.find('a').eq(1).html('<span>' + labelArr[values[1]] + '</span>');
		}
	}				

	// Datepicker

	$('.datepicker').datepicker({
		showOn: "button",
		buttonImage: "http://localhost:8080/estim-portail-theme/images/images/calendar.png",
		buttonImageOnly: true
	});	
	
	$('#date-from,#date-to').change(function () {
		var $wdg_filter = $('.wdg_search_filter');
		var $formSearchFilter = $wdg_filter.closest('form[name=form-search-filter]');
		$formSearchFilter.submit();
	});

	if( $.fn.niceScroll ){
		$(".scroll").niceScroll({
			autohidemode: false,
			background:'#f8f6f3',
			cursorcolor:'#242424',
			cursorborder:'5px solid #242424'
		});
	}
	
	// Style forms
	styleForms($('body'));

	// Fancybox
	if ($('.popin').length) {
		// store the link to restore the focus after closing
		var $popinLink = false;
		$('.popin').click(function() {
			$popinLink = $(this);
		});
		$('.popin').fancybox({
			type:'iframe',
			maxWidth: 785,
			scrolling: 'visible',
            onUpdate: function(){
                $("iframe.fancybox-iframe");
            },
			beforeShow: function () {
				styleForms($('#popin'));
				$('#popin select.chosen').chosen();
			},
			afterShow: function () {
				// place le focus dans l'input, empêche le focus dans la page
				$("#popin input.cancel").click(function() {
					$.fancybox.close();
				});

				$('a, button, input, select, textarea').attr('tabIndex', -1);
				$('.fancybox-skin').find('a, button, input, select, textarea').removeAttr('tabIndex');
				$('.fancybox-skin #nom').focus();
			},
			beforeClose: function () {
				$('a, button, input, select, textarea').removeAttr('tabIndex');
				$popinLink.focus();
			},
			keys  : {
				next : {
					34 : 'up',   // page down
					39 : 'left', // right arrow
					40 : 'up'    // down arrow
				},
				prev : {
					33 : 'down',   // page up
					37 : 'right',  // left arrow
					38 : 'down'    // up arrow
				},
				close  : [27], // escape key
				play   : [32], // space - start/stop slideshow
				toggle : [70]  // letter "f" - toggle fullscreen
			}
		});
	}

	// skip links on 'share' buttons
	$('#fiche .btns')
		.before('<a class="hidden" style="float:left;margin:5px 0;" href="#skip-share-btns">Passer les réseaux sociaux</a>')
		.after('<div id="skip-share-btns"></div>');

	// Menu mobile
	$('#mobile-current-page').click(function() {
		$(this).parent().toggleClass('open');
	});
	$('#topnav .member').click(function() {
		$(this).parent().parent().toggleClass('open');
	});

	if ( $('.carrousel, .next-events').length ) {
		hasSliderRes = true;
		initRes();
	}

	// Sidebar boxes
	$('#sidebar-left .box .title').click(function() {
		if (!isMobile) {
			$(this).toggleClass('show');
			$(this).next().slideToggle(300);
		}
	});

	// Hide tabs
	$('#fiche .std-tabs .tab:not(.open)').hide();

	// Detect pages - Before breakpoints
	if ( $('.home').length ) {
		isHome = true;
		initHome();
	}

	if ($('#results').length) {
		isResults = true;
		initResults();
	}

	$('.std-tabs').length && initFiche();
	$('#slider-zoom').length && initSliderZoom();
	$('#widget').length && initWidget();

	if (window.matchMedia) {
		// Breakpoints
		$.breakpoint({
			condition: function () {
				return window.matchMedia('only screen and (min-width:768px)').matches;
			},
			enter: mqEnterFull
		});
		$.breakpoint({
			condition: function () {
				return window.matchMedia('only screen and (min-width:481px) and (max-width:768px)').matches;
			},
			enter: mqEnterTablet
		});
		$.breakpoint({
			condition: function () {
				return window.matchMedia('only screen and (max-width:480px)').matches;
			},
			enter: mqEnterMobile
		});

		$('.fancytree-container li').each(function() {
			var id = $(this).attr('id').split('-');
			var item = "<option value='" + id[id.length - 1] + "'>" + $(this).children('span').children('.fancytree-title').text() + "</option>";
			$(this).parents('.chzn-container-multi').next().append(item);
			$(this).parents('.chzn-container-multi').next().attr("id", "ft-" + $(this).parents('.chzn-container-multi').data('tree-id'));
		});
	}
	/*
	Boutons Réagir sur les commentaires.
	-------------------------------------------------------------------------------------------------------------------------------------*/
	$('.showComments').click(function(){
		var id = $(this).attr("href");
		var offset = $(id).offset().top; 
		$('html,body').animate({scrollTop: offset}, 'slow');  // html,body pour bug chrome ???

		// ouverture automatique de la zone de commentaire a partir du bouton 'reagir'
		var $linkAddComment = $('.add-comment').find("a");
		var $idZoneComment = $linkAddComment.closest("fieldset.add-comment").find(".id-zone-comment");
		if ($idZoneComment) {
			$( "#" + $idZoneComment.val() )
				.show()
				.find("textarea")
				.addClass("focus").focus();	   
		}	    
		return false;  

	}); 
});

// <<<<<<<<<</NAMESPACE>
})(jQuery); window.estim_commons_scripts="loaded";}