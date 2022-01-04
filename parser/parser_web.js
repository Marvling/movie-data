
let listNames = ['Fight Club', 'The Fog', 'Harry Potter'];
let listData = [];
   
const getMovies = async (e) => {

    let url = `https://api.themoviedb.org/3/search/movie?api_key=00decbdccac0d50538a8bdbf8085ce4a&language=en-US&query=${e}&page=1&include_adult=false`;

    try{
        const response = await fetch(url)
        const data = await response.json()

        const firstlResult = data.results[0]

        listData.push(firstlResult)
        
    }catch(err){
        console.error(`this is my error!: ${err}`)
    }

    console.log(listData)
}

for (let i = 0; i < listNames.length; i++) {
    const e = listNames[i];

    getMovies(e)
    
}
