import { INestApplication, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ServerObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { DocumentBuilder } from '@nestjs/swagger'
import { SwaggerModule } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import * as fs from 'fs'

export interface Options {
  filePath?: string
  servers?: string | ServerObject[] // url dropdown select of servers

  deepScanRoutes?: boolean
  ignoreGlobalPrefix?: boolean

  title?: string
  description?: string
  externalDoc?: [string, string] // [title, url]
  version?: string
}

export async function swaggerJsonByControls(
  controllers: any[],
  {
    filePath, servers,
    deepScanRoutes = true,
    ignoreGlobalPrefix = true,

    title, description, externalDoc, version
  }: Options = {}
): Promise<string> {
  const app: INestApplication = await getDocsByControllers( controllers )
  const buildDocs = new DocumentBuilder() as any

  if(title) {
    buildDocs.setTitle(title)
  }

  if(description) {
    buildDocs.setDescription(description)
  }

  if(externalDoc) {
    buildDocs.setExternalDoc(externalDoc[0], externalDoc[1])
  }

  if(externalDoc) {
    buildDocs.setVersion(version)
  }

  // The official build step
  const docs = SwaggerModule.createDocument(
    app, buildDocs.build(), { deepScanRoutes, ignoreGlobalPrefix }
  )

  // array list of servers or object details of server
  docs.servers = servers as ServerObject[]

  const docString = JSON.stringify(docs, null, 2)

  if(filePath) {
    fs.writeFileSync(filePath, docString)
  }

  app.close() // may not be necessary step

  return docString
}
export default swaggerJsonByControls


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
