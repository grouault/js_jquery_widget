(function($) {
  var positionables = [ 'absolute', 'relative', 'fixed' ];
  if (!$.expr[':'].static) {
    // :static
    $._isStatic = function(/*HTMLElement*/e, /*Integer*/i, /*Array*/m) {
      return $.inArray($(e).css("position"), positionables) <= 0;
    };
    $.expr[':'].static = jQuery._isStatic;
  }
  if (!$.expr[':'].positionable) {
    // :positionable
    $._isPositionable = function(/*HTMLElement*/e, /*Integer*/i, /*Array*/m) {
      return $.inArray($(e).css("position"), positionables) >= 0;
    };
    $.expr[':'].positionable = jQuery._isPositionable;
  }
})(jQuery);





/**
 * Widget de slideshow
 *
 * Dans ce fichier (vocabulaire):
 *  - $uper fait toujours référence à $(this).closest(".ui-txtImgSlide") soit le conteneur 
 *    le plus haut du widget.
 *  - $elf fait toujours référence à $(this)
 *  - "<b> de l'actionsBox" fait référence aux boutons qui correspondent aux slides.
 *  - Les noms d'instances JQuery sont préfixées par $
 *  - "ui-txtImgSlide" est la class de référence du widget elle est placée sur la div 
 *    englobante. (d'ou le $(this).closest(".ui-txtImgSlide"))
 *
 */
$.widget("ui.txtImgSlide", {
  options : {
    width : "auto",
    height : "auto",
    timer : 2,
    fade : {
      opacity : 0.5,
      duration : 30
    },
    buttons : {
      enabled : true,
      options : {
        text : false,
        icons : {
          primary : "ui-icon-play"
        }
      }
    },
    breadcrumb : {
      enabled : true
    },
    slideClick : function() {
      var $elf = $(this);
      var $uper = $elf.closest(".ui-txtImgSlide");
      var $ub = $elf.find(".ui-txtImgSlide-slide-content[href],.ui-txtImgSlide-slide-content[onclick]");
      if ($ub.length) {
        // si un evenement est prévu pour le slide
        $ub.each(function() {
          // On notera que si il y a un onclick ET un href, 
          // on execute d'abord le onclick avant de faire le href
          var $elf = $(this);
          $elf.is("[onclick]") && $elf.click();
          $elf.is('[href]:not([href=""])') && (window.location.href = $elf.attr("href"));
        });
      } else {
        // evenement par defaut == passage slide suivant
        $uper.trigger("txtImgSlide-stopSlideShow").trigger("txtImgSlide-next");
      }
    }
  },
  _create : function() {
    this._eventSlide = this.options.slideClick;
    // this.element == la div du plugin
    var $uper = this.element.addClass("ui-txtImgSlide");
    $uper.wrapInner("<div class='ui-txtImgSlide-slides' />");
    $uper.append("<div class='ui-txtImgSlide-helper'><div class='ui-txtImgSlide-actionsBox'></div></div>");
    $uper.wrapInner("<div class='ui-txtImgSlide-layout' />");
    $uper.data("timer", this.options.timer);
    $uper.data("breadcrumb", this.options.breadcrumb);
    var dimensions = this._initDim($uper, this.options);
    var $lides = $uper.find(".ui-txtImgSlide-slides").children();
    var $helperBox = $uper.find(".ui-txtImgSlide-helper").css(dimensions);
    this._slidesInit($lides, dimensions, this.options.fade);
    this._createButtons(this.options.buttons, $helperBox.find('.ui-txtImgSlide-actionsBox').toggle(
        this.options.breadcrumb.enabled), $lides.length);
    // on attache les event du widget
    $uper.bind("txtImgSlide-next", this._next);
    $uper.bind("txtImgSlide-startSlideShow", this._startSS);
    $uper.bind("txtImgSlide-stopSlideShow", this._stopSS);
    // Init dim du layout
    $uper.find(".ui-txtImgSlide-layout").css(dimensions);
    // Affiche la premiere diapo (click premier bouton enfait)
    $uper.find('.ui-txtImgSlide-actionsBox b').first().trigger("txtImgSlide-click");
    // lance diaporama
    $uper.find(".ui-txtImgSlide-play").trigger("click");
  },
  _initDim : function($up, opt) { // retourne la taille trouvée ou calculée.
    var css = {};
    $.each([ "width", "height" ], function(i, dimName) {
      css[dimName] = "auto" == opt[dimName] ? $up[dimName]() : opt[dimName];
      if (css[dimName] == 0) {
        // si la hauteur ou la largeur sont nulles 
        var tot = 0, cpt = 0;
        // On regarde la moyenne des tailles des images dedans
        $up.find("img").each(function() {
          tot += $(this)[dimName]();
          cpt++;
        });
        var calcDim = parseInt(tot / cpt);
        if (calcDim == 0) {
          // si il n'y a pas d'images ou si la moyenne de leur taille est 0 ????
          do {
            $up = $up.parent(); // on cherche la taille des parents
            calcDim = $up[dimName]();
          } while (calcDim <= 0 && $up.parent().is(":not(body)"));
        }
        css[dimName] = calcDim == 0 ? "100%" : calcDim; // finalement si tout est vide, on met a 100%
      }
    });
    return css;
  },
  _next : function() { // event "txtImgSlide-next" posé sur $uper qui change de diapo à la suivante
    var $uper = $(this).closest(".ui-txtImgSlide");
    var $ab = $uper.find(".ui-txtImgSlide-actionsBox");
    var $nxt = $ab.find("b.ui-selected").next("b");
    $nxt.length ? $nxt.trigger("txtImgSlide-click") : $ab.find("b").first().trigger("txtImgSlide-click");
  },
  _createButtons : function(cfg, $actionsBox, nbSlides) {
    if (cfg && cfg.enabled) {
      $actionsBox.append(new Array(nbSlides + 1).join("<b>&nbsp;</b>"));
      $("<span class='ui-txtImgSlide-play'>&nbsp;</span>").appendTo($actionsBox).button(cfg.options).click(
          this._eventSlideshow);
      with ($actionsBox.find("b")) {
        bind("txtImgSlide-click", this._actionClick);
        click(this._eventActionB);
        addClass("ui-corner-all");
        each(function(idx, b) {
          $(b).data("index", idx);
        });
        first().addClass("ui-selected");
      }
    }
  },
  _eventSlideshow : function() { // action au click du bouton play/pause
    var $uper = $(this).closest(".ui-txtImgSlide");
    var $playOrPause = $uper.find(".ui-txtImgSlide-actionsBox").find(".ui-icon-play,.ui-icon-pause");
    $uper.trigger($playOrPause.hasClass("ui-icon-play") ? "txtImgSlide-startSlideShow" : "txtImgSlide-stopSlideShow");
  },
  _startSS : function() { // event "txtImgSlide-startSlideShow" qui lance le diaporama
    var $uper = $(this).closest(".ui-txtImgSlide");
    $uper.data("interval") && clearInterval($uper.data("interval"));
    $uper.data("interval", setInterval($.proxy(function() {
      $(this).trigger("txtImgSlide-next");
    }, $uper), $uper.data("timer") * 1000));
    with ($uper.find(".ui-txtImgSlide-actionsBox").find(".ui-icon-play,.ui-icon-pause")) {
      addClass("ui-icon-pause");
      removeClass("ui-icon-play");
    }
  },
  _stopSS : function() { // event "txtImgSlide-stopSlideShow" qui stop le diaporama
    var $uper = $(this).closest(".ui-txtImgSlide");
    if ($uper.data("breadcrumb").enabled) { // Si les miettes de pains sont abscentes on stop pas le diaporama
      $uper.data("interval") && clearInterval($uper.data("interval"));
      with ($uper.find(".ui-txtImgSlide-actionsBox").find(".ui-icon-play,.ui-icon-pause")) {
        removeClass("ui-icon-pause");
        addClass("ui-icon-play");
      }
    }
  },
  _eventActionB : function() { // action sur click d'un des boutons <b> de l'actionsBox
    $(this).trigger("txtImgSlide-click").closest(".ui-txtImgSlide").trigger("txtImgSlide-stopSlideShow");
  },
  _actionClick : function() { // event "txtImgSlide-click" (a ttaché à un  <b> de l'actionsBox )qui 
    var $elf = $(this);
    var lrs = $elf.closest(".ui-txtImgSlide").find(".ui-txtImgSlide-slide");
    var bg = lrs.hide().filter(":nth-child(" + ($elf.data("index") + 1) + ")").show().find(".ui-txtImgSlide-slide-bg");
    var cntnt = bg.siblings(".ui-txtImgSlide-slide-content");
    bg.css({
      width : cntnt.width(),
      height : cntnt.height()
    });
    $elf.siblings().removeClass("ui-selected");
    $elf.addClass("ui-selected");
  },
  _slidesInit : function($lides, dimensions, fade) {
    $lides.each(function(idx, elmt) {
      var $elf = $(elmt);
      var cssRef = $elf[0].className; // CSS source avant modif...
      $elf.css({
        background : "transparent"
      }).addClass("ui-txtImgSlide-slide-content").wrap("<div class='ui-txtImgSlide-slide'>").wrapInner(
          "<div class='ui-txtImgSlide-slide-content-data'>");
      var $lide = $elf.closest(".ui-txtImgSlide-slide").css(dimensions); // ici closest(...) == parent()
      // On place le bg derriere le contenu
      var bg = $("<div class='ui-txtImgSlide-slide-bg'>&nbsp;</div>").prependTo($lide);
      // Maintenant que le bg est mis on place l'image derriere
      $elf.find("img").css($.extend(dimensions, {
        border : "none"
      })).prependTo($lide);
      var rel = $("<div class='ui-txtImgSlide-slide-related-content' />").appendTo($lide);
      $elf.find("*:positionable").appendTo(rel);
      if ($elf.is('[href]:not([href=""]),[onclick]') && this._eventSlide) {
        $lide.addClass("ui-txtImgSlide-clickable");
      }
      // Maintenant que l'image est déplacée (et que donc les 
      // tailles des conteneurs sont OK) on adapte le bg au texte
      bg.css({
        width : $elf.width(),
        height : $elf.height()
      }).addClass(cssRef).fadeTo(fade.duration, fade.opacity);
    });
    $lides.closest(".ui-txtImgSlide-slide").hide().click(this._eventSlide); // ici closest(...) == parent()
  }
});

