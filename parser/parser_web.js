
const searchResult = []

async function dataParser() {

    const watchedData = []

    let url = './watched.csv';

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
        rows.forEach(e => {

            const dateWatched = e[0];
            const title = e[1];
            const isWatchedInTheater = e[2];
            const isWatchedAlone = e[3];

            dataObject = { dateWatched: '', title: '', isWatchedInTheater: '', isWatchedAlone: '' };

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

        searchResult.push = data.results[0];
    

    } catch (err) {
        console.error(`this is my error!: ${err}`);
    }
    
}



// const bok = watchedData[0]

console.log(dataParser());

// watchedData.forEach(e => {
//     tmdbSearch('Die Hard');

// });




