const topbar = document.getElementById('topbar');
const header = document.getElementById('header');


// Определяем высоту верхней панели (topbar) для дальнейшего использования
const topbarHeight = topbar.offsetHeight;

// Функция, которая задаёт верхний отступ для шапки (header) равным высоте topbar
function setHeaderOffset() {
  let topbarHeight = topbar.offsetHeight;
  header.style.top = `${topbarHeight}px`;
}

// Вызываем setHeaderOffset при загрузке страницы и при изменении размера окна
window.addEventListener('load', setHeaderOffset);
window.addEventListener('resize', setHeaderOffset);

const darkLogo = document.querySelector('.logo--dark');
const lightLogo = document.querySelector('.logo--light');

// Отслеживаем прокрутку страницы
window.addEventListener('scroll', () => {
  if (window.scrollY > topbarHeight) {
    header.classList.add('header_scrolled');
    header.style.top = 0;
  } else {
    header.classList.remove('header_scrolled');
    setHeaderOffset();
  }
});

const burgerBtn = document.getElementById('burger-btn');
const navCollapse = document.getElementById('collapseExample');

// Обработчик клика по кнопке бургера
burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('active');
  navCollapse.classList.toggle('open');
  if (navCollapse.classList.contains('open')) {
  }
});

const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});


// БЛОК С АККОРДЕОНОМ
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;

    header.classList.toggle('active');
    content.classList.toggle('active');
  });
});



// ФОРМА ОБРАТНОЙ СВЯЗИ
const element = document.getElementById('phone');
const maskOptions = {
  mask: '+7 (000) 000-00-00',
  lazy: true
};
const mask = new IMask(element, maskOptions);

function showSuccessMessage(textContent, className) {
  const messageBox = document.getElementById("form-message");

  setTimeout(function () {
    messageBox.style.display = 'block';
    messageBox.textContent = textContent;
    messageBox.className = `form-message ${className}`;

    setTimeout(function () {
      messageBox.style.display = 'none';
    }, 3000);

  });
};

document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.feedback-form__control');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.remove('invalid-field');
    });

    if (input.tagName.toLowerCase() === 'select') {
      if (input.value.trim() !== '') input.classList.add('filled');
      return;
    }

    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        input.classList.add('filled');
      } else {
        input.classList.remove('filled');
      }
    });

    if (input.value.trim() !== '') {
      input.classList.add('filled');
    }
  });
});

const form = document.getElementById("feedback-form");
const messageBox = document.getElementById("form-message");
let messageText;

messageBox.style.display = "none";
messageBox.textContent = "";
messageBox.classList.remove("success", "error");

form.addEventListener("submit", function (e) {
  const checkTest = [];
  const elements = form.querySelectorAll("input[name], select[name], textarea[name]");
  let formData = new FormData();

  e.preventDefault();

  elements.forEach((elem) => {
    let fieldValue = elem.value;

    // Замена множественных пробелов на один
    fieldValue = String(fieldValue).replace(/\s{2,}/g, " ").trim();

    // Определяем маску для валидации в зависимости от типа поля
    let fieldMask;

    if (elem.name && elem.dataset.type) {
      switch (elem.dataset.type) {
        case "phone":
          // Убираем все символы кроме цифр и +
          fieldValue = fieldValue.replace(/[.(),;:!?%#$'\"_=\/\-\s]*/g, "");
          fieldMask = /^[0-9\+]{8,12}$/i;
          break;

        case "email":
          fieldMask = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          break;

        case "captcha":
          fieldMask = /^[A-Za-z0-9]{5}$/i;
          break;

        case "fio":
          fieldMask = /^[А-ЯЁа-яё]+\s[А-ЯЁа-яё]+\s[А-ЯЁа-яё]+$/;
          break;

        case "select":
          // Значение должно быть непустым
          fieldMask = /^.+$/;
          break;

        default:
          fieldMask = /^[а-яёА-ЯЁA-Za-z0-9_\-\.\"\',;:\s]{5,}$/i;
          break;
      }

      // Проверяем поле, если оно required
      if (elem.hasAttribute("required")) {
        if (!fieldValue || !fieldMask || !fieldMask.test(fieldValue)) {
          checkTest.push(elem.name);
          elem.classList.add("invalid-field");
        } else {
          elem.classList.remove("invalid-field");
        }
      }
    } else {
      elem.classList.remove("invalid-field");
    }

    // Добавляем в formData только если нет ошибки по этому полю
    if (!checkTest.includes(elem.name)) {
      formData.append(elem.name, fieldValue);
    }

    console.log(elem.name, fieldValue, fieldMask, fieldMask?.test(fieldValue));
  });

  if (checkTest.length) {
    // messageText = "Пожалуйста, заполните обязательные поля корректно.";
    // showSuccessMessage(messageText, 'error');
    return false;
  }

  // Если всё прошло, показываем данные в консоли (или отправляем через fetch/ajax)
  // console.log("Данные формы:", Object.fromEntries(formData.entries()));

  // Преобразуем FormData в объект
  const jsonObject = Object.fromEntries(formData.entries());

  // Отправляем как JSON
  fetch(form.action || "/", {
    method: form.method || "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonObject),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

      // Просто считаем, что всё прошло успешно
      messageText = "Форма успешно отправлена!";
      showSuccessMessage(messageText, 'success');

      console.log("Отправляем на сервер:", jsonObject);

      // form.submit();
      form.reset();
      form.querySelectorAll(".invalid-field").forEach((el) =>
        el.classList.remove("invalid-field")
      );
    })
    .catch((err) => {
      messageText = "Произошла ошибка при отправке. Попробуйте позже.";
      showSuccessMessage(messageText, 'error');
      console.error(err);
    });

});




// БЛОК С ПРЕИМУЩЕСТВАМИ
const chooseVariant = document.getElementById('choose-variant');
const elementsRaiseBg = document.querySelectorAll('.raise-bg');
const elementsLowerBg = document.querySelectorAll('.lower-bg');

elementsRaiseBg.forEach(el => {
  el.addEventListener('mouseenter', () => {
    chooseVariant.classList.add('bg-up');
  });
  el.addEventListener('mouseleave', () => {
    chooseVariant.classList.remove('bg-up');
  });
});

elementsLowerBg.forEach(el => {
  el.addEventListener('mouseenter', () => {
    chooseVariant.classList.add('bg-down');
  });
  el.addEventListener('mouseleave', () => {
    chooseVariant.classList.remove('bg-down');
  });
});