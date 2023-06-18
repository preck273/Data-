const stationSchemaSchemaXsd = '<?xml version="1.0" encoding="UTF-8" ?>' +
    '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">' +
    '' +
    '   <xs:simpleType name="stationRestriction">' +
    '        <xs:restriction base="xs:integer">' +
    '            <xs:minInclusive value="1"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '    <xs:simpleType name="statusRestriction">' +
    '        <xs:restriction base="xs:string">' +
    '           <xs:enumeration value="Offline"/>' +
    '           <xs:enumeration value="Online"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '' +
    '    <xs:complexType name="station-input">' +
    '        <xs:all>' +
    '            <xs:element name="StationID" type="stationRestriction"/>' +
    '            <xs:element name="StatusStation" type="statusRestriction"/>' +
    '        </xs:all>' +
    '    </xs:complexType>' +
    '' +
    '    <xs:element name="stations" type="station-input"/>' +
    '</xs:schema>';

module.exports = stationSchemaSchemaXsd;
