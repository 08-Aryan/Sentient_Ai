FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy rest of the code
COPY . .

# Expose Vite Port
EXPOSE 3000

# Bind to 0.0.0.0 is crucial for Docker
CMD ["npm", "run", "dev", "--", "--host"]
