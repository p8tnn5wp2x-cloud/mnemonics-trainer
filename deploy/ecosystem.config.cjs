// PM2-конфиг для API-сервера тренажёра мнемотехники
// Запуск: pm2 start deploy/ecosystem.config.cjs
// Сохранить автозапуск: pm2 save && pm2 startup
//
// ЗАМЕНИТЕ:
//   - cwd на путь, куда склонирован проект
//   - ПАРОЛЬ в DATABASE_URL на пароль вашей базы PostgreSQL
//   - SESSION_SECRET на любую длинную случайную строку

module.exports = {
  apps: [
    {
      name: "mnemonics-api",
      script: "artifacts/api-server/dist/index.mjs",
      cwd: "/var/www/mnemonics-trainer",
      interpreter: "node",
      interpreter_args: "--enable-source-maps",
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: "8080",
        DATABASE_URL: "postgresql://mnemonics:ПАРОЛЬ@localhost:5432/mnemonics",
        SESSION_SECRET: "ЗАМЕНИТЕ_НА_СЛУЧАЙНУЮ_ДЛИННУЮ_СТРОКУ",
      },
    },
  ],
};
