FROM nginx:1.27

# @TODO certbot -> install certbot for Let's Encrypt SSL
# RUN apt-get update -y && apt-get install -y python3 python3-venv libaugeas0
# RUN python3 -m venv /opt/certbot/
# RUN /opt/certbot/bin/pip install --upgrade pip
# RUN /opt/certbot/bin/pip install certbot certbot-nginx
# RUN ln -s /opt/certbot/bin/certbot /usr/bin/certbot

RUN mkdir -p /data && chown -R nginx:nginx /data
WORKDIR /data

#COPY --chown=nginx:nginx --chmod=600 ./.htpasswd /data
COPY ./docker/nginx/nginx.conf /etc/nginx/templates/default.conf.template

#TODO: configure / run certbot