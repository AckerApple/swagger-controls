import { SecuritySchemeObject, ServerObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { INestApplication, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { DocumentBuilder } from '@nestjs/swagger'
import { SwaggerModule } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import * as fs from 'fs'

export interface Options {
  filePath?: string
  servers?: string | ServerObject[] // url dropdown select of servers

  deepScanRoutes?: boolean
  ignoreGlobalPrefix?: boolean
  contact?: [string, string, string] // name, url, email
  
  // Adds 'access-token' as an available authorization in the swagger playground
  useBearerAuths?: (boolean | {name: string, securityScheme: SecuritySchemeObject})[]

  title?: string
  description?: string
  externalDocs?: [string, string][] // [title, url][]
  version?: string
  tags?: string[][] // [[tagname, description]]
}

export async function getSwaggerByControllers(
  controllers: any[],
  {
    servers,
    deepScanRoutes = true,
    ignoreGlobalPrefix = true,
    contact, useBearerAuths,
    title, description, externalDocs, version, tags,
  }: Options = {}
) {
  const app: INestApplication = await getDocsByControllers( controllers )
  const buildDocs = new DocumentBuilder() as any

  if(title) {
    buildDocs.setTitle(title)
  }

  if(description) {
    buildDocs.setDescription(description)
  }

  if(externalDocs) {
    externalDocs.forEach(externalDoc => {
      buildDocs.setExternalDoc(externalDoc[0], externalDoc[1])
    })
  }

  if(version) {
    buildDocs.setVersion(version)
  }

  // [[tagName, description]]
  if ( tags ) {
    tags.forEach(tag => buildDocs.addTag(...tag))
  }

  if (useBearerAuths) {
    useBearerAuths.forEach(useBearerAuth => {
      const securityScheme: SecuritySchemeObject = useBearerAuth === true ? { type: 'http', scheme: 'bearer' } : (useBearerAuth as any).securityScheme
      const name: string = useBearerAuth === true ? 'access-token' : (useBearerAuth as any).name
      buildDocs.addBearerAuth(securityScheme, name)
    })
  }

  if (contact) {
    buildDocs.setContact(contact[0], contact[1], contact[2])
  }

  // The official build step
  const docs = SwaggerModule.createDocument(
    app, buildDocs.build(), { deepScanRoutes, ignoreGlobalPrefix }
  )

  // array list of servers or object details of server
  docs.servers = servers as ServerObject[]

  return docs
}

export async function writeByControllers(
  controllers: any[],
  options: Options = {}
): Promise<string> {
  const docs = getSwaggerByControllers(controllers, options)
  const docString = JSON.stringify(docs, null, 2)

  if(options.filePath) {
    fs.writeFileSync(options.filePath, docString)
  }

  // app.close() // may not be necessary step

  return docString
}
export default writeByControllers


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
