# Use a specific Node.js version as the base image
FROM node:21.7.3

# Set the build argument for VITE_API_URL
ARG VITE_API_URL

# Set the working directory
ENV APP_DIR=/apps/prepsom-games-frontend
WORKDIR ${APP_DIR}

# Set environment variable for VITE_API_URL (to make it accessible in the container)
ENV VITE_API_URL=${VITE_API_URL}

# Copy only necessary files (make sure you have a .dockerignore to avoid unnecessary files like node_modules)
COPY . .

# Install dependencies using npm ci for a clean install if package-lock.json exists
RUN npm ci

# Build the project using TypeScript compiler (npx tsc)
RUN npm run build

# Expose the port Cloud Run will listen on
EXPOSE 8080

# Start the Node.js app
CMD ["npm", "start"]
