# Use a Node.js base image for the build stage
FROM node:20 as builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build Angular application for SSR (both server and browser)
RUN npm run build

# Start a new stage for production
FROM node:20-alpine as runner

# Set the working directory
WORKDIR /app

# Copy the server-side and client-side artifacts
COPY --from=builder /app/dist/fe-safizoo ./dist/fe-safizoo

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Expose the port for the SSR server
EXPOSE 4000

# Run the SSR server
CMD ["node", "dist/fe-safizoo/server/server.mjs"]