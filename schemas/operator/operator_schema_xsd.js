const operatorSchemaXsd = '<?xml version="1.0" encoding="UTF-8" ?>' +
    '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">' +
    '' +
    '   <xs:simpleType name="operatorRestriction">' +
    '        <xs:restriction base="xs:integer">' +
    '            <xs:minInclusive value="1"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '    <xs:simpleType name="passwordRestriction">' +
    '        <xs:restriction base="xs:string">' +
    '            <xs:minLength value="4"/>' +
    '        </xs:restriction>' +
    '    </xs:simpleType>' +
    '' +
    '    <xs:complexType name="operator-input">' +
    '        <xs:all>' +
    '            <xs:element name="operatorID" type="operatorRestriction"/>' +
    '            <xs:element name="Password" type="passwordRestriction"/>' +
    '            <xs:element name="Authorization" type="xs:string"/>' +
    '        </xs:all>' +
    '    </xs:complexType>' +
    '' +
    '    <xs:element name="operators" type="operator-input"/>' +
    '</xs:schema>';

module.exports = operatorSchemaXsd;
