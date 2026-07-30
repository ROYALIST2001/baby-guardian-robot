# Start from a box that already has Node.js version 20.
FROM node:20

# Set the working folder inside the box.
WORKDIR /app

# Copy the package list and install the library.
COPY package.json .
RUN npm install

# Copy the rest of the code in.
COPY . .

# When the box starts, run the simulator.
CMD ["npm", "start"]