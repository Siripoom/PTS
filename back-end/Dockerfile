FROM node:18

WORKDIR /app

# คัดลอก package.json และ package-lock.json ก่อน เพื่อให้ npm install ใช้ cache จาก layer นี้
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

# เปิดพอร์ต 5000 สำหรับการเข้าถึงจากภายนอก
EXPOSE 5000

# เริ่มเซิร์ฟเวอร์
CMD ["node", "src/server.js"]
