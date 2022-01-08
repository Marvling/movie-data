import csvPath from '../parser/watched.csv'
import jsonPath from '../parser/movieData.json'
// import fs from 'fs'


const localParser = async (url = csvPath) => {

  const watchedData = []

  try {

    const response = await fetch(url);
    const data = await response.text();

    // Putting each line in an array
    const table = data.split('\n');

    // Remmoving a special character after each line (Cleaning)
    const rows = [];

    for (let i = 0; i < table.length; i++) {
      const row = table[i].split('\r').join('');
      rows.push(row.split(','));
    };


    // Making each row an object

    // TODO: Convert this to for loop which supports async or map


    rows.forEach(async entry => {

      const dateWatched = entry[0];
      const title = entry[1];
      const isWatchedInTheater = entry[2];
      const isWatchedAlone = entry[3];

      // filling the dataObject
      const dataObject = {};
      dataObject.dateWatched = dateWatched;
      dataObject.title = title;
      dataObject.isWatchedInTheater = isWatchedInTheater;
      dataObject.isWatchedAlone = isWatchedAlone;

      watchedData.push(dataObject);
    });


  } catch (err) {
    console.error(`this is my error!: ${err}`);
  }

  return watchedData
}

async function tmdbSearch(e) {

  let url = `https://api.themoviedb.org/3/search/movie?api_key=00decbdccac0d50538a8bdbf8085ce4a&language=en-US&query=${e}&page=1&include_adult=false`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    return data.results[0]

  } catch (err) {
    console.error(`this is my error!: ${err}`);
  }

}

async function getAllData() {

  const tmdbArray = [];

  try {

    const localData = await localParser();

    for (let index = 0; index < localData.length; index++) {
      const element = localData[index];
      if (element.title == '') {
        tmdbArray.push(element);
        continue
      }

      const newData = await tmdbSearch(element.title);
      const allData = Object.assign({}, element, newData)
      // console.log(allData);
      tmdbArray.push(allData);
    }

    // localData.forEach(element => {
    //   console.log(await tmdbSearch(element.title));
    // });

  } catch (err) {
    console.error(`this is my error!: ${err}`);
  }

  return tmdbArray;
}

async function jsonWriter(url = jsonPath) {

  const response = await fetch(url);
  const data = await response.json();


}

let bokum = require('../parser/movieData.json')

function modify(buffer) {
   // copy-webpack-plugin passes a buffer
   var manifest = JSON.parse(buffer.toString());

   // make any modifications you like, such as
   manifest.version = bokum.version;

   // pretty print to JSON with two spaces
   manifest_JSON = JSON.stringify(manifest, null, 2);
   return manifest_JSON;
}

console.log(modify(await getAllData()));