import { SecuritySchemeObject, ServerObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { INestApplication, MiddlewareConsumer, NestModule } from '@nestjs/common';
export interface Options {
    filePath?: string;
    servers?: string | ServerObject[];
    deepScanRoutes?: boolean;
    ignoreGlobalPrefix?: boolean;
    contact?: [string, string, string];
    useBearerAuths?: (boolean | {
        name: string;
        securityScheme: SecuritySchemeObject;
    })[];
    title?: string;
    description?: string;
    externalDocs?: [string, string][];
    version?: string;
    tags?: string[][];
}
export declare function swaggerJsonByControls(controllers: any[], { filePath, servers, deepScanRoutes, ignoreGlobalPrefix, contact, useBearerAuths, title, description, externalDocs, version, tags, }?: Options): Promise<string>;
export default swaggerJsonByControls;
export declare function getDocsByControllers(controllers: any[]): Promise<INestApplication>;
export declare class AppModule implements NestModule {
    configure(_consumer: MiddlewareConsumer): void;
}
