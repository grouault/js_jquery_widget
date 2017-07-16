/*
 * Messages utilises dans les fonctions CMS.
 * Version localisee en fr_FR
 *
 * Changelog:   NG GR	20080224 - v1.0, integration sous forme de .js
 *              GR - 20110720 - V2.0, maj projet manifestation interne
 */
var CMSMessages = {

	/*
	 * Système de Q/R de la CDS
	 */
	QuestionReponse : {
		// Messages d'erreurs sur validation du formulaire de question
		ERROR_AUTO_PUBLICATION: "Vous devez cocher une des cases autorisant ou non la publication de votre question sans votre adresse e-mail",
		ERROR_CODE_POSTAL : "Le code postal n'est pas correctement renseigné.",
		ERROR_MAIL : "L'adresse e-mail n'est pas correctement renseignée.",
		ERROR_OBJET_DEMANDE : "L'objet de votre demande doit être renseigné.",
		ERROR_OBJET_QUESTION : "Le titre de votre question doit être renseigné",
		ERROR_PAYS : "Le pays doit être renseigné.",
		ERROR_PUBLIC : "Veuillez indiquer votre situation.",
		ERROR_QUESTION : "Votre question doit être renseignée.",
		ERROR_SATISFACT_CHOICE : "Vous devez faire un choix dans les critères de satisfaction.",
		ERROR_MAIL_CONFIRM : "Vous devez confirmer votre email.",
		ERROR_APPROVE_CHARTE : "Vous devez approuvez la charte.",
		ALERT_UNKNOWN_SEARCH_VALUE : "Vous devez saisir une valeur de recherche.",
		ALERT_FORBIDEN_COPY : "Afin de vérifier votre saisie, vous ne pouvez pas copier ce champ.",
		ALERT_FORBIDEN_PASTE : "Impossible de copier une valeur dans ce champ."
	},

	/*
	 * Système de commentaires de la CDS 
	 */
	Commentaires : {
		// Messages d'erreurs sur validation du formulaire de question
		ERROR_EMAIL: "Vous devez indiquer un email pour votre commentaire.",
		ERROR_PSEUDO: "Vous devez indiquer un pseudo pour votre commentaire.",
		ERROR_COMMENT : "Vous devez saisir un texte pour votre commentaire.",
		ERROR_CAPTCHA : "Vous devez recopier le texte affiché de l'image avant de valider votre commentaire.",
		ERROR_DOUBLONS :"Vous avez deja saisie un commentaire!"
	},
	
	/*
	* Opinion de Science Actualite
	*/
	Opinion : {
		// Mesages d'erreurs sur validation du vote
		ERROR_CHOIX_VIDE: "Vous devez sélectionner une réponse dans la liste!"
	},
	
	/*
	* Manifestation Interne
	*/
	ManifInterne : {
	  // Message d'erreurs sur validation du formulaire d'inscription
	  ERROR_NAME : "Vous devez indiquer votre nom.",
	  ERROR_FIRSTNAME : "Vous devez indiquer votre prénom",
	  ERROR_MANADORY_EMAIL : "Vous devez indiquer un email",
	  ERROR_MAIL : "L'adresse e-mail n'est pas correctement renseignée.",
	  ERROR_PHONE : "Vous devez indiquer un numéro de téléphone.",
	  ERROR_SEANCE : "Vous devez indiquer une séance.",
	  ERROR_PLACE : "Vous devez saisir un nombre de place.",
	  // Message sur le formulaire d'administration d'une séance
	  ERROR_NB_PLACE : "Le nombre d'inscription demandé est supérieur au nombre autorisé pour la séance!"
	}
	
};
