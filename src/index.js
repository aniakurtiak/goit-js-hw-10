import { fetchBreeds, fetchCatByBreeds } from "./cat-api.js";

const selectors = {
  breedSelect: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

function createMarkupBreeds(arr) {
  return arr.map(({ id, name }) => `
    <option value="${id}">${name}</option>
  `).join('');
}

function showLoader() {
  selectors.loader.classList.remove('hidden');
}

function hideLoader() {
  selectors.loader.classList.add('hidden');
}

function showElement(element) {
  element.classList.remove('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

function showError() {
  Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');;
}

function hideError() {
  hideElement(selectors.error);
}

// Приховуємо елемент помилки спочатку
hideError();

// Покажемо завантажувач під час запиту за списком порід
showLoader();

fetchBreeds()
  .then(breeds => {
    // Заховаємо завантажувач після успішного запиту
    hideLoader();
    selectors.breedSelect.innerHTML = createMarkupBreeds(breeds);

    // Додаємо обробник події для селекту
    selectors.breedSelect.addEventListener("change", event => {
      const selectedBreedId = event.target.value;
      if (selectedBreedId) {
        // Покажемо завантажувач під час запиту за інформацією про кота
        showLoader();
        hideElement(selectors.catInfo);
        hideError(); // Приховуємо елемент помилки перед новим запитом

        // Викликаємо функцію для отримання даних про кота за ідентифікатором породи
        fetchCatByBreeds(selectedBreedId)
          .then(catData => {
            // Заховаємо завантажувач після успішного запиту
            hideLoader();
            if (catData) {
              // Виводимо інформацію про кота
              selectors.catInfo.innerHTML = `
                <img src="${catData[0].url}" alt="Cat" width = "400">
                <h3>${breeds.find(breed => breed.id === selectedBreedId).name}</h3>
                <p><strong>Description:</strong> ${catData[0].breeds[0].description}</p>
                <p><strong>Temperament:</strong> ${catData[0].breeds[0].temperament}</p>
              `;
              showElement(selectors.catInfo);
            } else {
              console.log("No cat data available for the selected breed.");
            }
          })
          .catch(error => {
            // Відображення елементу помилки при збої запиту
            console.error("Error:", error);
            showError();
          });
      }
    });
  })
  .catch(error => {
    // Відображення елементу помилки при збої запиту
    console.error("Error:", error);
    showError();
  });