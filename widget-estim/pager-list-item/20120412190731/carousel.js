/**
 * Widget de carousel
 *
 * Dans ce fichier (vocabulaire):
 *  - $uper fait toujours reference a  $(this).closest(".ui-ss-carousel") soit le conteneur 
 *    le plus haut du widget.
 *  - $elf fait toujours reference a  $(this)
 *  - "ui-ss-carousel" est la class de reference du widget elle est placee sur la div 
 *    englobante. (d'ou le $(this).closest(".ui-ss-carousel"))
 *  - les css en ui- sont des css a  usage internet.
 *  - les css en wdg_ sont des css appliques par l'utilisateur du widget
 *
 */
$.usWidget = function(name, base, prototype) {
  if (!prototype) {
    prototype = base;
    base = $.USWidget;
  }
  return $.widget(name, base, prototype);
};
$.USWidget = function(options, element) {
  // allow instantiation without initializing for simple inheritance
  if (arguments.length) {
    this._createWidget(options, element);
  }
};
var $_USWidget_prototype_structInit = {
  _findPathTarget : function(d, p) {
    for ( var i in p)
      d = d[p[i]];
    return d;
  },
  _applyVariables : function() {
    if (this.options && this._usOptions.variables) {
      for ( var j in this._usOptions.variables) {
        var pathes = this._usOptions.variables[j];
        var source = this._findPathTarget(this.options, pathes.source);
        var destination = this._findPathTarget(this.options, pathes.destination);
        if (destination && source) {
          for ( var kt in destination) {
            var o = destination[kt];
            for ( var kv in o) {
              if (typeof o[kv] == "string" && o[kv].indexOf("$") == 0) {
                o[kv] = source[o[kv].substr(1)] || 'none';
              }
            }
          }
        }
      }
    }
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
  _createWidget_origin : $.Widget.prototype._createWidget,
  _createWidget : function(options, element) {
    if (typeof this._trueCreate == 'undefined') {
      this._trueCreate = this._create;
      this._create = function() {
        this._applyVariables();
        this._trueCreate();
        this._bindEvents();
        this._initTriggers && this._initTriggers();
      };
    }
    this._createWidget_origin(options, element);
  }
};
$.USWidget.prototype = $.extend(true, {}, $.Widget.prototype, $_USWidget_prototype_structInit);
//fin de extension JQuery
var ui_carousel_initStruct = {
  _usOptions : {
    events : {
      ".ui-ss-carousel" : {
        animateCarousel : function(evt, selector, eventName) {
          $(this).find(".ui-tc-act-next").trigger("trigger", [ ".ui-tc-act-next", "clickAuto" ]);
        },
        stopCarousel : function(evt, selector, eventName) {
          $(this).data("interval") && clearInterval($(this).data("interval"));
        },
        startCarousel : function(evt, selector, eventName) {
          var $uper = $(this);
          $uper.data("interval", setInterval(function() {
            $uper.trigger("animateCarousel");
          }, 2000));
        }
      },
      ".ui-tc-act-previous,.ui-tc-act-next" : {
        trigger : function(evt, selector, eventName) {
          $(this).closest(".ui-ss-carousel").find(selector).trigger(eventName);
        }
      },
      ".ui-ss-tc-source" : {
        click : function(evt) {
          var href = $(this).closest(".ui-ss-tc-source").attr("href");
          if (href != null) {
        	if($(this).closest(".ui-ss-tc-source").attr("target") == "_blank"){
        		window.open(href);
        	}else{
        		window.location.href = href;
        	}
          }
        }
      },
      ".ui-ss-diapositive" : {
        umouseenter : function() {
          var $elf = $(this);
          var idx = $elf.data("index");
          var $ctnt = $elf.closest(".ui-tc-content");
          var c = $ctnt.data("cycle");
          if ((c.max - c.idx + 1) / (idx + 1) > 0.5) {
            c.idx++;
            $ctnt.trigger("turn", 0);
          }
          if ((c.max - c.idx + 1) / (idx + 1) < 0.5) {
            c.idx--;
            $ctnt.trigger("turn", 0);
          }
        }
      },
      ".ui-tc-content" : {
        turnleft : function() {
          $(this).trigger("turn", -1);
        },
        turnright : function() {
          $(this).trigger("turn", +1);
        },
        turn : function(evt, dir) {
          var $elf = $(this);
          var c = $elf.data("cycle");
          var lastStep = c.max - c.off; // firstStep == 0 
          c.idx = isNaN(dir) ? c.idx + 1 : c.idx + dir;
          c.idx = (c.idx > lastStep) ? (c.loop ? 0 : lastStep) : (c.idx < 0) ? (c.loop ? lastStep : 0) : c.idx;
          var css = {};
          css[c.orientation] = (c.idx == lastStep) ? c.fastwind : -(c.step * c.idx + c.margin * c.idx);
          $elf.find(".ui-ss-tc-innerElement").animate(css);
        }
      },
      ".ui-tc-act-previous" : {
        click : function(evt) {
          $(this).trigger("trigger", [ ".ui-tc-content", "turnleft" ]);
          $(this).closest(".ui-ss-carousel").trigger('stopCarousel');
        }
      },
      ".ui-tc-act-next" : {
        click : function(evt) {
          $(this).trigger("trigger", [ ".ui-tc-content", "turnright" ]);
          $(this).closest(".ui-ss-carousel").trigger('stopCarousel');
        },
        clickAuto : function(evt) {
          $(this).trigger("trigger", [ ".ui-tc-content", "turnright" ]);
        }
      }
    },
    variables : [ {
      source : [ "css" ],
      destination : [ "templates", "css" ]
    } ]
  },
  options : {
    orientation : "horizontal",
    starter : 0,
    background : true, // a false pour utiliser width/height
    sideBars : { // options des colonnes laterales
      borderWidth : 3,
      substractedStyles : [ "padding-left", "padding-right" ]
    },
    css : {
      diapositiveWidth : 150,
      diapositiveHeight : 115,
      buttonSize : 20,
      width : 545,
      height : 230,
      marginRight : 40,
      marginLeft : 0,
      marginTop : 0,
      marginBottom : 0,
      opacity : 0.5
    },
    timer : 2,
    loop : true,
    templates : {
      horizontal : {
        frame : '<table border="0" cellpadding="0" cellspacing="0" style="overflow:hidden"><tbody>' //
            + '<tr><td class="ui-tc-act-previous" rowspan="*"></td>' //
            + '<td class="ui-tc-content" ></td>' //
            + '<td class="ui-tc-act-next" rowspan="*"></td></tbody></table>',
        buttons : {
        }
      },
      vertical : {
        frame : '<table border="0" cellpadding="0" cellspacing="0" style="overflow:hidden><tbody>' //
            + '<tr><td class="ui-tc-act-previous" colspan="*"></td></tr>' //
            + '<tr><td class="ui-tc-content" ></td></tr>' //
            + '<tr><td class="ui-tc-act-next" colspan="*"></td></tr></tbody></table>',
        buttons : {
          previous : "&and;",
          next : "&or;"
        }
      },
      css : {
        elements : {
          width : "$diapositiveWidth",
          height : "$diapositiveHeight",
          background : "$background",
          display : "inline-block",
          marginRight : "$marginRight",
          marginBottom : "$marginBottom"
        },
        lastElement : {
          marginRight : 0
        },
        sourceElement : {
          position : "relative",
          width : "$diapositiveWidth",
          height : "$diapositiveHeight",
          overflow : "hidden"
        },
        innerFrame : {
          verticalAlign : "top",
          overflow : "visible"
        },
        textFrame : {
          position : "absolute",
          bottom : 0,
          width : "$diapositiveWidth",
          height : "50%"
        },
        innerElements : {
          width : "$diapositiveWidth",
          height : "$diapositiveHeight",
          position : "absolute"
        },
        scrollerFrame : {
          position : "relative",
          overflow : "hidden"
        },
        buttons : {
          textAlign : "center",
          fontWeight : "bolder",
          cursor : "pointer",
          verticalAlign : "middle",
          color : "#FFFFFF" 
        },
        txtTop : {
          verticalAlign : "bottom",
          position : "absolute",
          width : "$diapositiveWidth",
          left : 0,
          top : 0
        },
        txtBot : {
          verticalAlign : "top",
          position : "absolute",
          width : "$diapositiveWidth",
          left : 0,
          bottom : 0
        },
        toperBox : {
          position : "relative",
          float : "left"
        },
        slides : {
          display : "block",
          marginRight : "auto",
          marginLeft : "auto",
          position : "relative"
        }
      }
    }
  },
  /**
   * Calcul de la taille disponible de la colonne 
   * lateral dans laquelle se trouve l'element JQuery 
   * @param   $e       l'element JQuery
   * @returns {Number} la taille disponible
   */
  _sliderInnerWidth : function($e) {
    var pw = $e.innerWidth() - this.options.sideBars.borderWidth, t = this;
    $.each(t.options.sideBars.substractedStyles, function(i, e) {
      pw -= t._parseCSS($e, e);
    });
    return pw;
  },
  /**
   * Calcule la valeur numerique d'un attribut des CSS.
   * @param $o l'element cible
   * @param r l'attribut CSS a calcule
   * @returns {Number} un nombre sans unite.
   */
  _parseCSS : function($o, r) {
    var v = $o.css(r).replace(/[^0-9.]/g, "");
    return v.indexOf(".") >= 0 ? parseFloat(v) : parseInt(v);
  },
  _initCycleData : function($ctnt, nbChildren) {
    var css = this.options.css;
    var cycleData = {
      idx : this.options.starter,
      max : nbChildren,
      off : 0,
      loop : this.options.loop,
      scrollerWidth : css.diapositiveWidth,
      scrollerHeight : css.diapositiveHeight
    };
    if (this.options.orientation == "horizontal") {
      cycleData.scrollerWidth = this._scrollerSize(this.options.orientation, css.diapositiveWidth, nbChildren);
      cycleData.off = parseInt($ctnt.width() / css.diapositiveWidth);
      cycleData.step = css.diapositiveWidth;
      cycleData.margin = css.marginRight + css.marginLeft;
      cycleData.orientation = "left";
    } else {
      cycleData.scrollerHeight = nbChildren * css.diapositiveHeight + (nbChildren - 2) * css.marginTop;
      cycleData.off = Math.round($ctnt.height() / css.diapositiveHeight);
      cycleData.step = css.diapositiveHeight;
      cycleData.margin = css.marginBottom + css.marginTop;
      cycleData.orientation = "top";
    }
    return cycleData;
  },
  _enhanceCycleData : function($ctnt, cycleData, nbChildren) {
    // should be in _initCycleData but IE7...
    // + maj du step suite a  la taille mise a jour de la diapo dans initDim 
    var css = this.options.css;
    if (this.options.orientation == "horizontal") {
      cycleData.off = parseInt($ctnt.width() / css.diapositiveWidth);
      cycleData.step = css.diapositiveWidth;
      cycleData.scrollerWidth = this._scrollerSize(this.options.orientation, css.diapositiveWidth, nbChildren);
    } else {
      cycleData.off = Math.round($ctnt.height() / css.diapositiveHeight);
      cycleData.step = css.diapositiveHeight;
      cycleData.scrollerHeight = nbChildren * css.diapositiveHeight + (nbChildren - 2) * css.marginTop;
    }
  },
  _enhanceCSS : function($rame) {
    var tpl = this.options.templates, css = this.options.css;
    if (this.options.orientation == "horizontal") {
      $rame.width(this.element.width());
      tpl.css.buttons.width = css.buttonSize;
      tpl.css.innerFrame.height = css.diapositiveHeight;
      tpl.css.scrollerFrame.height = css.diapositiveHeight;
    } else {
      $rame.height(this.element.height());
      tpl.css.buttons.height = css.buttonSize;
      tpl.css.innerFrame.width = css.diapositiveWidth;
      tpl.css.scrollerFrame.width = css.diapositiveWidth;
      tpl.css.scrollerFrame.height = $ctnt.height();
      if (this.element.width() > css.diapositiveWidth) {
        this.element.width(css.diapositiveWidth);
      }
    }
  },
  _initTexts : function($elements, position, styleName) {
    var tpl = this.options.templates, maxHeight = 0, currentCSS = "ui-ss-" + position + "-outter";
    $elements.each(function() {
      var $elf = $(this);
      var $ource = $elf.closest(".ui-ss-tc-source");
      var $outter = $ource.parent();
      if (!$outter.is(".ui-ss-toper-box")) {
        $ource.wrap("<div></div>");
        $outter = $ource.parent().addClass("ui-ss-toper-box").css(tpl.css.toperBox);
      }
      var $elmt = $("<div></div>").appendTo($outter).addClass(currentCSS).css(tpl.css[styleName]);
      $elf.appendTo($elmt);
      maxHeight = Math.max(maxHeight, $elf.height());
    });
    return maxHeight;
  },
  _initTopTexts : function($ctnt) {
    var $tops = $ctnt.find(".wdg_ss_top_text");
    if ($tops.length) {
      var maxHeight = this._initTexts($tops, "top", "txtTop");
      if (maxHeight) {
        $ctnt.find(".ui-ss-top-outter").height(maxHeight);
        $ctnt.find(".ui-ss-tc-source").css("top", maxHeight);
        $ctnt.height($ctnt.height() + maxHeight);
        $ctnt.find(".ui-ss-toper-box, .ui-ss-tc-innerElement, .ui-ss-tc-scrollerFrame").height($ctnt.height());
      }
    }
  },
  _initBottomTexts : function($ctnt) {
    var $bots = $ctnt.find(".wdg_ss_bottom_text");
    if ($bots.length) {
      var maxHeight = this._initTexts($bots, "bottom", "txtBot");
      if (maxHeight) {
        $ctnt.find(".ui-ss-bottom-outter").height(maxHeight);
        $ctnt.height($ctnt.height() + maxHeight);
        $ctnt.find(".ui-ss-toper-box, .ui-ss-tc-innerElement, .ui-ss-tc-scrollerFrame").height($ctnt.height());
      }
    }
  },
  _initBubbles : function() {
  },
  _adjustSize : function($rame, $ctnt, cycleData) {
    var css = this.options.css;
    if (this.options.orientation == "horizontal") {
      var sw = this.element.width();
      var iw = sw - css.buttonSize * 2;
      $rame.width(sw);
      $ctnt.width(iw);
      cycleData.fastwind = iw - $ctnt.find(".ui-ss-tc-innerElement").width();
    } else {
      $ctnt.find(".ui-ss-tc-scrollerFrame").height($ctnt.height());
      $rame.height(this.element.height());
      cycleData.fastwind = $ctnt.height() - $ctnt.find(".ui-ss-tc-innerElement").height();
    }
    this.element.removeClass("wdg_onload");
  },
  _initDiapoData : function($ctnt) {
    $ctnt.find(".ui-ss-diapositive").each(function(idx, elmt) {
      $(this).data("index", idx);
    });
  },
  _initPositionables : function($ctnt) {
    var tpl = this.options.templates, css = this.options.css;
    var $lides = $ctnt.find(".ui-ss-tc-innerElement > :not(script)");
    $lides.addClass("ui-ss-tc-source").css(tpl.css.sourceElement);
    $lides.wrapInner("<div class='ui-ss-diapositive'></div>");
    // FIXME supprimer le wrap(span) quand ie7 ne sera plus cible
    $lides.wrap("<span class='fix_ie7'></span>").parent().css({
      display : "inline-block"
    });
    $ctnt.find(".ui-ss-diapositive").each(
        function() {
          var $inner = $(this).css(tpl.css.textFrame);
          $inner.find(":positionable").prependTo($inner.parent());
          $("<div></div>").prependTo($inner.parent()).addClass($inner.parent().attr("class")).removeClass(
              "ui-ss-tc-source").css({
            position : "absolute",
            opacity : css.opacity,
            bottom : $inner.css("bottom"),
            top : $inner.css("top"),
            left : $inner.css("left"),
            right : $inner.css("right"),
            background : $inner.parent().css("background"),
            width : $inner.width(),
            height : $inner.height()
          });
          var $img = $inner.find(".wdg_ss_background_image");
          $img.data("trueDims", {
            width : $img.width(),
            height : $img.height()
          });
          $inner.find(".wdg_ss_background_image").prependTo($inner.parent()).css(tpl.css.innerElements);
        });
  },
  _initDim : function($uper, tpl) {
    //permet de definir la hauteur et la largeur a  adopter pour le conteneur des images: bloc 'ui-ss-tc-source'
    //principe : recupertion de toutes les images pour recuperer 
    //- la hauteur de la plus grande image.
    //- la largeur de la plus large image
    var tpl = this.options.templates, $lides = $uper.find(".ui-ss-tc-source");
    var maxCss = {
      width : this.options.css.diapositiveWidth,
      height : this.options.css.diapositiveHeight
    };
    $lides.find(".wdg_ss_background_image").each(function() {
      var $img = $(this);
      var currentCss = $.extend($img.data("trueDims"), tpl.css.slides);
      maxCss.width = Math.max(maxCss.width, currentCss.width);
      maxCss.height = Math.max(maxCss.height, currentCss.height);
      //ajustement de la taille de l'image
      $img.css(currentCss);
    });
    // ajustement de la taille des conteneurs commun aux diapositives
    $uper.find(".ui-ss-tc-innerElement").css({
      height : maxCss.height,
      width : this._scrollerSize(this.options.orientation, maxCss.width, $lides.length)
    });
    $uper.find(".ui-ss-tc-scrollerFrame,.ui-tc-content").css({
      height : maxCss.height
    });
    $uper.find(".ss_noslide div").height("100%");
    // recuperer chaque bloc-diapo, on ajuste la taille du conteneur
    $lides.each(function() {
      var $elf = $(this);
      var offset = $elf.is(".ss_noslide") ? 4 : 0;
      $elf.css({
        width : maxCss.width - offset,
        height : maxCss.height - offset
      });
    });
    // mise a jour de la taille des diapos
    this.options.css.diapositiveWidth = maxCss.width;
    this.options.css.diapositiveHeight = maxCss.height;
    return maxCss;
  },
  /**
   * On force sa taille (en applicant un ratio) a  la taille
   * disponible dans la colonne.
   * Cette methode ne s'execute que si une diapositive
   * est plus grande que la colonne dans lequel est le slideshow.
   * 
   * @param $uper 
   * @param $lides 
   * @param dimensions les dimensions des slides (css)
   *                   le contenu de cet objet est modifie.
   * @param cycleData les parametres de rotation du carrousel
   *                   le contenu de cet objet est modifie.
   */
  _fixSliderSize : function($uper, $lides, dimensions, cycleData) {
    var css = this.options.css, largeurDiapoOriginale = dimensions.width, orientation = this.options.orientation;
    var largeurAffichage = this._sliderInnerWidth($lides.closest(".ui-tc-content"));
    
    if (largeurAffichage < largeurDiapoOriginale && largeurAffichage > 0) {//L'espace d'affichage est plus petit que la taille initiale des diapos
      var ratio = largeurAffichage / largeurDiapoOriginale;
      dimensions.width = parseInt(dimensions.width * ratio);
      var maxCss = $.extend({}, dimensions);
      maxCss.height = parseInt(maxCss.height * ratio);
      
      //Redimensionnement de l'image de fond en fonction de la taille d'affichage
      $lides.each(function() {
        $(this).find(".wdg_ss_background_image").each(function(i, img) {
          var $img = $(img);
          if ($img.width() > maxCss.width || $img.height() > maxCss.height) {
            $.each([ "height", "width" ], function(dims) {
              $img[this](dims[this] * ratio);
            }, [ $img.data("trueDims") ]);
          }
        });
      }).css(maxCss);
      

      var noSlideCss = $.extend({}, maxCss);
      $.each([ "height", "width" ], function(offset) {
        noSlideCss[this] = noSlideCss[this] - offset;
      }, [ 4 ]);
      $lides.filter(".ss_noslide").css(noSlideCss);
      css.diapositiveHeight = maxCss.height;
      css.diapositiveWidth = maxCss.width;


      if (orientation == "horizontal") {
        var newScrllWdth = this._scrollerSize(this.options.orientation, maxCss.width, $lides.length);
        $uper.find(".ui-ss-tc-innerElement").css({
          height : maxCss.height,
          width : newScrllWdth
        });
        $uper.find(".ui-ss-tc-scrollerFrame, .ui-ss-tc-innerFrame, .ui-ss-carousel").css({
          height : dimensions.width
        });
        cycleData.fastwind = maxCss.width - newScrllWdth;
      } else {
        var newScrllHght = this._scrollerSize(this.options.orientation, maxCss.height, $lides.length);
        $uper.find(".ui-ss-tc-innerElement").css({
          height : newScrllHght,
          width : maxCss.width
        });
        cycleData.fastwind = maxCss.height - newScrllHght;
      }
    }
  },
  _initTriggers : function() {
    this.element.trigger('startCarousel');
  },
  _create : function() {
    this._initialize();
    this.element.bubbles(this.options.bubble);
  },
  /**
   * @param d direction du scroll
   * @param s taille de la diapo
   * @param n nombre de diapos
   */
  _scrollerSize : function(/*String*/d,/*Integer*/s, /*Integer*/n) {
    if ("horizontal" == d) {
      return n * s + (n - 1) * this.options.css.marginRight;
    }
    return n * s + (n - 2) * this.options.css.marginTop;
  },
  _initialize : function() {
    // restructuration du DOM
    var $uper = this.element.addClass("ui-ss-carousel");
    var tpl = this.options.templates, tplTyp = this.options.orientation;
    // on fixe l image de fond du diaporama
    if ($uper.data("data") && $uper.data("data").imageBackground) {
      $uper.css({
        backgroundImage : "url(" + $uper.data("data").imageBackground + ")"
      });
    }
    var $rame = this.element.prepend(tpl[tplTyp].frame).find("> table:first");
    var $ctnt = $rame.find(".ui-tc-content");
    $rame.siblings().appendTo($ctnt);
    $rame.find(".ui-tc-act-previous").html(tpl[tplTyp].buttons.previous);
    $rame.find(".ui-tc-act-next").html(tpl[tplTyp].buttons.next);
    // fin restructuration    
    this._enhanceCSS($rame);
    var $lides = $ctnt.find("> *").css(tpl.css.elements);
    var cycleData = this._initCycleData($ctnt, $lides.length);
    $lides.last().css(tpl.css.lastElement);
    $ctnt.data("cycle", cycleData);
    $ctnt.css(tpl.css.innerFrame).addClass("ui-ss-tc-innerFrame");
    $ctnt.wrapInner("<div class='ui-ss-tc-scrollerFrame'><div class='ui-ss-tc-innerElement'></div></div>");
    $ctnt.find(".ui-ss-tc-scrollerFrame").css(tpl.css.scrollerFrame);
    $ctnt.find(".ui-ss-tc-innerElement").css(tpl.css.innerElements).width(cycleData.scrollerWidth).height(
        cycleData.scrollerHeight);
    this._initPositionables($ctnt);
    var dimensions = this._initDim($uper, tpl);//initialisation des tailles
    this._initDiapoData($ctnt);
    this._initTopTexts($ctnt);
    this._initBottomTexts($ctnt);
    $rame.find(".ui-tc-act-previous,.ui-tc-act-next").css(tpl.css.buttons);
    this._adjustSize($rame, $ctnt, cycleData);
    this._fixSliderSize($uper, $uper.find(".ui-ss-tc-source"), dimensions, cycleData);
    this._enhanceCycleData($ctnt, cycleData, $lides.length);
  }
};

$.usWidget("ui.carouselUS", ui_carousel_initStruct);
