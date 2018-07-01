FROM node:latest

WORKDIR /usr/src/app

COPY package.json /usr/src/app

# Install app dependencies
RUN npm install
RUN npm install http-server -g
RUN npm run-script build

COPY . /usr/src/app

EXPOSE 3000

CMD ["http-server", "./build/"]