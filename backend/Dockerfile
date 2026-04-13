FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

# Expose port 3000 for the Express server
EXPOSE 5298