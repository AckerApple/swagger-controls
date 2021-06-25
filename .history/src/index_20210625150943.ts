import { INestApplication, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ServerObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'

interface Options {
  filePath?: string
  servers?: string | ServerObject[] // url dropdown select of servers
  deepScanRoutes?: boolean
  ignoreGlobalPrefix?: boolean
}

export default async function swaggerJsonByControls(
  controllers: any[],
  {
    filePath, servers,
    deepScanRoutes = true,
    ignoreGlobalPrefix = true,
  }: Options = {}
): Promise<string> {
  const app: INestApplication = await getDocsByControllers( controllers )
  const buildDocs = new DocumentBuilder() as any

  let docs = SwaggerModule.createDocument(
    app, buildDocs, { deepScanRoutes, ignoreGlobalPrefix }
  )

  // array list of servers or object details of server
  docs.servers = servers as ServerObject[]

  const docString = JSON.stringify(docs, null, 2)

  if(filePath) {
    fs.writeFileSync(filePath, docString)
  }

  app.close()

  return docString
}

export async function getDocsByControllers(
  controllers: any[]
): Promise<INestApplication> {
  Reflect.defineMetadata('controllers', controllers, AppModule);
  return await NestFactory.create(AppModule)
}

/** Module reused to create Swagger docs */
@Module({})
export class AppModule implements NestModule {
  /** required by NestJs */
  configure(_consumer: MiddlewareConsumer): void {}
}
