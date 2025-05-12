FROM node:22

# Create app directory 
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy all the files to the container
COPY . .

# Expose the application port
EXPOSE 3040

# Run the application
CMD ["node", "index.js"]