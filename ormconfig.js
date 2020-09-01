require('dotenv').config();

const localOrmConfig = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'rwplatform',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};

const prodOrmConfig = {
  type: 'mysql',
  url: process.env.DATABASE_URL,
  port: 3306,
  synchronize: true,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};

module.exports =
  process.env.NODE_ENV === 'production' ? prodOrmConfig : localOrmConfig;