//


window.prettyIframeAdjust=function(){
  $(".pp_pic_holder iframe").load(function() {
    
 
    var $uper = $(this).closest(".pp_pic_holder");
    var $hc = $uper.find(".pp_hoverContainer");
    var $ct = $uper.find(".pp_content");
    var $ppd = $uper.find(".pp_details");//div de la pagination.
    
    var originHeight = $(this).height();
    var originWidth = $(this).width();
    var $frm = $(this.contentDocument);
    $(this).height($frm.height());
    $(this).width($frm.width());
    var deltaH = $frm.height() - originHeight;
    var deltaW = $frm.width() - originWidth;
    
    $uper.width($uper.width() + deltaW);
    $ppd.width($ppd.width() + deltaW);
    //$ct.width($ct.width() + deltaW);
    $ct.height($ct.height() + deltaH);
    $hc.width($hc.width() + deltaW);
    $hc.height($hc.height() + deltaH);
    
    /*
    $uper.css({
      top : $uper.offset().top - deltaH * 2,
      left : $uper.offset().left - deltaW * 2
    });
		*/
	
    $(".pp_overlay").attr("style", "").css({
      opacity : 0.8,
      position : "absolute",
      display : "block",
      width :  $("body:first").width(),
      height : $("body:first").height()+deltaH,
      top : 0,
      left : 0,
      bottom : 0,
      right : 0
    });
    
   
  
  });
}

window.wdg.pushInit("a[rel^='prettyPhoto']", function(){
          $(this).prettyPhoto($.extend(true,{
            theme: 'facebook',
            hideflash: true,
            slideshow: false,
            show_title:false,
             allow_resize:false,
            changepicturecallback: function(){
              window.prettyIframeAdjust();
            }
          },
          $("body").data("data") && $("body").data("data").prettyPhoto,
          $(this).data("data")));
},true);



