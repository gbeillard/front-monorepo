import React from 'react';

// material UI imports
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

// other
import PropertiesImportViewListCheckBox from './PropertiesImportViewListCheckBox.jsx';
import PropertiesImportViewListInfo from './PropertiesImportViewListInfo.jsx';
import * as TableColumn from './PropertiesTableList.tsx';

export default function PropertiesImportViewListDetails({
  resources,
  currentPreviewData,
  language,
  domains,
  units,
  openEditImportLine,
  actionCheckDataImport,
  showCheck,
}) {
  const mapedExcelTemplateViewer =
    currentPreviewData === null
      ? []
      : currentPreviewData.map((property) => {
        const currentTranslateIndex = property.PropertyLangs.findIndex(
          (id) => id.LangCode.toLowerCase() === language.toLowerCase()
        );
        const emptyCell = (
          <span className="empty-cell">{resources.ContentManagement.ToBeDefined}</span>
        );

        // currentLang
        let currentTranslate =
          property.PropertyLangs[currentTranslateIndex] != null
            ? property.PropertyLangs[currentTranslateIndex].LangName
            : '';
        if (currentTranslate === '') {
          const defaultLang = property.PropertyLangs.findIndex(
            (id) => id.LangCode.toLowerCase() === 'en'
          );
          currentTranslate =
            property.PropertyLangs[defaultLang] != null
              ? property.PropertyLangs[defaultLang].LangName
              : null;
        }

        // domain
        const currentDomainId = property.PropertyDomainCode;
        const currentDomainIndex = domains.findIndex((id) => id.DomainId === currentDomainId);
        const currentDomainValue =
          currentDomainIndex > -1 ? domains[currentDomainIndex].DomainName : emptyCell;

        // unit
        const currentUnitId = property.PropertyUnitCode;
        const currentUnitIndex = units.findIndex((id) => id.Id === currentUnitId);
        const currentUnitValue = currentUnitIndex > -1 ? units[currentUnitIndex].FormatName : '';

        const alreadyExists = property.IsGuidExists || property.IsNameExists;
        const cursor = alreadyExists ? 'initial' : 'pointer';
        const onClickHandler = () => {
          if (alreadyExists) {
            return;
          }
          openEditImportLine(property.PropertyLineId);
        };

        return (
          <TableRow
            key={property.PropertyLineId}
            id={property.PropertyLineId}
            hover={!alreadyExists}
          >
            <TableColumn.CheckColumn id={property.PropertyLineId}>
              <PropertiesImportViewListCheckBox
                isGuidOrNameCheck={property.IsGuidExists || property.IsNameExists}
                property={property}
                actionCheckDataImport={actionCheckDataImport}
              />
            </TableColumn.CheckColumn>

            <TableColumn.NameColumn
              style={{ cursor }}
              data-lineid={property.PropertyLineId}
              onClick={onClickHandler}
            >
              {currentTranslate}
            </TableColumn.NameColumn>

            <TableColumn.DomainColumn
              style={{ cursor }}
              data-lineid={property.PropertyLineId}
              onClick={onClickHandler}
            >
              {currentDomainValue}
            </TableColumn.DomainColumn>

            <TableColumn.UnitColumn
              style={{ cursor }}
              data-lineid={property.PropertyLineId}
              onClick={onClickHandler}
            >
              {currentUnitValue}
            </TableColumn.UnitColumn>

            <TableColumn.AlertColumn>
              <PropertiesImportViewListInfo
                property={property}
                showCheck={showCheck}
                resources={resources}
              />
            </TableColumn.AlertColumn>
          </TableRow>
        );
      });

  return <TableBody id="dico-properties-body">{mapedExcelTemplateViewer}</TableBody>;
}