// Интерактив схемы "Родословная JavaScript": справка по клику на язык,
// подсветка линий по фильтрам и по строкам таблицы.
// Всё внутри IIFE, чтобы переменные не попали в глобальную область.
(function () {
  var svg = document.getElementById('tree');
  if (!svg) return;

  var INFO = {
    fortran: { name: 'FORTRAN', lane: '1', meta: '1957 · Джон Бэкус · IBM',
      text: 'Первый язык высокого уровня, дошедший до массового применения. Главным доводом была не выразительность, а то, что компилятор порождает код не хуже написанного вручную. Прямых заимствований в JavaScript нет: FORTRAN открыл саму возможность писать формулами, а не командами процессора.' },
    algol: { name: 'ALGOL', lane: '1', meta: '1958 · международный комитет · Цюрих',
      text: 'Язык, о котором договорились европейские и американские исследователи. Ввёл блочную структуру: программа состоит из вложенных блоков, и объявленное внутри имя снаружи не видно. В JavaScript это вернулось лишь в 2015 году вместе с let и const - var блоков не знал.' },
    bcpl: { name: 'BCPL', lane: '1', meta: '1967 · Мартин Ричардс · Кембридж',
      text: 'Промежуточный язык для переноса компиляторов между машинами. Сам почти не применялся, но именно в нём блок впервые записали фигурными скобками. Эта запись прошла через C, затем через Java и дошла до JavaScript и стала самой узнаваемой чертой половины языков мира.' },
    c: { name: 'C', lane: '1', meta: '1972 · Деннис Ритчи · Bell Labs',
      text: 'Создавался, чтобы переписать UNIX на языке выше ассемблера. Закрепил тот набор операторов и служебных слов, который сегодня выглядит «обычным»: if, for, while, return, точка с запятой в конце. JavaScript взял эту внешность целиком, хотя устроен совершенно иначе.' },
    java: { name: 'Java', lane: '1', meta: '1995 · Джеймс Гослинг · Sun Microsystems',
      text: 'К JavaScript отношения почти не имеет: общее у них только семейство синтаксиса, идущее от C. Netscape и Sun договорились о совместном продвижении, и язык Айка переименовали из LiveScript в JavaScript ради популярности Java. Оттуда же скопирован объект Date со всеми его странностями.' },
    simula: { name: 'Simula', lane: '2', meta: '1967 · Даль и Нюгор · Осло',
      text: 'Писался для имитационного моделирования - отсюда имя. Чтобы описывать объекты реального мира, в него ввели классы, наследование и виртуальные методы, то есть всё то, что позже назовут объектно-ориентированным программированием. В JavaScript эта нотация попала только в ES2015, и то как надстройка.' },
    smalltalk: { name: 'Smalltalk', lane: '2', meta: '1980 · Алан Кэй · Xerox PARC',
      text: 'Довёл идею объектов до предела: объектом является всё, а вычисление сводится к тому, что объекты шлют друг другу сообщения. Нужный метод ищется в момент вызова, а не при компиляции. Эта динамичность и возможность менять программу на ходу перешли в JavaScript через Self.' },
    self: { name: 'Self', lane: '2', meta: '1987 · Ангар и Смит · Стэнфорд и Xerox PARC',
      text: 'Задал вопрос: зачем нужны классы, если объект может наследовать прямо от другого объекта? Новый объект получают клонированием существующего, а недостающее свойство ищут по цепочке ссылок. Айк взял эту модель целиком - классов в JavaScript нет до сих пор, есть лишь похожая на них запись.' },
    lisp: { name: 'Lisp', lane: '3', meta: '1958 · Джон Маккарти · MIT',
      text: 'Второй по возрасту используемый язык после FORTRAN. Ввёл почти всё, что сегодня кажется само собой разумеющимся: автоматическое управление памятью, динамические типы, функции как обычные значения и способность программы обращаться с собственным кодом как с данными. Последнее дошло до JavaScript как eval, а позже как Proxy и Reflect.' },
    scheme: { name: 'Scheme', lane: '3', meta: '1975 · Сассмен и Стил · MIT',
      text: 'Небольшой и строгий диалект Lisp. Его главный вклад - лексическая область видимости: функция помнит переменные, среди которых была написана, а не те, что есть в месте вызова. Это и есть замыкание. Айк говорил, что хотел принести в браузер именно Scheme, но ему велели сделать язык похожим на Java.' },
    ml: { name: 'ML', lane: '4', meta: '1973 · Робин Милнер · Эдинбург',
      text: 'Создавался как язык для системы доказательства теорем - отсюда строгость. Ввёл вывод типов: программист их не пишет, компилятор выводит сам и отказывается собирать программу при несоответствии. В JavaScript это не попало никогда, зато стало основой TypeScript.' },
    js: { name: 'JavaScript', lane: 'js', meta: '1995 · Брендан Айк · Netscape',
      text: 'Задача была сделать язык для оживления страниц, похожий на Java, и сделать быстро. Айк совместил три источника: внешность от C и Java, объектную модель от Self, механику функций от Scheme. Расхождение между тем, как язык выглядит, и тем, как он устроен, заложено именно здесь.' },
    es: { name: 'ES2015', lane: 'js', meta: 'июнь 2015 · комитет TC39',
      text: 'Первое крупное обновление после десятилетнего застоя. Показательно, чем оно заполнено: блочная область видимости из ALGOL, запись классов из Simula, явная рефлексия из Lisp. Язык не столько изобретал новое, сколько подбирал придуманное за полвека до него.' },
    ts: { name: 'TypeScript', lane: '4', meta: '2012 · Андерс Хейлсберг · Microsoft',
      text: 'Надстройка, а не новый язык: типы проверяет компилятор и полностью стирает перед запуском, в браузер уходит обычный JavaScript. Систему типов взяли из традиции ML, но приспособили к уже написанному динамическому коду - отсюда структурная типизация и union-типы.' }
  };

  var detail = document.getElementById('detail');
  var elName = document.getElementById('d-name');
  var elMeta = document.getElementById('d-meta');
  var elText = document.getElementById('d-text');
  var selected = null;

  function apply(ids) {
    var list = (ids || '').split(/\s+/).filter(Boolean);
    svg.querySelectorAll('.g.hot').forEach(function (el) { el.classList.remove('hot'); });
    if (!list.length) { svg.classList.remove('focusing'); return; }
    svg.classList.add('focusing');
    list.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('hot');
    });
  }

  function place() {
    if (!selected || detail.hidden) return;
    var r = selected.getBoundingClientRect();
    var p = detail.getBoundingClientRect();
    var gap = 16, pad = 12;
    var left = r.right + gap;
    if (left + p.width > window.innerWidth - pad) left = r.left - p.width - gap;
    if (left < pad) left = Math.max(pad, Math.min(r.left, window.innerWidth - p.width - pad));
    var popTop = r.top + r.height / 2 - p.height / 2;
    popTop = Math.max(pad, Math.min(popTop, window.innerHeight - p.height - pad));
    detail.style.left = Math.round(left) + 'px';
    detail.style.top = Math.round(popTop) + 'px';
  }

  function closePop() {
    if (selected) { selected.classList.remove('sel'); selected = null; }
    detail.hidden = true;
    detail.removeAttribute('data-lane');
  }

  function openPop(g) {
    var info = INFO[g.id];
    if (!info) return;
    if (selected) selected.classList.remove('sel');
    selected = g;
    g.classList.add('sel');
    elName.textContent = info.name;
    elMeta.textContent = info.meta;
    elText.textContent = info.text;
    detail.setAttribute('data-lane', info.lane);
    detail.style.left = '-9999px';
    detail.hidden = false;
    place();
  }

  svg.querySelectorAll('.clickable').forEach(function (g) {
    var toggle = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (selected === g) { closePop(); } else { openPop(g); }
    };
    g.addEventListener('click', toggle);
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') toggle(e);
    });
  });

  document.getElementById('d-close').addEventListener('click', closePop);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && selected) closePop();
  });
  document.addEventListener('click', function (e) {
    if (selected && !detail.contains(e.target)) closePop();
  });
  window.addEventListener('resize', place);
  window.addEventListener('scroll', place, true);

  var chips = Array.prototype.slice.call(document.querySelectorAll('.chips .chip'));
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      apply(chip.dataset.ids);
    });
  });

  function activeChipIds() {
    var on = document.querySelector('.chips .chip[aria-pressed="true"]');
    return on ? on.dataset.ids : '';
  }

  document.querySelectorAll('tbody tr[data-ids]').forEach(function (row) {
    row.tabIndex = 0;
    var show = function () { apply(row.dataset.ids); };
    var back = function () { apply(activeChipIds()); };
    row.addEventListener('mouseenter', show);
    row.addEventListener('mouseleave', back);
    row.addEventListener('focus', show);
    row.addEventListener('blur', back);
  });
})();
