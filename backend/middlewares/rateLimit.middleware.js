import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,                // 300 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later"
  }
});
