/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React from 'react';
import { Button } from '@bim-co/componentui-foundation';

// material UI imports
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import DialogTitle from '../../../components/dialogs/DialogTitle';
import DialogContent from '../../../components/dialogs/DialogContent';
import DialogActions from '../../../components/dialogs/DialogActions';

// other
import PropertiesImportViewListDetails from './PropertiesImportViewListDetails.jsx';
import * as TableColumn from './PropertiesTableList.tsx';

export default function PropertiesImportViewList({
  resources,
  closePropertiesImportViewList,
  currentPreviewData,
  actionCheckAllImport,
  currentFileName,
  validateTemplateData,
  language,
  domains,
  units,
  openEditImportLine,
  actionCheckDataImport,
  showChecks = true,
}) {
  const errorCount =
    currentPreviewData !== null
      ? currentPreviewData.filter((id) => id.IsOk === false && id.PropertyIsChecked === true).length
      : 0;
  const hasError = errorCount > 0;

  const isCheckedAll =
    currentPreviewData !== null
      ? currentPreviewData.filter((id) => id.PropertyIsChecked === true).length +
      currentPreviewData.filter((id) => id.IsNameExists === true || id.IsGuidExists).length ===
      currentPreviewData.length
      : false;

  const isValid =
    errorCount === 0 &&
    currentPreviewData !== null &&
    currentPreviewData.filter((id) => id.PropertyIsChecked === true).length > 0;
  return (
    <>
      <DialogTitle>{currentFileName}</DialogTitle>
      <DialogContent>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableColumn.CheckColumn className="domain-table-column-head">
                  <Checkbox
                    checked={isCheckedAll}
                    onChange={actionCheckAllImport}
                    tabIndex={-1}
                    className="general-checkbox"
                  />
                </TableColumn.CheckColumn>

                <TableColumn.NameColumn className="domain-table-column-head">
                  {resources.ContentManagement.PropertiesExcelTemplateName}
                </TableColumn.NameColumn>

                <TableColumn.DomainColumn className="domain-table-column-head">
                  {resources.ContentManagement.PropertiesExcelTemplateDomain}
                </TableColumn.DomainColumn>

                <TableColumn.UnitColumn className="domain-table-column-head">
                  {resources.ContentManagement.PropertiesExcelTemplateUnit}
                </TableColumn.UnitColumn>

                <TableColumn.AlertColumn />
              </TableRow>
            </TableHead>
          </Table>
          <div>
            <Table>
              <PropertiesImportViewListDetails
                resources={resources}
                currentPreviewData={currentPreviewData}
                language={language}
                domains={domains}
                units={units}
                openEditImportLine={openEditImportLine}
                actionCheckDataImport={actionCheckDataImport}
                showCheck={showChecks}
              />
            </Table>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Grid container wrap="nowrap" spacing={1}>
          <Grid item>{hasError && <ErrorIcon />}</Grid>
          <Grid item xs>
            {hasError && (
              <Typography>
                {resources.ManageClassifications.PropertiesTemplateAddErrorMessage.replace(
                  'X',
                  errorCount
                )}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Button onClick={closePropertiesImportViewList}>{resources.MetaResource.Cancel}</Button>
          </Grid>
          <Grid item>
            <Button variant="primary" onClick={validateTemplateData} disabled={!isValid}>
              {resources.MetaResource.Confirm}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
}