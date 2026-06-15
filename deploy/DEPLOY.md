# Установка тренажёра мнемотехники на VPS рег.ру

Пошаговая инструкция для публикации приложения на виртуальном сервере (VPS).
Все команды выполняются в терминале сервера (по SSH).

> Это приложение на Node.js с базой PostgreSQL. Обычный «виртуальный хостинг»
> рег.ру не подойдёт — нужен именно **VPS / облачный сервер** с root-доступом.

---

## Что понадобится

- VPS на рег.ру с Ubuntu 22.04 (или 24.04), минимум 1 ГБ ОЗУ
- Домен, направленный на IP вашего сервера (A-запись)
- Доступ по SSH (логин root и пароль/ключ — выдаются при создании VPS)

---

## Шаг 1. Подключение к серверу

С компьютера откройте терминал и подключитесь (IP возьмите в кабинете рег.ру):

```bash
ssh root@ВАШ_IP_АДРЕС
```

---

## Шаг 2. Установка нужных программ

```bash
# Обновляем систему
apt update && apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# pnpm (менеджер пакетов проекта) и PM2 (держит сервер запущенным)
npm install -g pnpm pm2

# PostgreSQL (база данных), nginx (веб-сервер), git
apt install -y postgresql nginx git

# Проверка версий
node -v && pnpm -v
```

---

## Шаг 3. Создание базы данных

```bash
# Заходим в PostgreSQL
sudo -u postgres psql
```

В открывшейся консоли PostgreSQL выполните (замените `МОЙ_ПАРОЛЬ` на свой):

```sql
CREATE DATABASE mnemonics;
CREATE USER mnemonics WITH PASSWORD 'МОЙ_ПАРОЛЬ';
GRANT ALL PRIVILEGES ON DATABASE mnemonics TO mnemonics;
\c mnemonics
GRANT ALL ON SCHEMA public TO mnemonics;
\q
```

Запишите пароль — он понадобится дальше.

---

## Шаг 4. Загрузка проекта

```bash
# Создаём папку и клонируем код
mkdir -p /var/www
cd /var/www
git clone https://github.com/p8tnn5wp2x-cloud/mnemonics-trainer.git
cd mnemonics-trainer

# Устанавливаем зависимости
pnpm install
```

---

## Шаг 5. Настройка переменных окружения

```bash
# Создаём файл .env из шаблона
cp deploy/.env.example .env
nano .env
```

В файле впишите свой пароль базы (тот, что задали в Шаге 3) и случайный
SESSION_SECRET. Сгенерировать случайную строку можно так:

```bash
openssl rand -hex 32
```

Сохраните файл: `Ctrl+O`, `Enter`, затем `Ctrl+X`.

Чтобы переменные были доступны командам сборки:

```bash
export $(grep -v '^#' .env | xargs)
```

---

## Шаг 6. Создание таблиц в базе

```bash
pnpm --filter @workspace/db run push
```

При запросе подтверждения выберите создание таблиц.

---

## Шаг 7. Сборка приложения

```bash
# Сборка API-сервера
pnpm --filter @workspace/api-server run build

# Сборка фронтенда (BASE_PATH должен быть = /)
BASE_PATH=/ PORT=20579 pnpm --filter @workspace/mnemonics run build
```

После сборки фронтенд лежит в `artifacts/mnemonics/dist/public`.

---

## Шаг 8. Запуск API-сервера через PM2

Откройте конфиг и впишите свой пароль базы и SESSION_SECRET:

```bash
nano deploy/ecosystem.config.cjs
```

Запустите:

```bash
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup    # выполните команду, которую он подскажет, для автозапуска
```

Проверка, что API отвечает:

```bash
curl http://127.0.0.1:8080/api/healthz
```

---

## Шаг 9. Настройка nginx

```bash
# Копируем конфиг
cp deploy/nginx.conf /etc/nginx/sites-available/mnemonics

# Открываем и заменяем example.ru на свой домен (в двух местах)
nano /etc/nginx/sites-available/mnemonics

# Включаем сайт
ln -s /etc/nginx/sites-available/mnemonics /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверяем конфиг и перезапускаем
nginx -t
systemctl restart nginx
```

Теперь сайт должен открываться по вашему домену: `http://ваш-домен.ru`

---

## Шаг 10. Бесплатный SSL-сертификат (https)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Следуйте подсказкам — certbot сам пропишет https в nginx и настроит
автопродление сертификата.

---

## Обновление сайта в будущем

Когда внесёте изменения в код (через Replit → GitHub), на сервере:

```bash
cd /var/www/mnemonics-trainer
git pull
pnpm install
pnpm --filter @workspace/api-server run build
BASE_PATH=/ PORT=20579 pnpm --filter @workspace/mnemonics run build
pm2 restart mnemonics-api
```

---

## Если что-то не работает

- **Сайт не открывается** — проверьте, что домен направлен на IP сервера
  (A-запись в кабинете рег.ру) и что nginx запущен: `systemctl status nginx`
- **«Не удалось загрузить...»** — API не запущен. Проверьте: `pm2 logs mnemonics-api`
- **Ошибка базы** — проверьте DATABASE_URL в `.env` и `deploy/ecosystem.config.cjs`
- **Порт занят** — убедитесь, что только PM2 запускает сервер на 8080
