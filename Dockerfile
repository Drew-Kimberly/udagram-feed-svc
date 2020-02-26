# Set the base image
FROM node:10-alpine

# Define Build arguments.
ARG LOCAL_PACKAGE_DIR=packages/udagram-feed-svc

# Create app directory
WORKDIR /usr/udagram-root/packages/app

# Copy package.json AND package-lock.json
COPY $LOCAL_PACKAGE_DIR/package*.json ./

# Install all dependencies
RUN npm ci

# Copy Monorepo root dependencies
COPY tsconfig.base.json /usr/udagram-root/tsconfig.base.json

# Copy the rest of the code
COPY $LOCAL_PACKAGE_DIR/src ./src
COPY $LOCAL_PACKAGE_DIR/tsconfig.json ./tsconfig.json
COPY $LOCAL_PACKAGE_DIR/Dockerfile ./Dockerfile

# Compile the app.
RUN npm run build:prod

# Expose the port
EXPOSE 8080

# Start the app.
CMD [ "node", "www/server.js" ]
