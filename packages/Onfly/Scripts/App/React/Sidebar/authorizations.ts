export type Authorizations = {
  enableSpace: boolean;
  enableGroupObjects: boolean;
  enableGroupDocuments: boolean;
  enableDocuments: boolean;
  enableContentRequests: boolean;
  enableMessages: boolean;
  enableGroups: boolean;
  search: {
    enableSearch: boolean;
    enableObjects: boolean;
  };
  contents: {
    enableManageContents: boolean;
    enableCollections: boolean;
  };
  dictionary: {
    enableProperties: boolean;
    enableMappings: boolean;
    enableEquivalences: boolean;
    enableRequests: boolean;
    enablePropertiesSets: boolean;
  };
  contactUs: {
    enableCreateBug: boolean;
    enableBugs: boolean;
    enableApiDoc: boolean;
  };
  settings: {
    enableUsers: boolean;
    enablePins: boolean;
    enableSuppliers: boolean;
    enableClassifications: boolean;
    enablePublishingControl: boolean;
    enableMetabase: boolean;
    enablePreferences: boolean;
  };
};

export const globalAuthorizations: {
  admin: Authorizations;
  object_creator: Authorizations;
  validator: Authorizations;
  member: Authorizations;
  partner: Authorizations;
  public_creator: Authorizations;
} = {
  admin: {
    enableSpace: true,
    enableGroupObjects: true,
    enableGroupDocuments: true,
    enableDocuments: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: true,
      enableCollections: true,
    },
    dictionary: {
      enableProperties: true,
      enableMappings: true,
      enableEquivalences: true,
      enableRequests: true,
      enablePropertiesSets: true,
    },
    contactUs: {
      enableCreateBug: true,
      enableBugs: true,
      enableApiDoc: true,
    },
    settings: {
      enableUsers: true,
      enablePins: true,
      enableSuppliers: true,
      enableClassifications: true,
      enablePublishingControl: true,
      enableMetabase: true,
      enablePreferences: true,
    },
  },
  object_creator: {
    enableSpace: true,
    enableGroupObjects: true,
    enableDocuments: true,
    enableGroupDocuments: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: true,
      enableCollections: true,
    },
    dictionary: {
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: true,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableCreateBug: true,
      enableBugs: true,
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableMetabase: false,
      enablePreferences: false,
    },
  },
  validator: {
    enableSpace: true,
    enableGroupObjects: true,
    enableDocuments: true,
    enableGroupDocuments: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: true,
      enableCollections: true,
    },
    dictionary: {
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: true,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableCreateBug: true,
      enableBugs: true,
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableMetabase: false,
      enablePreferences: false,
    },
  },
  member: {
    enableSpace: true,
    enableGroupObjects: true,
    enableDocuments: true,
    enableGroupDocuments: true,
    enableContentRequests: true,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: true,
      enableSearch: true,
    },
    contents: {
      enableManageContents: false,
      enableCollections: false,
    },
    dictionary: {
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: false,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableCreateBug: true,
      enableBugs: true,
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableMetabase: false,
      enablePreferences: false,
    },
  },
  partner: {
    enableSpace: false,
    enableGroupObjects: true,
    enableDocuments: false,
    enableGroupDocuments: true,
    enableContentRequests: false,
    enableMessages: true,
    enableGroups: true,
    search: {
      enableObjects: false,
      enableSearch: false,
    },
    contents: {
      enableManageContents: false,
      enableCollections: false,
    },
    dictionary: {
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: false,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableCreateBug: false,
      enableBugs: false,
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableMetabase: false,
      enablePreferences: false,
    },
  },
  public_creator: {
    enableSpace: false,
    enableGroupObjects: false,
    enableDocuments: false,
    enableGroupDocuments: false,
    enableContentRequests: false,
    enableMessages: false,
    enableGroups: false,
    search: {
      enableObjects: true,
      enableSearch: false,
    },
    contents: {
      enableManageContents: false,
      enableCollections: false,
    },
    dictionary: {
      enableProperties: false,
      enableMappings: false,
      enableEquivalences: false,
      enableRequests: false,
      enablePropertiesSets: false,
    },
    contactUs: {
      enableCreateBug: false,
      enableBugs: false,
      enableApiDoc: false,
    },
    settings: {
      enableUsers: false,
      enablePins: false,
      enableSuppliers: false,
      enableClassifications: false,
      enablePublishingControl: false,
      enableMetabase: false,
      enablePreferences: false,
    },
  },
};
