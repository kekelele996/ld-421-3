export const databaseConfig = {
  type: "mysql",
  url: process.env.DATABASE_URL ?? "mysql://lab_user:lab_password@127.0.0.1:3306/lab_equipment",
  synchronize: false
};
