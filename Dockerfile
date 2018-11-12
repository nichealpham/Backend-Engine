FROM ubuntu:16.04
ARG DEBIAN_FRONTEND=noninteractive

# Prepare environment
RUN apt-get update && \
    apt-get install -y apt-utils dialog && \
    apt-get install -y software-properties-common && \
    apt-get install -y curl && \
    apt-get install -y wget && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash && \
    apt-get install -y nodejs && \
    apt-get update && \
    npm install -g n && \
    n 8.10.0 && \
    apt-get install -y build-essential && \
    apt-get update && \
    apt-get upgrade -y

# Create app directory
WORKDIR /app

# Bundle app source & Install app dependencies
COPY . /app/

RUN npm install && \
    npm run build && \
    npm run test

EXPOSE 4001
CMD [ "NODE_ENV=Production", "node", "dest/Server.js" ]