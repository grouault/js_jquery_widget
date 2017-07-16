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
 * Widget ComboSelect
 *  - permet d'habiller un select en cachant le <select> et en le remplacant par une balise input
 *  - Les parametres evenutels sont les suivant
 *  @clazzLang      : objet css permettant d'habiller le input (non obligatoire)
 *  @selectcallback : permet d avoir un comportement specifique sur le select (non obligatoire)
 */
$.widget( "ui.comboselect", {
	_create: function() {
		var self = this,
			select = this.element.hide(),
			selected = select.children( ":selected" ),
			value = selected.val() ? selected.text() : "";
		var input = this.input = $( "<input>" )
			.insertAfter( select )
			.val( value )
			.autocomplete({
				delay: 0,
				minLength: 3,
				source: function( request, response ) {
					var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
					response( select.children( "option" ).map(function() {
						var text = $( this ).text();
						if ( this.value && ( !request.term || matcher.test(text) ) )
							return {
								label: text.replace(
									new RegExp(
										"(?![^&;]+;)(?!<[^<>]*)(" +
										$.ui.autocomplete.escapeRegex(request.term) +
										")(?![^<>]*>)(?![^&;]+;)", "gi"
									), "<strong>$1</strong>" ),
								value: text,
								option: this
							};
					}) );
				},
				select: function( event, ui ) {
					ui.item.option.selected = true;
					self._trigger( "selected", event, {
						item: ui.item.option
					});
					//traitement specifique via une methode dedie
					if (self.options.selectcallback)
						self.options.selectcallback();
				},
				change: function( event, ui ) {
					if ( !ui.item ) {
						var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
							valid = false;
						select.children( "option" ).each(function() {
							if ( $( this ).text().match( matcher ) ) {
								this.selected = valid = true;
								return false;
							}
						});
						if ( !valid ) {
							// remove invalid value, as it didn't match anything
							$( this ).val( "" );
							select.val( "" );
							input.data( "autocomplete" ).term = "";
							return false;
						}
					}
				}
				
			})
			.click(function(){
				// close if already visible
				if ( $(this).autocomplete( "widget" ).is( ":visible" ) ) {
					$(this).autocomplete( "close" );
					return;
				}

				// pass empty string as value to search for, displaying all results
				$(this).autocomplete( "search", "" );
				$(this).focus();
			})
			//mise a jour du style
			if (self.options.clazzLang){
				input.css(self.options.clazzLang)
				input.removeClass("ui-autocomplete-input");
			}

		input.data( "autocomplete" )._renderItem = function( ul, item ) {
			/* ul.removeClass("ui-widget"); */
			ul.removeClass("ui-widget ui-autocomplete ui-menu ui-widget-content ui-corner-all");
			ul.addClass(" sl-autocompete sl-menu sl-widget-content sl-corner-all ");
			return $( "<li></li>" )
				.addClass("sl-menu-item")
				.removeClass("ui-menu-item")
				.data( "item.autocomplete", item )
				.append( "<a class=\"sl-corner-all\">" + item.label + "</a>" )
				.appendTo( ul );
		};
	},
	
	destroy: function() {
		this.input.remove();
		/*this.button.remove(); */
		this.element.show();
		$.Widget.prototype.destroy.call( this );
	}
});

var ui_bubbles_initStruct = {
    _usOptions : {
      events : {
        ".ui-ss-with-bubble" : {
          mouseenter : function() {
            $(this).find(".ui-ss-bubble").fadeIn();
          },
          mouseleave : function() {
            $(this).find(".ui-ss-bubble").fadeOut();
          }
        }
      }
    },
    options : {
      css : {
        position : "absolute",
        border : "1px solid #000000",
        background : "#EBEBBE",
        opacity : 0.5, 
        padding: 5,
        opacity : 1,
        bottom : 10,
        right : 10
      },
      timer : false
    },
    _bindEvents : function() {
      if (this._usOptions && this._usOptions.events) {
        var $uper = this.element;
        $.each(this._usOptions.events, function(selector, events) {
          $.each(events, function(eventName, eventFunction) {
            $uper.bind(eventName, eventFunction);
          });
        });
      }
    }  
    ,
    _create : function() {
      this.element.find(".wdg_ss_over_text").hide().css(this.options.css).addClass("ui-ss-bubble").each(function() {
       /* $(this).closest(".ui-txtImgSlide-slide").addClass("ui-ss-with-bubble");*/
	   $(this).parent().addClass("ui-ss-with-bubble");
      });
      this._bindEvents();
    }
  };
$.widget("ui.bubbles", ui_bubbles_initStruct);