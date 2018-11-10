FROM ubuntu/node8:latest

# Create app directory
WORKDIR /app

# Bundle app source & Install app dependencies
COPY . /app/

RUN npm install && \
    npm run build && \
    npm run test

EXPOSE 4001
CMD [ "npm", "start" ]