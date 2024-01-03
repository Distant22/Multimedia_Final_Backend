# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]
