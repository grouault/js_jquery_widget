(function($) {

	$(document).ready(function() {

		function calcSizes() {
			var iniWidth = 959,
							iniHeight = 478,
							newWidth = $('.carousel-navigation').innerWidth(),
							sizes = {
								stage: {'width': newWidth, 'height': iniHeight},
								nav: {'width': iniWidth, 'height': iniHeight}
							};

			// Set navigation slider dims
			sizes.nav.width = (newWidth <= 250) ? 250 : newWidth / 4;
			sizes.nav.height = parseInt(iniHeight / iniWidth * sizes.nav.width);

			// Set main slider height
			sizes.stage.height = parseInt(iniHeight / iniWidth * newWidth);

			var carrouselHeight = sizes.nav.height + sizes.stage.height + 10;

			if (carrouselHeight > $(window).innerHeight()) {
				sizes.stage.height = $(window).innerHeight() - (sizes.nav.height + 15);
				sizes.stage.width = newWidth;
			}

			return sizes;
		}
		
		var sizes = calcSizes();
		$('#gallery > li').css({'width': sizes.stage.width + 'px', 'height': sizes.stage.height + 'px'});
		$('#gallery-thumbs > li').css({'width': sizes.nav.width + 'px', 'height': sizes.nav.height + 'px'});
		
		// apparition des informations d'une slide
		$('.carousel-stage').on('mouseenter mouseleave', '.content-infos', function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget).find('.sub-content-datas');
			if (e.type === "mouseenter")
				$target.stop(true, true).slideDown('fast');
			else
				$target.stop(true, true).slideUp('fast');
		});

		// If there are gallery thumbs on the page
		if ($('#gallery-thumbs').length > 0) {

			// remplace les images par un background centré / recadré
			$('.navigation .thumb-item').each(function() {
				var imgSrc = $(this).find('img').hide().attr('src');
				$(this).css({'background-image': "url('" + imgSrc + "')"});
			});

			// How many thumbs do you want to show & scroll by
			var visibleThumbs = 6;

			var thumbsSliderSettings = {
				controls: false,
				pager: false,
				minSlides: 1,
				maxSlides: visibleThumbs,
				infiniteLoop: false,
				slideWidth: sizes.nav.width
			};
			// Thumbnail slider
			var thumbsSlider = $('#gallery-thumbs').bxSlider(thumbsSliderSettings);
			// custom crontrols
			$('.navigation .btn-right').click(function(e) {
				e.preventDefault();
				thumbsSlider.goToNextSlide();
			});
			$('.navigation .btn-left').click(function(e) {
				e.preventDefault();
				thumbsSlider.goToPrevSlide();
			});
			// Put slider into variable to use public functions
			var gallerySlider = $('#gallery').bxSlider({
				controls: false,
				pager: false,
				infiniteLoop: true,
				speed: 500,
				onSlideNext: function($slideElement, oldIndex, newIndex) {
					// Tell the slider to move
					thumbsSlider.goToSlide(Math.floor(newIndex / visibleThumbs));
				},
				onSlidePrev: function($slideElement, oldIndex, newIndex) {
					// Tell the slider to move
					thumbsSlider.goToSlide(Math.floor(newIndex / visibleThumbs));
				}
			});
			// custom crontrols
			$('.stage .btn-right').click(function(e) {
				e.preventDefault();
				gallerySlider.goToNextSlide();
			});
			$('.stage .btn-left').click(function(e) {
				e.preventDefault();
				gallerySlider.goToPrevSlide();
			});
			// When clicking a thumb
			$('.thumb-item').click(function(e) {

				// Prevent default click behaviour
				e.preventDefault();
				// -6 as BX slider clones a bunch of elements
				gallerySlider.goToSlide($(this).closest('.thumb-item').index());
			});

		} else {
			var gallerySlider = $('#gallery').bxSlider({
				controls: false,
				pager: true,
				infiniteLoop: true,
				speed: 500
			});
			// custom crontrols
			$('.stage .btn-right').click(function(e) {
				e.preventDefault();
				gallerySlider.goToNextSlide();
			});
			$('.stage .btn-left').click(function(e) {
				e.preventDefault();
				gallerySlider.goToPrevSlide();
			});
		}
	});
})(jQuery); 