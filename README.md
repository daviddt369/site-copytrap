# site-copytrap

Универсальный JS-файл для защиты статических сайтов от тупого HTML-копипаста.

Что делает:

- проверяет текущий домен
- сравнивает его с `data-allowed-hosts`, `canonical` и `og:url`
- на чужом домене отключает типовую аналитику
- блокирует клики и формы
- показывает full-screen заглушку
- через несколько секунд редиректит на оригинальный сайт

## Быстрое подключение

Подключай скрипт в `<head>` до GTM, gtag, Pixel и других трекеров.

```html
<link rel="canonical" href="https://site.ru/">
<meta property="og:url" content="https://site.ru/">

<script
  src="/assets/js/copytrap.js"
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

## Параметры

- `data-allowed-hosts` - список разрешенных хостов через запятую
- `data-original-url` - куда редиректить с копии
- `data-redirect-delay` - задержка редиректа в миллисекундах
- `data-mode` - `hard` или `soft`
- `data-author-name` - имя разработчика в баннере
- `data-author-pitch` - короткий оффер в баннере
- `data-author-link` - ссылка на WhatsApp или другой контакт
- `data-author-link-text` - текст кнопки контакта

## Что править на сайте

1. Добавить `canonical`
2. Добавить `og:url`
3. Подключить `copytrap.js` в `<head>`
4. Подключать аналитику только после проверки `window.__copytrap.allowed`

Пример:

```html
<script>
  if (window.__copytrap && window.__copytrap.allowed) {
    initTagManager();
    initAnalytics();
  }
</script>
```

## Варианты использования

### 1. Копировать файл в каждый сайт

Файл кладется в:

```text
/assets/js/copytrap.js
```

### 2. Грузить централизованно из GitHub/CDN

После публикации репозитория можно подключать один центральный URL, например через jsDelivr:

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

Тогда обновление защиты делается в одном месте.
