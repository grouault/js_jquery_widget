$(document).ready(function() {
  $(".wdg_reset_focus").focus(function() {
    if ($(this).val() == this.defaultValue) {
      $(this).val("");
    }
  }).blur(function() {
    if ($(this).val() == "") {
      $(this).val(this.defaultValue ? this.defaultValue : "");
    }
  });
  /**
   * @param {Object} m3
   * @param {Object} name
   * @return {?}
   */
  var validTest = function(m3, name) {
    /** @type {boolean} */
    var run = false;
    if (m3.toLowerCase() == name.toLowerCase()) {
      /** @type {boolean} */
      run = true;
    }
    if (m3.toLowerCase().indexOf(name.toLowerCase()) != -1) {
      /** @type {boolean} */
      run = true;
    }
    return run;
  };
  /**
   * @param {number} value
   * @return {undefined}
   */
  var focus = function(value) {
    var $e = $(".search-result");
    $e.find("span.number").text(value);
    $e.show();
  };
  /**
   * @param {Object} execResult
   * @param {string} value
   * @param {string} input
   * @return {?}
   */
  var parse = function(execResult, value, input) {
    /** @type {boolean} */
    var resp = false;
    var oldconfig = execResult.find(".date-debut").text();
    var ret = execResult.find(".date-fin").text();
    var db = start(merge(oldconfig), merge(value));
    var doStart = start(merge(ret), merge(input));
    if (db >= 0 && doStart <= 0) {
      /** @type {boolean} */
      resp = true;
    }
    return resp;
  };
  /**
   * @param {string} b
   * @return {?}
   */
  var merge = function(b) {
    var segs = b.split("/");
    jour = segs[0];
    /** @type {number} */
    mois = segs[1] - 1;
    annee = segs[2];
    /** @type {Date} */
    var first = new Date(annee, mois, jour);
    return first;
  };
  /**
   * @param {Date} timeout
   * @param {Date} _this
   * @return {?}
   */
  var start = function(timeout, _this) {
    /** @type {number} */
    var wheelDeltaY = timeout.getTime() - _this.getTime();
    return wheelDeltaY == 0 ? wheelDeltaY : wheelDeltaY / Math.abs(wheelDeltaY);
  };
  $(".datepicker").datepicker({
    changeMonth : true,
    changeYear : true,
    showTime : true,
    dateFormat : "dd/mm/yy",
    dayNamesMin : ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
    monthNamesShort : ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"]
  });
  $(".search-button").click(function() {
    var relatedTarget = $(this);
    var clone = relatedTarget.closest(".bloc-filter").find('input[name="search"]');
    var platform = clone.val();
    if (platform == clone[0].defaultValue) {
      /** @type {string} */
      platform = "";
    }
    var camelKey = relatedTarget.closest(".bloc-filter").find('input[name="date-debut"]').val();
    var part = relatedTarget.closest(".bloc-filter").find('input[name="date-fin"]').val();
    if (platform.length > 0 || camelKey.length > 0 && part.length > 0) {
      var files = $(".widget_list_event").find("article").removeClass("search");
      /** @type {boolean} */
      var data = false;
      /** @type {number} */
      var udataCur = 0;
      $.each(files, function(dataAndEvents, element) {
        /** @type {boolean} */
        data = false;
        if (platform.length > 0) {
          var script = $(element).find(".title");
          if (validTest(script.text(), platform)) {
            /** @type {boolean} */
            data = true;
          }
          var selectedOption = $(element).find(".structure-accueil");
          if (!data && validTest(selectedOption.text(), platform)) {
            /** @type {boolean} */
            data = true;
          }
          var line = $(element).find(".localisation");
          if (!data && validTest(line.text(), platform)) {
            /** @type {boolean} */
            data = true;
          }
          var $label = $(element).find(".description");
          if (!data && validTest($label.text(), platform)) {
            /** @type {boolean} */
            data = true;
          }
          if (data && (camelKey.length > 0 && part.length > 0)) {
            data = parse($(element), camelKey, part);
          }
        } else {
          if (camelKey.length > 0 && part.length > 0) {
            data = parse($(element), camelKey, part);
          }
        }
        if (data) {
          $(element).addClass("search");
          udataCur++;
        }
      });
      $(".wdg_paginated").trigger("initialize-pager", true);
      focus(udataCur);
    } else {
      $(".wdg_paginated").trigger("initialize-pager", false);
    }
  });
  $(".init-button").click(function() {
    $(".wdg_paginated").trigger("initialize-pager", false);
  });
  $(".wdg_paginated").each(function() {
    var element = $(this);
    element.bind("initialize-pager", function(dataAndEvents, d) {
      go(d);
    });
    element.prepend('<div class="wdg_pager"></div>');
    var self = $(".wdg_pager").addClass("pagination");
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var ssz = 3;
    if (self.data("data") && self.data("data").nbItemsByPage) {
      ssz = self.data("data").nbItemsByPage;
    }
    var z = element.find("article").length;
    /** @type {number} */
    var len = Math.ceil(z / ssz);
    /**
     * @param {?} index
     * @return {undefined}
     */
    var expand = function(index) {
      var file = element.find("article").hide();
      if (index) {
        file = element.find("article.search");
      }
      file.slice(i * ssz, (i + 1) * ssz).show();
    };
    /**
     * @return {undefined}
     */
    var activate = function() {
      $previous = $(".wdg_pager_previous").hide();
      $next = $(".wdg_pager_next").hide();
      if (i > 0) {
        $previous.show();
      }
      if (i + 1 < len) {
        $next.show();
      }
      numberPage = ".number-" + i;
      $(numberPage).addClass("active").siblings().removeClass("active");
    };
    /**
     * @param {?} dir
     * @return {undefined}
     */
    var f = function(dir) {
      self.data("currentPage", i);
      expand(dir);
      activate();
    };
    /**
     * @param {?} input
     * @return {undefined}
     */
    var go = function(input) {
      loaded();
      if (input) {
        z = element.find("article.search").length;
      } else {
        z = element.find("article").length;
      }
      focus(z);
      /** @type {number} */
      len = Math.ceil(z / ssz);
      /** @type {number} */
      i = 0;
      init(input);
      f(input);
    };
    /**
     * @return {undefined}
     */
    var loaded = function() {
      self.html("");
    };
    /**
     * @param {?} x
     * @return {undefined}
     */
    var init = function(x) {
      $('<span class="wdg_pager_previous"></span>').prependTo(self).addClass("clickable paginationButton prevPage");
      $('<span class="wdg_pager_previous"></span>').prependTo(self).addClass("paginationButton firstPage").click(function() {
        /** @type {number} */
        i = 0;
        f();
      });
      /** @type {number} */
      var i = 0;
      for (;i < len;i++) {
        $('<span class="wdg_pager_number number-' + i + '"></span>').text(i + 1).addClass("paginationLink").bind("click", {
          newPage : i
        }, function(editor) {
          i = editor.data.newPage;
          f(x);
        }).appendTo(self);
      }
      $('<span class="wdg_pager_next"></span>').appendTo(self).addClass("clickable paginationButton nextPage");
      $('<span class="wdg_pager_next"></span>').appendTo(self).addClass("paginationButton lastPage").click(function() {
        /** @type {number} */
        i = len - 1;
        f(x);
      });
      self.find("span.wdg_pager_number:first").addClass("active");
      self.children().css("cursor", "pointer");
      $(".clickable").click(function() {
        if ($(this).hasClass("wdg_pager_previous")) {
          /** @type {number} */
          i = self.data("currentPage") - 1;
        } else {
          i = self.data("currentPage") + 1;
        }
        f(x);
      });
    };
    init();
    focus(z);
    f();
  });
});
