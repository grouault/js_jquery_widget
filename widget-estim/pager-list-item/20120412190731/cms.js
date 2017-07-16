/*
 * Fonctions systeme CMS
 *
 * Changelog:	NG 20080314 - v1.0, integration sous forme de .js
 *		NG 20080317 - v1.1,  correction sur showAndHide()
 *		NG 20080430 - v1.2,  ajout objet CMS et gestionnaire d'evenements onload
 *		GR 20080515 - v1.3,  ajout de la fonction checkMailAddress()
 *		NG 20080521 - v1.4,  ajout du systeme de votes sur les contenus et fonctions de gestion des cookies
 *		GR 20080605 - v1.5,  ajout de la fonction isNumeric(), modification des fonctions lies aux FAQ
 *		GG 20080908 - v1.6,  modification sur systeme de vote (bouton de vote unique), ajout fonction multi-navigateur de manipulation DOM avec namespace
 *		GR 20081008 - v1.7,  ajout des fonctions checkCodePostal() et checkMailAdresseTest()
 *		GR 20081022 - v1.8,  ajout des fonctions javascript relatives aux QuestionsReponses, prise en compte des fichers messages externalises.
 *		NG 20090218 - v1.9,  nettoyage (commentaires, etc.)
 *		SR 20101021 - v1.10, deploiement SACTU et modif methode checkForm, checkOpinion
 *    GR 20111211 - v1.11, Evolution HealthQAA.
 */

/*
Change le SRC d'une image (rollover)
	@obj:		Element HTML image
	@url:		URL du src
	@returns:	void
*/
function rollImg(obj, url) {
	obj.src = url;
}

/*
Echange le contenu d'un DIV
	@target:	ID du DIV
	@from:		1er contenu
	@to:		2nd contenu
	@returns:	void
*/
function swapTxt(target, from, to) {
	var elt = document.getElementById(target);
	if (elt != null) {
		if (elt.innerHTML == from) {
			elt.innerHTML = to;
		} else {
			elt.innerHTML = from;
		}
	}
}

/*
Cache ou montre un DIV
	@target:	ID du DIV
	@display:	Style de display a utiliser pour afficher le DIV (inline, block, ...)
	@returns:	void
*/
function showAndHide(target, display) {
	var elt = document.getElementById(target);
	if (elt != null) {
		if (elt.style.display == display) {
			elt.style.display = 'none';
		} else {
			elt.style.display = display;
		}
	}
}

/*
AJAX: Constantes pour les types de noeuds
*/
ajaxELEMENT_NODE = 1;
ajaxATTRIBUTE_NODE = 2;
ajaxTEXT_NODE = 3;
ajaxCDATA_SECTION_NODE = 4;
ajaxENTITY_REFERENCE_NODE = 5;
ajaxENTITY_NODE = 6;
ajaxPROCESSING_INSTRUCTION_NODE = 7;
ajaxCOMMENT_NODE = 8;
ajaxDOCUMENT_NODE = 9;
ajaxDOCUMENT_TYPE_NODE = 10;
ajaxDOCUMENT_FRAGMENT_NODE = 11;
ajaxNOTATION_NODE = 12;

/*
AJAX: Retourne un objet XMLHttpRequest fonction du navigateur
	@returns:	void
*/
function ajaxGetXmlHttpRequest() {
	var xhr = null;
	if (window.XMLHttpRequest) {
		//Firefox ou IE >= 7.0
		xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e) {
				try {
					// Ancienne version IE
					xhr = new ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {
			}
		}
	}
	return xhr;
}

/*
AJAX: Lit le contenu textuel d'un noeud, les CDATA etant pris en compte
	@elt:		Objet Node a lire
	@returns:	Une chaine contenant au contenu texte du noeud
*/
function ajaxGetNodeText(elt) {
	var out = '';
	for(i=0; i<elt.childNodes.length;i++) {
		var currentNode = elt.childNodes[i];
		if (currentNode.nodeType == ajaxTEXT_NODE || currentNode.nodeType == ajaxCDATA_SECTION_NODE) {
			out += currentNode.nodeValue;
		}
	}
	return out;
}

/*
Calendrier WS RESO: Navigue sur une date
	@dateChoisie:	Date sur laquelle naviguer
	@returns:	void
*/
function submitPage(dateChoisie){
	document.frm.dateChoisie.value=dateChoisie;
	document.frm.submit();
}

/*
Calendrier WS RESO: Change de mois
	@indicateur:	0 pour reculer, 1 pour avancer
	@returns:	void
*/
function changeMonth(indicateur){
	document.frm.changeMonth.value=indicateur;
	document.frm.submit();
}

/*
 * Objet generique pour toutes les fonctions liees au CMS
 */
var CMSUtils = {

	/*
	 * Ajoute un evenement sur un element
	 *	@elt:		L'element cible
	 *	@evtType:	Le type d'evenement souhaite (click, load ...)
	 * 	@func:		Fonction a appeller
	 *	@capture:	Indique s'il faut capturer ou non l'evenement (true/false)
	 *	@returns:	void
	 */
	addEvent : function(elt, evtType, func, capture) {
		if (elt.addEventListener) {
			// Pour browsers DOM2 autres que IE
			elt.addEventListener(evtType, func, capture);
		} else {
			if ( elt.attachEvent ) {
				// Fonction specifique IE
				elt.attachEvent('on' + evtType, func);
			} else {
				// Methode old-school passe partout
				// Ecrase tout gestionnaire precedemment installe
				elt['on' + evtType] = func;
			}
		}
	},	

	/*
	 * Ajoute une fonction a appeller sur le onload de la page
	 * 	@func:		Fonction a appeller
	 *	@returns:	void
	 */
	addWindowOnLoadEvent : function(func) {
		CMSUtils.addEvent(window, 'load', func, false);
	},
	
	
	/*
	 * Permet de verifier la vailidit� d'une adresse e-mail.
	 *	@mailAdress:	Adresse email a verifier
	 *	@returns: 	true si l'adresse est valide, sinon false
	 */
	checkMailAdress : function(mailAdress) {
		var strAdressMail = document.getElementById(mailAdress).value;
		var aroba = strAdressMail.indexOf('@');
		var point = strAdressMail.indexOf('.');
		if ((aroba > -1)&&(strAdressMail.length >2)&&(point > 0)) {
			return(true);
		} else {
			return(false);
		}	
	},
	
	/*
	 * fonction de test de la validite du code postal
	 * 	@codePostal: Code Postal a analyser.
	 * 	@returns: false si le code postal n est pas valid.
	 */
	checkCodePostal : function(codePostal){
		var codePostalRegExp = /^[a-zA-Z0-9]+$/; 
		if (codePostalRegExp.exec(codePostal) == null) {
			return false;
		} else {
			return true;
		}
	},
	
	/*
	 * fonction de test de la validite de l email
	 * 	@email: mail a analyser.
	 * 	@returns: false si l'adresse mail n'est pas valide.
	 */
	checkMailAdresse : function(email){
		var emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-.]{2,}[.][a-zA-Z]{2,10}$/;
		if (emailRegExp.exec(email) == null)
		{
		 return false;
		}
	},

	/*
	 * Constitue un tableau associatif sur la Query String, avec comme clef
	 * le nom de chaque argument, et en valeur la valeur de l'argument.
	 *	@queryString:	Une chaine QueryString, commencant ou non par '?'
	 * 	@returns:	Un tableau associatif
	 */
	queryStringAsMap :  function(queryString) {
		var qs = queryString;
		

		if (qs.charAt(0) == '?') {
			qs = qs.substring(1);
		}	

		var identifiers = qs.split('&');
			
		// Constitution d'une Map avec les valeurs de la Query String
		var qsMap = new Array();
		for (var i=0; i<identifiers.length;i++) {
			var key = identifiers[i].split('=')[0];
			qsMap[key] = identifiers[i].split('=')[1];
		}

		return qsMap;

	},
	
	/*
	 * Recupere un noeud precis d'un document DOM avec gestion des namespace
	 * dans le nom du noeud.
	 *	@prefix:	Prefixe NS pour le nom du noeud (optionel)
	 *	@local:		Nom du noeud sans le NS
	 *	@parentElem:	Element DOM parent du noeud a recuperer
	 *	@returns:	Un noeud DOM ou null si le noeud n'existe pas
	 */
	getElementsByTagNameDiff : function(prefix, local, parentElem) {			
		var result = null;
		if (prefix) {
			try {
				result = parentElem.getElementsByTagName(prefix + ':' + local);
 			} catch (e) {}

			if (result == undefined || result.length == 0 ) {
				result = parentElem.getElementsByTagName(local);
			}
			
		} else {
			result = parentElem.getElementsByTagName(local);
		}
		
		return result;
	},
	
	/*
	 * Tronque une chaine en en conservant que les n premiers caracteres
	 *	@str:		chaine a tronquer
	 *	@length:	Nb de caracteres a conserver
	 *	@returns:	La chaine tronquee + "..."
	 */
	truncate : function(str, length) {
		if (str.length >= length) {
			return str.slice(0,length) + '...';
		} else {
			return str;
		}
	},
	
	/*
	 * Gestion des cookies
	 */

	Cookie : {

		/*
		 * Recupere la valeur d'un cookie
		 *	@name:		Nom du cookie dont recuperer la valeur
		 * 	@returns:	La valeur du cookie, ou null s'il n'existe pas
		 */
		getCookie : function(name) {
			var out = null;

			if (document.cookie != undefined && document.cookie.length > 0) {
				var iStart = document.cookie.indexOf(name + '=');
				if (iStart > -1) {
					iStart = iStart + name.length + 1;
					var iEnd = document.cookie.indexOf(';', iStart);
					if (iEnd < 0) {
						// C'est le dernier cookie de la chaine
						iEnd = document.cookie.length;
					}
					out = unescape(document.cookie.substring(iStart, iEnd));
				}
			}

			return out;
		},

		/*
		 * Positionne un cookie
		 *	@name:		Nom du cookie
		 *	@value:		Valeur du cookie
		 *	@expireDays:	Nombre de jour de validite, null pour un cookie permanent
		 *	@returns:	void	
		 */
		setCookie : function(name, value, expireDays) {

			var strCookie = name + '=' + escape(value);
			var path = "; path=/";
			if (expireDays != null) {
				var expDate = new Date();
				expDate.setDate(expDate.getDate() + expireDays);
				strCookie += ';expires=' + expDate.toGMTString();
			}
			strCookie += path;
			document.cookie = strCookie;
		}
	},
	
	/*
	 * Fonctions relatives aux FAQ
	 */
	FAQ : {
		/*
		Gestion des FAQ: Montre une reponse
			@idCs:		Identifiant de la FAQ
			@width:		Largeur du DIV de reponse
			@height:	Hauteur du DIV de reposne
			@returns:	void
		*/				
		showToolTip : function (idCs, width, height) {
			var question = document.getElementById('question_' + idCs);
			var reponse = document.getElementById('reponse_' + idCs);
	
			if (reponse != null && question != null) {
		
				/* positionnement de la question */
				var top = question.offsetTop;
				var left = question.offsetLeft;
				
				/* positionnement de la reponse */
				reponse.style.width = width + 'px';
				reponse.style.height = height + 'px';
				reponse.style.left = (left+10) + 'px';
				reponse.style.top = (top+35) + 'px';
				reponse.style.visibility='visible';
			}
		},


		/*
		Gestion des FAQ: Cache une reponse
			@idCs:		Identifiant de la FAQ
			@width:		Largeur du DIV de reponse
			@height:	Hauteur du DIV de reposne
			@returns:	void
		*/			
		hideToolTip : function (idCs) {
			var reponse = document.getElementById('reponse_' + idCs);
			if (reponse != null) {
				reponse.style.visibility='hidden';
			}
		}
	},

	/*
	 * Systeme de widgets
	 */
	Widget : {
		
		/*
		 * Gestion d'un widget citations
		 * 	@pId:		ID du portail
		 *	@cId:		ID du widget
		 *	@mediaCs:	Racine d'acces aux medias CS
		 *	@prefixeImage:	Prefixe des images specifiques au portail
		 *	@returns:	void
		 */	
		WidgetCitations : function(pId, cId, mediaCs, prefixeImage) {
			
			this.m_cId = cId;
			this.m_mediaCs = mediaCs;
			this.m_prefixeImage = prefixeImage;
			this.m_pId = pId;
			
			this.m_buttonId = 'boutonVote' + this.m_cId;
			
			this.m_votable = false; 		// Widget votable ou non
			this.m_tabContent = new Array();	// Contenus de chaque item
			this.m_tabId = new Array();	// Identifiants de chaque item
			this.m_offset = 0;		// Index de l'element en cours d'affichage
						
			/*
			 * Navigue vers l'element precedent ou suivant
			 *	@increment:	Indique le nombre d'elements a avancer/reculer
			 *	@returns:	void
			 */
			this.roll = function(increment) {
				try {
					this.m_offset += increment;
	                        
					// Gestion fleche suivante
					if (this.m_offset+1 >= this.m_tabContent.length) {
						// On est a droite du tableau. Pas de next possible
						document.getElementById('widget-next-' + this.m_cId).style.visibility = 'hidden';
						this.m_offset = this.m_tabContent.length-1;
	                    		} else {
		                    		// Encore des citations a venir, fleche suivante a montrer
	                    			document.getElementById('widget-next-' + this.m_cId).style.visibility = 'visible';
	                    		}
	                    
	                    		// Gestion fleche precedente
	                    		if ( this.m_offset -1 < 0 ) {
		                    		// On est a gauche du tableau, pas de precedent possible
	                    			document.getElementById('widget-prev-' + this.m_cId).style.visibility = 'hidden';
						this.m_offset = 0;
					} else {
						// Encore des citations a gauche, fleche precedente a montrer
						document.getElementById('widget-prev-' + this.m_cId).style.visibility = 'visible';
					}
			
					document.getElementById('widget-content-' + this.m_cId).innerHTML = this.m_tabContent[this.m_offset];

					if (this.m_votable) {
			                	// changement du bouton vote, selon que l'utilisateur a deja vot ou non pour la citation nouvellement affiche 
		                        	this.toggleVoteButton();
					}
				} catch (e) { }	
			}
			
			/*
			 * Gere l'affichage du bouton de vote fonction des cookies du navigateur
			 *	@returns:	void
			 */
			this.toggleVoteButton = function() {
				var imgOnUrl = this.m_mediaCs + '/styles/generics/Widget/WidgetCitations/' + this.m_prefixeImage + '/on.png';
				var imgOffUrl = this.m_mediaCs + '/styles/generics/Widget/WidgetCitations/' + this.m_prefixeImage + '/off.png';
			 	var citationId = this.m_tabId[this.m_offset];
			 	var baseDom = document;
				
				CMSUtils.Vote.manageVoteButton(citationId, imgOnUrl, imgOffUrl, this.m_buttonId, baseDom);
			}
			
			/*
			 * Declenche le vote sur le contenu en cours d'affichage
			 *	@returns:	void
			 */
			this.vote = function () {
				var baseDom = document;
				var subTypeContent = 'Citation';
				var typeContent = 'Citation';									
				var imgOnUrl = this.m_mediaCs + '/styles/generics/Widget/WidgetCitations/' + this.m_prefixeImage + '/on.png';
				var citationId = this.m_tabId[this.m_offset];
				var pId = this.m_pId;
				var baseHTTP = '';
				
				if (! CMSUtils.Vote.hasVotedForContent(citationId)) { 
					CMSUtils.Vote.voteContent(citationId, pId, typeContent, subTypeContent, imgOnUrl, this.m_buttonId, baseDom, baseHTTP); 
				}
			}
			
		},
		
		DEFAULT_PHOTO_ROLL_TIMEOUT : 3000,		// Temps d'affichage d'un element
		
		/*
		 * Gestion d'un widget photos
		 *	@objectName:	Nom de l'objet JS instancie. Necessaire pour relancer un timeOut
		 *			pour faire tourner les photos.
		 * 	@pId:		ID du portail
		 *	@cId:		ID du widget
		 *	@mediaCs:	Racine d'acces aux medias CS
		 *	@prefixeImage:	Prefixe des images specifiques au portail
		 *	@returns:	void
		 */	
		WidgetPhotos : function(objectName, pId, cId, mediaCs, prefixeImage) {
			
			this.m_objectName = objectName;
			this.m_cId = cId;
			this.m_mediaCs = mediaCs;
			this.m_prefixeImage = prefixeImage;
			this.m_pId = pId;
			
			this.m_buttonId = 'boutonVote' + this.m_cId;
			
			this.m_votable = false; 		// Widget votable ou non
			this.m_tabContent = new Array();	// Contenus de chaque item
			this.m_tabId = new Array();	// Identifiants de chaque item
			this.m_offset = 0;		// Index de l'element en cours d'affichage
						
			/*
			 * Navigue vers l'element precedent ou suivant
			 *	@increment:	Indique le nombre d'elements a avancer/reculer
			 *	@returns:	void
			 */
			this.roll = function(increment) {
				this.m_offset += increment;
                        
	                        if (this.m_offset > this.m_tabContent.length-1)  {
	                                this.m_offset = 0;
	                        } else if ( this.m_offset < 0 ) {
		                       	this.m_offset = this.m_tabContent.length-1;
	                        }

	                        document.getElementById('widget-content-' + this.m_cId).innerHTML = this.m_tabContent[this.m_offset];

	                        document.getElementById('photo-widget-comment-' + this.m_tabId[this.m_offset]).innerHTML = CMSUtils.truncate(document.getElementById('photo-widget-comment-' + this.m_tabId[this.m_offset]).innerHTML, 80);

	                        if (this.m_votable) {
					// changement du bouton vote, selon que l'utilisateur a deja vot ou non pour la citation nouvellement affiche 
			                this.toggleVoteButton();
				}
			
				setTimeout(this.m_objectName + '.roll(1)', CMSUtils.Widget.DEFAULT_PHOTO_ROLL_TIMEOUT);
				
			}
			
			/*
			 * Gere l'affichage du bouton de vote fonction des cookies du navigateur
			 *	@returns:	void
			 */
			this.toggleVoteButton = function() {
				var imgOnUrl = this.m_mediaCs + '/styles/generics/Widget/WidgetPhotos/' + this.m_prefixeImage + '/on.png';
				var imgOffUrl = this.m_mediaCs + '/styles/generics/Widget/WidgetPhotos/' + this.m_prefixeImage + '/off.png';
			 	var photoId = this.m_tabId[this.m_offset];
			 	var baseDom = document;
				
				CMSUtils.Vote.manageVoteButton(photoId, imgOnUrl, imgOffUrl, this.m_buttonId, baseDom);
			}
			
			/*
			 * Declenche le vote sur le contenu en cours d'affichage
			 *	@returns:	void
			 */
			this.vote = function () {
				var baseDom = document;
				var subTypeContent = 'Photo';
				var typeContent = 'Photo';									
				var imgOnUrl = this.m_mediaCs + '/styles/generics/Widget/WidgetPhotos/' + this.m_prefixeImage + '/on.png';
				var photoId = this.m_tabId[this.m_offset];
				var pId = this.m_pId;
				var baseHTTP = '';
				
				if (! CMSUtils.Vote.hasVotedForContent(photoId)) { 
					CMSUtils.Vote.voteContent(photoId, pId, typeContent, subTypeContent, imgOnUrl, this.m_buttonId, baseDom, baseHTTP); 
				}
			}
			
                }, 
                
		/*
		 * Gestion d'un widget agenda
		 * 	@pId:		ID du portail
		 *	@cId:		ID du widget
		 *	@mediaCs:	Racine d'acces aux medias CS
		 *	@prefixeImage:	Prefixe des images specifiques au portail
		 *	@returns:	void
		 */	
		WidgetAgenda : function(pId, cId, mediaCs, prefixeImage) {
			
			this.m_cId = cId;
			this.m_mediaCs = mediaCs;
			this.m_prefixeImage = prefixeImage;
			this.m_pId = pId;
			
			this.m_tabContent = new Array();	// Contenus de chaque item
			this.m_tabId = new Array();	// Identifiants de chaque item
			this.m_offset = 0;		// Index de l'element en cours d'affichage
						
			/*
			 * Navigue vers l'element precedent ou suivant
			 *	@increment:	Indique le nombre d'elements a avancer/reculer
			 *	@returns:	void
			 */
			this.roll = function(increment) {
				try {
					this.m_offset += increment;
	                        
					// Gestion fleche suivante
					if (this.m_offset+2 >= this.m_tabContent.length) {
						// On est a droite du tableau. Pas de next possible
						document.getElementById('widget-next-' + this.m_cId).style.visibility = 'hidden';
						this.m_offset = this.m_tabContent.length-1;
	                    		} else {
		                    		// Encore des citations a venir, fleche suivante a montrer
	                    			document.getElementById('widget-next-' + this.m_cId).style.visibility = 'visible';
	                    		}
	                    
	                    		// Gestion fleche precedente
	                    		if ( this.m_offset -2 < 0 ) {
		                    		// On est a gauche du tableau, pas de precedent possible
	                    			document.getElementById('widget-prev-' + this.m_cId).style.visibility = 'hidden';
						this.m_offset = 0;
					} else {
						// Encore des citations a gauche, fleche precedente a montrer
						document.getElementById('widget-prev-' + this.m_cId).style.visibility = 'visible';
					}
			
					document.getElementById('widget-content-' + this.m_cId).innerHTML = unescape('%3Cp%3E') + this.m_tabContent[this.m_offset] + unescape('%3Cp%3E');
					
					if ( parseInt(this.m_offset) + 1 < this.m_tabContent.length) {
						document.getElementById('widget-content-' + this.m_cId).innerHTML += unescape('%3Cp%3E') + this.m_tabContent[this.m_offset+1] + unescape('%3Cp%3E');
					}					

				} catch (e) { }	
			}
			
		}                
		
	},
		
	/*
	 * Question-Reponse.
	 */	
	QuestionReponse : {
		
		/*
		 * Permet de valider ou non la saisie des champs du formulaire
		 * de saisie de confirmation
		 *	@formulaire:    formulaire a valider.
		 *	@returns:	true si la validation est ok sinon false
		 */
		checkForm : function(formulaire) {
		    if(CMSUtils.checkMailAdresse(formulaire.email.value) == false) {
				alert(CMSMessages.QuestionReponse.ERROR_MAIL);
			} else if (CMSUtils.checkMailAdresse(formulaire.emailconfirm.value) == false) {
			    alert(CMSMessages.QuestionReponse.ERROR_MAIL_CONFIRM);
			} else if( formulaire.pays.value == '' ) {
				alert(CMSMessages.QuestionReponse.ERROR_OBJET_PAYS);
			} else if( formulaire.objetdemande.value == '' ) {
				alert(CMSMessages.QuestionReponse.ERROR_OBJET_DEMANDE);
			} else if( formulaire.objetquestion.value == '' ) {
				alert(CMSMessages.QuestionReponse.ERROR_OBJET_QUESTION);
			} else if( formulaire.question.value == '' ) {
				alert(CMSMessages.QuestionReponse.ERROR_QUESTION);
			} else if(!formulaire.autopub[0].checked && !formulaire.autopub[1].checked) {
				alert(CMSMessages.QuestionReponse.ERROR_AUTO_PUBLICATION);
			} else if (!formulaire.charte.checked){
			    alert(CMSMessages.QuestionReponse.ERROR_APPROVE_CHARTE);
			} else {
				return true;
			}	
			return false;
		}	
	},
	
	/*
	 * Systeme de comptage
	 */
	LesPlus : {	
	
		// Prefixe du cookie JS utilise
		LESPLUS_COOKIE_PREFIX : 'cms.lesplus.',
	
		comptage: function(urlTrack, baseHTTP) {
			var urlVote = baseHTTP + urlTrack;
			var xhr = ajaxGetXmlHttpRequest();
			try {
				xhr.open('GET', urlVote, true);
				xhr.send(null);
			} catch (e) {
			   alert("error: " +  xhr.status);
			}
			
		}
	
	},	
	
	/**
	* Opinion Science Actualite
	*/
	Opinion : {
			OPINION_COOKIE_PREFIX : 'cms.as.opinion.',
			/*
			 * Permet de valider ou non la saisie des champs du formulaire
			 * de saisie de confirmation
			 *	@formulaire: url de l'element de vote.
			 *	@id: identifiant CS de l'opinion.
			 */
			updateContent : function(urlContent, id){
					var xhr = ajaxGetXmlHttpRequest();				
					xhr.onreadystatechange  = function() { 
					if(xhr.readyState  == 4) {
						if(xhr.status  == 200)  {
							document.getElementById(id).innerHTML = xhr.responseText;
					    } else 
					    	alert("Ajax error code " + xhr.status);
						}
					}; 
					try {
						xhr.open('GET', urlContent, true);
						xhr.send(null);
					} catch (e) {
						alert("Ajax error: " + xhr.status);
					}	
			},
			
			/*
			 * Permet de valider ou non la selection d'une proposition de l'opinion
			 *	@urlForm: url de l'element de vote.
			 *	@id: identifiant CS de l'opinion.
			 *  @radio: nom du bouton radio contenant l'identifiant de l'opinion
			 *  @return: false - la validation est en ajax.
			 */
			checkOpinion : function(urlForm, id, radio){
	
				/** test si l'id de l'opinion est bien transmise */
				if(id==""){
					alert("Enregisterment impossible!");
					return false;
				}
				var idContent = 'content_' + id;
				var params = '&ownerid=' + id;
				var radioVar = document.getElementsByName(radio);					
				var isChecked = false;
				/** recuperation de la selection de l'internaute */
				for(var i=0; i<radioVar.length ;i++){
					if(radioVar[i].checked==true){
						params += "&propid=" + radioVar[i].value;
						isChecked = true;
					}
				}
				/** test si une reponse est selectionnee */
				if(!isChecked){
					alert(CMSMessages.Opinion.ERROR_CHOIX_VIDE);
					return false;
				}
				/** ajout des parametres dans l'url */
				var urlValid = urlForm + params;				
	
				/** on place le cookie sur le navigateur */
				var cookieValue = CMSUtils.Opinion.OPINION_COOKIE_PREFIX + id;
				CMSUtils.Cookie.setCookie(cookieValue);
	
				/** appel de l element de vote en ajax */
				var xhr = ajaxGetXmlHttpRequest();				
				xhr.onreadystatechange  = function() { 
				if(xhr.readyState  == 4) {
					if(xhr.status  == 200)  {
						document.getElementById(idContent).innerHTML = xhr.responseText;
				    } else 
				    	alert("Ajax error code " + xhr.status);
					}
				}; 
				try {
					xhr.open('POST', urlValid, true);
					xhr.send(null);
				} catch (e) {
					alert("Ajax error: " + xhr.status);
				}	
				return false;
			},
			
			/**
			* function permettant de valider qu'au moins un ckeckbox
			* a ete selcectionne.
			*  @radio: nom du bouton radio contenant l'identifiant de l'opinion
			*  @return: boolean de validation.
			*/
			checkOpinionBorn : function(radio){
				var isChecked = false;
				var radioVar = document.getElementsByName(radio);
				/** recuperation de la selection de l'internaute */
				for(var i=0; i<radioVar.length ;i++){
					if(radioVar[i].checked==true){
						isChecked = true;
					}
				}

				/** test si une reponse est selectionnee */
				if(!isChecked){
					alert(CMSMessages.Opinion.ERROR_CHOIX_VIDE);
					return false;
				}
				
				return true;
			},			
			
			/**
			* function permettant de selectionner la propriete de la checkbox.
			*  @idProp: identifiant de la propriete a modifier.
			*  @radio : nom du bouton radio contenant l'identifiant de l'opinion.
			*/
			updateProps : function(idProp, radio){
				var radioVar = document.getElementsByName(radio);
				var props = document.getElementById(idProp);
				//parcourir la liste check-box pour deselectionner toutes les props
				for(var i=0; i<radioVar.length ;i++){
					radioVar[i].parentNode.className = 'sondage-off';
					radioVar[i].checked=false;
				}
				//selectionner la bonne props.
				props.parentNode.className='sondage-on';
				props.checked=true;
			}			
											
	}
	,	
	
	/*
	 * Systeme de commentaires
	 */
	Commentaires : {
		/*
		 * Permet de valider ou non la saisie des champs du formulaire
		 * de saisie de confirmation
		 *  @id: asset surlequel porte le commentaire
		 *	@formulaire:    formulaire a valider.
		 *	@returns:	true si la validation est ok sinon false
		 */
		COMMENTS_COOKIE_PREFIX : 'cms.comments.', 
		 
		checkForm : function(formulaire,id) {
			if (CMSUtils.Cookie.getCookie(CMSUtils.Commentaires.COMMENTS_COOKIE_PREFIX + id) != null) {
				alert(CMSMessages.Commentaires.ERROR_DOUBLONS);
			} else if (formulaire.email.value == '') {
				alert(CMSMessages.Commentaires.ERROR_EMAIL);
			} else if (formulaire.pseudo.value == '') {
				alert(CMSMessages.Commentaires.ERROR_PSEUDO);
			} else if (formulaire.comment.value == '') {
				alert(CMSMessages.Commentaires.ERROR_COMMENT);
			} else if (formulaire.captcha.value == '') {
				alert(CMSMessages.Commentaires.ERROR_CAPTCHA);
			} else {
				/** on place un cookie pour dire que le user a deja vote pour le contenu */
				if(id!=null){
					CMSUtils.Cookie.setCookie(CMSUtils.Commentaires.COMMENTS_COOKIE_PREFIX + id, 1, 7); 
				}
				return true;
			}	
			return false;
		}	
	},
	printElement : function(elementUrl, targetIds) {
			var xhr = ajaxGetXmlHttpRequest();
			
		  xhr.onreadystatechange  = function() { 
         if(xhr.readyState  == 4) {
            if(xhr.status  == 200)  {
            	var idArray = targetIds.split(',');
							for (var i=0; i<idArray.length; i++) {
								var id = idArray[i];
	            	document.getElementById(id).innerHTML = xhr.responseText;
							}
            } else 
            	alert("Ajax error code " + xhr.status);
         }
	    }; 
			
			try {
				xhr.open('GET', elementUrl, true);
				xhr.send(null);
			} catch (e) {
       	alert("Ajax error: " + xhr.status);
			}
	},
	
	/*
	 * Systeme de vote
	 */
	Vote : {
		// URL de l'element CS charge de voter
		VOTE_URL : '/cs/Satellite?pagename=Portails/CSElement/Vote',
		// Prefixe du cookie JS utilise
		VOTE_COOKIE_PREFIX : 'cms.vote.',
		// ID de l'image du bouton de vote sur la page
		VOTE_BUTTON_ID : 'boutonVote',
		
		/*
		 * Verifie si un vote a deja eu lieu pour l'internaute sur un contenu
		 *	@id:		Id du contenu
		 *	@returns:	true si le vote a deja eu lieu, sinon false
		 */
		hasVotedForContent : function(id) {
			return (CMSUtils.Cookie.getCookie(CMSUtils.Vote.VOTE_COOKIE_PREFIX + id) != null);
		},

		/*
		 * Verifie si un vote a deja eu lieu pour l'internaute sur la page en cours
		 * de visualisation (base sur le CID de l'URL)
		 *	@returns:	true si le vote a deja eu lieu, sinon false
		 */
		hasVotedForPage : function() {
			var qsMap = CMSUtils.queryStringAsMap(document.location.search);
			return (CMSUtils.Cookie.getCookie(CMSUtils.Vote.VOTE_COOKIE_PREFIX + qsMap['cid']) != null);
		},

		/*
		 * Declenche le vote pour la page en cours. Recupere dans l'URL
		 * le c, cid, pid et appelle la fonction d'envoi d'un vote
		 *	@returns: void
		 */
		votePage : function(imgOnUrl, buttonId) {

			var qsMap = CMSUtils.queryStringAsMap(document.location.search);


			if (qsMap['c'] != null && qsMap['cid'] != null && qsMap['pid'] != null) {
				// Toutes les valeurs necessaires au vote sont presentes. Envoi du vote
				var baseHTTP = '';
								
				CMSUtils.Vote.sendVote(qsMap['c'], null, qsMap['cid'], qsMap['pid'], baseHTTP);

				// Modifier l'image du bouton pour indiquer que le vote a eu lieu
				CMSUtils.Vote.changeButtonImage(imgOnUrl, buttonId, document);
			}
		},
		
		/*
		 * Declenche le vote pour le contenu dont on a pass� le cid en param�tre. 
		 *	@returns: void
		 */
		voteContent : function(cId, pId, typeContent, subTypeContent, imgOnUrl, buttonId, baseDom, baseHTTP) {
			if (cId != null && pId != null) {
				// Toutes les valeurs necessaires au vote sont presentes. Envoi du vote
				CMSUtils.Vote.sendVote(typeContent, subTypeContent, cId, pId, baseHTTP);

				// Modifier l'image du bouton pour indiquer que le vote a eu lieu
				CMSUtils.Vote.changeButtonImage(imgOnUrl, buttonId, baseDom);
			}

		},		

		/*
		 * Change l'image du bouton de vote
		 *	@imgUrl:	URL de l'image a utiliser
		 *	@buttonId:	id du bouton a modifier
		 *	@baseDom:	base de l'arbre DOM ou rechercher le bouton
		 *  @buttonId : id du bouton a changer
		 *	@returns:	void
		 */
		changeButtonImage : function(imgUrl, buttonId, baseDom) {
			var buttonElt = baseDom.getElementById(buttonId);
			
			if (buttonElt != null) {
				// Postulat: Le tag <A> du bouton contient une <IMG>
				buttonElt.getElementsByTagName('img')[0].src = imgUrl;
			}		
		},

		/*
		 * Appelle l'URL du service de vote avec les parametres requis. Place un cookie
		 * indiquant que l'internaute a vote pour ce contenu.
		 *	@type:		Type du contenu sur lequel s'effectue le vote
		 *	@subtype:	Sous-type du contenu
		 *	@id:		Identifiant du contenu
		 *	@siteId:	Identifiant du site (pid)
		 *	@returns:	void
		 */
		sendVote: function(type, subtype, id, siteId, baseHTTP) {
			var targetSubtype = subtype;
			if (targetSubtype == null) {
				targetSubtype = type;
			}



			var urlVote = baseHTTP + CMSUtils.Vote.VOTE_URL 
				+ '&c=' + type
				+ '&subtype=' + targetSubtype
				+ '&cid=' + id
				+ '&pid=' + siteId;
				
			var xhr = ajaxGetXmlHttpRequest();
			try {
				xhr.open('GET', urlVote, true);

				xhr.send(null);
				CMSUtils.Cookie.setCookie(CMSUtils.Vote.VOTE_COOKIE_PREFIX + id, 1, 365*10);
			} catch (e) {
			}
			
		},

		/*
		 * Gere le bouton de vote: Verifie si l'utilisateur a vote pour l'ID indique.
		 * Si c'est le cas, met l'image du bouton a l'etat "on".
		 *	@id:		ID du contenu
		 *	@imgOnUrl:	URL de l'image "On"
		 *	@returns:	void
		 */
		manageVoteButton : function(id, imgOnUrl, imgOffUrl, buttonId, baseDom) {
			var hasVoted = CMSUtils.Vote.hasVotedForContent(id);
			
			if (hasVoted) {
				CMSUtils.Vote.changeButtonImage(imgOnUrl, buttonId, baseDom);
			} else {
				CMSUtils.Vote.changeButtonImage(imgOffUrl, buttonId, baseDom);				
			}
		}

	},
	
	/*
	 * Verifie qu'un texte passe en parametre est numerique. 
	 * 	@str:		Chaine de caracter a analyser.
	 * 	@returns:	boolean - true si la chaine ne contient que des chiffres.
	 */
	isNumeric : function(str) {
		return new RegExp('^[0-9-.]*$', 'g').test(str);
	}

};

/*
 * ouvre un popup en modal avec la largeur et hauteur specifie
 * le contenu correspond au rendu de pagename
 * divId est l'id du div cache qui presente le popup
 *
 */
function openModalWindow(wid, hei, divId, pagename, elem) {
	if (elem.name != ""){
		jQuery('#' + divId).dialog('open');
	} else {
		jQuery('#' + divId).load(pagename).dialog( {
		modal : true,
		resizable : true,
		width : wid,
		height : hei,
		overlay : {
			background : '#000000',
			opacity : 0.4
		}
	});
	elem.name = divId;
	}
}

