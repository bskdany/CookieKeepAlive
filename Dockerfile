FROM mcr.microsoft.com/playwright:v1.39.0-jammy

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/chrome-archive-keyring.gpg
RUN echo 'deb [signed-by=/usr/share/keyrings/chrome-archive-keyring.gpg] https://dl.google.com/linux/chrome/deb/ stable main' > /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get install -y \
    google-chrome-stable

RUN apt-get install -y \
    fonts-liberation \
    fonts-dejavu \
    ttf-ubuntu-font-family

RUN ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime
