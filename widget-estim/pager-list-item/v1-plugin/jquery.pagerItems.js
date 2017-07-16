(function($){
	
	$.fn.pagerItems = function( options ) {
		
		// options par defaut.
		var defaults = {
			nbItemsPerPage: 3,
			domItem : "li",
			nbPagerSelector : 1
		};
		
		var tabPager = [];
		this.each(function(){
			
			var $elf = $(this);
			var opts = $.extend(defaults, options);
			var pager = (function($elf,  opts){
			
			    var currentPage = 1;
			    var nbPerPage = opts.nbItemsPerPage;
			    var nbItems = $elf.find('>' + opts.domItem).length;
			    var nbPages = Math.ceil(nbItems/nbPerPage);	
			    var nbPagerSelector = opts.nbPagerSelector;
				
				// elts constitutifs du pager.
				var templates = {
					outer : '<div class="wdg_pagination"></div>',
					pager: '<ul class="wdg_pager"></ul>',
					previousElts: '<li class="wdg_previous wdg_pager_first"><a>first</a></li><li class="wdg_previous wdg_pager_previous"><a>previous</a></li><li class="wdg_previous wdg_pager_plus_inf">...</li>',
					nextElts: '<li class="wdg_next wdg_pager_plus_sup">...</li><li class="wdg_next wdg_pager_next"><a>next</a></li><li class="wdg_next wdg_pager_last"><a>last</a></li>'			
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
			        $elf.find('>' + opts.domItem).hide()
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
			    		.show().addClass('active').siblings().removeClass('active');
			    	
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
			    		$elf.wrap( templates['outer'] );
			    		var $pager = $(templates['pager'])
			    			.insertBefore($elf)
			    			.append( templates['previousElts'] );
			    		// insertion des pages
			    	    for (var page = 1 ; page <= nbPages; page++) {
			    	        // ajout des numeros de pages.
			    	        $('<li class="wdg_pager_number number-' + page + '"></li>')
			    	        	.text(page)
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