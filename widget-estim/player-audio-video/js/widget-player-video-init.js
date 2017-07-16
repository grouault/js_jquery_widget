var zf = zf || {};

/* FUNCTIONS
 --------------------------------------------------------------------------------------------------------------------------------------*/

(function($) {

	zf.datasVideo = '';

	zf.changeVideoItem = function(d) {
            var linkSelector = $('.video-resources').find('.video-item');
            linkSelector.on( 'click', function(e) {
                e.preventDefault();
                if( !$(this).hasClass('active')) {
                    //Tabs
                    linkSelector.removeClass('active');
                    $(this).addClass('active');
                    //Iframe
                    var iframeString = '', videoInfosString ='';
                    var getDataId = $(this).attr('data-id');
                    iframeString += '<iframe width="480" height="270" src="'+d[getDataId].srcVideo+'" allowfullscreen class="video-player-iframe-widget" data-id="'+getDataId+'"></iframe>';
                    videoInfosString += '<a href="'+d[getDataId].hrefImg+'" class="video-link-title">';
                    videoInfosString    += '<img class="video-logo" alt="" src="'+d[getDataId].srcLogoImg+'">';
                    videoInfosString    += '<h1>'+d[getDataId].title+'</h1>';
                    videoInfosString += '</a>';
                    videoInfosString += '<figcaption class="video-text-infos">';
                    videoInfosString    += '<p class="video-desc-infos">'+d[getDataId].desc+'</p>';
                    videoInfosString    += '<p class="video-time-infos">Durée : '+d[getDataId].duration+'</p>';
                    videoInfosString    += '<p class="video-publish-infos">Publié le <time datetime="'+d[getDataId].datePublish+'" class="video-date-publish">'+d[getDataId].dateFormattedPublish+'</time></p>';
                    videoInfosString    += '<p class="video-author-item">';
                    videoInfosString    += '    <span>Par : </span>';
                    videoInfosString    += '    <a href="'+d[getDataId].authorLink+'" class="video-link-author-item" data-user-uri="'+d[getDataId].authorLink+'" data-tip-vszone="search">'+d[getDataId].authorName+'</a>';
                    videoInfosString    += '</p>';
                    videoInfosString    += '<a href="#tabs-menu-container-1" class="video-link-more-infos">En savoir +</a>';
                    videoInfosString += '</figcaption>';
                    $('.video-player-sub-widget').html(iframeString);
                    $('.sub-video-infos').html(videoInfosString);
                }
            });
	};

	zf.parseFile = function() {
            $.getJSON( "json/data-widget-video.json", function(data) {
                
            })
            .done(function(data) {
                var iframeString = '', videoInfosString ='', contentString = '';
                $.each( data.datas, function( key, val) {
                    if( key == 0) {
                        iframeString += '<iframe width="480" height="270" src="'+data.datas[key].srcVideo+'" allowfullscreen class="video-player-iframe-widget"></iframe>';
                        videoInfosString += '<a href="'+data.datas[key].hrefImg+'" class="video-link-title">';
                        videoInfosString    += '<img class="video-logo" alt="" src="'+data.datas[key].srcLogoImg+'">';
                        videoInfosString    += '<h1>'+data.datas[key].title+'</h1>';
                        videoInfosString += '</a>';
                        videoInfosString += '<figcaption class="video-text-infos">';
                        videoInfosString    += '<p class="video-desc-infos">'+data.datas[key].desc+'</p>';
                        videoInfosString    += '<p class="video-time-infos">Durée : '+data.datas[key].duration+'</p>';
                        videoInfosString    += '<p class="video-publish-infos">Publié le <time datetime="'+data.datas[key].datePublish+'" class="video-date-publish">'+data.datas[key].dateFormattedPublish+'</time></p>';
                        videoInfosString    += '<p class="video-author-item">';
                        videoInfosString        += '<span>Par : </span>';
                        videoInfosString        += '<a href="'+data.datas[key].authorLink+'" class="video-link-author-item" data-user-uri="'+data.datas[key].authorLink+'" data-tip-vszone="search">'+data.datas[key].authorName+'</a>';
                        videoInfosString    += '</p>';
                        videoInfosString    += '<a href="#tabs-menu-container-1" class="video-link-more-infos">En savoir +</a>';
                        videoInfosString += '</figcaption>';
                        contentString += '<figure class="video-item active" data-id="'+key+'">';
                    }
                    else {
                        contentString += '<figure class="video-item" data-id="'+key+'">';
                    }
                    contentString       += '<a href="'+data.datas[key].hrefImg+'" class="video-link-preview-item" title="'+data.datas[key].title+'">';
                    contentString           += '<img class="video-preview-item" alt="'+data.datas[key].title+'" title="'+data.datas[key].title+'" src="'+data.datas[key].srcImg+'">';
                    contentString       += '</a>';
                    contentString       += '<figcaption class="video-text-item">';
                    contentString           += '<p class="video-title-item">'+data.datas[key].title+'</p>';
                    contentString           += '<p class="video-desc-item">'+data.datas[key].desc+'</p>';
                    contentString           += '<p class="video-author-item">';
                    contentString               += '<span>par :&nbsp;</span>';
                    contentString               += '<a href="'+data.datas[key].authorLink+'" class="video-link-author-item" data-user-uri="'+data.datas[key].authorLink+'" data-tip-vszone="search">'+data.datas[key].authorName+'</a>';
                    contentString           += '</p>';
                    contentString       += '</figcaption>';
                    contentString += '</figure>';
                });
                $('.video-player-sub-widget').append(iframeString);
                $('.sub-video-infos').append(videoInfosString);
                $('.video-list').prepend(contentString);
                zf.datasVideo = data.datas;
            })
            .fail(function() {
                    
            })
            .always(function() {
                    
                    zf.changeVideoItem(zf.datasVideo);
            });
	};

	/* INIT
	 --------------------------------------------------------------------------------------------------------------------------------------*/

	zf.init = function() {
            zf.parseFile();
	};


        /* DOM READY
	 --------------------------------------------------------------------------------------------------------------------------------------*/

	$(document).ready(zf.init);

})(jQuery);
