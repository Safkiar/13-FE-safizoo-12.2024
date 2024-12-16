# Stage 1: Build the Angular Universal app
FROM node:18 AS build-stage
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build both browser and server bundles
COPY . .
RUN npm run build && npm run build:ssr

# Stage 2: Serve the Angular Universal app
FROM node:18 AS production-stage
WORKDIR /app

# Copy build outputs from the build stage
COPY --from=build-stage /app/dist/fe-safizoo ./dist

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Expose the port and define the startup command
EXPOSE 4000
CMD ["node", "dist/server/server.mjs"]