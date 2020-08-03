import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import fs from 'fs';
import { OpenAPIObject } from 'openapi3-ts';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { JsonObject } from 'swagger-ui-express';

/**
 * Load the OpenAPI Specification (OAS) file.
 * @param filename OpenAPI Specification/Swagger filename.
 */
export function loadOpenAPISpecFile(filename: string): JsonObject {
  let rawdata = fs.readFileSync(filename, 'utf8');

  return JSON.parse(rawdata);
}

/**
 * Create an OpenAPI Specification (OAS) file.
 * @param restSpecs Some of the specifications.
 * @param filename OpenAPI Specification/Swagger filename.
 */
export function createOpenAPISpecFile(restSpecs: Partial<OpenAPIObject>, filename?: string): JsonObject {
  const storage = getMetadataArgsStorage();
  const schemas = validationMetadatasToSchemas();
  const specs: OpenAPIObject = routingControllersToSpec(
    storage,
    {},
    {
      ...restSpecs,
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      //security: [{ bearerAuth: [] }],
    },
  );

  const openApiSpec: OpenAPIObject = {
    openapi: specs.openapi,
    info: specs.info,
    servers: specs.servers,
    paths: specs.paths,
    components: specs.components,
    security: specs.security,
    tags: specs.tag,
    externalDocs: specs.externalDocs,
  };

  let data = JSON.stringify(openApiSpec, null, 2);
  fs.writeFileSync(filename || 'openapi.json', data, 'utf8');

  return openApiSpec;
}
