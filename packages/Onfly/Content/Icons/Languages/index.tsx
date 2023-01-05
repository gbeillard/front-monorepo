import Multilingual from './Multilingual.svg';

import Dutch from './Dutch.svg';
import English from './English.svg';
import French from './French.svg';
import German from './German.svg';
import Italian from './Italian.svg';
import Portuguese from './Portuguese.svg';
import Spanish from './Spanish.svg';

export const getLanguageIcon = (languageCode: string) => {
	if (languageCode === null || languageCode === undefined) {
		return Multilingual;
	}

	const formatedLanguageCode = languageCode.toLowerCase();

	switch (formatedLanguageCode) {
		case 'nl':
			return Dutch;
		case 'en':
			return English;
		case 'fr':
			return French;
		case 'de':
			return German;
		case 'it':
			return Italian;
		case 'pt':
			return Portuguese;
		case 'es':
			return Spanish;
		default:
			return Multilingual;
	}
};