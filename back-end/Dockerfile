FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# สร้างตารางจาก schema.prisma + generate client
RUN npx prisma db push && npx prisma generate

EXPOSE 5000

CMD ["node", "src/server.js"]
