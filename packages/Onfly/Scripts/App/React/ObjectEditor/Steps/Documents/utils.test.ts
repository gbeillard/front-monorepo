import { getCreateValidation, getEditValidation, getNameValidation } from './utils';
import { DocumentSource, DocumentWrite } from '../../../../Reducers/BimObject/Documents/types';

describe('DocumentDialog utils', () => {
  describe('getNameValidation', () => {
    it('should validate if the name has 3 or more characters', () => {
      const baseDocument: DocumentWrite = {
        FileName: '',
        Name: '',
        Variants: [],
        Subsets: [],
      };
      expect(getNameValidation({ ...baseDocument, Name: 'abc' })).toBe(true);
      expect(getNameValidation({ ...baseDocument, Name: 'abc def' })).toBe(true);
      expect(
        getNameValidation({
          ...baseDocument,
          Name: 'super long document name 123 with special chars é&é&éè-é&çè_çé&çà_',
        })
      ).toBe(true);
    });
    it('should invalidate if the name has less than 3 characters', () => {
      const baseDocument: DocumentWrite = {
        FileName: '',
        Name: '',
        Variants: [],
        Subsets: [],
      };
      expect(getNameValidation({ ...baseDocument, Name: '' })).toBe(false);
      expect(getNameValidation({ ...baseDocument, Name: '12' })).toBe(false);
      expect(getNameValidation({ ...baseDocument, Name: 'à&' })).toBe(false);
    });
  });
  describe('getCreateValidation', () => {
    const invalidDocument: DocumentWrite = {
      FileName: '',
      Name: '',
      Variants: [],
      Subsets: [],
    };
    const validDocument: DocumentWrite = {
      FileName: 'My Link',
      Name: 'My Name',
      File: new File([], 'my file'),
      Variants: [],
      Subsets: [],
    };
    it('should check a valid file document', () => {
      const validation = getCreateValidation(validDocument, DocumentSource.File);
      expect(validation).toEqual({
        name: true,
        file: true,
        isReady: true,
      });
    });
    it('should check an invalid file document', () => {
      const validation = getCreateValidation(invalidDocument, DocumentSource.File);
      expect(validation).toEqual({
        name: false,
        file: false,
        isReady: false,
      });
    });
    it('should check a valid link document', () => {
      const validation = getCreateValidation(validDocument, DocumentSource.Link);
      expect(validation).toEqual({
        name: true,
        link: true,
        isReady: true,
      });
    });
    it('should check an invalid link document', () => {
      const validation = getCreateValidation(invalidDocument, DocumentSource.Link);
      expect(validation).toEqual({
        name: false,
        link: false,
        isReady: false,
      });
    });
  });
  describe('getEditValidation', () => {
    const invalidDocument: DocumentWrite = {
      FileName: '',
      Name: '',
      Variants: [],
      Subsets: [],
    };
    const validDocument: DocumentWrite = {
      FileName: 'My Link',
      Name: 'My Name',
      Variants: [],
      Subsets: [],
    };
    it('should check a valid file document', () => {
      const validation = getEditValidation(validDocument, DocumentSource.File);
      expect(validation).toEqual({
        name: true,
        isReady: true,
      });
    });
    it('should check an invalid file document', () => {
      const validation = getEditValidation(invalidDocument, DocumentSource.File);
      expect(validation).toEqual({
        name: false,
        isReady: false,
      });
    });
    it('should check a valid link document', () => {
      const validation = getEditValidation(validDocument, DocumentSource.Link);
      expect(validation).toEqual({
        name: true,
        link: true,
        isReady: true,
      });
    });
    it('should check an invalid link document', () => {
      const validation = getEditValidation(invalidDocument, DocumentSource.Link);
      expect(validation).toEqual({
        name: false,
        link: false,
        isReady: false,
      });
    });
  });
});