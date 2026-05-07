FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY src ./src

# Create uploads directory for local file storage
RUN mkdir -p uploads/vendor-documents

EXPOSE 4002

CMD ["node", "src/server.js"]
