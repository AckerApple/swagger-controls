"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.getDocsByControllers = exports.swaggerJsonByControls = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const core_1 = require("@nestjs/core");
const fs = __importStar(require("fs"));
async function swaggerJsonByControls(controllers, { filePath, servers, deepScanRoutes = true, ignoreGlobalPrefix = true, title, description, externalDoc, version } = {}) {
    const app = await getDocsByControllers(controllers);
    const buildDocs = new swagger_1.DocumentBuilder();
    if (title) {
        buildDocs.setTitle(title);
    }
    if (description) {
        buildDocs.setDescription(description);
    }
    if (externalDoc) {
        buildDocs.setExternalDoc(externalDoc[0], externalDoc[1]);
    }
    if (externalDoc) {
        buildDocs.setVersion(version);
    }
    const docs = swagger_2.SwaggerModule.createDocument(app, buildDocs, { deepScanRoutes, ignoreGlobalPrefix });
    docs.servers = servers;
    const docString = JSON.stringify(docs, null, 2);
    if (filePath) {
        fs.writeFileSync(filePath, docString);
    }
    app.close();
    return docString;
}
exports.swaggerJsonByControls = swaggerJsonByControls;
exports.default = swaggerJsonByControls;
async function getDocsByControllers(controllers) {
    Reflect.defineMetadata('controllers', controllers, AppModule);
    return await core_1.NestFactory.create(AppModule);
}
exports.getDocsByControllers = getDocsByControllers;
let AppModule = class AppModule {
    configure(_consumer) { }
};
AppModule = __decorate([
    (0, common_1.Module)({})
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=index.js.map