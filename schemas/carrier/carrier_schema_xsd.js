const carrierSchemaXsd = '<?xml version="1.0" encoding="UTF-8" ?>' +
    '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">' +
    '' +
    '   <xs:simpleType name="tagRestriction">' +
    '        <xs:restriction base="xs:integer">' +
    '            <xs:minInclusive value="1"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '    <xs:simpleType name="orderRestriction">' +
    '        <xs:restriction base="xs:integer">' +
    '            <xs:minInclusive value="1"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '' +
    '    <xs:simpleType name="stationRestriction">' +
    '        <xs:restriction base="xs:integer">' +
    '            <xs:minInclusive value="1"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '' +
    '    <xs:complexType name="carrier-input">' +
    '        <xs:all>' +
    '            <xs:element name="tagID" type="tagRestriction"/>' +
    '            <xs:element name="OrderID_O" type="orderRestriction"/>' +
    '            <xs:element name="StationID" type="stationRestriction"/>' +
    '            <xs:element name="StatusCarrier" type="xs:string"/>' +
    '        </xs:all>' +
    '    </xs:complexType>' +
    '' +
    '    <xs:element name="carriers" type="carrier-input"/>' +
    '</xs:schema>';

module.exports = carrierSchemaXsd;
