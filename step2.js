const { default: axios } = require('axios');
const fs = require('fs');

function cat(path){
    fs.readFile(path, 'utf8', function(err, data) {
         if (err){
             console.log(err)
             process.exit(1)
         }
         console.log(`Printed contents: ${data}`)
    })
}

async function webCat(url){
    axios.get(url)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(`Error fetching ${url}:\n ${error}`);
            process.exit(1);
        });
}

const arg = process.argv[2];
if (arg.startsWith('http')) {
    webCat(arg);
} else {
    cat(arg);
}