import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger.config';
import '@/config/passport.config';
import authRoutes from '@/routes/auth.routes';
import adminRoutes from '@/routes/admin.routes';
import userRoutes from '@/routes/user.routes';

dotenv.config();

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Authentication API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  console.log("🚀 ~ app.get ~ req:", req)
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
// export default app;