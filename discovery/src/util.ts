import {DockerComposeParserService} from "./DockerComposeParserService";
import {SwaggerParserService} from "./SwaggerParserService";
import {ScannerService} from "./ScannerService";

export const swaggerParser = new SwaggerParserService();
export const dockerComposeParser = new DockerComposeParserService();
export const scanner = new ScannerService();