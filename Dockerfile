FROM node:latest

ENV user puppy
ENV DOCKER_CONTAINER=true

RUN useradd -m -d /home/${user} ${user} && \
    chown -R ${user} /home/${user}  && \
    adduser ${user} sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

WORKDIR /home/${user}/app

COPY package.json .
RUN npm install
RUN npm install pm2 -g

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/chrome-archive-keyring.gpg
RUN echo 'deb [signed-by=/usr/share/keyrings/chrome-archive-keyring.gpg] https://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update && apt-get install -y --no-install-recommends\
    google-chrome-stable\
    fonts-liberation \
    fonts-dejavu \
    fonts-open-sans \
    fonts-roboto

RUN chmod +x /usr/bin/google-chrome-stable

RUN ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

COPY . .

WORKDIR src/server/
RUN chown -R ${user} /home/${user}/app

USER ${user}

CMD ["pm2-runtime", "start", "ecosystem.config.js"]