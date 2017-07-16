var zf = zf || {};

/* FUNCTIONS
 --------------------------------------------------------------------------------------------------------------------------------------*/

(function($) {
	zf.parseContentFile = function() {
            var contentString = '';
            $.getJSON( "json/data-widget-popup.json", function(data) {
                    
                })
                .done(function( data) {
                    //contentString += '<div>';
                    $.each( data.datas, function( key, val) {
                        if( key==0) {
                            contentString += '<div class="tabs-menu-content active" id="tabs-menu-content-'+key+'">';
                        }
                        else {
                            contentString += '<div class="tabs-menu-content" id="tabs-menu-content-'+key+'">';
                        }
                        $.each( data.datas[key].paragraphs, function( k, v) {
                            contentString += '<p>';
                            contentString += data.datas[key].paragraphs[k].desc;
                            contentString += '</p>';
                        });
                        contentString += '</div>';
                    });
                    //contentString += '</div>';
                    $('#tabs-menu-container-1').append(contentString);
                })
                .fail(function() {
                        
                })
                .always(function() {
                        
                });
	};

        zf.toogleVideoWidgetBlock = function() {
            var fancyboxToggle = '.video-link-more-infos, .content.slider-home .slider li a.thumb, .content.slider-home .slider li a.thumb-title, ';
            fancyboxToggle += '.header-article-widget-events-list .img-link, .header-article-widget-events-list h2 .title-link';
            $('.tabs-menu-link-container').on('click', function(e) {
                e.preventDefault();
                if( !$(this).hasClass('active')) {
                    var getDataId = $(this).attr('data-id');
                    $('.tabs-menu-link-container ').removeClass('active');
                    $(this).addClass('active');
                    $('.tabs-menu-content').removeClass('active');
                    $('#tabs-menu-content-'+getDataId).addClass('active');
                }
            });
            $(fancyboxToggle).fancybox({
                    'transitionIn': 'elastic',
                    'transitionOut':'elastic',
                    'speedIn':      600,
                    'speedOut':     200,
                    'overlayShow':  false,
                    'margin': 0,
                    'padding': 0
            });
	};


	/* INIT
	 --------------------------------------------------------------------------------------------------------------------------------------*/

	zf.init = function() {
            zf.parseContentFile();
            zf.toogleVideoWidgetBlock();
	};
	/* DOM READY
	 --------------------------------------------------------------------------------------------------------------------------------------*/

	$(document).ready(zf.init);

})(jQuery);