import {DockerComposeParserService} from "./DockerComposeParserService";
import {SwaggerParserService} from "./SwaggerParserService";
import {ScannerService} from "./ScannerService";
import {CMLCreator} from "./CMLCreator";

export const swaggerParser = new SwaggerParserService();
export const dockerComposeParser = new DockerComposeParserService();
export const cmlCreator = new CMLCreator();
export const scanner = new ScannerService();