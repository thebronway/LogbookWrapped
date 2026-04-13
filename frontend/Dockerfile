# Base stage for shared environment variables
FROM node:20-alpine AS base
WORKDIR /app

# Development stage
FROM base AS development
# We copy package files first to cache the npm install step
COPY package*.json ./
RUN npm install
# The source code will be mounted as a volume via docker-compose, 
# so we don't need to COPY . . here for development.