# Use a base image with Node.js installed
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
