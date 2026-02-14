# Use an official Node LTS runtime as a parent image
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Copy dependency files first (better caching)
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy application source
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Expose the port the app listens on
EXPOSE 5001

# Start the app with node (index.js is the app entrypoint)
CMD ["node", "index.js"]