module.exports = {
  apps: [
    {
      name: 'apicard',
      script: 'dist/main.js',
      cwd: '/home/vipcard-api',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        JWT_SECRET: 'vipcardsecretkeynamident',
        DB_HOST: 'localhost',
        DB_PORT: '5432',
        DB_USERNAME: 'vipcard',
        DB_PASSWORD: 'Olv251910',
        DB_NAME: 'vipcard_db',
      },
    },
  ],
};
