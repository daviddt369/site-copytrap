# site-copytrap

Защита статических сайтов от тупого копирования HTML и переноса на другой домен.

Рабочая схема сейчас двухслойная:

1. `inline bootstrap` прямо в `index.html`
2. внешний `copytrap.js` из этой репы

Это важно, потому что при `Сохранить как` браузер часто ломает внешние пути к JS. Если оставить только CDN-скрипт, копия может открыться без защиты. Inline-блок закрывает именно этот кейс.

## Что делает защита

- сверяет текущий `hostname` с разрешёнными доменами
- на чужом домене блокирует копию
- показывает баннер о нелегальной копии
- выводит автора и кнопку WhatsApp
- через несколько секунд редиректит на оригинал
- внешний `copytrap.js` дополнительно режет аналитику, клики и формы

## Что обязательно ставить на сайт

На каждый сайт нужно ставить оба блока:

1. `canonical`
2. `og:url`
3. `inline bootstrap` в `<head>`
4. внешний `copytrap.js` в `<head>`

`inline bootstrap` ставится раньше аналитики, GTM, Pixel, `gtag`, `ym` и любых других трекеров.

## Быстрое подключение

Готовый пример лежит в [examples/head-snippet.html](./examples/head-snippet.html).

Универсальный шаблон с плейсхолдерами лежит в [examples/head-snippet.template.html](./examples/head-snippet.template.html).

Меняешь только:

- `site.ru` на свой домен
- `https://site.ru/` на URL оригинала
- текст автора, оффер и ссылку

Потом вставляешь весь блок в `<head>`.

## Минимальный порядок подключения

```html
<link rel="canonical" href="https://site.ru/">
<meta property="og:url" content="https://site.ru/">

<!-- 1. Inline fallback -->
...inline bootstrap...

<!-- 2. Main protection -->
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

## Параметры `copytrap.js`

- `data-allowed-hosts` - разрешённые хосты через запятую
- `data-original-url` - URL оригинального сайта
- `data-redirect-delay` - задержка редиректа в миллисекундах
- `data-mode` - `hard` или `soft`
- `data-author-name` - имя разработчика
- `data-author-pitch` - оффер в баннере
- `data-author-link` - ссылка на WhatsApp или другой контакт
- `data-author-link-text` - текст кнопки

## Что делает inline bootstrap

Inline-блок:

- срабатывает даже если внешний JS не загрузился
- работает в копии после `Сохранить как`
- проверяет домен до инициализации остального сайта
- подменяет страницу баннером
- делает редирект на оригинал

Если копировщик вручную вырежет этот блок из HTML, фронтендом это уже не запретить. Это нормальное ограничение для статических сайтов.

## Подключение аналитики

Если аналитика инициализируется вручную, лучше запускать её только на оригинальном домене:

```html
<script>
  if (window.__copytrap && window.__copytrap.allowed) {
    initTagManager();
    initAnalytics();
  }
</script>
```

## Чеклист для нового сайта

1. Открыть [examples/head-snippet.template.html](./examples/head-snippet.template.html) или [examples/head-snippet.html](./examples/head-snippet.html)
2. Заменить домен, URL оригинала и контакты
3. Вставить блок в `<head>`
4. Убедиться, что он стоит выше GTM / Pixel / `gtag` / `ym`
5. Задеплоить
6. Проверить копию на левом домене

## Чеклист проверки

На оригинальном домене:

- сайт открывается как обычно
- баннера нет
- аналитика работает

На левом домене:

- появляется баннер о нелегальной копии
- виден автор и кнопка WhatsApp
- через 5 секунд идёт редирект на оригинал

## Инструкция для Codex / ChatGPT

Если просишь AI встроить защиту в новый сайт, достаточно дать ссылку на эту репу и сказать:

```text
Встрой защиту по инструкции из README и examples/head-snippet.html.
Нужны canonical, og:url, inline bootstrap и внешний copytrap.js.
Ставь всё в <head> до аналитики.
Заполни allowed hosts, original URL, имя автора и ссылку WhatsApp.
```

Если хочешь именно шаблонный режим с подстановкой значений, можно говорить так:

```text
Возьми examples/head-snippet.template.html из репы https://github.com/daviddt369/site-copytrap
и подставь значения в {{DOMAIN}}, {{AUTHOR_NAME}}, {{AUTHOR_PITCH}}, {{AUTHOR_LINK}},
{{AUTHOR_LINK_TEXT}} и {{REDIRECT_DELAY}}.
Потом вставь результат в <head> до аналитики.
```

## Рекомендуемый источник скрипта

Использовать централизованный CDN:

```html
https://cdn.jsdelivr.net/gh/daviddt369/site-copytrap@main/copytrap.js
```

Тогда основной JS можно обновлять в одном месте.
