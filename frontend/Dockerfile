# Base stage for shared environment variables
FROM node:20-alpine AS base
WORKDIR /app

# Development stage (Kept here in case you still want to run dev via Docker)
FROM base AS development
COPY package*.json ./
RUN npm install
# The source code is mounted via docker-compose volumes.

# Builder stage: Compiles the React/Vite app for production
FROM base AS builder
COPY package*.json ./
RUN npm install
# Copy the rest of the source code into the image
COPY . .
# Run the Vite build command to generate static files in /app/dist
RUN npm run build

# Production stage: Serves the static files using Nginx
FROM nginx:alpine AS production
# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the compiled static files from the builder stage to Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 80 for Nginx
EXPOSE 80
# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]