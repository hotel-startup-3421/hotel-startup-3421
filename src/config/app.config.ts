import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "api/v1",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3001",
  corsOrigins: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001"],
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "10", 10),
}));