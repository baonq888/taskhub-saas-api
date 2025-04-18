# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app (use the "start" script defined in package.json)
CMD ["npm", "start"]