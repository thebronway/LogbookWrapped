FROM node:20-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .

ARG AIRPORT_VERSION=latest
ARG VITE_API_TOKEN
ENV VITE_API_TOKEN=$VITE_API_TOKEN

# Installs Chromium for Puppeteer (used in export rendering), pulls airport DB
RUN apk add --no-cache curl chromium nss freetype harfbuzz ttf-freefont && \
    curl -fL "https://assets.conway.im/logbookwrapped/airports/airports-${AIRPORT_VERSION}-min.json" -o public/airports-min.json

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm run build

FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
