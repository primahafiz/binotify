FROM php:8.1-apache
COPY /src/. /var/www/html/
RUN apt-get update && apt-get install -y libpq-dev\
  && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
  && docker-php-ext-install pdo pdo_pgsql pgsql
RUN a2enmod rewrite && service apache2 restart
EXPOSE 8080