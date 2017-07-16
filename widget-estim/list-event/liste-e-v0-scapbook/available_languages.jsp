










AUI.add(
	'portal-available-languages',
	function(A) {
		var available = {};

		var direction = {};

		

			available['ca_ES'] = 'catalan (Espagne)';
			direction['ca_ES'] = 'ltr';

		

			available['zh_CN'] = 'chinois (Chine)';
			direction['zh_CN'] = 'ltr';

		

			available['en_US'] = 'anglais (Etats-Unis)';
			direction['en_US'] = 'ltr';

		

			available['fi_FI'] = 'finnois (Finlande)';
			direction['fi_FI'] = 'ltr';

		

			available['fr_FR'] = 'français (France)';
			direction['fr_FR'] = 'ltr';

		

			available['de_DE'] = 'allemand (Allemagne)';
			direction['de_DE'] = 'ltr';

		

			available['iw_IL'] = 'hébreu (Israël)';
			direction['iw_IL'] = 'rtl';

		

			available['hu_HU'] = 'hongrois (Hongrie)';
			direction['hu_HU'] = 'ltr';

		

			available['ja_JP'] = 'japonais (Japon)';
			direction['ja_JP'] = 'ltr';

		

			available['pt_BR'] = 'portugais (Brésil)';
			direction['pt_BR'] = 'ltr';

		

			available['es_ES'] = 'espagnol (Espagne)';
			direction['es_ES'] = 'ltr';

		

		Liferay.Language.available = available;
		Liferay.Language.direction = direction;
	},
	'',
	{
		requires: ['liferay-language']
	}
);