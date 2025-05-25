#!/bin/sh
if [ ! -f "/etc/letsencrypt/live/taskhive.ru/fullchain.pem" ]; then
    certbot certonly --standalone --non-interactive --agree-tos \
        --email vgolovin31@gmail.com \
        -d taskhive.ru -d www.taskhive.ru
else
    certbot renew
fi