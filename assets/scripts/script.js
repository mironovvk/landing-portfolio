const topbar = document.getElementById('topbar');
const header = document.getElementById('header');


// Определяем высоту верхней панели (topbar) для дальнейшего использования
const topbarHeight = topbar.offsetHeight;

// Функция, которая задаёт верхний отступ для шапки (header) равным высоте topbar
function setHeaderOffset() {
    let topbarHeight = topbar.offsetHeight;
    header.style.top = `${topbarHeight}px`;
    console.log(topbarHeight);
    console.log(typeof(topbarHeight));
}

// Вызываем setHeaderOffset при загрузке страницы и при изменении размера окна
window.addEventListener('load', setHeaderOffset);
window.addEventListener('resize', setHeaderOffset);

const darkLogo = document.querySelector('.logo--dark');
const lightLogo = document.querySelector('.logo--light');

// Отслеживаем прокрутку страницы
window.addEventListener('scroll', () => {
    if (window.scrollY > topbarHeight) {
        header.classList.remove('header_transparent');
        header.classList.add('header_scrolled');
        header.style.top = 0;
    } else {
        header.classList.add('header_transparent');
        header.classList.remove('header_scrolled');
        setHeaderOffset();
    }
});


// Обработчик клика по header
header.addEventListener('click', () => {
    if (window.scrollY <= topbarHeight && header.classList.contains('header_transparent')) {
        header.classList.remove('header_transparent');
        header.setAttribute('tabindex', '-1');
        header.focus();
    }
});

// Обработчик потери фокуса у header
header.addEventListener('blur', () => {
    if (window.scrollY <= topbarHeight && !header.classList.contains('header_transparent')) {
        header.classList.add('header_transparent');
    }
});

const burgerBtn = document.getElementById('burger-btn');
const navCollapse = document.getElementById('collapseExample');

// Обработчик клика по кнопке бургера
burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    navCollapse.classList.toggle('open');
    if (navCollapse.classList.contains('open')) {
        header.classList.remove('header_transparent');
    } else if (window.scrollY <= topbarHeight) {
        header.classList.add('header_transparent');
    }
});

// Для всех ссылок меню навигации добавляем обработчик клика
document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
        burgerBtn.classList.remove('active');
        navCollapse.classList.remove('open');
        if (window.scrollY <= topbarHeight) {
            header.classList.add('header_transparent');
        }
    });
});