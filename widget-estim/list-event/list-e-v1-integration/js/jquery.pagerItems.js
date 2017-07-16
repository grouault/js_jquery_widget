(function($){
	
	$.fn.pagerItems = function( options ) {
		
		// options par defaut.
		var defaults = {
			nbItemsPerPage: 3,
			domItem : "li",
			classItem: "visible",
			nbPagerSelector : 1,
			outerCss : 'paginate-widget-events-list',
			outerResultCss : 'number-results-widget-events-list', 
			pagerOuterCss: 'paginate-list-widget-events-list',
			pagerCss : 'paginate-sub-list-widget-events-list',
			previousCss : 'arrow-page fa fa-angle-left',
			numberPageCss : 'number-page',
			nextCss : 'arrow-page fa fa-angle-right',
			nextText : '',
			lastText : '',
			previousText : '',
			firstText : ''
		};
		
		var tabPager = [];
		this.each(function(){
			
			var $elf = $(this);
			var opts = $.extend(defaults, options);
			var pager = (function($elf,  opts){
			
			    var currentPage = 1;
			    var nbPerPage = opts.nbItemsPerPage;
				var itemsToFind = '>' + opts.domItem;
				if (opts.classItem.length > 0) {
					itemsToFind += '.' + opts.classItem;
				}			    
			    var nbItems = $elf.find(itemsToFind).length;
			    var nbPages = Math.ceil(nbItems/nbPerPage);	
			    var nbPagerSelector = opts.nbPagerSelector;
				
				// elts constitutifs du pager.
				var templates = {
					outer : '<div class="wdg_pagination ' + opts.outerCss + '"></div>',	
					outerResult : '<div class="' + opts.outerResultCss + '"><span class="wdg_nb_result">' + nbItems + '</span> r&eacute;sultats</div>',
					pagerOuter : '<div class="' + opts.pagerOuterCss + '"></div>',
					pager: '<ul class="wdg_pager ' + opts.pagerCss + '"></ul>',
					previousElts: '<li class="wdg_previous wdg_pager_first pager-navigation"><a>' + opts.firstText + '</a></li><li class="wdg_previous wdg_pager_previous pager-navigation"><a class="' + opts.previousCss + '">' + opts.previousText + '</a></li><li class="wdg_previous wdg_pager_plus_inf"><a class="' + opts.numberPageCss + '">...</a></li>',
					nextElts: '<li class="wdg_next wdg_pager_plus_sup"><a class="' + opts.numberPageCss + '">...</a></li><li class="wdg_next wdg_pager_next pager-navigation"><a class="' + opts.nextCss + '">' + opts.nextText + '</a></li><li class="wdg_next wdg_pager_last pager-navigation"><a>' + opts.lastText + '</a></li>'			
				};	
				
				var selectors = {						
					".wdg_pager_first" : {
						click : function(e) {
							var pager = e.data;
				    		currentPage = 1;
				    		_repaginate(pager);
						}
					},
					".wdg_pager_previous" : {
						click : function(e) {
							var pager = e.data;
							currentPage = pager.data('currentPage') - 1;	
							_repaginate(pager);
						}
					},
					".wdg_pager_next" : {
						click : function(e) {
							var pager = e.data;
							currentPage = pager.data('currentPage') + 1;
							_repaginate(pager);
						}
					},
					".wdg_pager_last" : {
						click : function(e) {
							var pager = e.data;
				    		currentPage = nbPages;
							_repaginate(pager);
						}					
					},
					".wdg_pager_number" : {
						click : function(e){
							var pager = e.data;
							currentPage = $(this).data("pageNb");
							_repaginate(pager);
						}
					}
				};
						    
			    var _bindEvents = function($pager) {
			    	if (typeof(selectors) != undefined) {
			    		$.each(selectors , function(selector, events) {	    			
			    			$.each(events, function(eventName, handler){
			    				$pager.find(selector).bind(eventName, $pager, handler);
			    			});
			    		});
			    	}
			    };
			    
			    var _elementsSynchronize = function (){
			        $elf.find(itemsToFind).hide()
			        	.slice((currentPage-1) * nbPerPage, currentPage * nbPerPage)
			        	.show();
			    };
			    
			    // permet de synchroniser les elements.
			    var _pagerSynchronize = function ( $pager ){
			    	// on cache tous les elements de pagination
			    	$pager.find(">li").hide();
			   
			    	if (currentPage > nbPagerSelector+1){
			    		$pager.find(".wdg_previous").show();
			    	}
			    	if (currentPage < nbPages-nbPagerSelector) {
			    		$pager.find(".wdg_next").show();
			    	}
			    	
			    	// active page.
			    	$pager.find(".number-" + currentPage)
			    		.show()
			    		.addClass('pager-active')
			    		.siblings().removeClass('pager-active');
			    	
			    	// affichage previous page
			    	for (var i=1; i<=nbPagerSelector ; i++) {
			    		if (currentPage-i >= 1) {
			    			$pager.find(".number-" + (currentPage-i)).show();
			    		}
			    	}
			    	// affichage next page
			    	for (var i=1; i<=nbPagerSelector; i++) {
			    		if (currentPage+i <= nbPages) {
			    			$pager.find(".number-" + (currentPage+i)).show();
			    		}
			    	}
			    	
			    	// affichage - plus INF.
			    	if (currentPage-nbPagerSelector > 1) {
			    		$pager.find(".wdg_pager_plus_inf").show()
			    	}
			    	
			    	// afficahge - plus SUP
			    	if (currentPage+nbPagerSelector < nbPages) {
			    		$pager.find(".wdg_pager_plus_sup").show()
			    	}
			    	
			    };
			    
			    // lance la pagination.
			    var _repaginate = function( $pager ){
			        $pager.data('currentPage', currentPage);
			        _elementsSynchronize();
			        _pagerSynchronize( $pager );
			    };
			    
			    return {
			    	init : function () {
			    		var $pager = $(templates['pager'])
			    			.insertBefore($elf)
			    			.wrap( templates['outer'] )
			    			.before( templates['outerResult'])
			    			.wrap( templates['pagerOuter'] )
			    			.append( templates['previousElts'] );
			    		// insertion des pages
			    	    for (var page = 1 ; page <= nbPages; page++) {
			    	        // ajout des numeros de pages.
			    	    	var textValue = '<a class="' + opts.numberPageCss + '">' + page + '</a>'
			    	        $('<li class="wdg_pager_number pager-navigation number-' + page + '"></li>')
			    	        	.append(textValue)
			    	        	.data("pageNb", page)
			    	        	.appendTo($pager);
			    	    } 
			    		$pager.append(templates['nextElts']);
			    		_bindEvents( $pager );
			    		_repaginate( $pager );
			    		return $pager;
			    	}
			    };
			
			})($elf, opts);
					
			// pager init.
			var $pager = pager.init();
			tabPager.push($pager);
						
		});
		
		// return le pager et pas this.
		return this.pushStack( tabPager );	
	
	};
	
})(jQuery);