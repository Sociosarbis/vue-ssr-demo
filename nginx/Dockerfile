FROM nginx:alpine
ENV PORT=9100
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i -e "s/\$PORT/$PORT/g" /etc/nginx/conf.d/default.conf
EXPOSE ${PORT}
CMD nginx -g "daemon off;"