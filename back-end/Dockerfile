FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# ⛳ inject DATABASE_URL แบบชั่วคราว สำหรับ prisma generate + db push
RUN echo "DATABASE_URL=${DATABASE_URL}" > prisma/.env && \
    npx prisma db push && \
    npx prisma generate && \
    rm prisma/.env

EXPOSE 5000

CMD ["node", "src/server.js"]
