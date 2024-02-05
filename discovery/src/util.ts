import {DockerComposeParserService} from "./DockerComposeParser.service";
import {SwaggerParserService} from "./SwaggerParser.service";

export const swaggerParser = new SwaggerParserService();

export const dockerComposeParser = new DockerComposeParserService();