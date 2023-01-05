import DefaultIcon from './Default.svg';
import ExcelIcon from './Excel.svg';
import MovieIcon from './Movie.svg';
import PDFIcon from './PDF.svg';
import PictureIcon from './Picture.svg';
import TextIcon from './Text.svg';
import ZipIcon from './Zip.svg';

export const getFileIcon = (extension: string) => {
	if (extension === null || extension === undefined) {
		return null;
	}

	const formatedExtension = extension.replace('.', '').toLowerCase();

	switch (formatedExtension) {
		// Excel
		case 'csv':
		case 'xls':
		case 'xlsx':
			return ExcelIcon;
		// Vidéo
		case 'mp4':
		case 'avi':
			return MovieIcon;
		case 'pdf':
			return PDFIcon;
		// Image
		case 'bmp':
		case 'gif':
		case 'jpeg':
		case 'jpg':
		case 'png':
			return PictureIcon;
		// Texte
		case 'doc':
		case 'docx':
		case 'txt':
			return TextIcon;
		case 'zip':
			return ZipIcon;
		default:
			return DefaultIcon;
	}
};