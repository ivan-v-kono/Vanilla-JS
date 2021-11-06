import { getValue, removeElement, hideElement, showElement } from './utils.js';
import { getMovies, getMoviesDetails } from './api.js';

/**
  * @const {String[]} movieDescriptionKeys
  * @description                                Array of keys for displaying full information about the selected movie 
  */
const movieDescriptionKeys = ['Title', 'Year', 'Rated', 'Released', 'Runtime', 'Genre', 'Director', 'Writer', 'Actors', 'Plot', 'Language', 'Country', 'Awards', 'Metascore', 'imdbRating', 'imdbVotes', 'imdbID', 'Type', 'DVD', 'BoxOffice', 'Production', 'Website'];

/**
  * @const {String[]} sourceNames
  * @description                                Array of keys for displaying complete information about the ratings of the selected movie
  */
const sourceNames = ['Internet Movie Database', 'Rotten Tomatoes', 'Metacritic'];


/**
  * @function getRequest
  * @description                    Receives entered data from input box and radio button, forms and returns search request entered by the user
  * @return {String} myRequest      Search request entered by the user
  */
function getRequest() {
    const titleValue = getValue('#input');
    const typeValue = getValue('input[name="radio"]:checked');
    const myRequest = '&s=' + titleValue + typeValue;
    return myRequest;
};


/**
  * @function isDataTrue
  * @description                    Checks data received from API
  * @param {Object} data            Data received from API
  * @return {Boolean}               Return true or false
  */
function isDataTrue(data) {
    if (data.Response === 'False' || !data.Response) {
        showElement('Sorry');
        document.getElementById('Sorry').textContent = `Oh... can't find anything. Try again ;)`;
        document.getElementById('input').value = '';
        hideElement('page');
        return false;
    } else {
        return true;
    }
}

/**
  * @function showMovieList
  * @description                            Displays cards of movies found by query
  * @param {Object} moviesData              Data received from API
  * @param {Number} p                       Current page number in pagination
  */
function showMovieList(moviesData, p) {
    const page = p;
    let end;
    removeElement('row');
    showElement('spinnerPlace');
    hideElement('page','movieDescription', 'Sorry', 'spinnerPlace');

    if (moviesData.Search.length == 10) {
        end = 10;
        showElement('page');
    } else end = moviesData.Search.length;

    document.getElementById("pagePrev").innerHTML = page;
    document.getElementById("pageNext").innerHTML = Math.ceil(moviesData.totalResults / 10);

    for (let i = 0; i < end; i++) {
        let imgSrc;
        if (!moviesData.Search[i].Poster || moviesData.Search[i].Poster == "N/A") {
            imgSrc = 'poster_n-a.jpg';
        } else imgSrc = moviesData.Search[i].Poster;

        const title = moviesData.Search[i].Title;
        const year = moviesData.Search[i].Year;
        const imdbID = moviesData.Search[i].imdbID;
        const div = `<a href="#" class=" mb-5 cards col-9 col-sm-5 col-md-3 col-lg-2 col-xxl-1 mx-2 mb-3 mx-xxl-0 px-xl-4 px-xxl-0" id=` + `${imdbID}` + `>
            <div class="card h-100 text-light">
              <img src=` + `${imgSrc}` + ` class="card-img-top img-fluid rounded rounded-bottom-0" alt="...">
                <div class="row card-body px-2 py-0 align-items-end" style="background: inherit;">
                  <h6 class="card-title p-2 m-0" >` + `${title}` + `</h6>
                </div>
              <div class="card-footer p-0 border-0" style="background: inherit;"> 
                <p class="p-1 m-0 fs-6 fw-bolder">` + `${year}` + `</p>
              </div>
            </div>
          </a>`;
        row.insertAdjacentHTML('beforeend', div);
    };
    chooseMovie(); 
}


/**
  * @function chooseMovie
  * @description                                    Handler for clicking on the card of the selected movie to get full information about the movie
  */
function chooseMovie() {
    const cards = document.querySelectorAll('.cards');

    cards.forEach(item => item.addEventListener('click', function() {
        /**
         * @const {String} selectedMovieRequest
         * @description                             Key for requesting full information about the movie from the API 
         */
        const selectedMovieRequest = '&plot=full&i=' + item.id;
        getSelectedMovieData(selectedMovieRequest);
    }));
}


/**
  * @function getSelectedMovieData
  * @description                                        Getting complete information about the selected movie from the API
  * @param {String} selectedMovieRequest                Key for requesting full information about the movie from the API 
  */
function getSelectedMovieData(selectedMovieRequest) {

    window.scrollTo(0, 0);
    hideElement('row', 'page', 'movieDescription');
    showElement('spinnerPlace');

    getMoviesDetails(selectedMovieRequest)
        .then(result => {
            const selectedMovieData = result;
            hideElement('spinnerPlace');
            showElement('row', 'page');
            showMovieDescription(selectedMovieData);
        });
}


/**
  * @function showMovieDescription
  * @description                                     Displays full information about the selected movie
  * @param {Object} selectedMovieData                Full information about the selected movie from the API 
  */
function showMovieDescription(selectedMovieData) {

    showElement('movieDescription');

    for (let key of movieDescriptionKeys) {
        if (!selectedMovieData.hasOwnProperty(key)) selectedMovieData[`${key}`] = 'N/A';
        document.getElementById(`${key}`).textContent = selectedMovieData[`${key}`];
    }
    if (!selectedMovieData.Poster || selectedMovieData.Poster == 'N/A') {
        selectedMovieData.Poster = 'poster_n-a.jpg';
    }
    document.getElementById("Poster").setAttribute("src", selectedMovieData.Poster);
    for (let i = 0; i < 3; i++) {
        if (!selectedMovieData.Ratings[i]) selectedMovieData.Ratings[i] = {};
        if (!selectedMovieData.Ratings[i].Value) selectedMovieData.Ratings[i].Value = 'N/A';
        document.getElementById(sourceNames[i]).textContent = selectedMovieData.Ratings[i].Value;
    }
}


//------------- EventListeners -------

//----------- поиск по нажатию Enter -----------------------------------


input.addEventListener('keypress', function(event) {
    const keybrd = event.which || event.keyCode || event.key;
    if (keybrd === 13 || keybrd === "Enter") {
        const myRequest = getRequest();
        removeElement('row');
        showElement('spinnerPlace');
        hideElement('page','movieDescription', 'Sorry');

        getMovies(myRequest)
            .then(result => {
                const moviesData = result;
                if (isDataTrue(moviesData)) {
                    hideElement('Sorry', 'spinnerPlace');
                    showMovieList(moviesData, 1);
                } else {
                    hideElement('spinnerPlace');
                    return;
                }
            });
    }
});


//----------- поиск по нажатию кнопки поиска -----------------------------------
search.addEventListener('click', function() {
    const myRequest = getRequest();
    removeElement('row');
    showElement('spinnerPlace');
    hideElement('page','movieDescription', 'Sorry');

    getMovies(myRequest)
        .then(result => {
            const moviesData = result;
            if (isDataTrue(moviesData)) {
                hideElement('Sorry', 'spinnerPlace');
                showMovieList(moviesData, 1);
            } else {
                hideElement('spinnerPlace');
                return;
            }
        });
});


//------------- кнопка закрытия описания фильма -----------------------------------
closeDescriptionBtn.addEventListener('click', function() {
    hideElement('movieDescription');
});


//------ переход на предыдущую страницу ------
prev.addEventListener('click', function() {
    const page = +document.getElementById("pagePrev").textContent - 1;
    if (page < 1) return;

    const myRequest = getRequest() + '&page=' + page;
    removeElement('row');
    showElement('spinnerPlace');
    hideElement('page','movieDescription', 'Sorry');

    getMovies(myRequest)
        .then(result => {
            const moviesData = result;
            hideElement('spinnerPlace');
            if (isDataTrue(moviesData)) {
                showMovieList(moviesData, page);
            } else return;
        });
});


//------ переход на следующую страницу ------
next.addEventListener('click', function() {
    const page = +document.getElementById("pagePrev").textContent + 1;
    if (page > +document.getElementById("pageNext").textContent) return;

    const myRequest = getRequest() + '&page=' + page;
    removeElement('row');
    showElement('spinnerPlace');
    hideElement('page','movieDescription', 'Sorry');
    
    getMovies(myRequest)
        .then(result => {
            const moviesData = result;
            hideElement('spinnerPlace');
            if (isDataTrue(moviesData)) {
                showMovieList(moviesData, page);
            } else return;
        });
});















