# swagger-controls

Convert classes to swagger documentation using NestJs decorators without the full commitment to NestJs

Use this tool when full NestJs adoption is too steep of a curve for your team or project. Use swagger-controls when you know you want those great swagger documentation decorators but your project still needs to maintain an Express middleware like approach.


### Is this a replacement for NestJs?

Nope. This library simply uses NestJs decorative functionality to assist in generating Swagger files. If anything, this package sets a project up for potential future NestJs adoption.

### Example

In this example there are 3 files involved in an Express app generating Swagger docs by decorating classes. Those three files are `generate-swagger-json.ts`, `index.ts`, and `controllers.ts`

***generate-swagger-json.ts***
```
import { controllers } from './controllers'
import swaggerJsonByControls from 'swagger-controls';

// write swagger.json file
swaggerJsonByControls(controllers, {
  filePath: `${__dirname}/swagger.json`
})
```

***index.ts***
```
import express from 'express'
import { HealthCheck } from './controllers'

export const app = express()

app.get('/v1/health-check', new HealthCheck().get)
```

***controllers.ts***
```
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger'
import { Controller, Get, HttpStatus } from '@nestjs/common'

@Controller('/v1/health-check')
export class HealthCheck {
  @Get()
  @ApiOperation({
    summary: 'Check on the status or health of API',
    description: 'Acts as a ping and a status indicator of accessible services',
  })
  @ApiResponse({
    status: HttpStatus.OK, type: HealthOutput,
    description: 'Very basic connectivity report',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE, type: HealthOutput,
    description: 'Connection to additional services is in an invalid state',
  })
  get(req: Express.Request, res: Express.Response): HealthOutput {
    return res.json( new HealthOutput() ) // respond
  }
}

/** Response to /v1/health-check calls */
class HealthOutput {
  @ApiProperty({
    example: 'ok',
    description: 'Basic indicator value of api is active'
  })
  status: 'ok' = 'ok'

  @ApiProperty({
    example: 'ok',
    description: 'Connective state to database. Static value for now'
  })
  db: 'ok' = 'ok'
}
```

> ❤️ This was crafted out of love for my homey who could use a better approach but not the whole Nest with it. _Acker