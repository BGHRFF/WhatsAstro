FROM bghrff/whatsastro:latest

RUN git clone https://github.com/BGHRFF/WhatsAstro /root/WhatsAstro
WORKDIR /root/WhatsAstro/
ENV TZ=Asia/Baku
RUN npm install supervisor -g
RUN yarn install --no-audit

CMD ["node", "bot.js"]
