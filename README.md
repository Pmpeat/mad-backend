### สร้าง Model Files โดยการ ###
ตัวอย่าง : npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

### เพิ่ม Fields ใหม่ให้กับ Database ที่มีอยู่แล้ว ###
ตัวอย่าง : npx sequelize-cli migration:create --name modify_users_add_new_fields

### ถ้าอยากจะสร้าง Database ใช้คำสั่งนี้ก็ได้ ###
ตัวอย่าง : npx sequelize-cli db:create หรือ npm run create

### Migrate Model Files โดยการ ###
ตัวอย่าง : npx sequelize-cli db:migrate หรือ npm run migrate

### ยกเลิกการ Migrate กลับไปอันเก่า ###
ตัวอย่าง : npx sequelize-cli db:migrate:undo

### วิธีการสร้าง Seed ###
ตัวอย่าง : npx sequelize-cli seed:generate --name demo-user

### วิธีการ Migrate Seed ###
ตัวอย่าง : npx sequelize-cli db:seed:all หรือ npm run seed

### วิธีการ Undo Seed ###
ตัวอย่าง : npx sequelize-cli db:seed:undo หรือ npm run seed:undo

### Undo Specific Seed ###
ตัวอย่าง : npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data

### Undo All Seed ###
ตัวอย่าง : npx sequelize-cli db:seed:undo:all

### ถ้าอยาก Unit Test ไปสร้าง Files ใน Folder Test *.test.js แล้วก็รันคำสั่ง ###
ตัวอย่าง : npm run test
คำสั่ง expect https://jestjs.io/docs/expect

### Query Basic ###
https://sequelize.org/docs/v6/core-concepts/model-querying-basics/