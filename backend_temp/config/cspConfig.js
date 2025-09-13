export const devCSP = {
  directives: {
    defaultSrc: ["'self'", "http://localhost:5173"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:5173"],
    styleSrc: ["'self'", "'unsafe-inline'", "http://localhost:5173"],
    imgSrc: ["'self'", "data:", "http://localhost:5173", "https://images.unsplash.com"],
    fontSrc: ["'self'", "http://localhost:5173"],
    connectSrc: ["'self'", "http://localhost:5000", "ws://localhost:5173"],
  },
};

export const prodCSP = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https://images.unsplash.com"], // ✅ allow external URLs
    fontSrc: ["'self'"],
    connectSrc: ["'self'"],
  },
};
