# Set the base image
FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json AND package-lock.json
COPY ./package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Compile the app.
RUN npm run build:prod

# Expose the port
EXPOSE 8080

# Start the app.
CMD [ "node", "www/server.js" ]
