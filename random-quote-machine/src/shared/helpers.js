import { QUOTES_URL, RETRY_WAIT } from './constants';

export const fetchQuotes = (handleResult, maxTries, tries = 0) => {
  fetch(QUOTES_URL)
    .then(response => {
      if(response.ok) {
        return response.json();
      } else {
        throw new Error("Unable to fetch quoutes.");
      }
    })
    .then(handleResult)
    .catch(error => {
      console.log("Error fetching quotes: ", error);
      if(tries < maxTries) {
        setTimeout(
          () => fetchQuotes(handleResult, maxTries, tries + 1), 
          RETRY_WAIT * (tries + 1)
        );
      }
    });
};

export const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

export const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
