# We build from an official Node image from Docker
FROM node:14

# Create app directory
# This will create /app folder inside the image
# Everything from here will be copied to /app
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install all dependencies
# This will create a node_modules folder inside docker image
RUN npm install

# Copy our source code into the image
COPY . ./

#Expose the port that our Node Express server will run
EXPOSE 3000

# Define the runtime command
# This will execute when we run our docker image
CMD ["node", "/app/bin/www"]