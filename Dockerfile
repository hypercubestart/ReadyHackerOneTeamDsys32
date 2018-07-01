FROM node:latest

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY . /usr/src/app

# Install app dependencies
RUN npm install
RUN npm install http-server -g
RUN npm run-script build

EXPOSE 8080

CMD ["http-server", "./build/"]