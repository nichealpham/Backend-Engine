FROM ubuntu/node8:latest

# Create app directory
WORKDIR /app

# Bundle app source & Install app dependencies
COPY dest/ /app/
COPY package.json /app/

RUN npm install --only=production

EXPOSE 4001
CMD [ "npm", "start" ]