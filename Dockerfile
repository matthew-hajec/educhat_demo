# Stage 1: Build Stage
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build-tailwind

# Stage 2: Production Stage
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app ./

# Set default environment variables (can be overridden)
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port specified by the PORT variable
EXPOSE ${PORT}

CMD ["npm", "start"]
