const DUMMY_DATA = {
  BundleList: [
    `<?xml version="1.0"?>
    <Bundle>
        <Version>4</Version>
        <BundleType>Upload</BundleType>
        <BimObject Id="0" CaoId="{5ec16500-d60e-4f3d-9794-3852a943ac71}" CaoDocumentId="525330944" CaoObjectId="243648" CaoClassification="OST_MechanicalEquipment">
            <Models>
                <Model>
                    <Name>Heating_Pump_-_External_unit.rfa</Name>
                    <ModelFileIsNeededForUpload>true</ModelFileIsNeededForUpload>
                </Model>
            </Models>
            <Photos>
                <Photo>
                    <Name>Photo</Name>
                    <Type>Include</Type>
                    <Content>/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCACAAIADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK5LxH468K+EtY8A6B4h1T+z9X+KHi288C+BbT7DqN3/bnirT/AnjX4l3el+fY2lzbaZ5Pgn4d+Mda+3axNp+nSf2P/AGbFdvq+oaXYXsTqQppSqThTi506alOSinOrONKlBOTSc6lScKdOO85yjCKcpJOKlWnRip1akKUXOlSUqk4wi6lapCjRppyaTnWrVIUqUE+apUnCEE5SSfW0UUVZYUUUUAFFFFABRRRQAUUUUAFfMHxr/bd/Yv8A2a/FWn+Bf2i/2u/2YPgD421bw/a+LNL8HfGv4+/Cn4V+KtS8K32o6ro9j4l0/wAPeOvFmhaveeH7zV9C1zS7XWbe0k0641HRtVsYbl7nTruKH6fr4A+HP/KU39sj/swD/gmn/wCtFf8ABWKgD8Yf20P+Cvf7XHhz4mfF/wAQ/sJf8FAP+DaHx7+z5oXh+y1n4QeBfjv+2jrdn+0/401HS/h7o994l8J6pd6B8bPBfwJtfEHiP4kweJtH8AXOpeMfCfhWDw/eeFpfGviXQpF13VLX9nv+HsX/AASy/wCkln7AH/iZH7Ov/wA8avgD9p3/AIK2ftT+EviL/wAFgvhT+zR+yn8APEf/AA6c+AHgX4xeNfiv8dP2nPiL4W/4S3/haf7LHif9o3w5deFvgd4A/Zi8W/8ACW/8Il/wiWvaLrfg/Vv2gPhZ/wAJb9j0iKw+IPhD/hI7zUvCX0B+yd+1R/wVN/aI/ZY/Zp/aA/4ZA/YAvf8AhefwA+Dfxi+2f8N+ftFfD37X/wALN+HXhzxr9q/4QD/h2/8AFv8A4Qfz/wC2/N/4Q/8A4Wt8Tf8AhGd/9i/8LB8Z/Yv+Ej1IA9//AOHsX/BLL/pJZ+wB/wCJkfs6/wDzxq/Az9nL/gqf+0d8Rfj1+xX45/4KHfttf8EAfD/wS8P+NfEvxF8S+Gv2Pf2uLrxB8bPgv478Qfsn/Hvwno0Hxx1nxZ8Y/HfwS0f4f6Pqfju7+G3iXxF4V8beINHvvi74g+HGh+DvF3iDTPEFtc6r9Lf8FcvDX7Zn7RXwj/Zy+DH7RvwY/Zj+CHhH4gftceBPDnhbxh8Ef2sfiv8AtE+J734k6r8LPjRY+DvDGs+DfG/7En7NmnaD4Q164ubq31zx7p3i7xdrvhZks5dN+GHjU3U1tad14M/ZP/4JV/sY+K/hlqX7QQ+FXwo+J/wj8aeB/wDhAvjl+0V8TvDf7Nmn/F7xT8OdF+GvjO68f/BrQdV+JPg3wl4+8O/Dy+8TeHNI8TXk2leK/Elr4l0+7svH2s+L/Fl7c+I/EnyqnxRxLxO+D+G+F8RneJp4rKK+Hjl1TMMfm2OrYV08+xVDB5HluS4/EVYYbL8DWq166xH7uNqjp+yjVnS/J+I+L8yfENfhnD5HhamCy/G8NYqpm1XNsVCvUrRxeHzudCnleGyLGv2cMLgakJYmpjoR9tUoR9n77cf2D+Cn7bv7F/7SnirUPAv7On7Xf7MHx+8baT4fuvFmqeDvgp8ffhT8VPFWm+FbHUdK0e+8S6h4e8C+LNd1ez8P2er67oel3Ws3FpHp1vqOs6VYzXKXOo2kU3r/AMJ/il4E+OPws+Gnxr+Fuu/8JR8MvjB8P/BvxS+HXiX+zNY0T/hIvAnxA8Oab4s8I67/AGN4i0/SPEGkf2v4f1fT9Q/szXdK0zWLD7R9l1PT7K9into/5X/+CdXwP+Lf7Hn/AAUl/Yh+HXjHxH8IPA/xD+IX/BMn4D/Cz48/C74i+JLe68UCy+Bf7HHwL8C6n4L/AGefEPhHXLnwx4/+N9p8cvgLca54l0K1bxR4KtP2d/ht8XvHeh+Ktb1WaztPBn9AP/BMq28K2f8AwTb/AOCfNp4F1nxB4j8E2v7EH7KFt4O8Q+LPDWneC/FWu+FYPgN4Bi8Paz4l8HaP4s8e6R4T8QappC2l9rPhrS/HXjTTtC1Ge50ux8WeI7a1i1i89LJs0qZpHMnVwscJLAZxj8sjGOIWJVejhKkfYYzmVGiqbxVCdOs8Pap7BydP21Xl539tw5ns8+p5vOpg44J5XxBm+SQUMV9bjiqOW11ToY5TVDDql9coyp13hkqqw7k6X1ivy+0f2/RRRXsH0QUUUUAFFFFABRRRQAV+IP7Yf7Lv7R37Q37Wvx90/wDZ4+JXwA+HPiBfh/8A8EPfiLPqHxi0u6+KO/R/2SP+Ch37c/7R/iKC6+F3w6+Lnw/+Jvhfzb3TPBeq+D/EXim10/wJ8av+Eb+IPwU8KeLvCHiA+LvjB8C/2+r5g+Nf7EX7F/7SnirT/HX7Rf7In7MHx+8baT4ftfCel+MfjX8AvhT8VPFWm+FbHUdV1ix8Naf4h8deE9d1ez8P2er67rmqWujW93Hp1vqOs6rfQ2yXOo3cswB+IH7cn/BK3/gpJrPxv/4KafEr9gv4w/sQat4J/wCCvPwf8D/BT9pvwR+134T+PPhTxV8FfCvwr/Zqn/Zt8M6h8CPiB8GtZ8baR4v8QeL9I8bfEjxPrt18QPhzo2neD9RsvBFhp+leMrZ9emJ+z18FP+DnH9mv4BfA/wDZ08C6h/wQh1bwT8Afg/8ADT4KeDtU8WXX/BQO+8Val4V+FfgvRfAvh7UPEt9o+laFpF54gvNI0K0uNZutL0PRtOuNRkuZrHStOtnitIfqD4pfsafsM/D/AMd674R8J/8ABuV8P/jj4f0j+zP7P+KXwt/Zr/4I96R4E8Ufb9H0/U7r+wtP+Nf7Tfwf+Jtv/Yl7e3Ph3U/+El+HXh3zdY0jUJ9G/tfw/JpWu6n+YEH7Uv8AwRC8L6P4Rs/jX/wRf/YA+GHxN1f4f/Drxr4l8FQfFP8A4NwNX0fTP+FieBPDvj/Rrzwj4j8Wft7/AA38QeM/h/4g8P8AiXSvEfw68f6h4A8G/wDCwPAmr+HfGtr4c0iy162s4gD6A/4KkeIv27vgl+zv+yf8Yv20fjN+y14qHhj9pX4Xa/f+D/2Rv2Zfil8P9b+G/wAbk+DHxgvLLxT4Y+J/xv8A2rfixo/xd8D/AA311dWurDwvr3wV+D+sfFNLTRJr3xF8KFl1GwX5P/aj1P8A4Ig/ty+E/ix4w/aH8Q6/8Lfj98XvFfw0+JXjTxn8EtJ+Et98WvGA8AfBnwp4J8N+AvBPxr1X4WeIprX4Sazp2j6JqE3gX43XPgHxfpPjjS0Pi3w94AvNJfQdP0NZ/bR/4IMQaj4Ti8Pf8EhP+CcGqaReeILm28dX2s/Gz/g2v0LUfDnhVfCviW7tNZ8J6XY/8FAPEdt408QT+NrXwd4eufDWsax4C0618K674l8YxeLLzV/Cel+BfGn1X8N/g/8A8E3v2ovH/wCxJrPwt/4Iz/AD4XfAX4s/HT4jaZefGv8A4Vd/wSU+JXwJ+Nej+EP2Z/2qbq4+Fv8Aav7HX7R/7Rt741/s34m+BdP8Wf2frvhpvAmjeMfhF9p1PXdL8deG/DGn3XzeCrcY8E8c5Z4j8HcWzyHOMnz3hTNcgnh8tbxuS8RZZmuXU8BnmEzGnmFCdSthqkaNeGExGHqYZzoxjKLhUrqr+YZvw/xJlnE2Y8W5LxVRwFDOMNg+HK2U1ciWK5KfEFD/AFNzbEf2hDNMLUqwxeRZzjsJPCVcO6KjVcoSjUcpy4v9kz40+CP28f8Agtf4b+K2l+CdH8ZSfs4fCP4v6/4b8Tal8T73SdN+EGn3Gh6T8HtPn+Gdn4D8MaxoHx18SQ/8LR8c+HfFi+L/ABVp/wAMLmP45eOfFPw28TeJofgZ8KvEfxl/ef8A4J7fDrWPg/8AsC/sPfCXxFP9p8QfC79kD9mn4da7c/8ACO+O/CH2jWPBPwX8FeGtTn/4RP4peEfh/wDE3wv5t7pk8n/CO/EXwH4J8d6Ju/s3xd4R8N+ILbUNGsug+Cn7EX7F/wCzX4q1Dx1+zp+yJ+zB8AfG2reH7rwnqnjH4KfAL4U/CvxVqXhW+1HStYvvDWoeIfAvhPQtXvPD95q+haHql1o1xdyadcajo2lX01s9zp1pLD9P1XDOS4zI8DXw+YZpHN8XicficdWxsMBDLov26pwp0Y4WGIxSSo0qUKftHWlOrbnqN1HKUvf4J4Zx3CuU18BmWcxz7G4rM8ZmVfMY5bTymM5Yr2ajSWDp4rGRiqNOlCHtPbSnVtz1L1HKUiiiivoj7AKKKKACiiigAooooAKKKKAPkD4pf8E9v2Bfjj47134pfGv9h79kD4wfE3xR/Zn/AAkvxF+KX7NPwX+IHjvxF/Ymj6f4d0b+3fF3izwVq/iDV/7I8P6RpWhaZ/aGoXH2DR9M0/TLXyrKytoI/P8A/h07/wAEsv8ApGn+wB/4hv8As6//ADua+/6KAPgD/h07/wAEsv8ApGn+wB/4hv8As6//ADua6n4f/wDBNv8A4J8/CL4j+A/jB8Hv2JP2Vvg18VPhnq+s614J+IXwc+BHw1+E3i/RrzxF4J8V/DvXIX134eeHPDeoarpOq+D/ABt4k0q90DWZ9R0KaW8tdWbTf7Z0fRdQ0/7WopSjGStKKkk4ytJJrmhJSjKz6xklKL3UkmrNImUYzVpRjJKUZJSSklKElOErO/vQnGMoveMoqSs0mFFFFMoKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=</Content>
                </Photo>
            </Photos>
            <Definitions>
                <Definition>
                    <Name>Heating Pump - External unit</Name>
                    <LanguageCode>fr</LanguageCode>
                    <Description>Generic Heating Pump - External unit</Description>
                </Definition>
            </Definitions>
            <Software>
                <Name>revit</Name>
                <Version>2020</Version>
            </Software>
            <Variants>
                <Variant Id="0" Name="Heating Pump - External unit - 7 KW">
                    <Properties>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Operating Mode Heat Pump</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>3415d706-ef44-4c7c-92b2-ef5600744dc5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Paramètre Coût</Name>
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
                                <Name>Product Code</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8c9dd035-a134-432d-b756-588c737a0864</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Minimum AC Voltage</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>fcc403df-0e37-4e9a-99fb-94b8ed2b020c</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POTENTIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 V</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <Name>Nominal Current</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8ed14a6b-915e-4277-bf5f-9862fdceab97</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_CURRENT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 A</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Liquid Diameter</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>1c9de466-ed86-4007-ad15-03cc87528b60</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.0208333333333333</CAD_Value>
                                <CAD_DisplayValue>6.35 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Overall Depth</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>853369fe-b588-4fd6-ab4d-c0bde5e1ac5d</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>1.01706036745407</CAD_Value>
                                <CAD_DisplayValue>310.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <Name>Sound power max (dB(A))</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>efb69f9a-7913-41d4-b42c-a129612473a5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000000</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Overall Width</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>12d977ec-debf-45d7-9c24-84eb47f90079</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>2.88713910761155</CAD_Value>
                                <CAD_DisplayValue>880.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Static Pressure</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8f843dc0-6cd4-4274-a951-2128c18393b5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_PRESSURE</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Génie climatique - Débit</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 Pa</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <CAD_Value>Heating Pump - External unit - 6 KW</CAD_Value>
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
                                <Name>Color</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>69f608c4-bde9-4ab6-860e-308ac785454f</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Service Space Width</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Width</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>4.59317585301837</CAD_Value>
                                <CAD_DisplayValue>1400.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Grid Material</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>0</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Grid Material</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>-1</CAD_Value>
                                <CAD_DisplayValue>-1</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Energy Efficiency Ratio (EER)</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>1bb8e1f3-0bec-43a4-ad9f-524dd582ebc1</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000000</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Mass</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>2a3378c4-ae0a-4b96-9ad8-208ac397ab74</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MASS</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000 kg</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Height Gas Connection</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Height Gas Connection</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.328083989501312</CAD_Value>
                                <CAD_DisplayValue>100.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Rated Frequency (Hz)</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>f84ce82b-1021-4638-8ec5-a2de4111ed44</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Coefficient Of Performance (COP)</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>993d8cf9-e2c9-4ca5-915c-6ee603db9b59</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000000</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Nominal Voltage</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>88df309e-c575-47c5-b472-42a613ab5a95</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POTENTIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 V</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Overall Height</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8a8b160c-87c9-43d7-9d6c-3f5ddd6daab5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>2.09317585301837</CAD_Value>
                                <CAD_DisplayValue>638.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Thermal Power</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>914237d9-1439-4d35-9bc9-73b78dbca275</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POWER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 W</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Cooling Capacity</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>cdaaeaca-4471-48a5-982c-72f15520731b</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_COOLING_LOAD</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>53819.5520835486</CAD_Value>
                                <CAD_DisplayValue>5.00000 kW</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Service Space Depth</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Depth</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>1.96850393700787</CAD_Value>
                                <CAD_DisplayValue>600.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Maximum Air Flow</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>86370010-7992-4e54-bad4-43095af625e3</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_AIR_FLOW</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Génie climatique - Débit</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 L/s</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Maximum AC Voltage</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>a88760d6-72cd-43ff-8a44-0ab9300aabfb</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POTENTIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 V</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Service Space Height</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Height</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>5.57742782152231</CAD_Value>
                                <CAD_DisplayValue>1700.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Service Space Material</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>0</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Material</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>243482</CAD_Value>
                                <CAD_DisplayValue>Service Space</CAD_DisplayValue>
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
                                <Name>Elévation par défaut</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>FAMILY_FREEINST_DEFAULT_ELEVATION</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Contraintes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 mm</CAD_DisplayValue>
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
                                <Name>Service Space Visible</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>7</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Visible</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>YESNO</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Visibilité</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>1</CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Gas Diameter</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>84173dca-9844-4ea5-949f-f6be2f8d59f7</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.0416666666666667</CAD_Value>
                                <CAD_DisplayValue>12.70 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <CAD_Value>Heating Pump - External unit</CAD_Value>
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
                                <Name>Main Material</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>0</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Main Material</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>-1</CAD_Value>
                                <CAD_DisplayValue>-1</CAD_DisplayValue>
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
                                <Name>Heating Capacity</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>69bb8d68-e703-434c-bf23-882c92ffa474</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_HEATING_LOAD</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>64583.4625002583</CAD_Value>
                                <CAD_DisplayValue>6.00000 kW</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Height Liquid Connection</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Height Liquid Connection</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.328083989501312</CAD_Value>
                                <CAD_DisplayValue>100.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Number of Poles</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>2b64e43c-8cb4-4a45-a0bb-508bdb53983b</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <CAD_Value>Generic Heating Pump - External unit</CAD_Value>
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
                                <Name>Paramètre Coût</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Coût</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>4.59317585301837</CAD_Value>
                                <CAD_DisplayValue>1400.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                    </Properties>
                </Variant>
                <Variant Id="0" Name="Heating Pump - External unit - 6 KW">
                    <Properties>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Service Space Height</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Height</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>5.57742782152231</CAD_Value>
                                <CAD_DisplayValue>1700.00 mm</CAD_DisplayValue>
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
                                <CAD_Value>Generic Heating Pump - External unit</CAD_Value>
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
                                <Name>Static Pressure</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8f843dc0-6cd4-4274-a951-2128c18393b5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_PRESSURE</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Génie climatique - Débit</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 Pa</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Grid Material</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>0</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Grid Material</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>-1</CAD_Value>
                                <CAD_DisplayValue>-1</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Overall Height</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8a8b160c-87c9-43d7-9d6c-3f5ddd6daab5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>2.09317585301837</CAD_Value>
                                <CAD_DisplayValue>638.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Mass</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>2a3378c4-ae0a-4b96-9ad8-208ac397ab74</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MASS</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000 kg</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Number of Poles</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>2b64e43c-8cb4-4a45-a0bb-508bdb53983b</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Energy Efficiency Ratio (EER)</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>1bb8e1f3-0bec-43a4-ad9f-524dd582ebc1</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000000</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Rated Frequency (Hz)</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>f84ce82b-1021-4638-8ec5-a2de4111ed44</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <Name>Service Space Depth</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Depth</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>1.96850393700787</CAD_Value>
                                <CAD_DisplayValue>600.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Height Gas Connection</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Height Gas Connection</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.328083989501312</CAD_Value>
                                <CAD_DisplayValue>100.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Maximum Air Flow</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>86370010-7992-4e54-bad4-43095af625e3</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_AIR_FLOW</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Génie climatique - Débit</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 L/s</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Nominal Voltage</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>88df309e-c575-47c5-b472-42a613ab5a95</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POTENTIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 V</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <Name>Elévation par défaut</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>FAMILY_FREEINST_DEFAULT_ELEVATION</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Contraintes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>BuiltIn</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Heating Capacity</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>69bb8d68-e703-434c-bf23-882c92ffa474</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_HEATING_LOAD</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>64583.4625002583</CAD_Value>
                                <CAD_DisplayValue>6.00000 kW</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Coefficient Of Performance (COP)</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>993d8cf9-e2c9-4ca5-915c-6ee603db9b59</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000000</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Minimum AC Voltage</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>fcc403df-0e37-4e9a-99fb-94b8ed2b020c</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POTENTIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 V</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Product Code</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8c9dd035-a134-432d-b756-588c737a0864</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Données d'identification</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <CAD_Value>Heating Pump - External unit - 6 KW</CAD_Value>
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
                                <Name>Service Space Visible</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>7</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Visible</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>YESNO</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Visibilité</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>1</CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Sound power max (dB(A))</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>efb69f9a-7913-41d4-b42c-a129612473a5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>NUMBER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.000000</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Maximum AC Voltage</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>a88760d6-72cd-43ff-8a44-0ab9300aabfb</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POTENTIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 V</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Gas Diameter</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>84173dca-9844-4ea5-949f-f6be2f8d59f7</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.0416666666666667</CAD_Value>
                                <CAD_DisplayValue>12.70 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Cooling Capacity</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>cdaaeaca-4471-48a5-982c-72f15520731b</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>HVAC_COOLING_LOAD</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>53819.5520835486</CAD_Value>
                                <CAD_DisplayValue>5.00000 kW</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Overall Depth</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>853369fe-b588-4fd6-ab4d-c0bde5e1ac5d</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>1.01706036745407</CAD_Value>
                                <CAD_DisplayValue>310.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Overall Width</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>12d977ec-debf-45d7-9c24-84eb47f90079</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>2.88713910761155</CAD_Value>
                                <CAD_DisplayValue>880.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Operating Mode Heat Pump</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>3415d706-ef44-4c7c-92b2-ef5600744dc5</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Construction</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <Name>Thermal Power</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>914237d9-1439-4d35-9bc9-73b78dbca275</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_POWER</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Autre</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 W</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
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
                                <Name>Nominal Current</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>8ed14a6b-915e-4277-bf5f-9862fdceab97</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>ELECTRICAL_CURRENT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Electrotechnique</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0</CAD_Value>
                                <CAD_DisplayValue>0.00 A</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Height Liquid Connection</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Height Liquid Connection</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.328083989501312</CAD_Value>
                                <CAD_DisplayValue>100.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Color</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>5</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>69f608c4-bde9-4ab6-860e-308ac785454f</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>TEXT</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value></CAD_Value>
                                <CAD_DisplayValue></CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Liquid Diameter</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>1c9de466-ed86-4007-ad15-03cc87528b60</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>0.0208333333333333</CAD_Value>
                                <CAD_DisplayValue>6.35 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Shared</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Main Material</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>0</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Main Material</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>-1</CAD_Value>
                                <CAD_DisplayValue>-1</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Service Space Material</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>0</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Material</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>MATERIAL</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Matériaux et finitions</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>243482</CAD_Value>
                                <CAD_DisplayValue>Service Space</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Paramètre Coût</Name>
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
                                <CAD_Value>Heating Pump - External unit</CAD_Value>
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
                                <Name>Service Space Width</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Service Space Width</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>4.59317585301837</CAD_Value>
                                <CAD_DisplayValue>1400.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
                                    <CAD_OldMappingType></CAD_OldMappingType>
                                    <CAD_ParameterType>Type</CAD_ParameterType>
                                </PlatformSpecificCAOData>
                            </PropertyData>
                        </Property>
                        <Property>
                            <PropertyData Type="BIMANDCO">
                                <Name>Paramètre Coût</Name>
                                <Value></Value>
                                <PropertyCode></PropertyCode>
                                <DomainCode></DomainCode>
                                <DomainId></DomainId>
                                <DomainName></DomainName>
                                <DataTypeCode>1</DataTypeCode>
                                <EditTypeCode>0</EditTypeCode>
                                <UnitCode></UnitCode>
                                <CAD_MappingKey>Coût</CAD_MappingKey>
                                <CAD_OldMappingKey></CAD_OldMappingKey>
                                <CAD_PrivateData></CAD_PrivateData>
                                <CAD_OldPrivateData></CAD_OldPrivateData>
                                <CAD_ParameterTypeName>LENGTH</CAD_ParameterTypeName>
                                <CAD_ParameterGroup>Cotes</CAD_ParameterGroup>
                                <CAD_ParameterDescription></CAD_ParameterDescription>
                                <CAD_Value>4.59317585301837</CAD_Value>
                                <CAD_DisplayValue>1400.00 mm</CAD_DisplayValue>
                                <PlatformSpecificCAOData>
                                    <CAD_MappingType>Family</CAD_MappingType>
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
            <Tags/>
            <CaoParameters/>
        </BimObject>
        <UserLanguage>fr</UserLanguage>
    </Bundle>`,
  ],
  Id: '{476f4654-7f09-4708-aaec-0a66e8c4ca6e}',
};

export default DUMMY_DATA;
