'use strict';

/* script.js подключён на всех страницах, поэтому каждая функция
   сначала проверяет, есть ли нужный элемент на текущей странице. */

/* ---------- 1. Тёмная тема (кнопка в шапке) ---------- */
function initTheme() {
  const button = document.querySelector('#theme');
  if (!button) return;

  const STORAGE_KEY = 'portfolio-theme';

  function applyTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    button.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
  }

  // читаем сохранённый выбор (localStorage может быть недоступен)
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (error) {}
  applyTheme(saved === 'dark');

  button.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-theme');
    applyTheme(isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (error) {}
  });
}

/* ---------- 2. Кнопка «Подробнее» показывает и скрывает блок ---------- */
function initShowMore() {
  const button = document.querySelector('#showMore');
  const moreText = document.querySelector('#moreText');
  if (!button || !moreText) return;

  button.addEventListener('click', () => {
    moreText.classList.toggle('d-none'); // d-none — класс Bootstrap
    const isHidden = moreText.classList.contains('d-none');
    button.textContent = isHidden ? 'Подробнее' : 'Скрыть';
    button.setAttribute('aria-expanded', String(!isHidden));
  });
}

/* ---------- 3. Форма обратной связи ---------- */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const commentInput = document.querySelector('#comment');
  const formMessage = document.querySelector('#formMessage');
  if (!form || !nameInput || !emailInput || !commentInput || !formMessage) return;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const fields = [nameInput, emailInput, commentInput];

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = 'mt-3 ' + type; // text-danger / text-success
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // не даём странице перезагрузиться

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const commentValue = commentInput.value.trim();

    const nameOk = nameValue !== '';
    const emailOk = EMAIL_PATTERN.test(emailValue);
    const commentOk = commentValue !== '';

    // подсвечиваем только неверные поля
    nameInput.classList.toggle('is-invalid', !nameOk);
    emailInput.classList.toggle('is-invalid', !emailOk);
    commentInput.classList.toggle('is-invalid', !commentOk);

    if (!nameOk || !emailOk || !commentOk) {
      showMessage('Заполните все поля и проверьте email', 'text-danger');
      fields.find((field) => field.classList.contains('is-invalid')).focus();
      return;
    }

    showMessage('Спасибо, ' + nameValue + '! Сообщение принято.', 'text-success');
    form.reset();
  });

  // как только пользователь начал исправлять поле, убираем красную рамку
  fields.forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
  });
}

/* ---------- 4. Проекты из data/projects.json ---------- */
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function renderProjects(container, projects) {
  container.innerHTML = projects.map((project, index) => `
    <article class="tile">
      <span class="tile-num">${String(index + 1).padStart(2, '0')}</span>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <p class="tile-tech">${escapeHtml(project.tech)}</p>
      <a class="tile-link" href="${escapeHtml(project.link)}">Открыть →</a>
    </article>
  `).join('');
}

function initProjects() {
  const container = document.querySelector('#projects');
  if (!container) return;

  fetch('./data/projects.json')
    .then((response) => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then((projects) => renderProjects(container, projects))
    .catch(() => {
      container.innerHTML =
        '<p class="text-danger">Не удалось загрузить проекты. ' +
        'Откройте сайт через Live Server или GitHub Pages.</p>';
    });
}

/* ---------- Запуск ---------- */
initTheme();
initShowMore();
initContactForm();
initProjects();
