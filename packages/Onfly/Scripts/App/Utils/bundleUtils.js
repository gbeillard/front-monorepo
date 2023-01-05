/* eslint-disable @typescript-eslint/no-unsafe-argument */
import _ from 'underscore';

export function getXmlDocFromBundle(text) {
  const parser = new DOMParser();
  return parser.parseFromString(text, 'text/xml');
}

export function getBundleFromXmlDoc(xmlDoc) {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
}

// Get Variants of a bundle
export function getVariantsFromBundle(xmlDoc) {
  const variants = [];

  const variantsList = xmlDoc.getElementsByTagName('Variant');

  for (let j = 0; j < variantsList.length; j++) {
    const variantName = variantsList[j].getAttribute('Name');
    variants.push({ Name: variantName, Checked: true });
  }

  return variants;
}

// Get Classifications of a bundle
export function getClassificationsFromBundle(xmlDoc) {
  const classifications = [];

  const classificationsList = xmlDoc.getElementsByTagName('Classification');

  for (let j = 0; j < classificationsList.length; j++) {
    // classificationId
    const classificationId = classificationsList[j].getAttribute('Id');

    // classificationName
    let classificationName = '';
    if (classificationsList[j].getElementsByTagName('Name').length > 0) {
      classificationName = classificationsList[j].getElementsByTagName('Name')[0].TextContent;
    }

    // nodeName
    let nodeName = '';
    if (classificationsList[j].getElementsByTagName('NodeName').length > 0) {
      nodeName = classificationsList[j].getElementsByTagName('NodeName')[0].TextContent;
    }

    // nodeId
    const nodeId = '';
    if (classificationsList[j].getElementsByTagName('NodeId').length > 0) {
      nodeName = classificationsList[j].getElementsByTagName('NodeId')[0].TextContent;
    }

    classifications.push({
      ClassificationName: classificationName,
      ClassificationId: classificationId,
      Id: nodeId,
      NodeName: nodeName,
    });
  }

  return classifications;
}

// Get All properties of a bundle array
export function getPropertiesFromBundleArray(xmlDocs) {
  const properties = [];

  for (let i = 0; i < xmlDocs.length; i++) {
    const doc = xmlDocs[i];

    const objectId = doc.getElementsByTagName('BimObject')[0].getAttribute('CaoObjectId');
    const bimobjectId = doc.getElementsByTagName('BimObject')[0].getAttribute('Id');
    let modelId;
    let fileName = '';
    if (doc.getElementsByTagName('Model').length > 0) {
      fileName = doc.getElementsByTagName('Model')[0].getElementsByTagName('Name')[0].textContent;
      if (
        bimobjectId > 0 &&
        doc.getElementsByTagName('Model')[0].getElementsByTagName('Id').length > 0
      ) {
        modelId = doc.getElementsByTagName('Model')[0].getElementsByTagName('Id')[0].textContent;
      }
    }

    const propertiesList = doc.getElementsByTagName('PropertyData');

    for (let j = 0; j < propertiesList.length; j++) {
      if (propertiesList[j].getElementsByTagName('Name').length > 0) {
        const propToFind = {
          Id: propertiesList[j].getElementsByTagName('CAD_MappingKey')[0].textContent,
          Name: propertiesList[j].getElementsByTagName('Name')[0].textContent,
          CAD_MappingKey: propertiesList[j].getElementsByTagName('CAD_MappingKey')[0].textContent,
          CAD_ParameterTypeName:
            propertiesList[j].getElementsByTagName('CAD_ParameterTypeName')[0].textContent,
          DataTypeName:
            propertiesList[j].getElementsByTagName('CAD_ParameterTypeName')[0].textContent,
          CAD_ParameterGroup:
            propertiesList[j].getElementsByTagName('CAD_ParameterGroup')[0].textContent,
        };

        if (
          propToFind.DataTypeName.toUpperCase() !== 'MATERIAL' &&
          propToFind.DataTypeName.toUpperCase() !== 'INVALID' &&
          propToFind.DataTypeName.toUpperCase() !== 'IMAGE'
        ) {
          if (xmlDocs.length === 1) {
            propToFind.CAD_DisplayValue =
              propertiesList[j].getElementsByTagName('CAD_DisplayValue')[0].textContent;
            if (propToFind.CAD_DisplayValue == null || propToFind.CAD_DisplayValue == '') {
              propToFind.CAD_DisplayValue =
                propertiesList[j].getElementsByTagName('CAD_Value')[0].textContent;
            }
          }

          if (
            propToFind.Name !== 'BC_OBJECT_VERSION' &&
            propToFind.Name !== 'BC_OBJECT_ID' &&
            propToFind.Name !== 'BC_MODEL_ID' &&
            propToFind.Name !== 'BC_VARIANT_ID'
          ) {
            const propFind = _.find(
              properties,
              (prop) =>
                prop.Name === propToFind.Name &&
                prop.CAD_MappingKey === propToFind.CAD_MappingKey &&
                prop.CAD_ParameterTypeName === propToFind.CAD_ParameterTypeName
            );

            if (propToFind.CAD_Objects == null) {
              propToFind.CAD_Objects = [];
            }

            propToFind.CAD_Objects.push({
              CaoObjectId: objectId,
              BimObjectId: bimobjectId,
              ModelFileName: fileName,
              ModelId: modelId,
            });

            if (propFind == null) {
              properties.push(propToFind);
            }
          }
        }
      }
    }
  }

  let index = 0;
  const domains = _.chain(properties)
    .groupBy((value) => value.CAD_ParameterGroup)
    .map((value, name) => ({ Id: index++, Name: name, PropertyList: value }))
    .sortBy('CAD_ParameterGroup')
    .value();
  return domains;
}

// Get All properties of a bundle
export function getPropertiesFromBundle(doc) {
  const properties = [];
  const propertiesList = doc.getElementsByTagName('Property');

  for (let j = 0; j < propertiesList.length; j++) {
    if (propertiesList[j].getElementsByTagName('Name').length > 0) {
      const propToFind = {
        Name: propertiesList[j].getElementsByTagName('Name')[0].textContent,
        IsEditable: propertiesList[j].getAttribute('IsReadOnly') === 'true',
        CaoParameterGroup:
          propertiesList[j].getElementsByTagName('CAD_ParameterGroup').length &&
          propertiesList[j].getElementsByTagName('CAD_ParameterGroup')[0].textContent,
        CaoParameterTypeName: propertiesList[j].getElementsByTagName('CAD_ParameterTypeName').length
          ? propertiesList[j].getElementsByTagName('CAD_ParameterTypeName')[0].textContent
          : '',
        DataType: propertiesList[j].getElementsByTagName('DataTypeCode')[0].textContent,
        CaoMappingKey: propertiesList[j].getElementsByTagName('CAD_MappingKey')[0].textContent,
        CaoPlatformSpecificData: {
          CAD_ParameterType:
            propertiesList[j].getElementsByTagName('CAD_ParameterType')[0].textContent,
          CAD_MappingType: propertiesList[j].getElementsByTagName('CAD_MappingType')[0].textContent,
        },
      };
      properties.push(propToFind);
    }
  }
  return properties;
}

// Get All objects information from bundle array
export function getObjectsFromBundleArray(xmlDocs) {
  const objects = [];

  for (let i = 0; i < xmlDocs.length; i++) {
    const doc = xmlDocs[i];

    const object = doc.getElementsByTagName('BimObject')[0];
    const definitions = object.getElementsByTagName('Definition');
    const name =
      definitions.length > 0 ? definitions[0].getElementsByTagName('Name')[0].textContent : null;
    const language =
      definitions.length > 0
        ? definitions[0].getElementsByTagName('LanguageCode')[0].textContent
        : null;
    const photos = object.getElementsByTagName('Photo');
    const photo =
      photos.length > 0 ? photos[0].getElementsByTagName('Content')[0].textContent : null;
    const objectId = object.getAttribute('Id');
    const caoId = object.getAttribute('CaoId');
    const caoObjectId = object.getAttribute('CaoObjectId');
    const caoDocumentId = object.getAttribute('CaoDocumentId');
    const caoClassification = object.getAttribute('CaoClassification');

    const variants = getVariantsFromBundle(doc);
    const classificationNodes = getClassificationsFromBundle(doc);

    objects.push({
      Id: objectId,
      CaoObjectId: caoObjectId,
      CaoDocumentId: caoDocumentId,
      CaoId: caoId,
      CaoClassification: caoClassification,
      Name: name,
      LanguageCode: language,
      Image: photo,
      Variants: variants,
      ClassificationNodes: classificationNodes,
    });
  }
  return objects;
}

// set ModelData to Bundle
export function setModelDataToBundle(
  objects,
  mappingConnected,
  selectedGroups,
  onflyUpload,
  platformUpload,
  xmlDocs
) {
  for (let i = 0; i < xmlDocs.length; i++) {
    const doc = xmlDocs[i];

    const objectXml = doc.getElementsByTagName('BimObject')[0];
    const objectIdXml = objectXml.getAttribute('Id');
    const caoIdXml = objectXml.getAttribute('CaoId');
    const caoObjectIdXml = objectXml.getAttribute('CaoObjectId');
    const caoDocumentIdXml = objectXml.getAttribute('CaoDocumentId');

    for (let j = 0; j < objects.length; j++) {
      const objectIdModel = objects[j].Id;
      const caoIdModel = objects[j].CaoId;
      const caoObjectIdModel = objects[j].CaoObjectId;
      const caoDocumentIdModel = objects[j].CaoDocumentId;

      if (
        objectIdModel === objectIdXml &&
        caoIdXml === caoIdModel &&
        caoObjectIdXml === caoObjectIdModel &&
        caoDocumentIdModel === caoDocumentIdXml
      ) {
        // platform
        const platformTag = doc.createElement('PublicPlateform');
        platformTag.setAttribute('include', platformUpload);
        objectXml.appendChild(platformTag);

        // classification nodes
        let classificationsBalise = doc.getElementsByTagName('Classifications');
        if (classificationsBalise.length !== 0) {
          objectXml.removeChild(classificationsBalise[0]);
        }
        objectXml.appendChild(doc.createElement('Classifications'));
        classificationsBalise = doc.getElementsByTagName('Classifications')[0];

        if (objects[j].ClassificationNodes != null) {
          for (let c = 0; c < objects[j].ClassificationNodes.length; c++) {
            const nodeModel = objects[j].ClassificationNodes[c];

            // classficationId
            const nodeXml = doc.createElement('Classification');
            nodeXml.setAttribute('Id', nodeModel.ClassificationId.toString());
            // nodeId
            const nodeIdXml = doc.createElement('NodeId');
            nodeIdXml.appendChild(doc.createTextNode(nodeModel.Id.toString()));
            nodeXml.appendChild(nodeIdXml);
            // nodeName
            const nodeNameXml = doc.createElement('NodeName');
            nodeNameXml.appendChild(doc.createTextNode(nodeModel.NodeName.toString()));
            nodeXml.appendChild(nodeNameXml);
            // classficationName
            const classificationNameXml = doc.createElement('Name');
            classificationNameXml.appendChild(
              doc.createTextNode(nodeModel.ClassificationName.toString())
            );
            nodeXml.appendChild(classificationNameXml);

            classificationsBalise.appendChild(nodeXml);
          }
        }

        // variants
        const variantsElem = doc.getElementsByTagName('Variants')[0];
        const variantsList = variantsElem.getElementsByTagName('Variant');
        for (let v = 0; v < objects[j].Variants.length; v++) {
          if (objects[j].Variants[v].Checked == false) {
            for (let w = 0; w < variantsList.length; w++) {
              if (variantsList[w].getAttribute('Name') == objects[j].Variants[v].Name) {
                variantsElem.removeChild(variantsList[w]);
              }
            }
          }
        }

        // properties
        const propertiesList = doc.getElementsByTagName('PropertyData');
        for (let p = 0; p < propertiesList.length; p++) {
          const propertyElement = propertiesList[p];
          const propertyKeys = propertyElement.getElementsByTagName('CAD_MappingKey');
          if (propertyKeys.length > 0) {
            const propertyKey = propertyKeys[0].textContent;
            for (let q = 0; q < mappingConnected.length; q++) {
              const propFind = _.find(
                mappingConnected[q].PropertyList,
                (item) => item.PropertyMappingConnected.CAD_MappingKey == propertyKey
              );

              if (propFind != null) {
                if (propertyElement.getElementsByTagName('PropertyId').length > 0) {
                  if (propertyElement.getElementsByTagName('PropertyId')[0].childNodes.length > 0) {
                    propertyElement
                      .getElementsByTagName('PropertyId')[0]
                      .removeChild(
                        propertyElement.getElementsByTagName('PropertyId')[0].childNodes[0]
                      );
                  }
                  propertyElement
                    .getElementsByTagName('PropertyId')[0]
                    .appendChild(doc.createTextNode(propFind.Id));
                } else {
                  const newElem = doc.createElement('PropertyId');
                  newElem.appendChild(doc.createTextNode(propFind.Id));
                  propertyElement.appendChild(newElem);
                }
                // for compatibility with previous plugin version
                if (propertyElement.getElementsByTagName('PropertyCode').length > 0) {
                  if (
                    propertyElement.getElementsByTagName('PropertyCode')[0].childNodes.length > 0
                  ) {
                    propertyElement
                      .getElementsByTagName('PropertyCode')[0]
                      .removeChild(
                        propertyElement.getElementsByTagName('PropertyCode')[0].childNodes[0]
                      );
                  }
                  propertyElement
                    .getElementsByTagName('PropertyCode')[0]
                    .appendChild(doc.createTextNode(propFind.PropertyCode));
                } else {
                  const newElem = doc.createElement('PropertyCode');
                  newElem.appendChild(doc.createTextNode(propFind.PropertyCode));
                  propertyElement.appendChild(newElem);
                }

                break;
              }
            }
          }
        }
      }
    }
  }

  return xmlDocs;
}

export function getManagementCloudIdFromBundle(xmlDocs) {
  for (let i = 0; i < xmlDocs.length; i++) {
    const xmlDoc = xmlDocs[i];
    const contentManagementList = xmlDoc.getElementsByTagName('ContentManagement');

    if (contentManagementList.length > 0) {
      if (contentManagementList[0].getElementsByTagName('Id').length > 0) {
        return contentManagementList[0].getElementsByTagName('Id')[0].TextContent;
      }
    }
  }

  return null;
}
