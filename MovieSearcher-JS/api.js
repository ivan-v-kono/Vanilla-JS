/**
  * @const {string} apiURL
  * @description                    API URL 
  */
const apiURL = 'https://www.omdbapi.com/?apikey=94c326db';


/**
  * @function getApiData
  * @description                    Receives data from API upon request
  * @param  {String} apiCalls       API request
  * @return {Object} data           Received data as an object
  * @async
  */
async function getApiData(apiCalls) {
	const response = await fetch(apiCalls);
    const data = await response.json();
    return data;
}


/**
  * @function getMovies
  * @description                    Сreates a general request to the API and returns the received data
  * @param  {String} searchKeys     Search request entered by the user
  * @return {Object} data           Received data as an object
  */
export function getMovies(searchKeys) {
    const request = 'https://www.omdbapi.com/?apikey=94c326db' + searchKeys;
    const data = getApiData(request); 
    return data;
}


/**
  * @function getMoviesDetails
  * @description                                Сreates a detailed request to the API and returns the received data
  * @param  {String} detailedKeys               Keys for requesting a movie selected by the user
  * @return {Object} data                       received data as an object
  */
export function getMoviesDetails(detailedKeys) {
    const request = apiURL + detailedKeys;
   	const data = getApiData(request); 
   	return data;
   }