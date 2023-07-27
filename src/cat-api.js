import axios from "axios";

const API_KEY = "0c0f1ab8-7a2e-4bd9-9567-9ea7a5c7745b";
axios.defaults.headers.common["x-api-key"] = API_KEY;
const BASE_URL = 'https://api.thecatapi.com/v1';


export function fetchBreeds() {
    const END_POINT = '/breeds';
    return axios.get(`${BASE_URL}${END_POINT}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching breeds:", error);
            return [];
        });
}

export function fetchCatByBreeds(breedId) {
    const END_POINT = '/images/search';
    return axios.get(`${BASE_URL}${END_POINT}?breed_ids=${breedId}`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching cat:", error);
            return null;
        });
}

