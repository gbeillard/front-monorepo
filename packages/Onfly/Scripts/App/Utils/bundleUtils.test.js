import _ from 'underscore';
import { getXmlDocFromBundle, getPropertiesFromBundleArray } from './bundleUtils.js';

/* eslint-disable max-lines-per-function */
describe('getPropertiesFromBundleArray', () => {
    it('should return properties of each variants only one time', () => {
        const bundle = `<?xml version="1.0"?>
        <Bundle>
            <Version>4</Version>
            <BundleType>Upload</BundleType>
            <BimObject Id="0" CaoId="{930c4184-511b-41ef-8dd0-f2a2fa9e4e2e}" CaoDocumentId="-517337088" CaoObjectId="138096" CaoClassification="OST_Doors">
                <Models>
                    <Model>
                        <Id></Id>
                        <Name>Single-Flush.rfa</Name>
                        <TemporaryModelPath>C:\\Users\\Georges\\AppData\\Roaming\\BimAndCo\\BACEngine\\Exchange\\Revit\\183453.rfa</TemporaryModelPath>
                        <ModelFileIsNeededForUpload>true</ModelFileIsNeededForUpload>
                    </Model>
                </Models>
                <Photos>
                    <Photo>
                        <Name>Photo</Name>
                        <Type>Include</Type>
                        <Content>/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCACAAIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACvD/ABb8W5WtPF2g32gy/ZWjvLC1urSQOQwDRDzVOMAlXYsDwCowTkn3Cvli/s01D4ptZSySpHNqeqhjE+0jEkjA++CAcHIOOQRUVJ8iuaU4qTs/61G+DfGeueG55n8PT3d1otm8RnsZg0lqVfOFWQg/Z2ZmfHI3PjIOMV7l4P8Aihofi25TTis2nayULGwuhgvtALGNx8rrndjoxCk7QBXjj6BrnhTUZr3SWlmtZmxcJGpmju0+7subYY3ghmX5M9Wb5O1Rx4b8URLbTW0Hh7UJMOouLn/iU3BHJZJcF7dj8xVOUCoF6tms6dVSV4u5pUp2eqsfUtFeDaT488Z/D+4TSvEumXupWQJYNdPm8UEqWKS5KTqoP3QcguqllwBXr3hnxZo/i3TlvNJu1kIUGa3YgTW7HI2yJnKnKsPQ4yCRzWyaZg4tG3RRRTEFFFFABRRRQAUUUUAFFFFABXzB/wA1ji/7Cuq/+hy19P18wf8ANY4v+wrqv/octYYj+G/n+TNqHxfd+aPTK53WPBul6qJXSMWtxISzNGoKSNknLxn5WycEnhjj7wroqK8OMpRd4s9RpPc8vH9seD4F06+sbfUNFlcKun3s5ktw3JzaycNBN8zgHAyWYgHbkLZ6Jb+INSN34UuJ9P1mNvk02S6Ftfx5X5vImLbbhABINzFWCJzktk+mSxRzwvDNGskUilXRxkMDwQQeory+Wzt7P4n6RBbxBIofEVkIlHIjDCJiq56Lk9BwO3SvTw2JdV8stzjrUVBc0T1H4XfErVfFGrNoOrwW000dj9sj1C3ynmxhkQb4yMBiWLEggdgor1WvnX4Gf8lDX/sXB/6Njr6Krui7o45pKVkFFFFUSFFFFABRRRQAUUUUAFfMH/NY4v8AsK6r/wChy19P18wf81ji/wCwrqv/AKHLWGI/hv5/kzah8X3fmj0yiiivBPWCvM7/AP5Ktpv/AGMdh/6BFXpleZ3/APyVbTf+xjsP/QIq7MD/ABTnxPwGr8DP+Shr/wBi4P8A0bHX0VXzr8DP+Shr/wBi4P8A0bHX0VXrw2POqfEFFFFUQFFFFABRRRQAUUUUAFfMH/NY4v8AsK6r/wChy19P18wf81ji/wCwrqv/AKHLWGI/hv5/kzah8X3fmj0yiiivBPWCvM7/AP5Ktpv/AGMdh/6BFXpleZ3/APyVbTf+xjsP/QIq7MD/ABTnxPwGr8DP+Shr/wBi4P8A0bHX0VXzr8DP+Shr/wBi4P8A0bHX0VXrw2POqfEFFFFUQFFFFABRRRQAUUUUAFfMH/NY4v8AsK6r/wChy19P18wf81ji/wCwrqv/AKHLWGI/hv5/kzah8X3fmj0yiiivBPWCvM7/AP5Ktpv/AGMdh/6BFXpleZ3/APyVbTf+xjsP/QIq7MD/ABTnxPwGr8DP+Shr/wBi4P8A0bHX0VXzr8DP+Shr/wBi4P8A0bHX0VXrw2POqfEFFFFUQFFFFABRRRQAUUUUAFfMH/NY4v8AsK6r/wChy19P15jrPwk83xePEujanHBIjzT/AGG4hLpJLIDv/eBsorE5+620kkAjCjKtFyg0vP8AI0pSUZXf9aoioqCSd7O/GnalEbO/JIWJ87JiBkmFyAJVxg/LyARuCngT14MoSg7SVj1oyUldBXmd/wD8lW03/sY7D/0CKvTK8zv/APkq2m/9jHYf+gRV1YH+KY4n4DV+Bn/JQ1/7Fwf+jY6+iq+dfgZ/yUNf+xcH/o2OvoqvXhsedU+IKKKKogKKKKACiiigAooooAKKKKAK99YWep2clnf2kF3ayY3wzxiRGwQRlTwcEA/hXD6l4P1LSgZtIlm1O1Bx9hmKeegJ42Ssyqyj5eJPmPzEyMcKfQKKzqUoVFaSLhOUHeLPJLa+gupJYo2ZZ4cebBLG0csWem+NgGXI5GQMjkcV53f/APJVtN/7GOw/9Air6K1vw9Ya/FGLsSpNDuMFzBIUkiJ64I4IyFJVgVJVcqcCvFNd8Ca/pXxL0Wdbe51Ozl1q0uReQW5OyNNiN520YRgFBJ4U5yMcqvLSwrpVOZO6OieIVSFnuVfgZ/yUNf8AsXB/6Njr6KriPC3wy0rwl4quda0+7u2SS0+yRWspUrCm/eQGxkjhAM5IwclsjHb12xVlY5pO7uFFFFMkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==</Content>
                    </Photo>
                </Photos>
                <Definitions>
                    <Definition>
                        <Name>Single-Flush</Name>
                        <LanguageCode>fr</LanguageCode>
                        <Description></Description>
                    </Definition>
                </Definitions>
                <Software>
                    <Name>revit</Name>
                    <Version>2019</Version>
                </Software>
                <Variants>
                    <Variant Id="0" Name="36&quot; x 80&quot;">
                        <Properties>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Door Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Door Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34907</CAD_Value>
                                    <CAD_DisplayValue>Door - Panel</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Opération</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>DOOR_OPERATION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Paramètres IFC</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fonction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FUNCTION_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Type de construction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>CURTAIN_WALL_PANELS_CONSTRUCTION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Frame Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Frame Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34906</CAD_Value>
                                    <CAD_DisplayValue>Door - Frame</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Width</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Width</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.25</CAD_Value>
                                    <CAD_DisplayValue>0' - 3&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_HEIGHT_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fabricant</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MANUFACTURER</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Résistance thermique (R)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_THERMAL_RESISTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_THERMAL_RESISTANCE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Modèle</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MODEL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Epaisseur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_THICKNESS_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.166666666666667</CAD_Value>
                                    <CAD_DisplayValue>0' - 2&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Image du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_IMAGE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>IMAGE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient d'apport thermique solaire</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_SOLAR_HEAT_GAIN_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coût</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_COST</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>CURRENCY</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FURNITURE_WIDTH</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>3</CAD_Value>
                                    <CAD_DisplayValue>3' - 0&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Ext</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Ext</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Transmission de la lumière visible</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_VISUAL_LIGHT_TRANSMITTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Protection contre l'incendie</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FIRE_RATING</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>WINDOW_HEIGHT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>6.66666666666667</CAD_Value>
                                    <CAD_DisplayValue>6' - 8&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Construction analytique</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTIC_CONSTRUCTION_LOOKUP_TABLE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>&lt;Aucun&gt;</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Commentaires du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_COMMENTS</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Int</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Int</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Note d'identification</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>KEYNOTE_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Code d'assemblage</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>UNIFORMAT_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>C1020</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_WIDTH_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fermeture du mur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>TYPE_WALL_CLOSURE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Description</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient de transfert de chaleur (U)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_HEAT_TRANSFER_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_COEFFICIENT_OF_HEAT_TRANSFER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>URL</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_URL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>URL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Numéro OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>23.30.10.00</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Titre OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>Doors</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                        </Properties>
                    </Variant>
                    <Variant Id="0" Name="36&quot; x 84&quot;">
                        <Properties>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Commentaires du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_COMMENTS</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient d'apport thermique solaire</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_SOLAR_HEAT_GAIN_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FURNITURE_WIDTH</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>3</CAD_Value>
                                    <CAD_DisplayValue>3' - 0&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fermeture du mur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>TYPE_WALL_CLOSURE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Opération</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>DOOR_OPERATION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Paramètres IFC</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>URL</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_URL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>URL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Type de construction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>CURTAIN_WALL_PANELS_CONSTRUCTION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_HEIGHT_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Code d'assemblage</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>UNIFORMAT_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>C1020</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Description</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient de transfert de chaleur (U)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_HEAT_TRANSFER_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_COEFFICIENT_OF_HEAT_TRANSFER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Door Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Door Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34907</CAD_Value>
                                    <CAD_DisplayValue>Door - Panel</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Width</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Width</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.25</CAD_Value>
                                    <CAD_DisplayValue>0' - 3&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fonction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FUNCTION_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fabricant</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MANUFACTURER</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Transmission de la lumière visible</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_VISUAL_LIGHT_TRANSMITTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Résistance thermique (R)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_THERMAL_RESISTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_THERMAL_RESISTANCE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Note d'identification</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>KEYNOTE_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Ext</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Ext</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Protection contre l'incendie</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FIRE_RATING</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Image du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_IMAGE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>IMAGE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Epaisseur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_THICKNESS_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.166666666666667</CAD_Value>
                                    <CAD_DisplayValue>0' - 2&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_WIDTH_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Modèle</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MODEL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Construction analytique</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTIC_CONSTRUCTION_LOOKUP_TABLE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>&lt;Aucun&gt;</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Int</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Int</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coût</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_COST</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>CURRENCY</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>WINDOW_HEIGHT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>7</CAD_Value>
                                    <CAD_DisplayValue>7' - 0&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Frame Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Frame Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34906</CAD_Value>
                                    <CAD_DisplayValue>Door - Frame</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Numéro OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>23.30.10.00</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Titre OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>Doors</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                        </Properties>
                    </Variant>
                    <Variant Id="0" Name="34&quot; x 84&quot;">
                        <Properties>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Epaisseur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_THICKNESS_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.166666666666667</CAD_Value>
                                    <CAD_DisplayValue>0' - 2&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_HEIGHT_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Image du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_IMAGE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>IMAGE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Transmission de la lumière visible</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_VISUAL_LIGHT_TRANSMITTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Construction analytique</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTIC_CONSTRUCTION_LOOKUP_TABLE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>&lt;Aucun&gt;</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Int</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Int</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coût</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_COST</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>CURRENCY</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Ext</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Ext</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fonction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FUNCTION_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FURNITURE_WIDTH</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>2.83333333333333</CAD_Value>
                                    <CAD_DisplayValue>2' - 10&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Modèle</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MODEL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Opération</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>DOOR_OPERATION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Paramètres IFC</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fabricant</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MANUFACTURER</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient de transfert de chaleur (U)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_HEAT_TRANSFER_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_COEFFICIENT_OF_HEAT_TRANSFER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Note d'identification</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>KEYNOTE_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Type de construction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>CURTAIN_WALL_PANELS_CONSTRUCTION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Code d'assemblage</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>UNIFORMAT_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>C1020</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Commentaires du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_COMMENTS</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_WIDTH_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Protection contre l'incendie</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FIRE_RATING</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>WINDOW_HEIGHT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>7</CAD_Value>
                                    <CAD_DisplayValue>7' - 0&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fermeture du mur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>TYPE_WALL_CLOSURE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Résistance thermique (R)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_THERMAL_RESISTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_THERMAL_RESISTANCE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Frame Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Frame Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34906</CAD_Value>
                                    <CAD_DisplayValue>Door - Frame</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient d'apport thermique solaire</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_SOLAR_HEAT_GAIN_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Door Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Door Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34907</CAD_Value>
                                    <CAD_DisplayValue>Door - Panel</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Description</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Width</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Width</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.25</CAD_Value>
                                    <CAD_DisplayValue>0' - 3&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>URL</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_URL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>URL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Numéro OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>23.30.10.00</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Titre OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>Doors</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                        </Properties>
                    </Variant>
                    <Variant Id="0" Name="32&quot; x 84&quot;">
                        <Properties>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Construction analytique</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTIC_CONSTRUCTION_LOOKUP_TABLE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>&lt;Aucun&gt;</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Code d'assemblage</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>UNIFORMAT_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>C1020</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fonction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FUNCTION_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Int</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Int</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Description</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Door Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Door Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34907</CAD_Value>
                                    <CAD_DisplayValue>Door - Panel</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coût</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_COST</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>CURRENCY</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Type de construction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>CURTAIN_WALL_PANELS_CONSTRUCTION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FURNITURE_WIDTH</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>2.66666666666667</CAD_Value>
                                    <CAD_DisplayValue>2' - 8&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fabricant</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MANUFACTURER</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Epaisseur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_THICKNESS_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.166666666666667</CAD_Value>
                                    <CAD_DisplayValue>0' - 2&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Width</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Width</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.25</CAD_Value>
                                    <CAD_DisplayValue>0' - 3&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient d'apport thermique solaire</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_SOLAR_HEAT_GAIN_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>WINDOW_HEIGHT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>7</CAD_Value>
                                    <CAD_DisplayValue>7' - 0&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_HEIGHT_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fermeture du mur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>TYPE_WALL_CLOSURE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Modèle</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MODEL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Transmission de la lumière visible</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_VISUAL_LIGHT_TRANSMITTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Frame Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Frame Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34906</CAD_Value>
                                    <CAD_DisplayValue>Door - Frame</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Résistance thermique (R)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_THERMAL_RESISTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_THERMAL_RESISTANCE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Protection contre l'incendie</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FIRE_RATING</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Note d'identification</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>KEYNOTE_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Ext</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Ext</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Opération</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>DOOR_OPERATION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Paramètres IFC</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Image du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_IMAGE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>IMAGE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient de transfert de chaleur (U)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_HEAT_TRANSFER_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_COEFFICIENT_OF_HEAT_TRANSFER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>URL</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_URL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>URL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_WIDTH_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Commentaires du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_COMMENTS</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Numéro OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>23.30.10.00</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Titre OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>Doors</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                        </Properties>
                    </Variant>
                    <Variant Id="0" Name="34&quot; x 80&quot;">
                        <Properties>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Description</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>WINDOW_HEIGHT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>6.66666666666667</CAD_Value>
                                    <CAD_DisplayValue>6' - 8&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_WIDTH_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Protection contre l'incendie</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FIRE_RATING</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Image du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_IMAGE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>IMAGE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_HEIGHT_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient d'apport thermique solaire</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_SOLAR_HEAT_GAIN_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Int</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Int</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>URL</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_URL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>URL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient de transfert de chaleur (U)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_HEAT_TRANSFER_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_COEFFICIENT_OF_HEAT_TRANSFER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FURNITURE_WIDTH</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>2.83333333333333</CAD_Value>
                                    <CAD_DisplayValue>2' - 10&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Transmission de la lumière visible</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_VISUAL_LIGHT_TRANSMITTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coût</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_COST</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>CURRENCY</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fabricant</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MANUFACTURER</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Frame Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Frame Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34906</CAD_Value>
                                    <CAD_DisplayValue>Door - Frame</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fonction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FUNCTION_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Type de construction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>CURTAIN_WALL_PANELS_CONSTRUCTION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fermeture du mur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>TYPE_WALL_CLOSURE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Door Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Door Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34907</CAD_Value>
                                    <CAD_DisplayValue>Door - Panel</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Epaisseur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_THICKNESS_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.166666666666667</CAD_Value>
                                    <CAD_DisplayValue>0' - 2&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Ext</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Ext</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Note d'identification</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>KEYNOTE_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Construction analytique</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTIC_CONSTRUCTION_LOOKUP_TABLE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>&lt;Aucun&gt;</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Commentaires du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_COMMENTS</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Modèle</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MODEL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Opération</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>DOOR_OPERATION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Paramètres IFC</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Résistance thermique (R)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_THERMAL_RESISTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_THERMAL_RESISTANCE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Width</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Width</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.25</CAD_Value>
                                    <CAD_DisplayValue>0' - 3&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Code d'assemblage</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>UNIFORMAT_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>C1020</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Numéro OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>23.30.10.00</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Titre OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>Doors</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                        </Properties>
                    </Variant>
                    <Variant Id="0" Name="30&quot; x 80&quot;">
                        <Properties>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Note d'identification</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>KEYNOTE_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Door Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Door Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34907</CAD_Value>
                                    <CAD_DisplayValue>Door - Panel</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Résistance thermique (R)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_THERMAL_RESISTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_THERMAL_RESISTANCE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Int</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Int</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Description</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FURNITURE_WIDTH</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>2.5</CAD_Value>
                                    <CAD_DisplayValue>2' - 6&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Protection contre l'incendie</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FIRE_RATING</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Construction analytique</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTIC_CONSTRUCTION_LOOKUP_TABLE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>&lt;Aucun&gt;</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_HEIGHT_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Width</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Width</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.25</CAD_Value>
                                    <CAD_DisplayValue>0' - 3&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Transmission de la lumière visible</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_VISUAL_LIGHT_TRANSMITTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Commentaires du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_COMMENTS</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Ext</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Ext</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fermeture du mur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>TYPE_WALL_CLOSURE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fonction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FUNCTION_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Image du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_IMAGE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>IMAGE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fabricant</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MANUFACTURER</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>WINDOW_HEIGHT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>6.66666666666667</CAD_Value>
                                    <CAD_DisplayValue>6' - 8&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Code d'assemblage</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>UNIFORMAT_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>C1020</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient d'apport thermique solaire</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_SOLAR_HEAT_GAIN_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Opération</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>DOOR_OPERATION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Paramètres IFC</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>URL</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_URL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>URL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Modèle</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MODEL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Frame Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Frame Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34906</CAD_Value>
                                    <CAD_DisplayValue>Door - Frame</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Type de construction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>CURTAIN_WALL_PANELS_CONSTRUCTION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Epaisseur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_THICKNESS_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.166666666666667</CAD_Value>
                                    <CAD_DisplayValue>0' - 2&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_WIDTH_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coût</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_COST</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>CURRENCY</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient de transfert de chaleur (U)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_HEAT_TRANSFER_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_COEFFICIENT_OF_HEAT_TRANSFER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Numéro OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>23.30.10.00</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Titre OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>Doors</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                        </Properties>
                    </Variant>
                    <Variant Id="0" Name="30&quot; x 84&quot;">
                        <Properties>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient de transfert de chaleur (U)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_HEAT_TRANSFER_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_COEFFICIENT_OF_HEAT_TRANSFER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Frame Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Frame Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34906</CAD_Value>
                                    <CAD_DisplayValue>Door - Frame</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Int</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Int</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fermeture du mur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>TYPE_WALL_CLOSURE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FURNITURE_WIDTH</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>2.5</CAD_Value>
                                    <CAD_DisplayValue>2' - 6&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Image du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_IMAGE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>IMAGE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>URL</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_URL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>URL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Largeur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_WIDTH_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Code d'assemblage</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>UNIFORMAT_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>C1020</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Opération</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>DOOR_OPERATION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Paramètres IFC</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Projection Ext</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Projection Ext</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.0833333333333333</CAD_Value>
                                    <CAD_DisplayValue>0' - 1&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Epaisseur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_THICKNESS_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.166666666666667</CAD_Value>
                                    <CAD_DisplayValue>0' - 2&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coefficient d'apport thermique solaire</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_SOLAR_HEAT_GAIN_COEFFICIENT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Coût</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_COST</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>CURRENCY</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Commentaires du type</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_TYPE_COMMENTS</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Note d'identification</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>KEYNOTE_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Construction analytique</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTIC_CONSTRUCTION_LOOKUP_TABLE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>&lt;Aucun&gt;</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Modèle</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MODEL</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Description</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>WINDOW_HEIGHT</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>7</CAD_Value>
                                    <CAD_DisplayValue>7' - 0&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fonction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>7</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FUNCTION_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>INVALID</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Fabricant</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ALL_MODEL_MANUFACTURER</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Résistance thermique (R)</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_THERMAL_RESISTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>HVAC_THERMAL_RESISTANCE</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Trim Width</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Trim Width</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>0.25</CAD_Value>
                                    <CAD_DisplayValue>0' - 3&quot;</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Hauteur brute</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FAMILY_ROUGH_HEIGHT_PARAM</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Transmission de la lumière visible</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>1</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>ANALYTICAL_VISUAL_LIGHT_TRANSMITTANCE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Propriétés analytiques</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Door Material</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>0</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>Door Material</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>34907</CAD_Value>
                                    <CAD_DisplayValue>Door - Panel</CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>Family</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Protection contre l'incendie</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>FIRE_RATING</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Type de construction</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>CURTAIN_WALL_PANELS_CONSTRUCTION_TYPE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value></CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Numéro OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_CODE</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>23.30.10.00</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                            <Property>
                                <PropertyData Type="BIMANDCO">
                                    <Name>Titre OmniClass</Name>
                                    <Value></Value>
                                    <PropertyCode></PropertyCode>
                                    <DomainCode></DomainCode>
                                    <DomainId></DomainId>
                                    <DomainName></DomainName>
                                    <DataTypeCode>5</DataTypeCode>
                                    <EditTypeCode>0</EditTypeCode>
                                    <UnitCode></UnitCode>
                                    <CAD_MappingKey>OMNICLASS_DESCRIPTION</CAD_MappingKey>
                                    <CAD_OldMappingKey></CAD_OldMappingKey>
                                    <CAD_PrivateData></CAD_PrivateData>
                                    <CAD_OldPrivateData></CAD_OldPrivateData>
                                    <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                    <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                    <CAD_ParameterDescription></CAD_ParameterDescription>
                                    <CAD_Value>Doors</CAD_Value>
                                    <CAD_DisplayValue></CAD_DisplayValue>
                                    <PlatformSpecificCAOData>
                                        <CAD_MappingType>BuiltIn</CAD_MappingType>
                                        <CAD_OldMappingType></CAD_OldMappingType>
                                        <CAD_ParameterType>Type</CAD_ParameterType>
                                    </PlatformSpecificCAOData>
                                </PropertyData>
                            </Property>
                        </Properties>
                    </Variant>
                </Variants>
                <Classifications/>
                <Countries/>
                <Catalogs/>
                <ContentManagement>
                    <Id>63</Id>
                    <Tags/>
                </ContentManagement>
                <CaoParameters/>
                <Groups/>
            </BimObject>
            <UserLanguage>fr</UserLanguage>
        </Bundle>`;

        const bundleArray = [getXmlDocFromBundle(bundle)];
        const result = getPropertiesFromBundleArray(bundleArray);

        _.each(result, domain => {
            _.each(domain.PropertyList, property => {
                expect(_.where(domain.PropertyList, { Name: property.Name, CAD_MappingKey: property.CAD_MappingKey, CAD_ParameterTypeName: property.CAD_ParameterTypeName }).length).toBe(1);
            });
        });
    });
});
