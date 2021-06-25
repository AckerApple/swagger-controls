import { INestApplication, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ServerObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
interface Options {
    filePath?: string;
    servers?: string | ServerObject[];
    deepScanRoutes?: boolean;
    ignoreGlobalPrefix?: boolean;
}
export default function swaggerJsonByControls(controllers: any[], { filePath, servers, deepScanRoutes, ignoreGlobalPrefix, }?: Options): Promise<string>;
export declare function getDocsByControllers(controllers: any[]): Promise<INestApplication>;
export declare class AppModule implements NestModule {
    configure(_consumer: MiddlewareConsumer): void;
}
export {};
