// Реестр работ курса и отрисовка навигации по нему.
// Новая работа = запись в WORKS + папка works/<slug>/index.html с <body data-work="<slug>">.
// Весь код в блоке: let/const не попадают в глобальную область и не пересекутся с переменными практик.
{
  // task - ссылка на условие задания, editor - на выполненное задание в онлайн-редакторе. Оба необязательны.
  const WORKS = [
    {
      slug: 'cramer',
      title: 'Крамер',
      task: 'https://node-server.ru/m/mod/scorm/player.php?a=487&currentorg=crs_hello&scoid=1011',
      editor: 'https://web-scriptor.ru/g/a825a88',
    },
    {
      // Условия двух подзаданий - на самой странице работы, решение у обоих одно
      slug: 'xsl',
      title: 'XSL-преобразования',
      editor: 'https://web-scriptor.ru/g/xsl_intro',
    },
    {
      slug: 'docker',
      title: 'Docker-образ',
      task: 'https://node-server.ru/m/mod/forum/view.php?id=3982',
    },
    {
      slug: 'js_history',
      title: 'Родословная JavaScript',
      task: 'https://node-server.ru/m/mod/forum/view.php?id=3980',
    },
    {
      slug: 'correlation',
      title: 'Корреляция',
      task: 'https://node-server.ru/m/mod/scorm/player.php?a=489&currentorg=crs_hello&scoid=1015',
      editor: 'https://web-scriptor.ru/g/53aa5a4',
    },
  ];

  // Путь к корню сайта: src этого скрипта, как он записан в разметке, минус "assets/works.js".
  // На главной получится "", на странице работы - "../../".
  const SCRIPT_PATH = 'assets/works.js';
  const rootPath = document.currentScript.getAttribute('src').slice(0, -SCRIPT_PATH.length);

  const homeHref = rootPath || './';
  const worksHref = rootPath + 'works/';
  const workHref = (work) => worksHref + work.slug + '/';

  const currentSlug = document.body.dataset.work;
  const SIDEBAR_ID = 'works-sidebar';

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const createLink = (href, text, className) => {
    const link = createElement('a', className, text);
    link.href = href;
    return link;
  };

  // Нумерованный список всех работ, текущая помечена aria-current
  const createWorkList = (className) => {
    const list = createElement('ol', className);
    for (const work of WORKS) {
      const item = document.createElement('li');
      const link = createLink(workHref(work), work.title);
      if (work.slug === currentSlug) link.setAttribute('aria-current', 'page');
      item.append(link);
      list.append(item);
    }
    return list;
  };

  // Кнопка "три полоски": атрибут popovertarget сам открывает и закрывает панель, обработчики не нужны
  const createMenuButton = () => {
    const button = createElement('button', 'menu-button');
    button.setAttribute('popovertarget', SIDEBAR_ID);
    button.setAttribute('aria-label', 'Список работ');
    button.innerHTML = '<span></span><span></span><span></span>';
    return button;
  };

  // Боковая панель на popover: браузер даёт верхний слой, затемнение фона, закрытие по Esc и клику мимо
  const createSidebar = () => {
    const sidebar = createElement('aside', 'sidebar');
    sidebar.id = SIDEBAR_ID;
    sidebar.setAttribute('popover', '');
    sidebar.setAttribute('aria-label', 'Работы по курсу');

    const closeButton = createElement('button', 'sidebar-close', '✕');
    closeButton.setAttribute('popovertarget', SIDEBAR_ID);
    closeButton.setAttribute('popovertargetaction', 'hide');
    closeButton.setAttribute('aria-label', 'Закрыть');

    const head = createElement('div', 'sidebar-head');
    head.append(createElement('span', 'sidebar-title', 'Работы по курсу'), closeButton);

    const foot = createElement('div', 'sidebar-foot');
    foot.append(createLink(homeHref, 'Главная'), createLink(worksHref, 'Все работы'));

    sidebar.append(head, createWorkList('works-list'), foot);
    return sidebar;
  };

  const renderSiteNav = (nav) => {
    nav.append(createMenuButton(), createLink(homeHref, 'Малодушев М. А.', 'brand'));
    document.body.append(createSidebar());
  };

  // Кнопки посередине подвала: условие задания и выполненное задание, если ссылки заданы
  const createWorkLinks = (work) => {
    const links = createElement('div', 'button-row');
    if (work.task) links.append(createLink(work.task, 'Ссылка на задание', 'button-link button-link-outline'));
    if (work.editor) links.append(createLink(work.editor, 'Ссылка на выполненное задание', 'button-link'));
    return links;
  };

  // Подвал работы: соседние работы по порядку в WORKS, между ними - ссылки на задание.
  // Пустые слоты - <span>, чтобы сетка из трёх колонок не съезжала у первой и последней работы.
  const renderPager = (nav) => {
    const index = WORKS.findIndex((work) => work.slug === currentSlug);
    if (index === -1) return;

    const prev = WORKS[index - 1];
    const next = WORKS[index + 1];

    nav.append(
      prev ? createLink(workHref(prev), '← ' + prev.title) : document.createElement('span'),
      createWorkLinks(WORKS[index]),
      next ? createLink(workHref(next), next.title + ' →') : document.createElement('span'),
    );
  };

  const siteNav = document.querySelector('[data-nav="site"]');
  if (siteNav) renderSiteNav(siteNav);

  const pager = document.querySelector('[data-nav="pager"]');
  if (pager) renderPager(pager);

  // Оглавление на works/index.html: переносим пункты в готовый <ol>, чтобы сохранить его класс
  const worksList = document.querySelector('[data-nav="list"]');
  if (worksList) worksList.replaceChildren(...createWorkList().children);
}