# OpenAPI Specification

#### Version 3.0.0-rc2

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](http://www.ietf.org/rfc/rfc2119.txt).

This document is licensed under [The Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

## Introduction

The OpenAPI Specification (OAS) is a project used to describe and document RESTful APIs.


The OpenAPI Specification defines a set of files required to describe such an API.
These files can then be used by documentation generation tools to display the API and code generation tools to generate clients in various programming languages.

Additional utilities can also take advantage of the resulting files, such as testing tools.

## Table of Contents
<!-- TOC depthFrom:1 depthTo:3 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Definitions](#definitions)
	- [Path Templating](#pathTemplating)
	- [Media Types](#mediaTypes)
	- [HTTP Status Codes](#httpCodes)
- [Specification](#specification)
	- [Format](#format)
	- [File Structure](#fileStructure)
	- [Data Types](#dataTypes)
	- [Rich Text Formatting](#richText)
	- [Relative References In URLs](#relativeReferences)
	- [Schema](#schema)
		- [OpenAPI Object](#oasObject)
		- [Info Object](#infoObject)
		- [Contact Object](#contactObject)
		- [License Object](#licenseObject)
		- [Server Object](#serverObject)
		- [Server Variables Object](#serverVariablesObject)
		- [Server Variable Object](#serverVariableObject)
		- [Components Object](#componentsObject)
		- [Paths Object](#pathsObject)
		- [Path Item Object](#pathItemObject)
		- [Operation Object](#operationObject)
		- [External Documentation Object](#externalDocumentationObject)
		- [Parameter Object](#parameterObject)
		- [Request Body Object](#requestBodyObject)
		- [Content Object](#contentObject)
		- [Media Type Object](#mediaTypeObject)
		- [Encoding Object](#encodingObject)
		- [Encoding Property Object](#encodingPropertyObject)
		- [Responses Object](#responsesObject)
		- [Response Object](#responseObject)
		- [Callbacks Object](#callbacksObject)
		- [Callback Object](#callbackObject)
		- [Headers Object](#headersObject)
		- [Example Object](#exampleObject)
		- [Links Object](#linksObject)
		- [Link Object](#linkObject)
		- [Link Parameters Object](#linkParametersObject)
		- [Header Object](#headerObject)
		- [Tag Object](#tagObject)
		- [Reference Object](#referenceObject)
		- [Schema Object](#schemaObject)
		- [XML Object](#xmlObject)
		- [Security Scheme Object](#securitySchemeObject)
		- [OAuth Flows Object](#oauthFlowsObject)
		- [OAuth Flow Object](#oauthFlowObject)
		- [Scopes Object](#scopesObject)
		- [Security Requirement Object](#securityRequirementObject)
	- [Specification Extensions](#specificationExtensions)
	- [Security Filtering](#securityFiltering)
- [Appendix A: Revision History](#revisionHistory)
	

<!-- /TOC -->

## Definitions

##### <a name="pathTemplating"></a>Path Templating
Path templating refers to the usage of curly braces ({}) to mark a section of a URL path as replaceable using path parameters.

##### <a name="mediaTypes"></a>Media Types
Media type definitions are spread across several resources.
The media type definitions SHOULD be in compliance with [RFC 6838](http://tools.ietf.org/html/rfc6838).

Some examples of possible media type definitions:
```
  text/plain; charset=utf-8
  application/json
  application/vnd.github+json
  application/vnd.github.v3+json
  application/vnd.github.v3.raw+json
  application/vnd.github.v3.text+json
  application/vnd.github.v3.html+json
  application/vnd.github.v3.full+json
  application/vnd.github.v3.diff
  application/vnd.github.v3.patch
```
##### <a name="httpCodes"></a>HTTP Status Codes
The HTTP Status Codes are used to indicate the status of the executed operation. 
The available status codes are defined by [RFC 7231](http://tools.ietf.org/html/rfc7231#section-6) and registered status codes are listed in the [IANA Status Code Registry](http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml).

## Specification

### Format

The files describing the RESTful API in accordance with this specification are represented as JSON objects and conform to the JSON standards.
YAML, being a superset of JSON, can be used as well to represent an OAS file. 

For example, if a field has an array value, the JSON array representation will be used:

```json
{
   "field": [...]
}
```

While the API is described using JSON, it does not impose a JSON input/output to the API itself.

All field names in the specification are **case sensitive**.

The schema exposes two types of fields: Fixed fields, which have a declared name, and Patterned fields, which declare a regex pattern for the field name.

Patterned fields can have multiple occurrences as long as each has a unique name. 

In order to preserve the ability to round-trip between YAML and JSON formats, YAML version [1.2](http://www.yaml.org/spec/1.2/spec.html) is recommended along with some additional constraints:

- Tags MUST be limited to those allowed by the [JSON Schema ruleset](http://www.yaml.org/spec/1.2/spec.html#id2803231)
- Keys used in YAML maps MUST be limited to a scalar string, as defined by the [YAML Failsafe schema ruleset](http://yaml.org/spec/1.2/spec.html#id2802346)

### <a name="fileStructure"></a>File Structure

The OAS representation of the API is made of a single file.
However, parts of the definitions can be split into separate files, at the discretion of the user.
This is applicable for `$ref` fields in the specification as follows from the [JSON Schema](http://json-schema.org) definitions.

By convention, it is RECOMMENDED that the OpenAPI Specification (OAS) file be named `openapi.json` or `openapi.yaml`.

### <a name="dataTypes"></a>Data Types

Primitive data types in the OAS are based on the types supported by the [JSON Schema Specification Wright Draft 00](https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.2). 
Note that `integer` as a type is also supported and is defined as a JSON number without a fraction or exponent part. 
`null` is not supported as a type (see [`nullable`](#schemaNullable) for an alternative solution).
Models are described using the [Schema Object](#schemaObject) which is an extended subset of JSON Schema Specification Wright Draft 00.

<a name="dataTypeFormat"></a>Primitives have an optional modifier property: `format`.
OAS uses several known formats to more finely define the data type being used.
However, the `format` property is an open `string`-valued property, and can have any value to support documentation needs.
Formats such as `"email"`, `"uuid"`, etc., can be used even though they are not defined by this specification.
Types that are not accompanied by a `format` property follow their definition from the JSON Schema. Tools that do not recognize a specific `format` MAY default back to the `type` alone, as if the `format` was not specified.

The formats defined by the OAS are:


Common Name | [`type`](#dataTypes) | [`format`](#dataTypeFormat) | Comments
----------- | ------ | -------- | --------
integer | `integer` | `int32` | signed 32 bits
long | `integer` | `int64` | signed 64 bits
float | `number` | `float` | |
double | `number` | `double` | |
string | `string` | | |
byte | `string` | `byte` | base64 encoded characters
binary | `string` | `binary` | any sequence of octets
boolean | `boolean` | | |
date | `string` | `date` | As defined by `full-date` - [RFC3339](http://xml2rfc.ietf.org/public/rfc/html/rfc3339.html#anchor14)
dateTime | `string` | `date-time` | As defined by `date-time` - [RFC3339](http://xml2rfc.ietf.org/public/rfc/html/rfc3339.html#anchor14)
password | `string` | `password` | Used to hint UIs the input needs to be obscured.

### <a name="richText"></a>Rich Text Formatting
Throughout the specification `description` fields are noted as supporting CommonMark markdown formatting.
OpenAPI compliant tooling MUST support [CommonMark 0.27](http://spec.commonmark.org/0.27/). 

### <a name="relativeReferences"></a>Relative References in URLs

Unless specified otherwise, all properties that are URLs MAY be relative references as defined by [RFC 3986](https://tools.ietf.org/html/rfc3986#section-4.2).
Relative references are resolved using the URLs defined in the [`Server Object`](#serverObject) as a Base URI.

Relative references used in `$ref` are processed as per [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03), i.e. using the URL of the current document as the base URI. See also the [Reference Object](#referenceObject).

### Schema

In the following description, if a field is not explicitly **Required** or described with a MUST or SHALL, it can be considered OPTIONAL. 

#### <a name="oasObject"></a>OpenAPI Object

This is the root document object for the API specification.
It combines what previously was the Resource Listing and API Declaration (version 1.2 and earlier) together into one document.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="oasVersion"></a>openapi | `string` | **Required.** Specifies the OpenAPI Specification version being used. It can be used by tooling Specifications and clients to interpret the version. The structure SHALL be `major`.`minor`.`patch`, where `patch` versions MUST be compatible with the existing `major`.`minor` tooling. Typically patch versions will be introduced to address errors in the documentation, and tooling SHOULD typically be compatible with the corresponding `major`.`minor` (3.0.*). Patch versions will correspond to patches of this document.
<a name="oasInfo"></a>info | [Info Object](#infoObject) | **Required.** Provides metadata about the API. The metadata can be used by the clients if needed.
<a name="oasServers"></a>servers | [[Server Object](#serverObject)] | An optional array of Server Objects which provide connectivity information to a target server.
<a name="oasPaths"></a>paths | [Paths Object](#pathsObject) | **Required.** The available paths and operations for the API.
<a name="oasComponents"></a>components | [Components Object](#componentsObject) | An element to hold various schemas for the specification.
<a name="oasSecurity"></a>security | [[Security Requirement Object](#securityRequirementObject)] | A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition.
<a name="oasTags"></a>tags | [[Tag Object](#tagObject)] | A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the [Operation Object](#operationObject) must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
<a name="oasExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation.

This object can be extended with [Specification Extensions](#specificationExtensions). 

#### <a name="oasVersionString"></a>OpenAPI Version String

The version string signifies the version of the OpenAPI Specification that the document complies to.  The format for this string MUST be `major`.`minor`.`patch`.  The `patch` MAY be suffixed by a hyphen and extra alphanumeric characters.

A `major`.`minor` SHALL be used to designate the OpenAPI Specification version, and will be considered compatible with the OpenAPI Specification specified by that `major`.`minor` version.  The patch version will not be considered by tooling, making no distinction between `3.0.0` and `3.0.1`.

In subsequent versions of the OpenAPI Specification, care will be given such that increments of the `minor` version SHOULD NOT interfere with operations of tooling developed to a lower minor version.  Thus a hypothetical `3.1.0` specification SHOULD be usable with tooling designed for `3.0.0`.


#### <a name="infoObject"></a>Info Object

The object provides metadata about the API.
The metadata can be used by the clients if needed, and can be presented in editing or documentation generation tools for convenience.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="infoTitle"></a>title | `string` | **Required.** The title of the application.
<a name="infoDescription"></a>description | `string` | A short description of the application. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="infoTermsOfService"></a>termsOfService | `string` | A URL to the Terms of Service for the API. MUST be in the format of a URL.
<a name="infoContact"></a>contact | [Contact Object](#contactObject) | The contact information for the exposed API.
<a name="infoLicense"></a>license | [License Object](#licenseObject) | The license information for the exposed API.
<a name="infoVersion"></a>version | `string` | **Required.** The version of the API definition (which is distinct from the OpenAPI specification version or the API implementation version).


This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Info Object Example:

```json
{
  "title": "Sample Pet Store App",
  "description": "This is a sample server for a pet store.",
  "termsOfService": "http://example.com/terms/",
  "contact": {
    "name": "API Support",
    "url": "http://www.example.com/support",
    "email": "support@example.com"
  },
  "license": {
    "name": "Apache 2.0",
    "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
  },
  "version": "1.0.1"
}
```

```yaml
title: Sample Pet Store App
description: This is a sample server for a pet store.
termsOfService: http://example.com/terms/
contact:
  name: API Support
  url: http://www.example.com/support
  email: support@example.com
license:
  name: Apache 2.0
  url: http://www.apache.org/licenses/LICENSE-2.0.html
version: 1.0.1
```

#### <a name="contactObject"></a>Contact Object

Contact information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="contactName"></a>name | `string` | The identifying name of the contact person/organization.
<a name="contactUrl"></a>url | `string` | The URL pointing to the contact information. MUST be in the format of a URL.
<a name="contactEmail"></a>email | `string` | The email address of the contact person/organization. MUST be in the format of an email address.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Contact Object Example:

```json
{
  "name": "API Support",
  "url": "http://www.example.com/support",
  "email": "support@example.com"
}
```

```yaml
name: API Support
url: http://www.example.com/support
email: support@example.com
```

#### <a name="licenseObject"></a>License Object

License information for the exposed API.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="licenseName"></a>name | `string` | **Required.** The license name used for the API.
<a name="licenseUrl"></a>url | `string` | A URL to the license used for the API. MUST be in the format of a URL.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### License Object Example:

```json
{
  "name": "Apache 2.0",
  "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
}
```

```yaml
name: Apache 2.0
url: http://www.apache.org/licenses/LICENSE-2.0.html
```

#### <a name="serverObject"></a>Server Object

An object representing a Server.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="serverUrl"></a>url | `string` | **Required.** A URL to the target host.  This URL supports Server Variables and may be relative, to indicate that the host location is relative to the location where the OpenAPI definition is being served. Variable substitutions will be made when a variable is named in `{`brackets`}`.
<a name="serverDescription"></a>description | `string` | An optional string describing the host designated by the URL. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="serverVariables"></a>variables | [Server Variables Object](#serverVariablesObject) | An object holding variables for substitution in the URL template.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Server Object Example

A single server would be described as:

```yaml
url: https://development.gigantic-server.com/v1
description: Development server
```

The following shows how multiple servers can be described, for example, at the OpenAPI Object's [`servers`](#oasServers):

```yaml
servers:
- url: https://development.gigantic-server.com/v1
  description: Development server
- url: https://staging.gigantic-server.com/v1
  description: Staging server
- url: https://api.gigantic-server.com/v1
  description: Production server
```

The following shows how variables can be used for a server configuration:

```yaml
servers:
- url: https://{username}.gigantic-server.com:{port}/{basePath}
  description: The production API server
  variables:
    username:
      # note! no enum here means it is an open value
      default: demo
      description: this value is assigned by the service provider, in this example `gigantic-server.com`
    port:
      enum:
        - 8443
        - 443
      default: 8443
    basePath:
      # open meaning there is the opportunity to use special base paths as assigned by the provider, default is `v2`
      default: v2
```

#### <a name="serverVariablesObject"></a>Server Variables Object

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="serverVariablesName"></a> {name} | [Server Variable Object](#serverVariableObject) | A variable to be used for substitution in a Server's URL template.

This object can be extended with [Specification Extensions](#specificationExtensions). 


#### <a name="serverVariableObject"></a>Server Variable Object

An object representing a Server Variable for server URL template substitution.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="serverVariableEnum"></a>enum | [`string`] | An enumeration of primitive type values to be used if the substitution options are from a limited set.
<a name="serverVariableDefault"></a>default | `string` |  **Required.** The default value to use for substitution if an alternate value is not specified, and will be sent if an alternative value is _not_ supplied. Unlike the [Schema Object's](#schemaObject) `default`, this value MUST be provided by the consumer.
<a name="serverVariableDescription"></a>description | `string` | An optional description for the server variable. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.

This object can be extended with [Specification Extensions](#specificationExtensions). 

#### <a name="componentsObject"></a>Components Object

Holds a set of reusable objects for different aspects of the OAS.
All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.


##### Fixed Fields

Field Name | Type | Description
---|:---|---
<a name="componentsSchemas"></a> schemas | Map[`string`, [Schema Object](#schemaObject)] | An object to hold reusable [Schema Objects](#schemaObject).
<a name="componentsResponses"></a> responses | Map[`string`, [Response Object](#responseObject)] | An object to hold reusable [Response Objects](#responseObject).
<a name="componentsParameters"></a> parameters | Map[`string`, [Parameter Object](#parameterObject)] | An object to hold reusable [Parameter Objects](#parameterObject).
<a name="componentsExamples"></a> examples | Map[`string`, [Example Object](#exampleObject)] | An object to hold reusable [Example Objects](#exampleObject).
<a name="componentsRequestBodies"></a> requestBodies | Map[`string`, [Request Body Object](#requestBodyObject)] | An object to hold reusable [Request Body Objects](#requestBodyObject).
<a name="componentsHeaders"></a> headers | Map[`string`, [Header Object](#headerObject)] | An object to hold reusable [Header Objects](#headerObject).
<a name="componentsSecuritySchemes"></a> securitySchemes| Map[`string`, [Security Scheme Object](#securitySchemeObject)] | An object to hold reusable [Security Scheme Objects](#securitySchemeObject).
<a name="componentsLinks"></a> links | Map[`string`, [Link Object](#linkObject)] | An object to hold reusable [Link Objects](#linkObject).
<a name="componentsCallbacks"></a> callbacks | Map[`string`, [Callback Object](#callbackObject)] | An object to hold reusable [Callback Objects](#callbackObject).

This object can be extended with [Specification Extensions](#specificationExtensions). 

All the fixed fields declared above are objects that MUST use keys that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.

Field Name Examples:

```
User
User_1
User_Name
user-name
my.org.User
my\org\User
```

##### Components Object Example

```json
"components": {
  "schemas": {
      "Category": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        }
      },
      "Tag": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        }
      }
    }
  },
  "parameters": {
    "skipParam": {
      "name": "skip",
      "in": "query",
      "description": "number of items to skip",
      "required": true,
      "schema": {
        "type": "integer",
        "format": "int32"
      }
    },
    "limitParam": {
      "name": "limit",
      "in": "query",
      "description": "max records to return",
      "required": true,
      "schema" : {
        "type": "integer",
        "format": "int32"
      }
    }
  },
  "responses": {
    "NotFound": {
      "description": "Entity not found."
    },
    "IllegalInput": {
      "description": "Illegal input for operation."
    },
    "GeneralError": {
      "description": "General Error",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/GeneralError"
          }
        }
      }
    }
  },
  "securitySchemes": {
    "api_key": {
      "type": "apiKey",
      "name": "api_key",
      "in": "header"
    },
    "petstore_auth": {
      "type": "oauth2",
      "flows": {
        "implicit": {
          "authorizationUrl": "http://example.org/api/oauth/dialog",
          "scopes": {
            "write:pets": "modify pets in your account",
            "read:pets": "read your pets"
          }
        }
      }
    }
  }
}
```

```yaml
components:
  schemas:
    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
  parameters:
    skipParam:
      name: skip
      in: query
      description: number of items to skip
      required: true
      schema:
        type: integer
        format: int32
    limitParam:
      name: limit
      in: query
      description: max records to return
      required: true
      schema:
        type: integer
        format: int32
  responses:
    NotFound:
      description: Entity not found.
    IllegalInput:
      description: Illegal input for operation.
    GeneralError:
      description: General Error
      content:
        application/json
          schema:
            $ref: '#/components/schemas/GeneralError'
  securitySchemas:
    api_key:
      type: apiKey
      name: api_key
      in: header
    petstore_auth:
      type: oauth2
      flows: 
        implicit:
          authorizationUrl: http://example.org/api/oauth/dialog
          scopes:
            write:pets: modify pets in your account
            read:pets: read your pets
```


#### <a name="pathsObject"></a>Paths Object

Holds the relative paths to the individual endpoints and their operations.
The path is appended to the URL from the [`Server Object`](#serverObject) in order to construct the full URL.  The Paths MAY be empty, due to [ACL constraints](#securityFiltering).

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="pathsPath"></a>/{path} | [Path Item Object](#pathItemObject) | A relative path to an individual endpoint. The field name MUST begin with a slash. The path is **appended** (no relative URL resolution) to the expanded URL from the [`Server Object`](#serverObject)'s `url` field in order to construct the full URL. [Path templating](#pathTemplating) is allowed.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Paths Object Example

```json
{
  "/pets": {
    "get": {
      "description": "Returns all pets from the system that the user has access to",
      "responses": {
        "200": {          
          "description": "A list of pets.",
          "content": {
            "application/json": {
              "schema": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/pet"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

```yaml
/pets:
  get:
    description: Returns all pets from the system that the user has access to
    responses:
      '200':
        description: A list of pets.
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/pet'
```

#### <a name="pathItemObject"></a>Path Item Object

Describes the operations available on a single path.
A Path Item MAY be empty, due to [ACL constraints](#securityFiltering).
The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="pathItemRef"></a>$ref | `string` | Allows for an external definition of this path item. The referenced structure MUST be in the format of a [Path Item Object](#pathItemObject). If there are conflicts between the referenced definition and this Path Item's definition, the behavior is *undefined*.
<a name="pathItemSummary"></a>summary| `string` | An optional, string summary, intended to apply to all operations in this path.
<a name="pathItemDescription"></a>description | `string` | An optional, string description, intended to apply to all operations in this path. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="pathItemGet"></a>get | [Operation Object](#operationObject) | A definition of a GET operation on this path.
<a name="pathItemPut"></a>put | [Operation Object](#operationObject) | A definition of a PUT operation on this path.
<a name="pathItemPost"></a>post | [Operation Object](#operationObject) | A definition of a POST operation on this path.
<a name="pathItemDelete"></a>delete | [Operation Object](#operationObject) | A definition of a DELETE operation on this path.
<a name="pathItemOptions"></a>options | [Operation Object](#operationObject) | A definition of a OPTIONS operation on this path.
<a name="pathItemHead"></a>head | [Operation Object](#operationObject) | A definition of a HEAD operation on this path.
<a name="pathItemPatch"></a>patch | [Operation Object](#operationObject) | A definition of a PATCH operation on this path.
<a name="pathItemTrace"></a>trace | [Operation Object](#operationObject) | A definition of a TRACE operation on this path.
<a name="pathItemServers"></a>servers | [[Server Object](#serverObject)] | An alternative `server` array to service all operations in this path.
<a name="pathItemParameters"></a>parameters | [[Parameter Object](#parameterObject) \| [Reference Object](#referenceObject)] | A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a [name](#parameterName) and [location](#parameterIn). The list can use the [Reference Object](#referenceObject) to link to parameters that are defined at the [OpenAPI Object's components/parameters](#componentsParameters). 


This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Path Item Object Example

```json
{
  "get": {
    "description": "Returns pets based on ID",
    "summary": "Find pets by ID",
    "operationId": "getPetsById",
    "responses": {
      "200": {
        "description": "pet response",
        "content": {
          "*/*": {
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Pet"
              }
            }
          }
        }
      },
      "default": {
        "description": "error payload",
        "content": {
          "text/html": {
            "schema": {
              "$ref": "#/components/schemas/ErrorModel"
            }
          }
        }
      }
    }
  },
  "parameters": [
    {
      "name": "id",
      "in": "path",
      "description": "ID of pet to use",
      "required": true,
      "type": "array",
      "items": {
        "type": "string"
      },
      "style": "commaDelimited"
    }
  ]
}
```

```yaml
get:
  description: Returns pets based on ID
  summary: Find pets by ID
  operationId: getPetsById
  responses:
    '200':
      description: pet response
      content:
        '*/*' :
          schema:
            type: array
            items:
              $ref: '#/components/schemas/Pet'
    default:
      description: error payload
      content:
        'text/html':
          schema:
            $ref: '#/components/schemas/ErrorModel'
parameters:
- name: id
  in: path
  description: ID of pet to use
  required: true
  type: array
  format: form
  items:
    type: string  
```

#### <a name="operationObject"></a>Operation Object

Describes a single API operation on a path.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="operationTags"></a>tags | [`string`] | A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
<a name="operationSummary"></a>summary | `string` | A short summary of what the operation does. For maximum readability in editing or documentation generation tools, this field SHOULD be less than 120 characters.
<a name="operationDescription"></a>description | `string` | A verbose explanation of the operation behavior. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="operationExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this operation.
<a name="operationId"></a>operationId | `string` | Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is recommended to follow common programming naming conventions.
<a name="operationParameters"></a>parameters | [[Parameter Object](#parameterObject) \| [Reference Object](#referenceObject)] | A list of parameters that are applicable for this operation. If a parameter is already defined at the [Path Item](#pathItemParameters), the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a [name](#parameterName) and [location](#parameterIn). The list can use the [Reference Object](#referenceObject) to link to parameters that are defined at the [OpenAPI Object's components/parameters](#componentsParameters).
<a name="operationRequestBody"></a>requestBody | [Request Body Object](#requestBodyObject) \| [Reference Object](#referenceObject) | The request body applicable for this operation.  The `requestBody` is only supported in HTTP methods where the [HTTP 1.1 specification](https://tools.ietf.org/html/rfc7231#section-4.3.1) has explicitly defined semantics for request bodies.  In other cases where the HTTP spec is vague, `requestBody` SHALL be ignored by consumers.
<a name="operationResponses"></a>responses | [Responses Object](#responsesObject) | **Required.** The list of possible responses as they are returned from executing this operation.
<a name="operationCallbacks"></a>callbacks | [Callbacks Object](#callbacksObject) | The list of possible callbacks as they are returned from executing this operation.
<a name="operationDeprecated"></a>deprecated | `boolean` | Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is `false`.
<a name="operationSecurity"></a>security | [[Security Requirement Object](#securityRequirementObject)] | A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. This definition overrides any declared top-level [`security`](#oasSecurity). To remove a top-level security declaration, an empty array can be used.
<a name="operationServers"></a>servers | [[Server Object](#serverObject)] | An alternative `server` array to service this operation. If an alternative `server` object is specified at the Path Item Object or Root level, it will be overridden by this value.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Operation Object Example

```json
{
  "tags": [
    "pet"
  ],
  "summary": "Updates a pet in the store with form data",
  "operationId": "updatePetWithForm",
  "parameters": [
    {
      "name": "petId",
      "in": "path",
      "description": "ID of pet that needs to be updated",
      "required": true,
      "type": "string"
    }
  ],
  "requestBody": {
    "content": {
      "application/x-www-form-urlencoded": {
        "schema": {
          "type": "object",
           "properties": {
              "name": { 
                "description": "Updated name of the pet",
                "type": "string"
              },
              "status": {
                "description": "Updated status of the pet",
                "type": "string"
             }
           },
        "required": ["status"] 
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "Pet updated.",
      "content": {
        "application/json": {},
        "application/xml": {}
      }
    },
    "405": {
      "description": "Invalid input",
      "content": {
        "application/json": {},
        "application/xml": {}
      }
    }
  },
  "security": [
    {
      "petstore_auth": [
        "write:pets",
        "read:pets"
      ]
    }
  ]
}
```

```yaml
tags:
- pet
summary: Updates a pet in the store with form data
operationId: updatePetWithForm
parameters:
- name: petId
  in: path
  description: ID of pet that needs to be updated
  required: true
  type: string
requestBody:
  content:
    'application/x-www-form-urlencoded':
      schema:
       properties:
          name: 
            description: Updated name of the pet
            type: string
          status:
            description: Updated status of the pet
            type: string
        required: 
          - status
responses:
  '200':
    description: Pet updated.
    content: 
      'application/json': {}
      'application/xml': {}
  '405':
    description: Invalid input
    content: 
      'application/json': {}
      'application/xml': {}
security:
- petstore_auth:
  - write:pets
  - read:pets
```


#### <a name="externalDocumentationObject"></a>External Documentation Object

Allows referencing an external resource for extended documentation.

##### Fixed Fields

Field Name | Type | Description
---|:---:|---
<a name="externalDocDescription"></a>description | `string` | A short description of the target documentation. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="externalDocUrl"></a>url | `string` | **Required.** The URL for the target documentation. Value MUST be in the format of a URL.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### External Documentation Object Example

```json
{
  "description": "Find more info here",
  "url": "https://example.com"
}
```

```yaml
description: Find more info here
url: https://example.com
```

#### <a name="parameterObject"></a>Parameter Object

Describes a single operation parameter.

A unique parameter is defined by a combination of a [name](#parameterName) and [location](#parameterIn).

##### Parameter Locations
There are four possible parameter locations (as specified with the `in` field):
* path - Used together with [Path Templating](#pathTemplating), where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is `itemId`.
* query - Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is `id`.
* header - Custom headers that are expected as part of the request. Note that [RFC 7230](https://tools.ietf.org/html/rfc7230#page-22) states header names are case insensitive.
* cookie - Used to pass a specific cookie value to the API.


##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="parameterName"></a>name | `string` | **Required.** The name of the parameter. Parameter names are *case sensitive*. <ul><li>If [`in`](#parameterIn) is `"path"`, the `name` field MUST correspond to the associated path segment from the [path](#pathsPath) field in the [Paths Object](#pathsObject). See [Path Templating](#pathTemplating) for further information.<li>If [`in`](#parameterIn) is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored.<li>For all other cases, the `name` corresponds to the parameter name used based on the [`in`](#parameterIn) property.</ul>
<a name="parameterIn"></a>in | `string` | **Required.** The location of the parameter. Possible values are "query", "header", "path" or "cookie".
<a name="parameterDescription"></a>description | `string` | A brief description of the parameter. This could contain examples of use.  [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="parameterRequired"></a>required | `boolean` | Determines whether this parameter is mandatory. If the [parameter location](#parameterIn) is "path", this property is **required** and its value MUST be `true`. Otherwise, the property MAY be included and its default value is `false`. 
<a name="parameterDeprecated"></a> deprecated | `boolean` | Specifies that a parameter is deprecated and SHOULD be transitioned out of usage.
<a name="parameterAllowEmptyValue"></a> allowEmptyValue | `boolean` | Sets the ability to pass empty-valued parameters. This is valid only for `query` parameters and allows sending a parameter with an empty value. Default value is `false`. If [`style`](#parameterStyle) is used, if behavior is `n/a`, the value of `allowEmptyValue` SHALL be ignored.

The rules for serialization of the parameter are specified in one of two ways.
For simpler scenarios, a [`schema`](#parameterSchema) and [`style`](#parameterStyle) can be used to describe the structure and syntax of the parameter.

Field Name | Type | Description
---|:---:|---
<a name="parameterStyle"></a>style | `string` | Describes how the parameter value will be serialized depending on type of the parameter value. Default values (based on value of `in`): for `query` - `form`; for `path` - `simple`; for `header` - `simple`; for `cookie` - `form`.
<a name="parameterExplode"></a>explode | `boolean` | When this is true, parameter values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map.  For other types of parameters this property has no effect. When [`style`](#parameterStyle) is `form`, the default value is `true`. For all other styles, the default value is `false`.
<a name="parameterAllowReserved"></a>allowReserved | `boolean` | Determines whether the parameter value SHOULD allow reserved characters, as defined by [RFC3986](https://tools.ietf.org/html/rfc3986#section-2.2) `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. This property only applies to parameters with an `in` value of `query`. The default value is `false`.
<a name="parameterSchema"></a>schema | [Schema Object](#schemaObject) \| [Reference Object](#referenceObject)] | The schema defining the type used for the parameter.
<a name="parameterExample"></a>example | Any | Example of the media type.  The example SHOULD match the specified schema and encoding properties if present.  The `example` object is mutually exclusive to the `examples` object.  Furthermore, if referencing a `schema` which contains an example, the `example` value SHALL _override_ the the example provided by the schema. To represent examples of media types that cannot naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
<a name="parameterExamples"></a>examples | Map[ `string`, [Example Object](#exampleObject) \| [Reference Object](#referenceObject)] | Examples of the media type.  Each example SHOULD contain a value in the correct format as specified in the parameter encoding.  The `examples` object is mutually exclusive to the `example` object.  Furthermore, if referencing a `schema` which contains an example, the `examples` value SHALL _override_ the example provided by the schema.

For more complex scenarios a [Content Object](#contentObject) can be used to define the media type and schema of the parameter.
A parameter MUST contain either a `schema` property, or a `content` property, but not both.
When `example` or `examples` are provided in conjunction with the `schema` object, 
the example MUST follow the prescribed serialization strategy for the parameter.


Field Name | Type | Description
---|:---:|---
<a name="parameterContent"></a>content | [Content Object](#contentObject) | The content of the parameter.

##### Style Values

In order to support common ways of serializing simple parameters, a set of `style` values are defined.

`style` | [`type`](#dataTypes) |  `in` | Comments
----------- | ------ | -------- | --------
matrix |  `primitive`, `array`, `object` |  `path` | Path-style parameters defined by [RFC6570](https://tools.ietf.org/html/rfc6570#section-3.2.7) 
label | `primitive`, `array`, `object` |  `path` | Label style parameters defined by [RFC6570](https://tools.ietf.org/html/rfc6570#section-3.2.5)
form |  `primitive`, `array`, `object` |  `query`, `cookie` | Form style parameters defined by [RFC6570](https://tools.ietf.org/html/rfc6570#section-3.2.8). This option replaces `collectionFormat` with a `csv` value. 
simple | `array` | `path`, `header` | Simple style parameters defined by [RFC6570](https://tools.ietf.org/html/rfc6570#section-3.2.2).
spaceDelimited | `array` | `query` | Space separated array values. This option replaces `collectionFormat` equal to `ssv`. 
pipeDelimited | `array` | `query` | Pipe separated array values. This option replaces `collectionFormat` equal to `pipes`.
deepObject | `object` | `query` | Provides a simple way of rendering nested objects using form parameters.


##### Style Examples

Assuming a parameter named `color` with one of the following values:

```
   string -> "blue"
   array -> ["blue","black","brown"]
   object -> { "R": 100, "G": 200, "B": 150 }
```
The following table shows examples of how those values would be rendered.

[`style`](#dataTypeFormat) | `explode` | `empty` | `string` | `array` | `object`
----------- | ------ | -------- | -------- | --------|-------
matrix | false | ;color | ;color=blue | ;color=blue,black,brown | ;color=R,100,G,200,B,150
matrix | true | ;color | ;color=blue | ;color=blue;color=black;color=brown | ;R=100;G=200;B=150
label | false | .  | .blue |  .blue.black.brown | .R.100.G.200.B.150
label | true | . | .blue |  .blue.black.brown | .R=100.G=200.B=150
form | false | color= | color=blue | color=blue,black,brown | color=R,100,G,200,B,150
form | true | color= | color=blue | color=blue&color=black&color=brown | R=100&G=200&B=150
simple | false | n/a | blue | blue,black,brown | R,100,G,200,B,150
simple | true | n/a | blue | blue,black,brown | R=100,G=200,B=150
spaceDelimited | false | n/a | n/a | blue%20black%20brown | R%20100%20G%20200%20B%20150
pipeDelimited | false | n/a | n/a | blue\|black\|brown | R\|100\|G\|200|G\|150
deepObject | true | n/a | n/a | n/a | color[R]=100&color[G]=200&color[B]=150

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Parameter Object Examples

A header parameter with an array of 64 bit integer numbers:

```json
{
  "name": "token",
  "in": "header",
  "description": "token to be passed as a header",
  "required": true,
  "schema": {
    "type": "array",
    "items": {
      "type": "integer",
      "format": "int64"
    }
  },
  "style": "commaDelimited"
}
```

```yaml
name: token
in: header
description: token to be passed as a header
required: true
schema:
  type: array
  items:
    type: integer
    format: int64
style: commaDelimited
```

A path parameter of a string value:
```json
{
  "name": "username",
  "in": "path",
  "description": "username to fetch",
  "required": true,
  "schema": {
    "type": "string"
  }
}
```

```yaml
name: username
in: path
description: username to fetch
required: true
schema:
  type: string
```

An optional query parameter of a string value, allowing multiple values by repeating the query parameter:
```json
{
  "name": "id",
  "in": "query",
  "description": "ID of the object to fetch",
  "required": false,
  "schema": {
    "type": "array",
    "items": {
      "type": "string"
    }
  },
  "style": "form",
  "explode": true
}
```

```yaml
name: id
in: query
description: ID of the object to fetch
required: false
schema:
  type: array
  items:
    type: string
style: form
explode: true
```

A free-form query parameter, allowing undefined parameters of a specific type:
```json
{
  "in": "query",
  "name": "freeForm",
  "schema": {
    "type": "object",
    "additionalProperties": {
      "type": "integer"
    },
  },
  "style": "form"
}
```

```yaml
in: query
name: freeForm
schema:
  type: object
  additionalProperties:
    type: integer
style: form
```

#### <a name="requestBodyObject"></a>Request Body Object

Describes a single request body.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="requestBodyDescription"></a>description | `string` | A brief description of the request body. This could contain examples of use.  [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="requestBodyContent"></a>content | [Content Object](#contentObject) | **Required.** The content of the request body.
<a name="requestBodyRequired"></a>required | `boolean` | Determines if the request body is required in the request. Defaults to `false`.


This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Request Body Examples

A request body with a referenced model definition.
```json
{
  "description": "user to add to the system",
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/User"
      },
      "examples": {
          "user" : {
            "summary": "User Example", 
            "externalValue": "http://foo.bar/examples/user-example.json"
          } 
        }
    },
    "application/xml": {
      "schema": {
        "$ref": "#/components/schemas/User"
      },
      "examples": {
          "user" : {
            "summary": "User example in XML",
            "externalValue": "http://foo.bar/examples/user-example.xml"
          }
        }
    },
    "text/plain": {
      "examples": {
        "user" : {
            "summary": "User example in Plain text",
            "externalValue": "http://foo.bar/examples/user-example.txt" 
        }
      } 
    },
    "*/*": {
      "examples": {
        "user" : {
            "summary": "User example in other format",
            "externalValue": "http://foo.bar/examples/user-example.whatever"
        }
      }
    }
  }
}
```

```yaml
description: user to add to the system
content: 
  'application/json':
    schema:
      $ref: '#/components/schemas/User'
    examples:
      user:
        summary: User Example
        externalValue: 'http://foo.bar/examples/user-example.json'
  'application/xml':
    schema:
      $ref: '#/components/schemas/User'
    examples:
      user:
        summary: User Example in XML
        externalValue: 'http://foo.bar/examples/user-example.xml'
  'text/plain':
    examples:
      user:
        summary: User example in text plain format
        externalValue: 'http://foo.bar/examples/user-example.txt'
  '*/*':
    examples:
      user: 
        summary: User example in other format
        externalValue: 'http://foo.bar/examples/user-example.whatever'
```

A body parameter that is an array of string values:
```json
{
  "description": "user to add to the system",
  "content": {
    "text/plain": {
      "schema": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    }
  }
}
```

```yaml
description: user to add to the system
required: true
content:
  text/plain:
    schema:
      type: array
      items:
        type: string
```


#### <a name="contentObject"></a>Content Object

Describes a set of supported media types. A Content Object can be used in [Request Body Object](#requestBodyObject),
[Parameter Objects](#parameterObject), [Header Objects](#headerObject), and [Response Objects](#responseObject).

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="contentMediaType"></a>{mediaType} | [Media Type Object](#mediaTypeObject) | A media type that is supported by this container. The key should be the media type and the value is used to describe it.

##### Content Examples

```js
"content": {
  "application/json": {
    "schema": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "examples": {
      "list": {
        "summary": "List of names",
        "value" : ["Bob","Diane","Mary","Bill"]
        },
      "empty":{
        "summary": "Empty List",
        "value": []
      } 
    }
  },
  "application/xml": {
    "examples": { 
      "list": { 
        "summary": "List of names",
        "value": "<Users><User name='Bob'/><User name='Diane'/><User name='Mary'/><User name='Bill'/></Users>"
      },
      "empty": {
        "summary":"Empty",
        "value": "<Users/>"
      }
    }
  },
  "text/plain": {
    "examples": {
      "list": {
        "summary": "List of names",
        "value": "Bob,Diane,Mary,Bill"
      },
      "empty": {
        "summary": "Empty",
        "value" : ""
      }
    }
  }
}
```

```yaml
content:
  'application/json': 
    schema:
      type: array
      items:
        type: string
    examples:
      list:
        summary: List of Names
        value:
          - Bob
          - Diane
          - Mary
          - Bill
      empty:
        summary: Empty
        value: {}

  'application/xml': 
    examples:
      list:
        summary: List of names
        value: "<Users><User name='Bob'/><User name='Diane'/><User name='Mary'/><User name='Bill'/></Users>"
      empty:
        summmary: Empty list
        value: "<Users/>"
  'text/plain':
    examples:
      list:
        summary: List of names
        value: "Bob,Diane,Mary,Bill"
      empty:
        summary: Empty
        value: ""
```

#### <a name="mediaTypeObject"></a>Media Type Object
Each Media Type Object provides schema and examples for a the media type identified by its key.  Media Type Objects can be used in a [Content Object](#contentObject).   

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="mediaTypeSchema"></a>schema | [Schema Object](#schemaObject) \| [Reference Object](#referenceObject) | The schema defining the type used for the request body.
<a name="mediaTypeExample"></a>example | Any | Example of the media type.  The example object SHOULD be in the correct format as specified in the media type.  The `example` object is mutually exclusive to the `examples` object.  Furthermore, if referencing a `schema` which contains an example, the `example` value SHALL _override_ the the example provided by the schema.
<a name="mediaTypeExamples"></a>examples | Map[ `string`, [Example Object](#exampleObject) \| [Reference Object](#referenceObject)] | Examples of the media type.  Each example object SHOULD  match the media type and specified schema if present.  The `examples` object is mutually exclusive to the `example` object.  Furthermore, if referencing a `schema` which contains an example, the `examples` value SHALL _override_ the example provided by the schema.
<a name="mediaTypeEncoding"></a>encoding | [Encoding Object](#encodingObject) | Encoding of the media type.  The encoding object SHOULD only apply to `requestBody` objects when the content type is `multipart`.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Media Type Examples

```js
{
  "application/json": {
    "schema": {
         "$ref": "#/components/schemas/Pet"
    },
    "examples": {
      "cat" : {
        "summary": "An example of a cat",
        "value": 
          {
            "name": "Fluffy",
            "petType": "Cat",
            "color": "White",
            "gender": "male",
            "breed": "Persian"
          }
      },
      "dog": {
        "summary": "An example of a dog with a cat's name",
        "value" :  { 
          "name": "Puma",
          "petType": "Dog",
          "color": "Black",
          "gender": "Female",
          "breed": "Mixed"
        },
      "frog": {
          "$ref": "#/components/examples/frog-example"
        }
      }
    }
  }
}
```

```yaml
application/json: 
  schema:
    $ref: "#/components/schemas/Pet"
  examples:
    cat:
      summary: An example of a cat
      value:
        name: Fluffy
        petType: Cat
        color: White
        gender: male
        breed: Persian
    dog:
      summary: An example of a dog with a cat's name
      value:
        name: Puma
        petType: Dog
        color: Black
        gender: Female
        breed: Mixed
    frog:
      $ref: "#/components/examples/frog-example"
```

##### Considerations for file uploads

In contrast with the 2.0 specification, describing `file` input/output content in OpenAPI is 
described with the same semantics as any other schema type. Specifically:

```yaml
# content transferred with base64 encoding
schema:
  type: string
  format: base64

# content transferred in binary (octet-stream):
schema:
  type: string
  format: binary
```

Note that the above examples apply to either input payloads (i.e. file uploads) or response payloads.

A `requestBody` example for submitting a file in a `POST` operation therefore may look like the following:

```yaml
requestBody:
  content:
    application/octet-stream:
      # any media type is accepted, functionally equivalent to `*/*`
      schema:
        # a binary file of any type
        type: string
        format: binary
```

In addition, specific media types may be specified:

```yaml
# multiple, specific media types may be specified:
requestBody:
  content:
    'image/png, image/jpeg':
      # a binary file of type png or jpeg
      schema:
        type: string
        format: binary
```

##### Support for x-www-form-urlencoded request bodies

To submit content using form url encoding via RFC 1866, the following
definition may be used:

```yaml
requestBody:
  content:
    x-www-form-urlencoded:
      schema:
        type: object
        properties:
          id:
            type: string
            format: uuid
          address:
            # complex types are stringified to support RFC1866
            type: object
            properties: {}
```

Note that in the above example, the contents in the `requestBody` MUST be stringified per RFC1866 when being passed to the server.  In addition, the `address` field complex object will be stringified as well.

When passing complex objects in the `x-www-form-urlencoded` content type, the default serialization strategy of such properties is described in the `parameterContent` section as `form`.

##### Special Considerations for `multipart` content

It is common to use `multipart/form-data` as a `Content-Type` when transferring request bodies to operations.  In contrast to 2.0, a `schema` is required to define the input parameters to the operation when using `multipart` content.  This allows complex structures as well as supporting mechanisms for multiple file uploads.

When passing in `multipart` types, boundaries MAY be used to separate sections of the content being transferred — thus, the following default `Content-Type`s are defined for `multipart/*`:

* If the property is a primitive, or an array of primitive values, the default Content-Type is `text/plain`
* If the property is complex, or an array of complex values, the default Content-Type is `application/json`
* If the property is a `type: string` with `format: binary` or `format: base64` (aka a file object), the default Content-Type is `application/octet-stream`


Examples:

```yaml
requestBody:
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          id:
            type: string
            format: uuid
          address:
            # default Content-Type for objects is `application/json`
            type: object
            properties: {}
          profileImage:
            # default Content-Type for string/binary is `application/octet-stream`
            type: string
            format: binary
          children:
            # default Content-Type for arrays is based on the `inner` type (text/plain here)
            type: array
            items:
              type: string
          addresses:
            # default Content-Type for arrays is based on the `inner` type (object shown, so `application/json` in this example)
            type: array
            items:
              type: '#/components/schemas/Address'
```

In scenarios where more control is needed over the Content-Type for `multipart` request bodies, an `encoding` attribute is introduced.  This attribute is _only_ applicable to `multipart/*` and `x-www-form-urlencoded` request bodies.

#### <a name="encodingObject"></a>Encoding Object

An object representing multipart region encoding for `requestBody` objects.

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="encodingProperty"></a>{property} | [Encoding Property Object](#encodingPropertyObject) | The property name to which the special encoding are applied.  This field MUST exist in the schema as a property.

##### Encoding Object Example

```yaml
requestBody:
  content:
    multipart/mixed:
      schema:
        type: object
        properties:
          id:
            # default is text/plain
            type: string
            format: uuid
          address:
            # default is application/json
            type: object
            properties: {}
          historyMetadata:
            # need to declare XML format!
            description: metadata in XML format
            type: object
            properties: {}
          profileImage:
            # default is application/octet-stream, need to declare an image type only!
            type: string
            format: binary
      encoding:
        historyMetadata:
          # require XML Content-Type in utf-8 encoding
          contentType: application/xml; charset=utf-8
        profileImage:
          # only accept png/jpeg
          contentType: image/png, image/jpeg
```

#### <a name="encodingPropertyObject"></a>Encoding Property Object

A single encoding definition applied to a single schema property.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="encodingContentType"></a>contentType | `string` | The Content-Type to use for encoding a specific property. Default value depends on the property type: for `string` with `format` being `binary` – `application/octet-stream`; for other primitive types – `text/plain`; for `object` - `application/json`; for `array` – the default is defined based on the inner type.
<a name="encodingHeaders"></a>headers | `object` | A string map allowing additional information to be provided as headers, for example `Content-Disposition`.  Note `Content-Type` is described separately and will be ignored from this section.
<a name="encodingStyle"></a>style | `string` | Describes how a specific property value will be serialized depending on its type .  See [Parameter Object](#parameterObject) for details on the [`style`](#parameterStyle) property. The behavior follows the same values allowed for `query` parameters, including default values.
<a name="encodingExplode"></a>explode | `boolean` | When this is true, property values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map.  For other types of properties this property has no effect. When [`style`](#encodingStyle) is `form`, the default value is `true`. For all other styles, the default value is `false`.
<a name="encodingAllowReserved"></a>allowReserved | `boolean` | Determines whether the parameter value SHOULD allow reserved characters, as defined by [RFC3986](https://tools.ietf.org/html/rfc3986#section-2.2) `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. The default value is `false`.

This object can be extended with [Specification Extensions](#specificationExtensions). 

#### <a name="responsesObject"></a>Responses Object

A container for the expected responses of an operation.
The container maps a HTTP response code to the expected response.

It is not expected for the documentation to necessarily cover all possible HTTP response codes, since they may not be known in advance.
However, it is expected for the documentation to cover a successful operation response and any known errors.

The `default` MAY be used as a default response object for all HTTP codes 
that are not covered individually by the specification.

The `Responses Object` MUST contain at least one response code, and it 
SHOULD be the response for a successful operation call.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="responsesDefault"></a>default | [Response Object](#responseObject) \| [Reference Object](#referenceObject) | The documentation of responses other than the ones declared for specific HTTP response codes. It can be used to cover undeclared responses. [Reference Object](#referenceObject) can be used to link to a response that is defined at the [OpenAPI Object's components/responses](#componentsResponses) section.

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="responsesCode"></a>[HTTP Status Code](#httpCodes) | [Response Object](#responseObject) \| [Reference Object](#referenceObject) | Any [HTTP status code](#httpCodes) can be used as the property name (one property per HTTP status code). Describes the expected response for that HTTP status code.  [Reference Object](#referenceObject) can be used to link to a response that is defined at the [OpenAPI Object's components/responses](#componentsResponses) section. This field MUST be quoted for compatibility between JSON and YAML (i.e. "200"), and MAY contain the uppercase character, `X` to designate a wildcard, such as `2XX` to represent all response codes between `[200-299]`. If a response range is defined, and an explicit code within that range is defined as well, the explicit code definition takes precedence over the range definition for that code.


This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Responses Object Example

A 200 response for successful operation and a default response for others (implying an error):

```json
{
  "200": {
    "description": "a pet to be returned",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/Pet"
        }
      }
    }
  },
  "default": {
    "description": "Unexpected error",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorModel"
        }
      }
    }
  }
}
```

```yaml
'200':
  description: a pet to be returned
  content: 
    application/json:
      schema:
        $ref: '#/components/schemas/Pet'
default:
  description: Unexpected error
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/ErrorModel'
```

#### <a name="responseObject"></a>Response Object
Describes a single response from an API Operation, including design-time, static 
`links` to operations based on the response.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="responseDescription"></a>description | `string` | **Required.** A short description of the response. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="responseHeaders"></a>headers | [Headers Object](#headersObject) | A list of headers that are sent with the response. If a response header is defined with the name `"Content-Type"`, it SHALL be ignored.
<a name="responseContentObject"></a>content | [Content Object](#contentObject) | An object containing descriptions of potential response payloads.
<a name="responseLinks"></a>links | [Links Object](#linksObject) | An object representing operations related to the response payload.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Response Object Examples

Response of an array of a complex type:

```json
{
  "description": "A complex object array response",
  "content": {
    "application/json": {
      "schema": {
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/VeryComplexType"
        }
      }
    }
  }
}
```

```yaml
description: A complex object array response
content: 
  application/json:
    schema: 
      type: array
      items:
        $ref: '#/components/schemas/VeryComplexType'
```

Response with a string type:

```json
{
  "description": "A simple string response",
  "content": {
    "text/plain": {
      "schema": {
        "type": "string"
      }
    }
  }

}
```

```yaml
description: A simple string response
representations:
  text/plain:
    schema:
      type: string
```

Plain text response with headers:

```json
{
  "description": "A simple string response",
  "content": {
    "text/plain": {
      "schema": {
        "type": "string"
      }
    }
  },
  "headers": {
    "X-Rate-Limit-Limit": {
      "description": "The number of allowed requests in the current period",
      "type": "integer"
    },
    "X-Rate-Limit-Remaining": {
      "description": "The number of remaining requests in the current period",
      "type": "integer"
    },
    "X-Rate-Limit-Reset": {
      "description": "The number of seconds left in the current period",
      "type": "integer"
    }
  }
}
```

```yaml
description: A simple string response
content:
  text/plain:
    schema:
      type: string
    example: 'whoa!'
headers:
  X-Rate-Limit-Limit:
    description: The number of allowed requests in the current period
    type: integer
  X-Rate-Limit-Remaining:
    description: The number of remaining requests in the current period
    type: integer
  X-Rate-Limit-Reset:
    description: The number of seconds left in the current period
    type: integer
```

Response with no return value:

```json
{
  "description": "object created"
}
```

```yaml
description: object created
```

#### <a name="callbacksObject"></a>Callbacks Object

A map of possible out-of band callbacks related to the parent operation.
Each value in the map is a [Callback Object](#callbackObject) that describes a request that may be initiated by the API provider and the expected responses.
The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="callbackName"></a>{name} | [Callback Object](#callbackObject) \| [Reference Object](#referenceObject) | A Callback Object used to define a callback request and expected responses

This object can be extended with [Specification Extensions](#specificationExtensions). 

#### <a name="callbackObject"></a>Callback Object

A map of possible out-of band callbacks related to the parent operation.
Each value in the map is a [Path Item Object](#pathItemObject) that describes a set of requests that may be initiated by the API provider and the expected responses.
The key value used to identify the callback object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="callbackExpression"></a>{expression} | [Path Item Object](#pathItemObject) | A Path Item Object used to define a callback request and expected responses

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Key Expression

The key used to identify the [Path Item Object](#pathItemObject) is a variable expression that can be evaluated in the context of a runtime HTTP request/response to identify the URL to be used for the callback request.
A simple example might be `$request.body#/url`.
However, using [variable substitution](#variableSubstitution) syntax the complete HTTP message can be accessed.
This includes accessing any part of a body that can be accessed using a JSON Pointer [RFC6901](https://tools.ietf.org/html/rfc6901). 

For example, given the following HTTP request:

```http
POST /subscribe/myevent?queryUrl=http://clientdomain.com/stillrunning HTTP/1.1
Host: example.org
Content-Type: application/json
Content-Length: 123

{
  "failedUrl" : "http://clientdomain.com/failed"
  "successUrls : [
    "http://clientdomain.com/fast",
    "http://clientdomain.com/medium",
    "http://clientdomain.com/slow"
  ] 
}

201 Created
Location: http://example.org/subscription/1

```

Here are the examples of how the various expressions evaluate, assuming a the callback operation has a path parameter named `eventType` and a query parameter named `queryUrl`.

Expression | Value 
---|:---
$url | http://example.org/subscribe/myevent?queryUrl=http://clientdomain.com/stillrunning
$method | POST
$request.path.eventType | myevent
$request.query.queryUrl | http://clientdomain.com/stillrunning
$request.header.content-Type | application/json
$request.body#/failedUrl | http://clientdomain.com/stillrunning
$request.body#/successUrls/2 | http://clientdomain.com/medium
$response.header.Location | http://example.org/subscription/1


##### Callback Object Example

A callback to the URL specified by the `url` parameter in the request


```yaml
myWebhook:
  '$request.body#/url':
    post:
      requestBody:
        description: Callback payload
        content: 
          'application/json':
            schema:
              $ref: '#/components/schemas/SomePayload'
      responses:
        '200':
          description: webhook successfully processed and no retries will be performed
```


#### <a name="headersObject"></a>Headers Object
Lists the headers that can be sent in a response or forwarded via a link. Note that [RFC 7230](https://tools.ietf.org/html/rfc7230#page-22) states header names are case insensitive.

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="headersName"></a>{name} | [Header Object](#headerObject)  \| [Reference Object](#referenceObject) | The name of the property corresponds to the name of the header. The value describes the type of the header.

##### Headers Object Example

Rate-limit headers:

```json
{
    "X-Rate-Limit-Limit": {
        "description": "The number of allowed requests in the current period",
        "schema": {
            "type": "integer"
        }
    },
    "X-Rate-Limit-Remaining": {
        "description": "The number of remaining requests in the current period",
        "schema": {
            "type": "integer"
        }
    },
    "X-Rate-Limit-Reset": {
        "description": "The number of seconds left in the current period",
        "schema": {
            "type": "integer"
        }
    }
}
```

```yaml
X-Rate-Limit-Limit:
  description: The number of allowed requests in the current period
  schema:
    type: integer
X-Rate-Limit-Remaining:
  description: The number of remaining requests in the current period
  schema:
    type: integer
X-Rate-Limit-Reset:
  description: The number of seconds left in the current period
  schema:
    type: integer
```

#### <a name="exampleObject"></a>Example Object

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="exampleSummary"></a>summary | `string` | Short description for the example.
<a name="exampleDescription"></a>description | `string` | Long description for the example. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="exampleValue"></a>value | Any | Embedded literal example. The `value` field and `externalValue` field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
<a name="exampleExternalValue"></a>externalValue | `string` | A URL that points to the literal example. This provides the ability to reference examples that cannot easily be included in JSON or YAML documents.  The `value` field and `externalValue` field are mutually exclusive. 

This object can be extended with [Specification Extensions](#specificationExtensions). 

In all cases, the example value is expected to be compatible with the type schema 
for the value that it is accompanying.  Tooling implementations MAY choose to 
validate compatibility automatically, and reject the example value(s) if they 
are not compatible.

##### Example Object Example

```yaml
# in a model
schemas:
  properties:
    name:
      type: string
      examples:
        name:
          $ref: http://example.org/petapi-examples/openapi.json#/components/examples/name-example

# in a request body:
  requestBody:
    content:
      'application/json':
        schema:
          $ref: '#/components/schemas/Address'
        examples: 
          foo:
            summary: A foo example
            value: {"foo": "bar"}
          bar:
            summary: A bar example
            value: {"bar": "baz"}
      'application/xml':
        examples: 
          xmlExample:
            summary: This is an example in XML
            externalValue: 'http://example.org/examples/address-example.xml'
      'text/plain':
        examples:
          textExample: 
            summary: This is a text example
            externalValue: 'http://foo.bar/examples/address-example.txt' 


# in a parameter
  parameters:
    - name: 'zipCode'
      in: 'query'
      schema:
        type: 'string'
        format: 'zip-code'
        examples:
          zip-example: 
            $ref: '#/components/examples/zip-example'

# in a response
  responses:
    200:
      description: your car appointment has been booked
      content: 
        application/json:
          schema:
            $ref: '#/components/schemas/SuccessResponse'
          examples:
            confirmation-success:
              $ref: '#/components/examples/confirmation-success'
```

#### <a name="linksObject"></a>Links Object
The links object represents a set of possible design-time links for a response.
The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.

As opposed to _dynamic_ links (links provided **in** the response payload), the OAS linking mechanism does not require that link information be provided in a specific response format at runtime.

For computing links, and providing instructions to execute them, [variable substitution](#variableSubstitution) is used for accessing values in a response and using them as values while invoking the linked operation.

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="linksName"></a> {name} | [Link Object](#linkObject) \| [Reference Object](#referenceObject) | A short name for the link, following the naming constraints of the names for [Component Objects](#componentsObject). The link SHALL reference a single Link Object, or a JSON Reference to a single link object.

#### <a name="linkObject"></a>Link Object
The `Link Object` is responsible for defining a possible operation based on a single response.

##### Fixed Fields

Field Name  |  Type  | Description
---|:---:|---
<a name="linkOperationRef"></a>operationRef | `string` | a relative or absolute reference to an OAS operation. This field is mutually exclusive with the `operationId` field, and must point to the fragment of a valid OAS definition.
<a name="linkOperationId"></a>operationId  | `string` | the name of an _existing_, resolvable OAS operation, as defined with a unique `operationId`.  This field is mutually exclusive with the `operationRef` field.  Relative `operationRef` values MAY be used to locate an existing [Operation Object](#operationObject) in the OAS.
<a name="linkParameters"></a>parameters   | [Link Parameters Object](#linkParametersObject) | an object representing parameters to pass to an operation as specified with `operationId` or identified via `operationRef`.
<a name="linkHeaders"></a>headers      | [Headers Object](#headersObject)    | an object representing headers to pass to the linked resource. Where conflicts occur between these headers, and those defined in the related operation, these headers override.
<a name="linkDescription"></a>description  | `string` | a description of the link, supports [CommonMark syntax](http://spec.commonmark.org/).
<a name="linkServer"></a>server       | [Server Object](#serverObject) | a server object to be used by the target operation.

This object can be extended with [Specification Extensions](#specificationExtensions). 

Locating a linked resource MAY be performed by either a `operationRef` or `operationId`.
In the case of an `operationId`, it MUST be unique and resolved in the scope of the OAS document.
Because of the potential for name clashes, consider the `operationRef` syntax as the preferred 
method for specifications with external references.

##### <a name="responsePayload"></a>Response Payload Values

Payload values are only available in parsable response payloads which match the advertised media 
type and for media types that can be referenced using a JSON Pointer fragment Id.  In all cases, 
if a value does _not_ exist, the parameter will be considered a `null` value (as opposed to an 
empty value) and _not_ passed as a parameter to the linked resource.  In cases where a value is 
required, and a parameter is not supplied, the client MAY choose to not follow the link definition. 

##### Example

Response payload:
```json
{
    "id": "df71a505-07bc-458a-a5c0-73c0340d1ec7",
    "firstname": "Ash",
    "lastname": "Williams"
}
```

Payload Variables:
```yaml
id: df71a505-07bc-458a-a5c0-73c0340d1ec7
firstname: Ash
lastname: Williams
missingValue: null
```

In situations where variables appear in an array, an array of variables will be extracted.
For example:

```json
[
  { "color": "red" },
  { "color": "green" },
  { "color": "blue" }
]
```

will be extracted as such:

```json
color: ["red", "green", "blue"]
```

The variables generated can be used in locations prescribed by the definition.


##### <a name="variableSubstitution"></a>Variable Substitution
In all cases, _variables_ from request and responses may be substituted for link generation.
The table below provides examples of variable expressions and examples of their use in a value:

Source Location | variable expression | example reference | notes
---|:---|:---|:---
HTTP Method            | `$method`         | `/users/{$method}`                | The allowable values for the `$method` will be those for the HTTP operation 
Requested content type | `$request.header.accept`        | `/users/3?format={$request.header.accept}`      |  
Request parameter      | `$request.path.id`        | `/users/{$request.path.id}`            | Request parameters MUST be declared in the `parameters` section for the operation or they cannot be used in substitution.  This includes request headers
Request body           | `$request.body`    | `/users/{$request.body#/user/uuid}` | For operations which accept payloads, references may be made to portions of the `requestBody` or the entire body itself
Request URL            | `$url`            | `/track?url={$url}`               | 
Response value         | `$response.body`       | `{$response.body#/uuid}`                | Only the payload in the response can be accessed with the `$response` syntax.  
Response header        | `$response.header` | `{$response.header.Server}`        | Single header values only are available

From the request, the `parameter`s used in calling the operation are made available through the `$request` syntax.
For responses, the response payload may be used with the `$response` syntax.
For both requests and responses, values will be substituted in the link in sections designated with a variable expression, surrounded by curly brackets `{}`. 

The variable expression is defined by the following [ABNF](https://tools.ietf.org/html/rfc5234) syntax

```
      expression = ( "$url" | "$method" | "$request." [ source ] | "$response." [ source ])
      source = ( header-reference | query-reference | path-reference | body-reference )  
      header-reference = "header." token
      query-reference = "query." name  
      path-reference = "path." name
      body-reference = "body#" fragment
      fragment = a JSON Pointer [RFC 6901](https://tools.ietf.org/html/rfc6901)  
      name = *( char )
      char = as per RFC [7159](https://tools.ietf.org/html/rfc7159#section-7)
      token = as per RFC [7230](https://tools.ietf.org/html/rfc7230#section-3.2.6)
```

The `name` identifier is case-sensitive, whereas `token` is not. 


##### Request Parameter Example
Computing a link from a request operation like this:

```yaml
paths:
  /users/{id}:
    parameters:
    - name: id
      in: path
      required: true
      description: the user identifier, as userId or username
      schema:
        type: string
    responses:
      '200':
        description: the user being returned
        content:
          application/json:
            schema:
              type: object
              properties:
                uuid: the unique user id
                  type: string
                  format: uuid
```

Can be used in a link like this:

```yaml
Addresses:
  # the target link operationId
  operationId: getUserAddress
  parameters:
    # get the `id` field from the request path parameter named `id`
    userId: '{$request.path.id}'
```

Where the `$request.path.id` is the value passed in the request to `/users/{id}`.

##### Response Payload Example

```yaml
Addresses:
  operationId: getUserAddressByUUID
  parameters:
    # get the `id` field from the request path parameter named `id`
    userUuid: '{$response.body#/uuid}'
```

And the array example:

```yaml
ColorSelection:
  operationId: getColorSample
  parameters:
    colorName: '{$response.body#/color}'
```

Would produce three links with the `colorName` of `red`, `green`, and `blue`:

As with all links, it is at the clients' discretion to follow them, neither 
permissions nor the ability to make a successful call to that link is guaranteed 
solely by the existence of a relationship.


##### Example

The example below shows how relationships in the BitBucket API can be represented 
with the link schema. This example uses `operationId` values to link responses to 
possible operations.

```yaml
paths: 
  /2.0/users/{username}: 
    get: 
      operationId: getUserByName
      parameters: 
      - name: username
        in: path
        required: true
        schema:
          type: string
      responses: 
        '200':
          description: The User
          content:
            application/json:
              schema: 
                $ref: '#/components/schemas/user'
          links:
            userRepositories:
              $ref: '#/components/links/UserRepositories'
  /2.0/repositories/{username}:
    get:
      operationId: getRepositoriesByOwner
      parameters:
        - name: username
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: repositories owned by the supplied user
          content: 
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/repository'
          links:
            userRepository:
              $ref: '#/components/links/UserRepository'
  /2.0/repositories/{username}/{slug}: 
    get: 
      operationId: getRepository
      parameters: 
        - name: username
          type: string
          in: path
          required: true
          schema:
            type: string
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses: 
        '200':
          description: The repository
            content:
              application/json: 
                schema: 
                  $ref: '#/components/schemas/repository'
          links:
            repositoryPullRequests:
              $ref: '#/components/links/RepositoryPullRequests'
  /2.0/repositories/{username}/{slug}/pullrequests: 
    get: 
      operationId: getPullRequestsByRepository
      parameters: 
      - name: username
        in: path
        required: true
        schema:
          type: string
      - name: slug
        in: path
        required: true
        schema:
          type: string
      - name: state
        in: query
        schema:
          type: string
          enum: 
            - open
            - merged
            - declined
      responses: 
        '200':
          description: an array of pull request objects
          content:
            application/json: 
              schema: 
                type: array
                items: 
                  $ref: '#/components/schemas/pullrequest'
  /2.0/repositories/{username}/{slug}/pullrequests/{pid}: 
    get: 
      operationId: getPullRequestsById
      parameters: 
      - name: username
        in: path
        required: true
        schema:
          type: string
      - name: slug
        in: path
        required: true
        schema:
          type: string
      - name: pid
        in: path
        required: true
        schema:
          type: string
      responses: 
        '200':
          description: a pull request object
          content:
            application/json: 
              schema: 
                $ref: '#/components/schemas/pullrequest'
          links:
            $ref: '#/components/links/PullRequestMerge'
  /2.0/repositories/{username}/{slug}/pullrequests/{pid}/merge: 
    post: 
      operationId: mergePullRequest
      parameters: 
      - name: username
        in: path
        required: true
        schema:
          type: string
      - name: slug
        in: path
        required: true
        schema:
          type: string
      - name: pid
        in: path
        required: true
        schema:
          type: string
      responses: 
        '204':
          description: the PR was successfully merged
components:
  links:
    UserRepositories:
      # returns array of '#/components/schemas/repository'
      operationId: getRepositoriesByOwner
      parameters:
        username: $response.body#/username
    UserRepository:
      # returns '#/components/schemas/repository'
      operationId: getRepository
      parameters:
        username: $response.body#/owner/username
        slug: $response.body#/slug
    RepositoryPullRequests:
      # returns '#/components/schemas/pullrequest'
      operationId: getPullRequestsByRepository
        parameters: 
          username: $response.body#/owner/username
          slug: $response.body#/slug
    PullRequestMerge:
      # executes /2.0/repositories/{username}/{slug}/pullrequests/{pid}/merge
      operationId: mergePullRequest
      parameters:
        username: $response.body#/author/username
        slug: $response.body#/repository/slug
        pid: $response.body#/id
  schemas: 
    user: 
      type: object
      properties: 
        username: 
          type: string
        uuid: 
          type: string
    repository: 
      type: object
      properties: 
        slug: 
          type: string
        owner: 
          $ref: '#/components/schemas/user'
    pullrequest: 
      type: object
      properties: 
        id: 
          type: integer
        title: 
          type: string
        repository: 
          $ref: '#/components/schemas/repository'
        author: 
          $ref: '#/components/schemas/user'
```

As references to `operationId` MAY NOT be possible (the `operationId` is an optional 
value), references MAY also be made through a relative `operationRef`:

```yaml
components:
  links:
    UserRepositories:
      # returns array of '#/components/schemas/repository'
      operationRef: '#paths~12.0~1repositories~1{$response.body#/username}'
```

or an absolute `operationRef`:

```yaml
components:
  links:
    UserRepositories:
      # returns array of '#/components/schemas/repository'
      href: 'https://na2.gigantic-server.com/#/paths/~12.0~1repositories~1{$response.body#/username}'
```

Note that in the use of `operationRef`, the _escaped forward-slash_ is necessary when 
using JSON references.

#### <a name="linkParametersObject"></a>Link Parameters Object
Using the `operationId` to reference an operation in the definition has many benefits, including the ability to define media type options, security requirements, response and error payloads.
Many operations require parameters to be passed, and these MAY be dynamic depending on the response itself.

To specify parameters required by the operation, we can use a **Link Parameters Object**.
This object contains parameter names along with static or dynamic values:

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="linkParameterName"></a> {name} | Any \| [{expression}](#variableSubstitution) | A constant value or expression to be evaluated and passed to the linked operation.

```yaml
paths:
  /user/{username}: # ...
  /user/{username}/commits:
    get:
      operationId: userCommitHistory
      parameters:
      - name: username
        in: path
        type: string
        required: true
      - name: page
        type: integer
        format: int32
        required: true
      responses: { ... }
components:
  links:
    UserCommitHistory:
      operationId: userCommitHistory
      parameters:
        username: $response.body#/user/username
        page: 0
```

In the above, the link for `UserCommitHistory` points to the operation `getUserCommitHistory`, and passes the `username` value from the response payload as well as the static scalar value `0`.

#### <a name="headerObject"></a>Header Object

The Header Object follows the structure of the [Parameter Object](#parameterObject), with the following changes:

1. `name` MUST NOT be specified, it is given in the [Headers Object](#headersObject).
1. `in` MUST NOT be specified, it is implicitly in `header`.
1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, [`style`](#parameterStyle)).

##### Header Object Example

A simple header with of an integer type:

```json
{
  "description": "The number of allowed requests in the current period",
  "schema": {
    "type": "integer"
  }
}
```

```yaml
description: The number of allowed requests in the current period
schema:
  type: integer
```

#### <a name="tagObject"></a>Tag Object

Allows adding meta data to a single tag that is used by the [Operation Object](#operationObject).
It is not mandatory to have a Tag Object per tag used there.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="tagName"></a>name | `string` | **Required.** The name of the tag.
<a name="tagDescription"></a>description | `string` | A short description for the tag. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="tagExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this tag.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Tag Object Example

```json
{
	"name": "pet",
	"description": "Pets operations"
}
```

```yaml
name: pet
description: Pets operations
```

#### <a name="examplesObject"></a>Examples Object

Anywhere an `example` may be given, a JSON Reference MAY be used, with the 
explicit restriction that examples having a JSON format with object named 
`$ref` are not allowed. This does mean that `example`, structurally, can be 
either a string primitive or an object, similar to `additionalProperties`.

In all cases, the payload is expected to be compatible with the type schema 
for the value that it is accompanying.  Tooling implementations MAY choose to 
validate compatibility automatically, and reject the example value(s) if they 
are not compatible.

```yaml
# in a model
schemas:
  properties:
    name:
      type: string
      example:
        $ref: http://foo.bar#/examples/name-example

# in a request body, note the plural `examples` as the Content-Type is set to `*`:
  requestBody:
    content:
      'application/json':
        schema:
          $ref: '#/components/schemas/Address'
        examples: 
          - {"foo": "bar"}
          - {"bar": "baz"}
      'application/xml':
        examples: 
          - $ref: 'http://foo.bar#/examples/address-example.xml' 
      'text/plain':
        examples: 
          - $ref: 'http://foo.bar#/examples/address-example.txt' 
        
# in a parameter
  parameters:
    - name: 'zipCode'
      in: 'query'
      schema:
        type: 'string'
        format: 'zip-code'
        example: 
          $ref: 'http://foo.bar#/examples/zip-example'
# in a response, note the plural `examples`:
  responses:
    '200':
      description: your car appointment has been booked
      content: 
        application/json:
          schema:
            $ref: '#/components/schemas/SuccessResponse'
          example:
            $ref: http://foo.bar#/examples/address-example.json
```

#### <a name="referenceObject"></a>Reference Object

A simple object to allow referencing other components in the specification, internally and externally.

The Reference Object is defined by [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) and follows the same structure, behavior and rules. 

For this specification, reference resolution is done as defined by the JSON Reference specification and not by the JSON Schema specification.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="referenceRef"></a>$ref | `string` | **Required.** The reference string. 

This object cannot be extended with additional properties and any properties added SHALL be ignored.

##### Reference Object Example

```json
{
	"$ref": "#/components/schemas/Pet"
}
```

```yaml
$ref: '#/components/schemas/Pet'
```

##### Relative Schema File Example
```json
{
  "$ref": "Pet.json"
}
```

```yaml
$ref: Pet.yaml
```

##### Relative Files With Embedded Schema Example
```json
{
  "$ref": "definitions.json#/Pet"
}
```

```yaml
$ref: definitions.yaml#/Pet
```

#### <a name="schemaObject"></a>Schema Object

The Schema Object allows the definition of input and output data types.
These types can be objects, but also primitives and arrays.
This object is an extended subset of the [JSON Schema Specification Wright Draft 00](http://json-schema.org/).

Further information about the properties can be found in [JSON Schema Core](https://tools.ietf.org/html/draft-wright-json-schema-00) and [JSON Schema Validation](https://tools.ietf.org/html/draft-wright-json-schema-validation-00).
Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here.

##### Properties 

The following properties are taken directly from the JSON Schema definition and follow the same specifications:

- title
- multipleOf
- maximum
- exclusiveMaximum
- minimum
- exclusiveMinimum
- maxLength
- minLength
- pattern (This string SHOULD be a valid regular expression, according to the [ECMA 262 regular expression](https://www.ecma-international.org/ecma-262/5.1/#sec-7.8.5) dialect)
- maxItems
- minItems
- uniqueItems
- maxProperties
- minProperties
- required
- enum

The following properties are taken from the JSON Schema definition but their definitions were adjusted to the OpenAPI Specification. 
- type - Value MUST be a string. Multiple types via an array are not supported.
- allOf - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- oneOf - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- anyOf - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- not - Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- items - Value MUST be an object and not an array. Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema. `items` MUST be present if the `type` is `array`.
- properties - Property definitions MUST be a [Schema Object](#schemaObject) and not a standard JSON Schema (inline or referenced).
- additionalProperties - Value can be boolean or object. Inline or referenced schema MUST be of a [Schema Object](#schemaObject) and not a standard JSON Schema.
- description - [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
- format - See [Data Type Formats](#dataTypeFormat) for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
- default - The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level. For example, of `type` is `string`, then `default` can be `"foo"` but cannot be `1`.

Alternatively, any time a Schema Object can be used, a [Reference Object](#referenceObject) can be used in its place. This allows referencing definitions in place of defining them inline.

Additional properties defined by the JSON Schema specification that are not mentioned here are strictly unsupported.

Other than the JSON Schema subset fields, the following fields MAY be used for further schema documentation:

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="schemaNullable"></a>nullable | `boolean` | Allows sending a `null` value for the defined schema. Default value is `false`.
<a name="schemaDiscriminator"></a>discriminator | `string` | Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it. See [Composition and Inheritance](#schemaComposition) for more details.
<a name="schemaReadOnly"></a>readOnly | `boolean` | Relevant only for Schema `"properties"` definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of the request. If property is marked as `readOnly` being `true` and is in the `required` list, the `required` will take effect on the response only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
<a name="schemaWriteOnly"></a>writeOnly | `boolean` | Relevant only for Schema `"properties"` definitions. Declares the property as "write only". This means that it MAY be sent as part of a request but SHOULD NOT be sent as part of the response. If property is marked as `writeOnly` being `true` and is in the `required` list, the `required` will take effect on the request only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
<a name="schemaXml"></a>xml | [XML Object](#xmlObject) | This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
<a name="schemaExternalDocs"></a>externalDocs | [External Documentation Object](#externalDocumentationObject) | Additional external documentation for this schema. 
<a name="schemaExample"></a>example | Any | A free-form property to include an example of an instance for this schema. To represent examples that cannot naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
<a name="schemaDeprecated"></a> deprecated | `boolean` | Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is `false`.

This object can be extended with [Specification Extensions](#specificationExtensions). 

###### <a name="schemaComposition"></a>Composition and Inheritance (Polymorphism)

The OpenAPI Specification allows combining and extending model definitions using the `allOf` property of JSON Schema, in effect offering model composition.
`allOf` takes in an array of object definitions that are validated *independently* but together compose a single object. 

While composition offers model extensibility, it does not imply a hierarchy between the models.
To support polymorphism, OpenAPI Specification adds the support of the `discriminator` field.
When used, the `discriminator` will be the name of the property used to decide which schema definition is used to validate the structure of the model.
As such, the `discriminator` field MUST be a required field.
There are are two ways to define the value of a discriminator for an inheriting instance.
- Use the schema's name.
- Override the schema's name by overriding the property with a new value. If exists, this takes precedence over the schema's name.
As such, inline schema definitions, which do not have a given id, *cannot* be used in polymorphism.

###### XML Modeling

The [xml](#schemaXml) property allows extra definitions when translating the JSON definition to XML.
The [XML Object](#xmlObject) contains additional information about the available options.

##### Schema Object Examples

###### Primitive Sample

```json
{
  "type": "string",
  "format": "email"
}
```

```yaml
type: string
format: email
```

###### Simple Model

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "address": {
      "$ref": "#/components/schemas/Address"
    },
    "age": {
      "type": "integer",
      "format": "int32",
      "minimum": 0
    }
  }
}
```

```yaml
type: object
required:
- name
properties:
  name:
    type: string
  address:
    $ref: '#/components/schemas/Address'
  age:
    type: integer
    format: int32
    minimum: 0
```

###### Model with Map/Dictionary Properties

For a simple string to string mapping:

```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  }
}
```

```yaml
type: object
additionalProperties:
  type: string
```

For a string to model mapping:

```json
{
  "type": "object",
  "additionalProperties": {
    "$ref": "#/components/schemas/ComplexModel"
  }
}
```

```yaml
type: object
additionalProperties:
  $ref: '#/components/schemas/ComplexModel'
```

###### Model with Example

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "format": "int64"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "name"
  ],
  "example": {
    "name": "Puma",
    "id": 1
  }
}
```

```yaml
type: object
properties:
  id:
    type: integer
    format: int64
  name:
    type: string
required:
- name
example:
  name: Puma
  id: 1
```

###### Models with Composition

```json
{
  "schemas": {
    "ErrorModel": {
      "type": "object",
      "required": [
        "message",
        "code"
      ],
      "properties": {
        "message": {
          "type": "string"
        },
        "code": {
          "type": "integer",
          "minimum": 100,
          "maximum": 600
        }
      }
    },
    "ExtendedErrorModel": {
      "allOf": [
        {
          "$ref": "#/components/schemas/ErrorModel"
        },
        {
          "type": "object",
          "required": [
            "rootCause"
          ],
          "properties": {
            "rootCause": {
              "type": "string"
            }
          }
        }
      ]
    }
  }
}
```

```yaml
schemas:
  ErrorModel:
    type: object
    required:
    - message
    - code
    properties:
      message:
        type: string
      code:
        type: integer
        minimum: 100
        maximum: 600
  ExtendedErrorModel:
    allOf:
    - $ref: '#/components/schemas/ErrorModel'
    - type: object
      required:
      - rootCause
      properties:
        rootCause:
          type: string
```

###### Models with Polymorphism Support

```json
{
  "schemas": {
    "Pet": {
      "type": "object",
      "discriminator": "petType",
      "properties": {
        "name": {
          "type": "string"
        },
        "petType": {
          "type": "string"
        }
      },
      "required": [
        "name",
        "petType"
      ]
    },
    "Cat": {
      "description": "A representation of a cat. Note that `Cat` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "huntingSkill": {
              "type": "string",
              "description": "The measured skill for hunting",
              "default": "lazy",
              "enum": [
                "clueless",
                "lazy",
                "adventurous",
                "aggressive"
              ]
            }
          },
          "required": [
            "huntingSkill"
          ]
        }
      ]
    },
    "Dog": {
      "description": "A representation of a dog. Note that `Dog` will be used as the discriminator value.",
      "allOf": [
        {
          "$ref": "#/components/schemas/Pet"
        },
        {
          "type": "object",
          "properties": {
            "packSize": {
              "type": "integer",
              "format": "int32",
              "description": "the size of the pack the dog is from",
              "default": 0,
              "minimum": 0
            }
          },
          "required": [
            "packSize"
          ]
        }
      ]
    }
  }
}
```

```yaml
schemas:
  Pet:
    type: object
    discriminator: petType
    properties:
      name:
        type: string
      petType:
        type: string
    required:
    - name
    - petType
  Cat:  ## "Cat" will be used as the discriminator value
    description: A representation of a cat
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        huntingSkill:
          type: string
          description: The measured skill for hunting
          default: lazy
          enum:
          - clueless
          - lazy
          - adventurous
          - aggressive
      required:
      - huntingSkill
  Dog:  ## "Dog" will be used as the discriminator value
    description: A representation of a dog
    allOf:
    - $ref: '#/components/schemas/Pet'
    - type: object
      properties:
        packSize:
          type: integer
          format: int32
          description: the size of the pack the dog is from
          default: 0
          minimum: 0
      required:
      - packSize
```

#### <a name="xmlObject"></a>XML Object

A metadata object that allows for more fine-tuned XML model definitions.

When using arrays, XML element names are *not* inferred (for singular/plural forms) and the `name` property SHOULD be used to add that information.
See examples for expected behavior.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="xmlName"></a>name | `string` | Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
<a name="xmlNamespace"></a>namespace | `string` | The URL of the namespace definition. Value SHOULD be in the form of a URL.
<a name="xmlPrefix"></a>prefix | `string` | The prefix to be used for the [name](#xmlName).
<a name="xmlAttribute"></a>attribute | `boolean` | Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
<a name="xmlWrapped"></a>wrapped | `boolean` | MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`).

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### XML Object Examples

The examples of the XML object definitions are included inside a property definition of a [Schema Object](#schemaObject) with a sample of the XML representation of it.

###### No XML Element

Basic string property:

```json
{
    "animals": {
        "type": "string"
    }
}
```

```yaml
animals:
  type: string
```

```xml
<animals>...</animals>
```

Basic string array property ([`wrapped`](#xmlWrapped) is `false` by default):

```json
{
    "animals": {
        "type": "array",
        "items": {
            "type": "string"
        }
    }
}
```

```yaml
animals:
  type: array
  items:
    type: string
```

```xml
<animals>...</animals>
<animals>...</animals>
<animals>...</animals>
```

###### XML Name Replacement

```json
{
  "animals": {
    "type": "string",
    "xml": {
      "name": "animal"
    }
  }
}
```

```yaml
animals:
  type: string
  xml:
    name: animal
```

```xml
<animal>...</animal>
```


###### XML Attribute, Prefix and Namespace

In this example, a full model definition is shown.

```json
{
  "Person": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int32",
        "xml": {
          "attribute": true
        }
      },
      "name": {
        "type": "string",
        "xml": {
          "namespace": "http://example.com/schema/sample",
          "prefix": "sample"
        }
      }
    }
  }
}
```

```yaml
Person:
  type: object
  properties:
    id:
      type: integer
      format: int32
      xml:
        attribute: true
    name:
      type: string
      xml:
        namespace: http://example.com/schema/sample
        prefix: sample
```

```xml
<Person id="123">
    <sample:name xmlns:sample="http://example.com/schema/sample">example</sample:name>
</Person>
```

###### XML Arrays

Changing the element names:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
```

```xml
<animal>value</animal>
<animal>value</animal>
```

The external `name` property has no effect on the XML:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    },
    "xml": {
      "name": "aliens"
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
  xml:
    name: aliens
```

```xml
<animal>value</animal>
<animal>value</animal>
```

Even when the array is wrapped, if no name is explicitly defined, the same name will be used both internally and externally:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "xml": {
      "wrapped": true
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
  xml:
    wrapped: true
```

```xml
<animals>
  <animals>value</animals>
  <animals>value</animals>
</animals>
```

To overcome the above example, the following definition can be used:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    },
    "xml": {
      "wrapped": true
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
  xml:
    wrapped: true
```

```xml
<animals>
  <animal>value</animal>
  <animal>value</animal>
</animals>
```

Affecting both internal and external names:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string",
      "xml": {
        "name": "animal"
      }
    },
    "xml": {
      "name": "aliens",
      "wrapped": true
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
    xml:
      name: animal
  xml:
    name: aliens
    wrapped: true
```

```xml
<aliens>
  <animal>value</animal>
  <animal>value</animal>
</aliens>
```

If we change the external element but not the internal ones:

```json
{
  "animals": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "xml": {
      "name": "aliens",
      "wrapped": true
    }
  }
}
```

```yaml
animals:
  type: array
  items:
    type: string
  xml:
    name: aliens
    wrapped: true
```

```xml
<aliens>
  <aliens>value</aliens>
  <aliens>value</aliens>
</aliens>
```

#### <a name="securitySchemeObject"></a>Security Scheme Object

Allows the definition of a security scheme that can be used by the operations.
Supported schemes are HTTP authentication, an API key (either as a header or as a query parameter), OAuth2's common flows (implicit, password, application and access code) and Oauth1.

##### Fixed Fields
Field Name | Type | Validity | Description
---|:---:|---|---
<a name="securitySchemeType"></a>type | `string` | Any | **Required.** The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`, `"oauth1"`.
<a name="securitySchemeDescription"></a>description | `string` | Any | A short description for security scheme. [CommonMark syntax](http://spec.commonmark.org/) can be used for rich text representation.
<a name="securitySchemeName"></a>name | `string` | `apiKey` | **Required.** The name of the header or query parameter to be used.
<a name="securitySchemeIn"></a>in | `string` | `apiKey` | **Required.** The location of the API key. Valid values are `"query"` or `"header"`.
<a name="securitySchemeScheme"></a>scheme | `string` | `http` | **Required.** The name of the HTTP Authorization scheme to be used in the [Authorization header as defined in RFC 7235](https://tools.ietf.org/html/rfc7235#section-4.2).
<a name="securitySchemeBearerFormat"></a>bearerFormat | `string` | `http` (`"bearer"`) | A hint to the client to identify how the bearer token is formatted.  Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
<a name="securitySchemeFlows"></a>flows | [OAuth Flows Object](#oauthFlowsObject) | `oauth2` | **Required.** An object containing configuration information for the flow types supported. 
<a name="securitySchemeOpenIdConnectUrl"></a>openIdConnectUrl | `string` | `openIdConnect` | **Required.** OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.
<a name="securitySchemeAuthorizationUrl"></a>authorizationUrl | `string` | `oauth1` | **Required.** Resource Owner Authorization URL to send the user to the server to authorize the request. This MUST be in the form of a URL.
<a name="securitySchemeTokenUrl"></a>tokenUrl | `string` | `oauth1` | **Required.** Token Credentials URL to obtain a set of token credentials from the server. This MUST be in the form of a URL.
<a name="securitySchemeRequestUrl"></a>requestUrl | `string` | `oauth1` | **Required.** Temporary Credentials URL to obtain a set of temporary credentials from the server. This MUST be in the form of a URL.
<a name="signatureMethod"></a>requestUrl | [`string`] | `oauth1` | A list of supported signatures used for authorization. Valid values are `"HMAC-SHA1"`, `"RSA-SHA1"`, or `"PLAINTEXT"`. Default vaule is `"HMAC-SHA1"`


This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Security Scheme Object Example

###### Basic Authentication Sample

```json
{
  "type": "http",
  "scheme": "basic"
}
```

```yaml
type: http
scheme: basic
```

###### API Key Sample

```json
{
  "type": "apiKey",
  "name": "api_key",
  "in": "header"
}
```

```yaml
type: apiKey
name: api_key
in: header
```

###### JWT Bearer Sample

```json
{
  "type": "http",
  "scheme": "bearer",
  "bearerFormat": "JWT",
}
```

```yaml
type: http
scheme: bearer
bearerFormat: JWT
```
###### Oauth1 Sample

```json
{
  "type": "oauth1",
   "authorizationUrl": "http://example.com/api/oauth/dialog",
   "tokenUrl": "http://example.com/api/oauth/token",   
   "requestUrl": "http://example.com/api/oauth/request",
   "signatureMethod": ["RSA-SHA1"]
}
```

```yaml
type: oauth1
authorizationUrl: http://example.com/api/oauth/dialog
tokenUrl: http://example.com/api/oauth/token
requestUrl: http://example.com/api/oauth/request
signatureMethod:
  - RSA-SHA1
```

###### Implicit OAuth2 Sample

```json
{
  "type": "oauth2",
  "flows": {
    "implicit": {
      "authorizationUrl": "https://example.com/api/oauth/dialog",
      "scopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    }
  }
}
```

```yaml
type: oauth2
flows: 
  implicit:
    authorizationUrl: https://example.com/api/oauth/dialog
    scopes:
      write:pets: modify pets in your account
      read:pets: read your pets
```

#### <a name="oauthFlowsObject"></a>OAuth Flows Object

Allows configuration of the supported OAuth Flows.

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="oauthFlowsImplicit"></a>implicit| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Implicit flow 
<a name="oauthFlowsPassword"></a>password| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Resource Owner Password flow 
<a name="oauthFlowsClientCredentials"></a>clientCredentials| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Client Credentials flow.  Previously called `application` in OpenAPI 2.0.
<a name="oauthFlowsAuthorizationCode"></a>authorizationCode| [OAuth Flow Object](#oauthFlowObject) | Configuration for the OAuth Authorization Code flow.  Previously called `accessCode` in OpenAPI 2.0.

This object can be extended with [Specification Extensions](#specificationExtensions). 

#### <a name="oauthFlowObject"></a>OAuth Flow Object

Configuration details for a supported OAuth Flow

##### Fixed Fields
Field Name | Type | Validity | Description
---|:---:|---|---
<a name="oauthFlowAuthorizationUrl"></a>authorizationUrl | `string` | `oauth2` (`"implicit"`, `"authorizationCode"`) | **Required.** The authorization URL to be used for this flow. This MUST be in the form of a URL.
<a name="oauthFlowTokenUrl"></a>tokenUrl | `string` | `oauth2` (`"password"`, `"clientCredentials"`, `"authorizationCode"`) | **Required.** The token URL to be used for this flow. This MUST be in the form of a URL.
<a name="oauthFlowRefreshUrl"></a>refreshUrl | `string` | `oauth2` | The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.
<a name="oauthFlowScopes"></a>scopes | [Scopes Object](#scopesObject) | `oauth2` | **Required.** The available scopes for the OAuth2 security scheme.

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### OAuth Flow Object Examples

```JSON
{
  "type": "oauth2",
  "flows": {
    "implicit": {
      "authorizationUrl": "https://example.com/api/oauth/dialog",
      "scopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    },
    "authorizationCode": {
      "authorizationUrl": "https://example.com/api/oauth/dialog",
      "tokenUrl": "https://example.com/api/oauth/token",
      "scopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    }
  }
}
```

```YAML
type: oauth2
flows: 
  implicit:
    authorizationUrl: https://example.com/api/oauth/dialog
    scopes:
      write:pets: modify pets in your account
      read:pets: read your pets
  authorizationCode:
    authorizationUrl: https://example.com/api/oauth/dialog
    tokenUrl: https://example.com/api/oauth/token
    scopes:
      write:pets: modify pets in your account
      read:pets: read your pets 
```

#### <a name="scopesObject"></a>Scopes Object

Lists the available scopes for an OAuth2 security scheme.

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="scopesName"></a>{name} | `string` | Maps between a name of a scope to a short description of it (as the value of the property).

This object can be extended with [Specification Extensions](#specificationExtensions). 

##### Scopes Object Example

```json
{
  "write:pets": "modify pets in your account",
  "read:pets": "read your pets"
}
```

```yaml
write:pets: modify pets in your account
read:pets: read your pets
```

#### <a name="securityRequirementObject"></a>Security Requirement Object

Lists the required security schemes to execute this operation.
The name used for each property MUST correspond to a security scheme declared in the [Security Schemes](#componentsSecuritySchemes) under the [Components Object](#componentsObject).

Security Requirement Objects that contain multiple schemes require that all schemes MUST be satisfied for a request to be authorized.
This enables support for scenarios where there multiple query parameters or HTTP headers are required to convey security information.

When a list of Security Requirement Objects is defined on the [Open API object](#oasObject) or [Operation Object](#operationObject), only one of Security Requirement Objects in the list needs to be satisfied to authorize.  

##### Patterned Fields

Field Pattern | Type | Description
---|:---:|---
<a name="securityRequirementsName"></a>{name} | [`string`] | Each name MUST correspond to a security scheme which is declared in the [Security Schemes](#componentsSecuritySchemes) under the [Components Object](#componentsObject). If the security scheme is of type `"oauth2"` or `"openIdConnect"`, then the value is a list of scope names required for the execution. For other security scheme types, the array MUST be empty.

##### Security Requirement Object Examples

###### Non-OAuth2 Security Requirement

```json
{
  "api_key": []
}
```

```yaml
api_key: []
```

###### OAuth2 Security Requirement

```json
{
  "petstore_auth": [
    "write:pets",
    "read:pets"
  ]
}
```

```yaml
petstore_auth:
- write:pets
- read:pets
```

### <a name="specificationExtensions"></a>Specification Extensions

While the OpenAPI Specification tries to accommodate most use cases, additional data can be added to extend the specification at certain points.

The extensions properties are implemented as patterned fields that are always prefixed by `"x-"`.

Field Pattern | Type | Description
---|:---:|---
<a name="infoExtensions"></a>^x- | Any | Allows extensions to the OpenAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. Can have any valid JSON format value.

The extensions may or may not be supported by the available tooling, but those may be extended as well to add requested support (if tools are internal or open-sourced).

### <a name="securityFiltering"></a>Security Filtering

Some objects in the OpenAPI Specification MAY be declared and remain empty, or completely be removed, even though they are inherently the core of the API documentation. 

The reasoning behind it is to allow an additional layer of access control over the documentation itself.
While not part of the specification itself, certain libraries MAY choose to allow access to parts of the documentation based on some form of authentication/authorization.

Two examples for this:

1. The [Paths Object](#pathsObject) MAY be empty. It may be counterintuitive, but this may tell the viewer that they got to the right place, but can't access any documentation. They'd still have access to the [Info Object](#infoObject) which may contain additional information regarding authentication.
2. The [Path Item Object](#pathItemObject) MAY be empty. In this case, the viewer will be aware that the path exists, but will not be able to see any of its operations or parameters. This is different than hiding the path itself from the [Paths Object](#pathsObject) so the user will not be aware of its existence. This allows the documentation provider a finer control over what the viewer can see.

## <a name="revisionHistory"></a>Appendix A: Revision History

Version | Date | Notes
---   | --- | ---
3.0.0-rc0 | 2017-02-28 | Implementer's Draft of the 3.0 specification
2.0   | 2015-12-31 | Donation of Swagger 2.0 to the Open API Initiative
2.0   | 2014-09-08 | Release of Swagger 2.0
1.2   | 2014-03-14 | Initial release of the formal document.
1.1   | 2012-08-22 | Release of Swagger 1.1
1.0   | 2011-08-10 | First release of the Swagger Specification
