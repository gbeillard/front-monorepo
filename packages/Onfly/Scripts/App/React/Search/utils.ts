import { ContentManagementLibrary } from '../../Reducers/BimObject/types';
import OCResources from './resources';

export const createSearchResources = (resources: any, type: 'objects' | 'files') => ({
  ...OCResources,
  Search: {
    Sorting: resources?.SearchResults?.SortByText,
    SortByCreatedAtOption: resources?.ContentSearch?.SortCreated,
    SortByLastUpdateOption: resources?.ContentSearch?.SortModified,
    SortByNameOption: resources?.ContentSearch?.SortAlpha,
    SortBySizeOption: resources?.ContentSearch?.SortSize,
    SortByRelevance: resources?.ContentSearch?.SortRelevance,
    SortAscending: resources?.ContentSearch?.SortOrderAsc,
    SortDescending: resources?.ContentSearch?.SortOrderDesc,
    SearchPlaceholder: resources?.ContentSearch?.SearchPlaceholder,
    Filters: resources?.SearchResults?.Filters,
    Navigation: resources?.SearchResults?.Navigation,
    FileCard: {
      CreationDate: resources?.BimObjectDetailsInfos?.CreationDateLabel,
      UpdateDate: resources?.BimObjectDetailsInfos?.UpdateDateLabel,
      AddFavoriteTooltip: resources?.ContentManagementCollections?.AddLinkedObjectToFavorite,
      RemoveFavoriteTooltip: resources?.ContentManagementCollections?.RemoveLinkedObjectToFavorite,
    },
    EntityRow: {
      CreatedBy: resources?.BimObjectDetailsInfos?.CreationByLabel,
      UpdatedBy: resources?.BimObjectDetailsInfos?.UpdatedByLabel,
    },
    TooltipFilterBtnNoFilter: resources?.ContentSearch?.TooltipFilterBtnNoFilter,
    TooltipFilterBtnFilter: resources?.ContentSearch?.TooltipFilterBtnFilter,
  },
  Filters: {
    CounterLabel:
      type === 'files'
        ? resources?.ContentSearch?.CounterLabel
        : resources?.ContentSearch?.CounterLabelObjects,
    SubmitFilters: resources.MetaResource?.Submit,
    SoftwaresLabel: resources?.ContentSearchFilter?.SoftwareLabel,
    SoftwaresPlaceholder: resources?.ContentSearchFilter?.SoftwarePlaceholder,
    UboKindsLabel: resources?.ContentSearchFilter?.ContentTypeLabel,
    UboKindsPlaceholder: resources?.ContentSearchFilter?.SoftwareLabel,
    ContentTypeLabel: resources?.ContentSearchFilter?.ContentTypeLabel,
    ContentTypePlaceholder: resources?.ContentSearchFilter?.ContentTypePlaceholder,
    LodsLabel: resources?.ContentSearchFilter?.LODLabel,
    LodsPlaceholder: resources?.ContentSearchFilter?.LODPlaceholder,
    TagsLabel: resources?.ContentSearchFilter?.TagLabel,
    TagsPlaceholder: resources?.ContentSearchFilter?.TagPlaceholder,
    ParametersLabel: resources?.ContentSearchFilter?.ParameterLabel,
    ParametersPlaceholder: resources?.ContentSearchFilter?.ParameterPlaceholder,
    GroupsLabel: resources?.SearchResults?.GroupsFilterLabel,
    GroupsPlaceholder: resources?.SearchResults?.GroupsFilterPlaceholder,
    GroupsTypeProject: resources?.ContentManagement?.GroupeTypeProject,
    GroupsTypeCollection: resources?.ContentManagement?.GroupeTypeCollection,
    ManufacturersLabel: resources?.SearchResults?.ManufacturersLabel,
    ManufacturersPlaceholder: resources?.SearchResults?.ManufacturersPlaceholder,
    CountriesLabel: resources?.SearchResults?.CountriesLabel,
    CountriesPlaceholder: resources?.SearchResults?.CountriesPlaceholder,
    PropertiesLabel: resources?.SearchResults?.PropertiesLabel,
    SpacesLabel: resources?.ContentManager?.SpacesLabel,
    ClassificationsLabel: resources?.SearchResults?.ClassificationsLabel,
    PropertiesPlaceholder: resources?.SearchResults?.PropertiesPlaceholder,
    CatalogsIdLabel: resources?.SearchResults?.CatalogsIdLabel,
    CatalogsIdPlaceholder: resources?.SearchResults?.CatalogsIdPlaceholder,
  },
  SearchResults: {
    NoResults: resources?.MetaResource?.NoResult,
    ResetFilters: resources?.SearchResults?.FiltersReset,
    NoOptions: resources?.MetaResource?.NoResultFound,
    Loading: resources?.MetaResource?.Loading,
  },
  FilesDownloader: {
    Document: resources?.MediaType?.Document,
    Model3D: resources?.MediaType?.Model3D,
    Model2D: resources?.MediaType?.Model2D,
    FileName: resources?.BimObjectDetailsModels?.FileNameLabel,
    Type: resources?.BimObjectDetailsDocuments?.TypeLabel,
    Size: resources?.BimObjectDetailsModels?.SizeLabel,
    LevelOfDetail: resources?.BimObjectDetailsModels?.LevelOfDetailLabel,
    Download: resources?.BimObjectDetailsModels?.DownloadLabel,
    EmptyTitle: resources?.ContentSearchInspect?.EmptyStateFileTitle,
    EmptyDescription: resources?.ContentSearchInspect?.EmptyStateFilesDescription,
  },
  SmartDownload: {
    SetsAndProperties: resources?.SmartDownload?.SetsAndProperties,
    Summary: resources?.SmartDownload?.Summary,
    Variants: resources?.SmartDownload?.Variants,
    Models: resources?.SmartDownload?.Models,
    CurrentSelection: resources?.SmartDownload?.CurrentSelection,
    DownloadButton: resources?.SmartDownload?.DownloadButton,
    ValidateSelection: resources?.SmartDownload?.ValidateSelection,
    ConfigureObject: resources?.SmartDownload?.ConfigureObject,
    SelectAll: resources?.SmartDownload?.SelectAll,
    IdentificationData: resources?.SmartDownload?.IdentificationData,
    DataOnly: resources?.SmartDownload?.DataOnly,
    Sets: resources?.SmartDownload?.Sets,
    Properties: resources?.SmartDownload?.Properties,
  },
  Inspector: {
    CreatedAtLabel: resources?.ContentSearch?.CreationDate,
    UpdatedAtLabel: resources?.ContentSearch?.UpdateDate,
    DownloadButton: resources?.ContentSearchInspect?.Download,
    PreviewButton: resources?.ContentSearchInspect?.Preview,
    SeeMoreButton: resources?.ContentSearchInspect?.SeeMore,
    SeeLessButton: resources?.ContentSearchInspect?.SeeLess,
    ObjectTitle: resources?.ContentSearchInspect?.ObjectLinkLabel,
    PinsTitle: resources?.ContentSearchFilter?.TagLabel,
    ParametersTitle: resources?.ContentSearchFilter?.ParameterLabel,
    ParameterFieldName: resources?.ContentSearchInspect?.ParameterName,
    ParameterFieldValue: resources?.ContentSearchInspect?.ParameterValue,
    FamilyParam: resources?.ContentSearchInspect?.FamilyParam,
    SharedParam: resources?.ContentSearchInspect?.SharedParam,
    RevitBuiltinParam: resources?.ContentSearchInspect?.RevitBuiltinParam,
    TypeParam: resources?.ContentSearchInspect?.TypeParam,
    InstanceParam: resources?.ContentSearchInspect?.InstanceParam,
    FormulaParam: resources?.ContentSearchInspect?.FormulaParam,
    MappedParam: resources?.ContentSearchInspect?.MappedParam,
    EmptyStateTitle: resources?.ContentSearchInspect?.EmptyStateTitle,
    EmptyStateDescription: resources?.ContentSearchInspect?.EmptyStateDescription,
    TooltipGoToObject: resources?.ContentSearchInspect?.TooltipGoToObject,
    DefaultParametersGroupName: resources?.MetaResource?.Other,
    TagsTitle: resources?.ContentSearchInspect?.TagsTitle,
    Subsets: resources?.ContentSearchInspect?.Subsets,
    PropertiesTitle: resources?.ContentSearchInspect?.PropertiesTitle,
    FilesTitle: resources?.ContentSearchInspect?.FilesTitle,
    InformationsTitle: resources?.ContentSearchInspect?.InformationsTitle,
    EmptyStatePropertyTitle: resources?.ContentSearchInspect?.EmptyStatePropertyTitle,
    EmptyStatePropertyDescription: resources?.ContentSearchInspect?.EmptyStatePropertyDescription,
    EmptyStateFileTitle: resources?.ContentSearchInspect?.EmptyStateFileTitle,
    EmptyStateFilesDescription: resources?.ContentSearchInspect?.EmptyStateFilesDescription,
    Distribution: resources?.ContentSearchInspect?.Distribution,
    NoCountriesFound: resources?.ContentSearchInspect?.NoCountriesFound,
    Link: resources?.ContentSearchInspect?.Link,
    TooltipEdit: resources?.ContentManagement?.TooltipEdit,
    AddFavoriteTooltip: resources?.BimObjectDetails?.AddToFavorite,
    RemoveFavoriteTooltip: resources?.BimObjectDetails?.RemoveFromFavorite
  },
  Libraries: {
    LibrariesPlaceholder: resources?.ContentManagement?.SelectLibraries,
    MyLibrary: resources?.ContentManagement?.MyLibrary,
    MyOnflyLibrary: resources?.ContentManagement?.MyOnflyLibrary,
    MyEntityLibrary: resources?.ContentManagement?.MyEntityLibrary,
    BimAndCoLibrary: resources?.ContentManagement?.BimAndCoLibrary,
    AllSpaces: resources?.ContentManagement?.AllSpaces,
  },
  Objects: {
    ConfigureButton: resources?.ContentSearch?.Configure,
  },
  Preview: {
    VariantsFilterPlaceholder: resources?.ContentSearchInspect?.Preview,
    PreviewVariantsDefaultOption: resources?.ContentPreview?.ThumbnailLabel,
  },
  ClassificationsModal: {
    ClassificationsPlaceholder: resources?.ClassificationsModal?.ClassificationPlaceholder,
    SearchPlaceholder: resources?.ClassificationsModal?.SearchPlaceholder,
    NoResults: resources?.ClassificationsModal?.NoResults,
  },
  FreeTrial: {
    Title: resources?.FreeTrial?.Title,
    Close: resources?.FreeTrial?.Close,
    Next: resources?.FreeTrial?.Next,
    Finish: resources?.FreeTrial?.Finish,
    CheckboxLabel: resources?.FreeTrial?.CheckboxLabel,
    Description: resources?.FreeTrial?.Description,
    DescriptionBold: resources?.FreeTrial?.DescriptionBold,
    Link: resources?.FreeTrial?.Link,
    TextLink: resources?.FreeTrial?.TextLink,
    DownloadTitle: resources?.FreeTrial?.DownloadTitle,
    DownloadTextFirst: resources?.FreeTrial?.DownloadTextFirst,
    DownloadTextSecond: resources?.FreeTrial?.DownloadTextSecond,
    UploadTitle: resources?.FreeTrial?.UploadTitle,
    UploadTextFirst: resources?.FreeTrial?.UploadTextFirst,
    UploadTextSecond: resources?.FreeTrial?.UploadTextSecond,
    InviteTitle: resources?.FreeTrial?.InviteTitle,
    InviteTextFirst: resources?.FreeTrial?.InviteTextFirst,
    InviteTextSecond: resources?.FreeTrial?.InviteTextSecond,
    DownloadPlugin: resources?.ContentManagement?.DownloadAppButton,
  },
});

export const createLibrary = (libraryName: ContentManagementLibrary) => ({
  Name: libraryName,
});

export const getCustomFilters = (isPlugin, pluginData, softwares) => {
  const customFilters = {
    must: [],
    mustNot: [],
    forceContentTypeDisplay: false,
    forceAggregateFilter: false,
  };

  if (isPlugin && pluginData?.software && softwares?.length > 0) {
    customFilters.forceContentTypeDisplay = true;
    const pluginSoftwares = softwares
      .filter((software) => software.Name.toLowerCase() === pluginData?.software?.toLowerCase())
      .map((software) => ({
        id: software.Id,
        version: parseInt(software.Version as string),
      }));

    // Must
    const mustSoftwares = pluginSoftwares
      .filter((software) => parseInt(pluginData?.softwareVersion as string) >= software.version)
      .map((software) => software.id.toString());

    if (mustSoftwares.length > 0) {
      customFilters.must.push({ property: 'File_Software.Id', values: mustSoftwares });
    }

    // Must not
    const filteredSoftwares = pluginSoftwares
      .filter((software) => parseInt(pluginData?.softwareVersion as string) < software.version)
      .map((software) => software.id.toString());
    if (filteredSoftwares.length > 0) {
      customFilters.mustNot.push({ property: 'File_Software.Id', values: filteredSoftwares });
    }
  }
  return customFilters;
};

export const isButtonFavoriteVisible = (object: any, role?: any) =>
  role?.key !== 'partner' &&
  object?.IsOnManagementCloud &&
  (object.Status === 'published' || role?.key !== 'member');
