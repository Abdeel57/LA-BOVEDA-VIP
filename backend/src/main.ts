
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Disable default body parser
  });

  // Enable Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      // Formatear errores de validación de forma amigable
      const messages = errors.map(error => {
        const constraints = error.constraints || {};
        return Object.values(constraints)[0] || 'Error de validación';
      });
      return new HttpException(
        {
          message: messages,
          error: 'Bad Request',
          statusCode: 400,
        },
        400
      );
    },
  }));

  // Configure body parser with increased limit for images
  const express = require('express');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS with specific configuration
  // ⚠️ IMPORTANTE: Puedes configurar dominios desde CORS_ORIGINS en variables de entorno
  // Formato: CORS_ORIGINS=https://dominio1.com,https://dominio2.com
  
  // Dominios por defecto (siempre permitidos)
  const defaultOrigins = [
    /^http:\/\/localhost:5173$/, // Vite dev server (desarrollo local)
    /^http:\/\/localhost:3001$/, // Puerto alternativo desarrollo
    /\.onrender\.com$/, // Any Render subdomain
    /\.netlify\.app$/, // Any Netlify subdomain
    /\.up\.railway\.app$/, // Any Railway subdomain (ej: la-boveda-vip-production.up.railway.app)
    /dashboard\.render\.com$/, // Render dashboard
    
    // ============================================
    // DOMINIOS DE CLIENTES - Agrega aquí los nuevos
    // ============================================
    // Cliente: Sorteos Gama
    'https://sorteosgama.pro',
    'https://www.sorteosgama.pro',
    'http://sorteosgama.pro',
    'http://www.sorteosgama.pro',
    
    // Cliente: Lucky Snap (legacy)
    'https://luckysnaphn.com',
    'https://www.luckysnaphn.com',
    'https://luckysnap.netlify.app',
    'https://neodemo.netlify.app',
  ];

  // Obtener dominios adicionales desde variables de entorno
  const corsOriginsEnv = process.env.CORS_ORIGINS;
  const envOrigins: (string | RegExp)[] = [];
  
  if (corsOriginsEnv) {
    const origins = corsOriginsEnv.split(',').map(origin => origin.trim()).filter(Boolean);
    envOrigins.push(...origins);
    console.log(`🌐 CORS Origins desde variables de entorno: ${origins.join(', ')}`);
  }

  // Combinar dominios por defecto con los de variables de entorno
  const allowedOrigins = [...defaultOrigins, ...envOrigins];

  console.log(`🔒 CORS configurado con ${allowedOrigins.length} orígenes permitidos`);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true); // Allow non-browser requests
      }

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        console.log(`✅ CORS permitido para: ${origin}`);
        return callback(null, origin);
      }

      console.warn(`❌ CORS bloqueado para origen no permitido: ${origin}`);
      console.warn(`   Orígenes permitidos: ${allowedOrigins.map(o => o instanceof RegExp ? o.toString() : o).join(', ')}`);
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Add a simple root route before setting the global prefix
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'Lucky Snap Backend API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        api: '/api',
        health: '/api/health'
      }
    });
  });

  // Add health check endpoint
  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  app.setGlobalPrefix('api'); // Set a global prefix for all routes

  const port = process.env.PORT || 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';

  console.log(`🚀 Lucky Snap Backend starting...`);
  console.log(`📡 Environment: ${nodeEnv}`);
  console.log(`🌐 Port: ${port}`);
  console.log(`🔗 API Base: http://localhost:${port}/api`);

  await app.listen(port);
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
}
bootstrap();
