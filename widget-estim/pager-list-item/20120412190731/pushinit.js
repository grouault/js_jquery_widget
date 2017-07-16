window.__onerror = function(message, url, lineNumber) {
  var hasConsole = console && console.log ? true : false;
  if (window.LOGS && window.LOGS.isDebug()) {
    if (hasConsole) {
      for ( var i = 0; i < window.LOGS.path.length; i++) {
        window.LOGS.path[i].numero = i;
      }
      console.log({
        erreur : {
          message : message,
          url : url,
          lineNumber : lineNumber
        },
        path : window.LOGS.path
      });
    } else {
      if (typeof $ == 'function') {
        var msgBox = $("#window_onerror_custom_message_box");
        if (msgBox.length == 0) {
          msgBox = $("<pre id='window_onerror_custom_message_box'></pre>").css({
            position : "absolute",
            border : "3px solid black",
            zIndex : 100000,
            background : "white",
            color : "red"
          }).appendTo("body").dblclick(function() {
            $(this).hide();
          });
        }
        msgBox.show().html("");
        if (window.LOGS.path) {
          $.each(window.LOGS.path, function(i, e) {
            e.numero = i;
            $("<div></div>").html($.toJSON(e)).prependTo(msgBox);
          });
        }
        $("<h1>Il faut double cliquer pour faire disparaitre cette boite.</h1>").prependTo(msgBox);
        msgBox.prepend("<div>Message d'erreur : " + message + "\nURL : " + url + '\nA la ligne : ' + lineNumber
            + "</div>");
        msgBox.find("div").css({
          border : "1px solid blue"
        });
      } else {
        alert("!!! Erreur grave !!!\n!!! JQuery n'est pas chargé !!! \nMessage d'erreur : " + message + "\nURL : "
            + url + '\nA la ligne : ' + lineNumber);
      }
    }
  } // sinon  on laisse courrir...
  return !hasConsole; // ou pas
};
var HELPERS = {};
var TESTS = {
  connection : function() {
    // TODO
  },
  __developpementServer_test : new String(window.location.href).indexOf("http://webdev") == 0,
  developpementServer : function() {
    return this.__developpementServer_test;
  }
};
var LOGS = {
  url : false,
  dateAsString : function() {
    var d = new Date();
    return d.getFullYear() + "-" //
        + d.getMonth() + "-" //
        + d.getDate() + "::" //
        + d.getHours() + ":" //
        + d.getMinutes() + ":" //      
        + d.getSeconds() + "," //
        + d.getMilliseconds();
  },
  formatResume : function(s) {
    return $.trim(s).substr(0, 10).replace(/[^a-zA-Z0-9]/g, "_");
  },
  path : [],
  isDebug : function() {
    return window.TESTS.developpementServer();
  },
  resizePath : function() {
    while (this.path.length >= 500)
      path.shift();
  },
  doEmptyPath : function() {
    if (this.url || (typeof console != 'undefined' && typeof console.log == 'function')) {
      var data = this.path.length == 1 ? this.path[0] : {
        from : "" + (window.location.href),
        logs : this.path
      };
      data.trough = "doEmptyPath";
      this.path = [];
      if (this.url) {
        $.ajax(this.url, {
          dataType : "json",
          context : data,
          data : data,
          error : function() {
            var tmp = window.LOGS.path;
            window.LOGS.path = this.logs;
            $.merge(window.LOGS.path, tmp);
            window.TESTS.connection();
          },
          success : function() {
            delete this.logs;
          }
        });
      }
      if (console && console.log) {
        console.log(data);
      }
    }
  },
  message : function(l, o) {
    switch (l) {
      case "debug":
        if (!this.isDebug())
          break;
      case "error":
        this.doEmptyPath();
        break;
      default:
      case "info":
        break;
    }
  },
  info : function(s) {
    this.add("info_" + this.formatResume(s), {
      message : s
    }, "info");
  },
  debug : function(s) {
    this.add("dbg_" + this.formatResume(s), {
      message : s
    }, "debug");
  },
  add : function(s, o, l) {
    this.resizePath();
    this.path.push({
      from : "" + (window.location.href),
      name : s,
      date : this.dateAsString(),
      content : o,
      level : l || "info"
    });
    l && this.message(l, o);
  },
  list : function(s, o) {
    while (path.length >= 500)
      path.shift();
  },
  error : function(o) {
    this.add("error generique", o);
    throw o && o.message || o;
  }
};
if (typeof console != 'undefined' && typeof console.log == 'function') {
  window.LOGS.error = function(o) {
    window.LOGS.add("error generique (console)", o);
    console.log(o);
  };
} else if (window.LOGS.isDebug()) {
  window.LOGS.error = function(o) {
    window.LOGS.add("error generique (webdev)", o);
    alert(o && o.message || o);
  };
}
/** DEBUT COMMENTAIRE
    Un élément wdg est créé. Il est global (window.wdg).
    Cet élément contiendra toutes les méthodes spécifiques aux
    widgets.
    
    Chaque widget sera un sous élément de l'élément wdg.
    |        wdg.monWidget={
    |            maFonctionSpécifique : function(){}
    |        };
    |        <b onclick="wdg.monWidget.maFonctionSpécifique(this,event)">exemple d'utilisation</b>
    
    Pour initialiser un widget, il suffit de passer son selecteur et 
    sa fonction d'initialisation à wdg.pushInit.
    Cela permet d'optimiser le chargement des widgets en mutualisant
    la traversée du DOM.
    Explication : 
    |    $(".wdg_widgetTest1").each(fonctionDInit1);
    |    $(".wdg_widgetTest2").each(fonctionDInit2);
    |    $(".wdg_widgetTest3").each(fonctionDInit3);
    |    $(".wdg_widgetTest4").each(fonctionDInit4);
    |    $(".wdg_widgetTest5").each(fonctionDInit5);
    Provoque CINQ traverséeS du DOM (au complet).
    Alors que :
    |   var glob=$(".wdg_widgetTest1,.wdg_widgetTest2,.wdg_widgetTest4,.wdg_widgetTest5");
    |   glob.filter(".wdg_widgetTest1").each(fonctionDInit1);
    |   glob.filter(".wdg_widgetTest2").each(fonctionDInit2);
    |   glob.filter(".wdg_widgetTest3").each(fonctionDInit3);
    |   glob.filter(".wdg_widgetTest4").each(fonctionDInit4);
    |   glob.filter(".wdg_widgetTest5").each(fonctionDInit5);
    Ne provoque qu'une seule et unique traversée du DOM.

FIN COMMENTAIRE */
var wdg = {
  initializable : [],//pool d'éléments à initialiser
  /**
   *  Ajoute une initialisation d'élément après le chargement du DOM.
   *  @param selector (obligatoire) une chaine de caractère contenant
   *          un sélecteur JQuery.
   *  @param initialize (obligatoire) une fonction de callback telle 
   *          que this soit l'élément sur lequel elle est appliquée.
   *  @param asAJQueryObject (optionnel) permet de préciser si l'objet
   *          JQuery résultant du selector doit être traité comme un
   *          unique élément surlequel appliqué le callback ou si chacun
   *          de ses sous-éléments doit se voir appliquer le callback.
   *          Par défaut on applique le callback à chacun des éléments 
   *          indépendamment les uns des autres. 
   * @return void() */
  pushInit : function(/*String*/selector, /*Function*/initialize, /*boolean (optionnel)*/asAJQueryObject) {
    wdg.initializable.push({
      selector : selector,
      initialize : initialize,
      asAJQueryObject : asAJQueryObject
    });
  },
  tools : {
    globalEval : window.execScript ? function(src) {
      window.execScript(src);
    } : function(src) {
      window.eval.call(window, src);
    },
    /**
     * Enlève l'échappement (encodage de type URL) des attributs d'un objet.
     * Le parcours de l'objet est profond.
     * @return void */
    unescapeData : function(o) {
      var oStack = [ o ];
      var deepness = 0; // compteur anti infini
      while (oStack.length && deepness < 500) { // Tant que la pile n'est pas vide
        var data = oStack.shift();
        for ( var k in data) { // pour chaque attribut de l'objet
          switch (typeof data[k]) {
            case 'object':// les tableaux sont des objets :) les new String() aussi :(
              if (typeof data[k].toLowerCase == 'undefined') {
                oStack.push(data[k]); // on empile pour le traiter à la prochaine itération
                deepness++; // risque d'infini...
                break;
              }
              // else c'est un "new String()
            case 'string':
              data[k] = unescape(data[k]);
              break;
            default:
              // NOOP RAF
          }
        }
      }
    }
  },
  helpers : []
};
/** DEBUT COMMENTAIRE
    On parcours les elements comme ça :
    |    <input type="hidden" disabled="true" value='{
    |        "jsonAttribute" : "jsonValue",
    |        "otherJsonAttribute" : 42
    |    }' class="wdg_init_parent_data" />
    pour en extraire le contenu (en JSON) de l'attribut value
    et "attacher" l'objet Javascript obtenu au jQuery.data() de 
    l'élément DOM parent.
    Cela permet de passer au JS des foulitudes de paramètres sans
    avoir à pourrir le HTML avec des input-hidden.
    En plus les données étant attachées à un élément DOM, cela
    les contextualises.
    /!\ En JSON les clefs sont entre "
    /!\ En JSON on utilise des " et pas des '
    Ces JSON ci sont mal formés : 
    |    {'toto':'coco'}
    |    {toto:"coco"}
    Ceux ci sont bien formés :
    |    {"toto":"coco"}
    |    {"toto":[1,2,3,42],"tutu" : 654}
    
FIN COMMENTAIRE */
window.wdg.pushInit("input.wdg_init_parent_data", function() {
  var $elf = $(this);
  var initData = $.parseJSON($elf.val());
  wdg.tools.unescapeData(initData);
  $elf.parent().data("data", initData);
});
var pushInitActions = {
  initParentData : window.wdg.pushInit("script:not([src])[type='json/init-parent-data']", function() {
    try {
      var $elf = $(this);
      var initData = $.parseJSON($elf.html());
      wdg.tools.unescapeData(initData);
      var par = $elf.parent($elf.attr("target"));
      if (par.data("data")) {
        $.extend(true, par.data("data"), initData);
      } else {
        par.data("data", initData);
      }
      $elf.appendTo("body").remove();
    } catch (e) {
      window.LOGS.error({
        error : e,
        message : e.message + "\n$.parseJSON :" + ($.parseJSON) + "\nwdg.tools.unescapeData:"
            + (wdg.tools.unescapeData) + "\n"
      });
    }
  }),
  jqueryOnload : window.wdg.pushInit("script:not([src])[type='jquery/onload']", function() {
    try {
      window.wdg.tools.globalEval($.trim($(this).html()));
    } catch (e) {
      window.LOGS.error({
        error : e,
        code : $(this).html(),
        domElement : this,
        message : e.message + "\njquery/onload\n--- code ---\n" + $(this).html() + "\n--- /code ---"
      });
    }
  }),
  whenDomIsLoaded : $(function() {
    if (window.wdg.initializable.length) {
      window.LOGS.debug("Passe des pushinit : '" + window.wdg.initializable.length + "'");
    }
    while (window.wdg.initializable.length) {
      var globSelector = "";
      var toInit = window.wdg.initializable;
      window.wdg.initializable = [];
      $.each(toInit, function(i, e) {
        globSelector += (globSelector.length ? "," : "") + e.selector;
      });
      var initPool = $(globSelector);
      $.each(toInit, function(i, e) {
        if (e.asAJQueryObject) {
          var callees=initPool.filter(e.selector);
          if( callees.length ){
            e.initialize.call(callees);
          }
        } else {
          initPool.filter(e.selector).each(e.initialize);
        }
      });
      if (window.wdg.initializable.length) {
        window.LOGS.debug("Passe supplémentaire pour le chargement des pushinit : '" + //
        window.wdg.initializable.length + "'");
      }
    }
  })
};
