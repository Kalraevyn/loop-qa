# Use the latest Node.js LTS version based on Debian
FROM node:18-bullseye

# update apt and upgrade
RUN apt-get update && apt-get upgrade -y

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -D @playwright/test@latest
RUN npx playwright install --with-deps
# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000