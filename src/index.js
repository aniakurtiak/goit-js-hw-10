import { fetchBreeds, fetchCatByBreeds } from "./cat-api.js";
import Notiflix from "notiflix"; // Імпорт бібліотеки Notiflix

const selectors = {
  breedSelect: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
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

// Функція для показу помилки з використанням Notiflix
function showError() {
  Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
}

// Приховуємо елемент помилки спочатку
hideLoader();

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
        selectors.catInfo.innerHTML = ''; // Очистимо вміст блока з інформацією про кота

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
