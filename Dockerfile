FROM node:8 as builder

ADD package.json /usr/src/app/
WORKDIR /usr/src/app
RUN yarn install 
COPY . .
RUN yarn build

FROM nginx:stable
COPY --from=builder build/ /var/www/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
