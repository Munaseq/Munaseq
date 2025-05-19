"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dotenv = require("dotenv");
async function bootstrap() {
    dotenv.config();
    const PORT = parseInt(process.env.PORT || '3000', 10);
    console.log('To open swagger navigate to: http://localhost:' +
        PORT +
        '/api' +
        '\n' +
        '\n');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API')
        .setDescription('API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    await app.listen(PORT || 3000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map