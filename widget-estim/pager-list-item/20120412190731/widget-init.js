/**
 * Script d'initialisation de tous les ?l?ments graphiques ?volu?s.
 * Widget, ?vennements JS...
 **/

/**
 * Initialisation du Pretty Photo.
 *
 **/
window.prettyIframeAdjust = function () {
  $(".pp_pic_holder iframe").load(function () {
      
      var $uper = $(this).closest(".pp_pic_holder");
      var $hc = $uper.find(".pp_hoverContainer");
      var $ct = $uper.find(".pp_content");
      var $ppd = $uper.find(".pp_details"); //div de la pagination.
      
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
      
      $(".pp_overlay").attr("style", "").css({
          opacity : 0.8,
          position : "absolute",
          display : "block",
          width : $("body:first").width(),
          height : $("body:first").height() + deltaH,
          top : 0,
          left : 0,
          bottom : 0,
          right : 0
        });
      
    });
}

window.wdg.pushInit("a[rel^='prettyPhoto']", function () {
    $(this).prettyPhoto($.extend(true, {
          theme : 'facebook',
          hideflash : true,
          slideshow : false,
          show_title : false,
          allow_resize : false,
          changepicturecallback : function () {
            window.prettyIframeAdjust();
          }
        },
        $("body").data("data") && $("body").data("data").prettyPhoto,
        $(this).data("data")));
  }, true);

/*
Permet d habiller le ComboSelect lang dans le footer
@target:  js_langues
@display:  affiche la langue selectionner
@returns:  void
 */
window.wdg.pushInit("[name=js_langues]", function () {
    var $elf = $(this);
    $elf.comboselect({
        clazzLang : {
          background : "url(/mediacs/images/bsistf/blackselect.jpg) no-repeat scroll left center transparent",
          fontSize : 12,
          height : 19,
          width : 131,
          paddingTop : 3,
          paddingLeft : 10,
          border : 0
        },
        selectcallback : function () {
          var selected = $elf.children(":selected");
          if (selected.length == 1) {
            window.location = selected[0].value;
          }
        }
      });
  })

window.wdg.pushInit(".wdg_slideshow_diaporama", function () {
    var $elf = $(this);
    var initData = $.extend($elf.data("data"), {
          css : {
            diapositiveWidth : 200,
            diapositiveHeight : 200,
            buttonSize : 14,
            marginRight : 40,
            marginLeft : 0,
            marginTop : 0,
            marginBottom : 0,
            opacity : 0.5
          }
			
        });
    $elf.txtImgSlide(initData);
  })

window.wdg.pushInit(".wdg_slideshow_carousel", function () {
    var $elf = $(this);
    var initData = $.extend($elf.data("data"), {
          css : {
            diapositiveWidth : 149,
            diapositiveHeight : 115,
            buttonSize : 25,
            marginRight : 24,
            marginLeft : 0,
            marginTop : 25,
            marginBottom : 0,
            opacity : 0.5
          }
        });
    $elf.carouselUS(initData);
  })

window.wdg.pushInit(".wdg_autocomplete", function () {
    var $elf = $(this);
    var initData = $.extend({
        cache : {},
        lastXhr : false,
        minLength : 1,
        url : $("body").data("urlFichierXML")
    },$elf.data("data"));
    $elf.data("data",initData).autocomplete({
      minLength: initData.minLength,
      source: function( request, response ) {
        var term = request.term,conf=$elf.data("data");
        if ( term in conf.cache ) {
          response( conf.cache[ term ] );
          return;
        }
        conf.lastXhr = $.get(conf.url,{debut:term}, function( data, status, xhr ) {
          conf.cache[ term ] =[];
          $(data).find("option").each(function(i,e){
              conf.cache[ term ].push({label:$(this).text(),value:$(this).text()});
          });
          if ( xhr === conf.lastXhr ) {
            response( conf.cache[ term ] );
          }
        },"xml");
      }
    });
  })

//------------------------- OPTIM  ---------------------------------//


window.wdg.pushInit("body", function () {
    $(this).addClass('js');
  });

window.wdg.pushInit(".need-js", function () {
    $(this).show();
  });

// transform input labels into hidden labels + inside text in input with reset-focus
window.wdg.pushInit("label.js-label-outside", function () {
    var $elf = $(this);
    $elf.each(function () {
        // get the input corresponding to this label
        var $input = $elf.next(); //parent().find('#'+$(this).attr('for'));
        $input.val($elf.html()).addClass('reset-focus');
        $input.get(0).defaultValue = $(this).html();
        $elf.addClass('outside');
      });
  });

//Reset form focus
window.wdg.pushInit(".reset-focus", function () {
    var $elf = $(this);
    $elf.focus(function () {
        if ($elf.val() == this.defaultValue)
          $elf.val('');
      }).blur(function () {
        if ($.trim(this.value) == '')
          this.value = (this.defaultValue ? this.defaultValue : '');
      });
  });

// Blank links
window.wdg.pushInit(".blank-link", function () {
    $(this).click(function () {
        window.open($(this).attr('href'));
        return false;
      });
  });

// Skin selelect
window.wdg.pushInit(".skin-select", function () {
    $(this).select_skin();
  });

// Select lang
window.wdg.pushInit(".select-lang", function () {
    var $elf = $(this);
    $elf.change(function () {
        window.location = this.options[this.selectedIndex].value;
      });
  });

// newsletter email check
window.wdg.pushInit(".news form", function () {
    $(this).checkFormNews();
  });

// Header opts
window.wdg.pushInit(".header-opts", function () {
    $(this).headeropts();
  });

// main menu
window.wdg.pushInit("#mainnav, #menu-cite", function () {
    $(this).slidedownMenu();
  });

// sidebar menu
window.wdg.pushInit(".std-sidebar #main-menu", function () {
    $(this).sidebarmenu();
  });
  
//ui.dialog{
window.wdg.pushInit(".lienfonctionjs-dialog", function () {
	$(this).click(function () {
            $(".dialog").dialog();
      });
  });
 
//Captcha 
window.wdg.pushInit(".captcha", function() {
	$.fn.image = function(src) {
		return this.each(function() {
			$("<img />").appendTo(this).each(function() {
				this.src = src;
			});
		});
	};

	$(this).image("/cms/captcha");
});

 