import { fetchBreeds, fetchCatByBreeds } from "./cat-api.js";
import Notiflix from "notiflix"; 
import Choices from 'choices.js';

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
  selectors.breedSelect.classList.add('hidden');
}

function hideLoader() {
  selectors.loader.classList.add('hidden');
  selectors.breedSelect.classList.remove('hidden');
}

function showError() {
  Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
}

hideLoader();

fetchBreeds()
  .then(breeds => {
    selectors.breedSelect.innerHTML = createMarkupBreeds(breeds);

    const choices = new Choices(selectors.breedSelect, {
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
    });

    selectors.breedSelect.addEventListener("change", event => {
      const selectedBreedId = event.target.value;
      if (selectedBreedId) {
        showLoader(); 
        selectors.catInfo.innerHTML = '';
        
        fetchCatByBreeds(selectedBreedId)
          .then(catData => {
            hideLoader(); 
            if (catData) {
              selectors.catInfo.innerHTML = `
                <img src="${catData[0].url}" alt="Cat" width="400">
                <h3>${breeds.find(breed => breed.id === selectedBreedId).name}</h3>
                <p><strong>Description:</strong> ${catData[0].breeds[0].description}</p>
                <p><strong>Temperament:</strong> ${catData[0].breeds[0].temperament}</p>
              `;
            } else {
              console.log("No cat data available for the selected breed.");
            }
          })
          .catch(error => {
            console.error("Error:", error);
            showError();
          });
      }
    });

    hideLoader(); 
  })
  .catch(error => {
    console.error("Error:", error);
    showError();
  });
