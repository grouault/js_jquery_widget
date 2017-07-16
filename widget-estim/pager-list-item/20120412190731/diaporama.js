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
 * CHANGELOG
 *  INITIALISATION : SC
 *  20110511  GR  - ajout des methodes bubblesInit, initTopTexts, initBottomTexts
 *          - modification de slideClick (href recupere au niveau de l objet data du selecteur et non sur l attribut href)
 */
var diaporama_ui_txtImgSlide = {
  options : {
    width : "auto", // largeur utilisée si background false
    height : "auto", // hauteur utilisée si background false
    background : true, // a false pour utiliser width/height
    sideBars : { // options des colonnes latérales
      borderWidth : 3,
      substractedStyles : [ "padding-left", "padding-right" ]
    },
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
          // on execute d'abord le onclick avant de suivre le href
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
  _usOptions : {
    events : {
      ".ui-txtImgSlide" : {
        "txtImgSlide-next" : function() {
          // event "txtImgSlide-next" posé sur $uper qui change de diapo à la suivante
          var $uper = $(this);
          var $ab = $uper.find(".ui-txtImgSlide-actionsBox");
          var $nxt = $ab.find("b.ui-selected").next("b");
          $nxt.length ? $nxt.trigger("txtImgSlide-click") : $ab.find("b").first().trigger("txtImgSlide-click");
        },
        "txtImgSlide-startSlideShow" : function() { // event "txtImgSlide-startSlideShow" qui lance le diaporama
          var $uper = $(this);
          $uper.data("interval") && clearInterval($uper.data("interval"));
          $uper.data("interval", setInterval($.proxy(function() {
            $(this).trigger("txtImgSlide-next");
          }, $uper), $uper.data("timer") * 1000));
          with ($uper.find(".ui-txtImgSlide-actionsBox").find(".ui-icon-play,.ui-icon-pause")) {
            addClass("ui-icon-pause");
            removeClass("ui-icon-play");
          }
        },
        "txtImgSlide-stopSlideShow" : function() { // event "txtImgSlide-stopSlideShow" qui stop le diaporama
          var $uper = $(this);
          if ($uper.data("breadcrumb").enabled) { // Si les miettes de pains sont abscentes on stop pas le diaporama
            $uper.data("interval") && clearInterval($uper.data("interval"));
            with ($uper.find(".ui-txtImgSlide-actionsBox").find(".ui-icon-play,.ui-icon-pause")) {
              removeClass("ui-icon-pause");
              addClass("ui-icon-play");
            }
          }
        }
      },
      ".ui-txtImgSlide-actionsBox b" : {
        "txtImgSlide-click" : function() { // event "txtImgSlide-click" (a ttaché à un  <b> de l'actionsBox )qui 
          var $elf = $(this);
          var lrs = $elf.closest(".ui-txtImgSlide").find(".ui-txtImgSlide-slide");
          var bg = lrs.hide().filter(":nth-child(" + ($elf.data("index") + 1) + ")").show().find(
              ".ui-txtImgSlide-slide-bg");
          var cntnt = bg.siblings(".ui-txtImgSlide-slide-content");
          bg.css({
            width : cntnt.width(),
            height : cntnt.height()
          });
          $elf.siblings().removeClass("ui-selected");
          $elf.addClass("ui-selected");
        },
        click : function() { // action sur click d'un des boutons <b> de l'actionsBox
          $(this).trigger("txtImgSlide-click").closest(".ui-txtImgSlide").trigger("txtImgSlide-stopSlideShow");
        }
      }
    }
  },
  /**
   * Méthode d'initialisation du widget
   */
  _create : function() {
    this._eventSlide = this.options.slideClick;
    // this.element == la div du plugin
    var $uper = this.element.addClass("ui-txtImgSlide");
    // mise a jour de la structure du slideShow
    $uper.wrapInner("<div class='ui-txtImgSlide-slides' />");
    $uper.append("<div class='ui-txtImgSlide-helper'><div class='ui-txtImgSlide-actionsBox'></div></div>");
    $uper.wrapInner("<div class='ui-txtImgSlide-layout' />");
    // mise a jour du context de l element "ui-txtImgSlide"
    $uper.data("timer", this.options.timer);
    $uper.data("breadcrumb", this.options.breadcrumb);
    // initialisation des dimensions
    var dimensions = this._initDim($uper, this.options);
    var $lides = $uper.find(".ui-txtImgSlide-slides").children();
    var $helperBox = $uper.find(".ui-txtImgSlide-helper").css(dimensions);
    this._slidesInit($lides, dimensions, this.options.fade);
    this._createButtons(this.options.buttons, $helperBox.find('.ui-txtImgSlide-actionsBox').toggle(
        this.options.breadcrumb.enabled), $lides.length);
    // on cache les bulles eventuelles
    this._bubblesInit();
    this._initTopTexts();
    this._initBottomTexts();
    // Init dim du layout
    $uper.height($uper.find(".ui-txtImgSlide-layout").css(dimensions).height());
    // on attache les event du widget
    this._bindEvents();
    // Affiche la premiere diapo (click premier bouton enfait)
    $uper.find('.ui-txtImgSlide-actionsBox b').first().trigger("txtImgSlide-click");
    // lance diaporama
    $uper.find(".ui-txtImgSlide-play").trigger("click");
  },
  /**
   * Calcul de la taille disponible dans la colonne 
   * latéral dans laquelle se trouve l'élément JQuery 
   * @param   $e       l'élément JQuery
   * @returns {Number} la taille disponible
   */
  _sideBarInnerWidth : function($e) {
    var pw = $e.innerWidth() - this.options.sideBars.borderWidth, t = this;
    $.each(t.options.sideBars.substractedStyles, function(i, e) {
      pw -= t._parseCSS($e, e);
    });
    return pw;
  },
  _bindEvents : function() {
    if (this._usOptions && this._usOptions.events) {
      var $uper = this.element;
      $.each(this._usOptions.events, function(selector, events) {
        $.each(events, function(eventName, eventFunction) {
          $uper.find(selector).add($uper.filter(selector)).bind(eventName, eventFunction);
        });
      });
    }
  },
  /**
   * Calcul de la taille des slides.
   * Tous les slides sont de la même taille.
   * @param $up l'élément JQuery (div englobante du widget)
   * @param css les dimensions
   * @param opt les options du widget
   */
  _calculateSlideSize : function($up, css, opt) {
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
  },
  /**
   * On utilise l'image de fond du diaporama pour
   * figer la taille du diaporama.
   * @param $uper
   * @param dimensions
   */
  _fixBackgroundSize : function($uper, dimensions, opt) {
    if (opt.background //
        && $uper.data("data") //
        && $uper.data("data").imageBackground) {
      $uper.css({
        backgroundImage : "url(" + $uper.data("data").imageBackground + ")",
        backgroundRepeat : "no-repeat",
        height : $uper.data("data").imageBackgroundHauteur,
        width : $uper.data("data").imageBackgroundLargeur
      });
      // on met a jour les dimensions du slideshow avec les dimensions de l image de fond
      dimensions.height = $uper.data("data").imageBackgroundHauteur;
      dimensions.width = $uper.data("data").imageBackgroundLargeur;
    } else {
      var css = {
        height : dimensions.height
      };
      $.each([ "width", "height" ], function(i, dimName) {
        opt[dimName] && (css[dimName] = opt[dimName]);
      });
      $uper.css(css);
    }
  },
  /**
   * Si le widget est positionné dans une colonne latéral, 
   * on force sa taille (en applicant un ratio) à la taille
   * disponible dans la colonne.
   * @param $uper 
   * @param dimensions les dimensions des slides (css)
   * @param opt les options du widget
   */
  _fixSlideBarSize : function($uper, dimensions, opt) {
    var $col = $uper.closest("#content > .sidebarLeft,#content > .sidebarRight");
    if ($col.length) {
      var ow = $uper.width();
      if (ow == 0) {
        return;
      }
      var pw = this._sideBarInnerWidth($uper.parent());
      if (pw < ow && pw > 0) {
        var ratio = pw / ow;
        // on met a jour les dimensions du slideshow avec les dimensions de l image de fond
        dimensions.height = parseInt(dimensions.height * ratio);
        dimensions.width = parseInt(dimensions.width * ratio);
        $uper.css({
          height : dimensions.height,
          width : dimensions.width
        });
      }
    }
  },
  /** 
   * style in-liner sur le diaporama, 
   * si le diaporama n est pas dans une boite ss_outer.
   * On force son comportement a suivre le flux de positionnement
   * (comme un caractère) 
   */
  _fixOuterSize : function($uper, dimensions, opt) {
    if ($uper.parent().is(":not(.ss_outer)")) {
      $uper.wrap("<span></span>").parent().addClass("ss_inliner").css({
        display : "inline-block"
      });
      $uper.closest(".ss_inliner").css(dimensions);
    }
  },
  /**
   * Calcule la valeur numérique d'un attribut des CSS.
   * @param $o l'élément cible
   * @param r l'attribut CSS a calculé
   * @returns {Number} un nombre sans unité.
   */
  _parseCSS : function($o, r) {
    var v = $o.css(r).replace(/[^0-9.]/g, "");
    return v.indexOf(".") >= 0 ? parseFloat(v) : parseInt(v);
  },
  /**
   * Méthode lancant tous les calculs de redimensionnement du widget
   * @param $up
   * @param opt
   * @returns {Object} un objet contenant des valeurs de CSS calculées.
   */
  _initDim : function($up, opt) { // retourne la taille trouvée ou calculée.
    var css = {};
    this._calculateSlideSize($up, css, opt);
    this._fixBackgroundSize($up, css, opt);
    this._fixSlideBarSize($up, css, opt);
    this._fixOuterSize($up, css, opt);
    return css;
  },
  _createButtons : function(cfg, $actionsBox, nbSlides) {
    if (cfg && cfg.enabled) {
      $actionsBox.append(new Array(nbSlides + 1).join("<b>&nbsp;</b>"));
      $("<span class='ui-txtImgSlide-play'>&nbsp;</span>").appendTo($actionsBox).button(cfg.options).click(
          this._eventSlideshow);
      with ($actionsBox.find("b")) {
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
  _slidesInit : function($lides, dimensions, fade) {
    $lides.each(function(idx, elmt) {
      var $elf = $(elmt); // elmt: selecteur du slide : 
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
      if ($.trim($lide.find(".ui-txtImgSlide-slide-content-data").html()) != '') {
        bg.css({
          width : $elf.width(),
          height : $elf.height()
        }).addClass(cssRef).fadeTo(fade.duration, fade.opacity);
      } else {
        bg.hide();
      }
    });
    $lides.closest(".ui-txtImgSlide-slide").hide().click(this._eventSlide); // ici closest(...) == parent()
  },
  _bubblesInit : function() {
    // par defaut les bulles infos sont caches
    this.element.find(".wdg_ss_over_text").hide();
  },
  _initTopTexts : function() {
    // par defaut cette information est cache.
    this.element.find(".wdg_ss_top_text").hide();
  },
  _initBottomTexts : function() {
    // par defaut cette information est cache
    this.element.find(".wdg_ss_bottom_text").hide();
  }
};
$.widget("ui.txtImgSlide", diaporama_ui_txtImgSlide);
