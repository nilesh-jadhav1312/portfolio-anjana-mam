# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Set VITE_API_URL to /api for relative path serving in production
ENV VITE_API_URL=/api
RUN npm run build

# Stage 2: Backend & Final Image
FROM node:20-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Copy built frontend to the 'public' folder used by server.js
COPY --from=frontend-builder /app/frontend/dist ./public

# Create uploads directory (ensure it exists)
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
