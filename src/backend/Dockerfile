# Use official Node.js image for backend
FROM node:18
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
