$(document).ready(function(){
   
  $('.wdg_paginated').each(function() {
     
	// initialisation variable.
	var $pager = $('<ul class="wdg_pager"></ul>'); // bloc pagination.
	var $first = $('<li class="wdg_pager_first"></li>');
	var $last = $('<li class="wdg_pager_last"></li>');
	var $previous = $('<li class="wdg_pager_previous"></li>');
    var $next = $('<li class="wdg_pager_next"></li>');
    var $plusInf = $('<li class="wdg_pager_plus_inf">...</li>');
    var $plusSup = $('<li class="wdg_pager_plus_sup">...</li>');
    
	var $elf = $(this); // bloc des elements tot
    var currentPage = 1;
    var nbPerPage = 3;
    var nbItems = $elf.find('>li').length;
    var nbPages = Math.ceil(nbItems/nbPerPage);

    
    $('<span class="wdg_pager_previous"></span>')
    // permet de synchroniser le bloc pager.
    var elementsSynchronize = function (){
      $elf.find('>li').hide()
      .slice((currentPage-1) * nbPerPage, currentPage * nbPerPage)
      .show();
    };
    
    // permet de synchroniser les elements.
    var pagerSynchronize = function (pager){
    	// on cache tous les elements de pagination
    	$pager.find(">li").hide();
   
    	if (currentPage > 1){
    		$previous.show();
    		$first.show();
    	}
    	if ((currentPage+1) < nbPages) {
    		$next.show();
    		$last.show();
    	}
    	
    	// active page.
    	$pager.find(".number-" + currentPage)
    		.show().addClass('active').siblings().removeClass('active');
    	
    	// affichage previous page
    	for (var i=1; i<=2 ; i++) {
    		if (currentPage-i >= 1) {
    			$pager.find(".number-" + (currentPage-i)).show();
    		}
    	}
    	// affichage next page
    	for (var i=1; i<=2; i++) {
    		if (currentPage+i <= nbPages) {
    			$pager.find(".number-" + (currentPage+i)).show();
    		}
    	}
    	
    	// affichage - plus INF.
    	if (currentPage-2 > 1) {
    		$plusInf.show();
    	}
    	
    	// afficahge - plus SUP
    	if (currentPage+2 < nbPages) {
    		$plusSup.show();
    	}
    };
    
    // lance la pagination.
    var repaginate = function(){
        $pager.data('currentPage', currentPage);
        elementsSynchronize();
        pagerSynchronize();
    };

    
    /** 
     * Initialisation du pager.
     */
    // Ajout des liens preview.
    $previous.text("<").prependTo($pager).addClass('clickable');
    $first.text("first").prependTo($pager)
    	.click(function(){
    		currentPage = 1;
    		repaginate();
    	});
 
    // Ajout des pages.
    $plusInf.appendTo($pager);
    for (var page = 1 ; page <= nbPages; page++) {
      // ajout des numeros de pages.
      $('<li class="wdg_pager_number number-' + page + '"></li>').text(page)
      .bind('click', {newPage : page}, function(event){
    	currentPage = event.data['newPage'];
    	repaginate();
      })
      .appendTo($pager);
    }    
    $plusSup.appendTo($pager);
    
    // Ajout des liens next.
    $next.text(">").appendTo($pager).addClass('clickable');  
    $last.text("last").appendTo($pager)
    	.click(function(){
    		currentPage = nbPages-1;
    		repaginate();
    	});   
    
    $elf.wrap('<div class="wdg_pagination"></div>')
    $pager.insertBefore($elf)
    	.find('li.wdg_pager_number:first').addClass('active');

    $('.clickable').click(function(){
	  if ($(this).hasClass('wdg_pager_previous')) {
		  currentPage = 1;
		  if ($pager.data('currentPage') > 1) {
			  currentPage = $pager.data('currentPage') - 1;  
		  }
	  } else {
		  currentPage = $pager.data('currentPage') + 1;
	  }
	  repaginate();
    });
    
    // initialize
    repaginate();
    
  });
	
});