FROM node:12

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn --production
COPY . . 

CMD [ "yarn", "start" ]