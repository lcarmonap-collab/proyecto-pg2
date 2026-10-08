import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { env } from './config/env';
import { prisma } from './config/prisma';
import authRoutes from './routes/auth.routes';
import productorRoutes from './routes/productor.routes';
import catalogoRoutes from './routes/catalogo.routes';
import parcelaRoutes from './routes/parcela.routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFound } from './middlewares/not-found.middleware';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((x) => x.trim()), credentials: true }));
app.use(rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1 AS ok`;
    return res.status(200).json({
      success: true,
      service: 'SICA-MAGA API',
      status: 'UP',
      database: 'UP'
    });
  } catch (error) {
    console.error('Health check de base de datos falló:', error);
    return res.status(503).json({
      success: false,
      service: 'SICA-MAGA API',
      status: 'DEGRADED',
      database: 'DOWN'
    });
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productores', productorRoutes);
app.use('/api/v1/catalogos', catalogoRoutes);
app.use('/api/v1/parcelas', parcelaRoutes);

app.use(notFound);
app.use(errorHandler);
