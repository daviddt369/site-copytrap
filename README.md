# site-copytrap

Универсальный JS-файл для защиты статических сайтов от тупого HTML-копипаста.

## Что делает

- проверяет текущий домен
- сравнивает его с `data-allowed-hosts`, `canonical` и `og:url`
- на чужом домене отключает типовую аналитику
- блокирует клики и формы
- показывает full-screen заглушку
- показывает блок разработчика с ссылкой на WhatsApp
- через несколько секунд редиректит на оригинальный сайт

## Как это работает

Скрипт берет текущий хост через `window.location.hostname`.

Дальше он собирает список разрешенных доменов из трех мест:

- `data-allowed-hosts`
- `<link rel="canonical">`
- `<meta property="og:url">`

Если текущий домен есть в этом списке, сайт работает как обычно.

Если текущий домен не совпадает:

- основной контент скрывается
- ставится `noindex, nofollow, noarchive`
- глушатся типовые трекеры (`gtag`, `fbq`, `ym`, `ttq`, `sendBeacon`)
- блокируются клики и отправка форм
- показывается баннер о нелегальной копии
- показывается блок разработчика
- через заданную задержку идет редирект на оригинальный сайт

## Что будет, если сайт скопируют

Если кто-то просто вытянет HTML/CSS/JS и зальет сайт на другой домен, то на копии:

1. Сработает проверка домена.
2. Пользователь увидит баннер `Нелегальная копия сайта`.
3. Появится кнопка перехода на оригинальный сайт.
4. Появится подпись разработчика `Ai.Vazovski` и ссылка в WhatsApp.
5. Через `5` секунд посетителя перекинет на оригинал.

Важно: это защита не от разработчика, который умеет переписывать код, а от массового тупого копипаста лендингов. Для такой задачи она подходит нормально.

## Быстрое подключение

Подключай скрипт в `<head>` до GTM, gtag, Pixel, Метрики и других трекеров.

```html
<link rel="canonical" href="https://site.ru/">
<meta property="og:url" content="https://site.ru/">

<script
  src="https://cdn.jsdelivr.net/gh/daviddt369/site-copytrap@main/copytrap.js"
  data-allowed-hosts="site.ru,www.site.ru"
  data-original-url="https://site.ru/"
  data-redirect-delay="5000"
  data-mode="hard"
  data-author-name="Ai.Vazovski"
  data-author-pitch="Хотите такой же качественный сайт? Напишите мне."
  data-author-link="https://wa.me/77755196342?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%82%D0%B0%D0%BA%D0%BE%D0%B9%20%D0%B6%D0%B5%20%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82."
  data-author-link-text="Написать в WhatsApp"
></script>
```

## Как добавить на новый сайт

### 1. Пропиши правильный домен в SEO-тегах

```html
<link rel="canonical" href="https://new-site.ru/">
<meta property="og:url" content="https://new-site.ru/">
```

### 2. Вставь `copytrap` в `<head>`

```html
<script
  src="https://cdn.jsdelivr.net/gh/daviddt369/site-copytrap@main/copytrap.js"
  data-allowed-hosts="new-site.ru,www.new-site.ru"
  data-original-url="https://new-site.ru/"
  data-redirect-delay="5000"
  data-mode="hard"
  data-author-name="Ai.Vazovski"
  data-author-pitch="Хотите такой же качественный сайт? Напишите мне."
  data-author-link="https://wa.me/77755196342?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%82%D0%B0%D0%BA%D0%BE%D0%B9%20%D0%B6%D0%B5%20%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82."
  data-author-link-text="Написать в WhatsApp"
></script>
```

### 3. Подключай аналитику только после проверки

Если GTM, Meta Pixel, gtag или другая аналитика подключаются вручную, оборачивай их так:

```html
<script>
  if (window.__copytrap && window.__copytrap.allowed) {
    initTagManager();
    initAnalytics();
  }
</script>
```

## Параметры

- `data-allowed-hosts` - список разрешенных хостов через запятую
- `data-original-url` - куда редиректить с копии
- `data-redirect-delay` - задержка редиректа в миллисекундах
- `data-mode` - `hard` или `soft`
- `data-author-name` - имя разработчика в баннере
- `data-author-pitch` - короткий оффер в баннере
- `data-author-link` - ссылка на WhatsApp или другой контакт
- `data-author-link-text` - текст кнопки контакта

## Режимы

### `hard`

Жесткий режим:

- скрывает весь контент
- показывает заглушку
- блокирует взаимодействие
- редиректит на оригинал

### `soft`

Более мягкий режим:

- тоже блокирует взаимодействие и редиректит
- но визуально оставляет менее агрессивный overlay

Для лендингов лучше использовать `hard`.

## Чеклист для нового сайта

Перед публикацией проверь:

1. `canonical` указывает на реальный домен
2. `og:url` указывает на реальный домен
3. `data-allowed-hosts` содержит домен и `www`
4. `data-original-url` ведет на оригинал
5. `copytrap.js` подключен в `<head>` выше аналитики
6. на родном домене сайт открывается нормально
7. на тестовом левом домене появляется баннер и редирект

## Варианты использования

### 1. Грузить централизованно из GitHub/CDN

Основной вариант:

```html
<script
  src="https://cdn.jsdelivr.net/gh/daviddt369/site-copytrap@main/copytrap.js"
  data-allowed-hosts="site.ru,www.site.ru"
  data-original-url="https://site.ru/"
  data-redirect-delay="5000"
  data-mode="hard"
  data-author-name="Ai.Vazovski"
  data-author-pitch="Хотите такой же качественный сайт? Напишите мне."
  data-author-link="https://wa.me/77755196342?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A5%D0%BE%D1%87%D1%83%20%D1%82%D0%B0%D0%BA%D0%BE%D0%B9%20%D0%B6%D0%B5%20%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82."
  data-author-link-text="Написать в WhatsApp"
></script>
```

Плюс этого варианта: обновление защиты делается в одном месте.

### 2. Копировать файл в каждый сайт

Если не хочешь CDN, можно положить файл локально:

```text
/assets/js/copytrap.js
```

И подключать так:

```html
<script src="/assets/js/copytrap.js"></script>
```

Но централизованный вариант удобнее.

## Файлы в репозитории

- `copytrap.js` - сам скрипт защиты
- `examples/head-snippet.html` - готовый пример подключения
- `README.md` - инструкция
