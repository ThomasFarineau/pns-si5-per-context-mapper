import {DockerComposeParserService} from "./DockerComposeParser.service";
import {SwaggerParserService} from "./SwaggerParser.service";
import {ScannerService} from "./Scanner.service";

export const swaggerParser = new SwaggerParserService();
export const dockerComposeParser = new DockerComposeParserService();
export const scanner = new ScannerService();