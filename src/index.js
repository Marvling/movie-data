/* this file is the same as data-parser.js in the main branch,
it is mounted as index so it can be run from the browser*/

//TODO: Use this file to setup a db so .csv and .json files can be upladed/downloaded

/* Paths need to be imported using module for exposing local files in the node server
the npm package is called file-loader and is loaded in webpack config*/
import csvPath from '../data/watched.csv'
import jsonPath from '../data/movie-data.json'

// Parsing the local csv data
async function localParser(url = csvPath) {

  // Defining a variabe to return from the function
  const watchedData = [];

  try {

    const response = await fetch(url);
    const data = await response.text();

    // Putting each line in an array
    const table = data.split('\n');

    // Defining rows variable to put each row in an array
    const rows = [];
    // Remmoving a special character after each line (Cleaning)
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      rows.push(row.split(','));
    };

    // Converting each row into an object
    rows.forEach(async (entry) => {

      const dateWatched = entry[0];
      const title = entry[1].trimEnd(); /*  */
      const isWatchedInTheater = entry[2];
      const isWatchedAlone = entry[3];

      // defining the object variable to be created on each loop
      const dataObject = {};

      // filling the dataObject
      dataObject.dateWatched = dateWatched;
      dataObject.title = title;
      dataObject.isWatchedInTheater = isWatchedInTheater;
      dataObject.isWatchedAlone = isWatchedAlone;

      //pushing the objects in arry that will be returned
      watchedData.push(dataObject);
    });


  } catch (err) {
    console.error(`this is my error!: ${err}`);
  }

  // returning the array
  return watchedData;
}

/* This functions takes a movie name and
returns the first search result from the tmdb api */
async function tmdbSearch(e) {

  let url = `https://api.themoviedb.org/3/search/movie?api_key=00decbdccac0d50538a8bdbf8085ce4a&language=en-US&query=${e}&page=1&include_adult=false`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    // the api returns an array of results, this function returns the first element in that array
    return data.results[0]

  } catch (err) {
    console.error(`this is my error!: ${err}`);
  }

}

// Unused function, returns more data then search by string
// TODO: Get more by searching by ID
async function tmdbSearchId (id){
  let url = `https://api.themoviedb.org/3/movie/${id}?api_key=00decbdccac0d50538a8bdbf8085ce4a`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    // the api returns an array of results, this function returns the first element in that array
    return data

  } catch (err) {
    console.error(`this is my error!: ${err}`);
  }
 }

// Returns an array that has objects containing both local data, and tmdb data
async function getCombinedData() {

  // Declaring the array to be returned
  const combinedArray = [];

  try {

    const localData = await localParser();
    
    // Iterating through local data
    for (let index = 0; index < localData.length; index++) {
      const element = localData[index];

      /* If the local data name is empty (no movies wathed that day)
      no requests will be made and the local data will be pused*/
      if (element.title == '') {
        combinedArray.push(element);
        continue
      }

      // if the name string isn't empty request data from tmdbApi 
      const tmdbData = await tmdbSearch(element.title);
      // combine the data from local csv (returned from the local parser) with the tmdbApi data
      const combinedData = Object.assign({}, element, tmdbData);
      // push the combined data to the array that will be returned
      combinedArray.push(combinedData);
    }

  } catch (err) {
    console.error(`this is my error!: ${err}`);
  }

  return combinedArray;
}

/* the data can be copied as an object and pasted into a static file
writing the data to a static file requires a db implementation */

// log all the data to the console
// console.log(await getCombinedData())

// Finding search errors on the movie-data.json
const searchErrors = (jsonPath.filter(obj => obj.release_date == null && obj.title != ''));
console.log(searchErrors);