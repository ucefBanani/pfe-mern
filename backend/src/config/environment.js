const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow-ai',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-for-dev',
  nodeEnv: process.env.NODE_ENV || 'development',
  smtp: {
    host: process.env.SMTP_HOST || null,
    port: process.env.SMTP_PORT || null,
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
    from: process.env.FROM_EMAIL || 'noreply@taskflowai.com',
  },
  openaiApiKey: process.env.OPENAI_API_KEY || null,
};
