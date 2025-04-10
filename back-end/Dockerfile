FROM node:18

WORKDIR /app

# คัดลอก package.json และ package-lock.json ก่อน เพื่อให้ npm install ใช้ cache
COPY package*.json ./
RUN npm install --omit=dev

# คัดลอก Prisma schema และไฟล์ที่จำเป็น
COPY prisma ./prisma
COPY . .

# สร้าง environment variable สำหรับ DATABASE_URL และเรียกใช้งาน prisma
RUN echo "DATABASE_URL=${DATABASE_URL}" > prisma/.env && \
    npx prisma db push && \
    npx prisma generate && \
    rm prisma/.env

EXPOSE 5000

CMD ["node", "src/server.js"]
