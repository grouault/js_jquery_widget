/* FUNCTIONS
 --------------------------------------------------------------------------------------------------------------------------------------*/
(function($) {

	$('.video-resources').each(function(){
		
		var $elf = $(this);
		var $iframe = $elf.find('.video-player-iframe-widget');
		// liste video.
		var $videos = $elf.find('.videos').find('figure').hide();
		$elf.find('.videos').find('figure:first').show();
		// liste items.
		var items = $elf.find('.items').find('figure');
		$elf.find('.video-item:first').addClass("active");
		
		var linkSelector = $elf.find('.video-item');
        linkSelector.on('click', function(e) {
			var videoUrl = $(this).data('url')
			var videoId = $(this).data("id");
			$iframe.attr('src', '');
			setTimeout( function () {
				$iframe.attr('src', videoUrl);  
			}, 50);
			$videos.hide();
			$.each($videos, function(i, video){
				var $video = $(video);
				if ($video.data("id") == videoId) {
					$video.show();
				}
			});
			items.removeClass("active");
			$.each(items, function(i, item){
				var $item = $(item);
				if ($item.data("id") == videoId) {
					$item.addClass("active");
				} 
			});
		});	
	});
	
})(jQuery);
