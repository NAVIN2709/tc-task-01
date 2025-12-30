# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose port (change if needed)
EXPOSE 3000

# Environment variables (optional, can also use docker run -e)
# ENV PORT=3000

# Start the server
CMD ["node", "index.js"]
