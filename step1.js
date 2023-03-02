const fs = require('fs');

function cat(path){
    fs.readFile(path, 'utf8', function(err, data) {
         if (err){
             console.log(err)
             process.exit(1)
         }
         console.log(`Print contents: ${data}`)
    })
}

const path = process.argv[2];
cat(path);