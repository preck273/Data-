const orderSchemaXsd = '<?xml version="1.0" encoding="UTF-8" ?>' +
    '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">' +
    '' +
    '   <xs:simpleType name="orderRestriction">' +
    '        <xs:restriction base="xs:integer">' +
    '            <xs:minInclusive value="1"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '' +
    '    <xs:complexType name="order-input">' +
    '        <xs:all>' +
    '            <xs:element name="OrderID" type="orderRestriction"/>' +
    '            <xs:element name="OrderInformation" type="xs:string"/>'  +
    '        </xs:all>' +
    '    </xs:complexType>' +
    '' +
    '    <xs:element name="orders" type="order-input"/>' +
    '</xs:schema>';

module.exports = orderSchemaXsd;
