# Use a lightweight Node.js base image for efficiency
FROM node:18-alpine AS build-stage

WORKDIR /app/src

# Copy package.json and package-lock.json for efficient caching
COPY package*.json ./

# Install dependencies for building the Angular app
RUN npm install

# Copy the rest of the project source code
COPY . .

# Build the Angular app in production mode
RUN npm run build --prod

# Use a separate stage for the final image to minimize size
FROM node:18-alpine AS final-stage

# Set the working directory for the server code
WORKDIR /usr/src/app

# Copy only the production build artifacts from the build stage
COPY --from=build-stage /app/src/dist/fe-safizoo ./

# Install dependencies for server-side rendering (SSR) runtime
RUN npm install express

# Copy the server-side entry point (adjust the path if needed)
COPY server.mjs ./

# Expose the port used by your Node.js server (default: 4000)
EXPOSE 4000

# Start the Node.js server in production mode
CMD ["node", "server.mjs"]