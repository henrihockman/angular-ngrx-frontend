FROM nginx:mainline-alpine

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist/ /usr/share/nginx/html
