FROM node:18

WORKDIR /app

# 👇 รับตัวแปร DATABASE_URL จากตอน build
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# 👇 inject DATABASE_URL ลง .env ชั่วคราว (เพื่อให้ Prisma ใช้งานได้)
RUN echo "DATABASE_URL=${DATABASE_URL}" > prisma/.env && \
    npx prisma db push && \
    npx prisma generate && \
    rm prisma/.env

EXPOSE 5000

CMD ["node", "src/server.js"]
