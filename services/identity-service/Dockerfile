FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY src ./src
COPY scripts ./scripts

EXPOSE 4001

CMD ["node", "src/server.js"]
