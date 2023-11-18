FROM mcr.microsoft.com/playwright:v1.39.0-jammy

ENV DEBIAN_FRONTEND=noninteractive
ENV user ubuntu

RUN useradd -m -d /home/${user} ${user} && \
    chown -R ${user} /home/${user}  && \
    adduser ${user} sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

WORKDIR /home/${user}

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/chrome-archive-keyring.gpg
RUN echo 'deb [signed-by=/usr/share/keyrings/chrome-archive-keyring.gpg] https://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/google-chrome.list

RUN apt-get update && apt-get install -y \
    google-chrome-stable\
    fonts-liberation \
    fonts-dejavu \
    fonts-open-sans \
    fonts-roboto \
    ttf-mscorefonts-installer\
    git

RUN chmod +x /usr/bin/google-chrome-stable

RUN ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

WORKDIR app
COPY ../ ./
# RUN npm install

# WORKDIR src/server

# USER ${user}

# CMD ["node", "start-persistent-browser.js"]