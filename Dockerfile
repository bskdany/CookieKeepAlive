FROM mcr.microsoft.com/playwright:v1.39.0-jammy
ENV DEBIAN_FRONTEND=noninteractive

RUN useradd -m -d /home/ubuntu -s /bin/bash ubuntu
WORKDIR /home/$USER

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

RUN ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# RUN git clone https://github.com/bskdany/CookieKeepAlive.git
WORKDIR CookieKeepAlive
COPY . .

WORKDIR src/server
USER ubuntu

CMD ["node", "start-persistent-browser.js"]
# CMD ["/usr/bin/google-chrome-stable", "--remote-debugging-port=9222 --disable-ipc-flooding-protection --no-sandbox   --no-default-browser-check  --headless=new"]



