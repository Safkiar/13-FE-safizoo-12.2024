# Stage 1: Build Angular App
FROM node:18 AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build Angular app (production mode with SSR)
RUN npm run build

# Stage 2: Run SSR Server
FROM node:18

# Set working directory
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 4000

# Start the SSR server
CMD ["npm", "run", "serve:ssr:fe-safizoo"]