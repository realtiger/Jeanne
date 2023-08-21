ARG BASE_IMAGE=nginx:1.23-alpine
FROM ${BASE_IMAGE}

COPY ./_nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./_nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./_nginx/ssl/* /etc/nginx/ssl/

COPY ./dist/Jeanne /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;"]

