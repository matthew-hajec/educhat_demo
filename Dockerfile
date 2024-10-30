# Stage 1: Build Stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build-tailwind

# Stage 2: Production Stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app ./

# Set default environment variables (can be overridden)
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port specified by the PORT variable
EXPOSE ${PORT}

# Health Check (optional)
HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/ || exit 1

CMD ["npm", "start"]
