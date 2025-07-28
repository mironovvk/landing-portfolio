// window.addEventListener('load', () => {
//   window.scrollTo(0, 0);
// });

const topbar = document.getElementById('topbar');
const header = document.getElementById('header');


// Определяем высоту верхней панели (topbar) для дальнейшего использования
const topbarHeight = topbar.offsetHeight;

// Функция, которая задаёт верхний отступ для шапки (header) равным высоте topbar
function setHeaderOffset() {
  let topbarHeight = topbar.offsetHeight;
  header.style.top = `${topbarHeight}px`;
}

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

// Вызываем setHeaderOffset при загрузке страницы и при изменении размера окна
window.addEventListener('load', setHeaderOffset);
window.addEventListener('resize', setHeaderOffset);

const darkLogo = document.querySelector('.logo--dark');
const lightLogo = document.querySelector('.logo--light');

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
          fieldValue = fieldValue.replace(/\D/g, "");
          if (fieldValue.startsWith("8")) {
            fieldValue = "7" + fieldValue.slice(1);
          }
          fieldValue = "+" + fieldValue;
          if (fieldValue.length === 12) {
            fieldValue = fieldValue.replace(/(\+\d)(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3-$4-$5");
          }
          fieldMask = /^\+\d{1}\s\d{3}\s\d{3}-\d{2}-\d{2}$/;
          break;


        case "email":
          fieldMask = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          break;

        case "full_name":
          fieldMask = /^([А-ЯЁа-яёA-Za-z-]+)(\s[А-ЯЁа-яёA-Za-z-]+)*$/;
          break;
        case "select":
          fieldMask = /^.+$/;
          break;

        case "message":
          fieldMask = /^[^<>]{10,1000}$/s;
          break;

        default:
          fieldMask = /^[а-яёА-ЯЁA-Za-z0-9_\-\.\"\',;:\s]{5,}$/i;
          break;
      }

      // проверяем поле, если оно required
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

    // console.log(elem.name, fieldValue, fieldMask, fieldMask?.test(fieldValue));
  });

  if (checkTest.length) {
    // messageText = "Пожалуйста, заполните обязательные поля корректно.";
    // showSuccessMessage(messageText, 'error');
    return false;
  }

  // если всё прошло, показываем данные в консоли и отправляем через fetch
  // console.log("Данные формы:", Object.fromEntries(formData.entries()));

  const recaptchaResponse = document.getElementById("g-recaptcha-response").value;
  formData.append("g-recaptcha-response", recaptchaResponse);

  fetch('https://www.programweb.studio/contacts.php', {
    method: form.method,
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject();
      }
      return response.json();
    })
    .then((data) => {
      console.log("Ответ сервера:", data);
      if (data.Status === 'success') {
        form.reset();
        form.querySelector("#success_formCallback").style.display = 'flex';
        form.querySelector("#success_formCallback").innerHTML = 'Ваше обращение успешно зарегистрировано.<br>В ближайшее время мы свяжемся с Вами.';
      } else {
        form.querySelector("#errors_formCallback").style.display = 'flex';
        form.querySelector("#errors_formCallback").innerHTML = 'Не удалось отправить данные формы. ' + data.Msg;

        grecaptcha.execute("6LfmgA8pAAAAAH-Qn2UfaUQkvDsGflyV4X0DcU7E", { action: "add_form" })
          .then(function (token) {
            document.querySelectorAll('input.token').forEach(el => el.value = token);
          });
      }

      showSuccessMessage(data.message || "Форма успешно отправлена!", 'success');
      form.querySelectorAll(".invalid-field").forEach(el => el.classList.remove("invalid-field"));
    })
    .catch((err) => {
      showSuccessMessage(err.message || "Произошла ошибка при отправке. Попробуйте позже.", 'error');
      form.querySelector("#errors_formCallback").style.display = 'flex';
      form.querySelector("#errors_formCallback").innerHTML = 'Произошла ошибка при отправке. Попробуйте позже.' + err.message;
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

const lightbox = GLightbox({
  selector: '.glightbox',
  touchNavigation: true,
  keyboardNavigation: true,
  loop: false,
  zoomable:false,
});