# Start from an official box that already has Node.js version 20 inside.
FROM node:22

# Set the working folder inside the box. All our files live here.
WORKDIR /app

# Copy ONLY the package list in first.
# (Doing this before copying the rest lets Docker remember the installed
#  libraries and skip re-installing them every time we change our code —
#  this makes future builds much faster.)
COPY package.json .

# Install the libraries listed in package.json (this installs Express).
RUN npm install

# Now copy the rest of our code into the box.
COPY . .

# Tell Docker our app uses port 3000.
EXPOSE 3000

# The command that runs when the box starts up: "npm start".
CMD ["npm", "start"]