FROM node:8-alpine
RUN mkdir -p /udosr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
