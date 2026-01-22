# Ultra-simple Dockerfile for EduSphere
# No dependencies needed - uses only built-in Node.js modules!

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all application files
COPY . .

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application (no build step needed!)
CMD ["node", "exam-server.js"]
