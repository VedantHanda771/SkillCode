# Use Node 18 base image with Debian (allows apt-get)
FROM node:18-bullseye

# Install Java (needed for javac)
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Set working directory
WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files (Backend + Frontend)
COPY . .

# Build frontend (if exists)
RUN npm run build --prefix Frontend

# Expose backend port
EXPOSE 10000

# Start backend
CMD ["npm", "run", "dev"]
