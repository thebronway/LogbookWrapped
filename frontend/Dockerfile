# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Builder stage: Compiles the React/Vite app for production
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .

ARG AIRPORT_VERSION=latest

# This pulls airports-latest-min.json by default, but saves it locally as just airports-min.json
RUN apk add --no-cache curl && \
    curl -fL "https://assets.conway.im/logbookwrapped/airports/airports-${AIRPORT_VERSION}-min.json" -o public/airports-min.json

RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
# This copies the 'dist' folder, which includes airports-min.json to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]