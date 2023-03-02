const { default: axios } = require('axios');
const fs = require('fs');

function cat(path){
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            cb(`Error reading ${path}: ${err}`);
        } else {
            cb(data);
        }
    })
}

function webCat(url, cb){
    axios.get(url)
        .then((response) => {
            cb(response.data);
        })
        .catch((error) => {
            cb(`Error fetching ${url}:\n ${error}`);
        });
}

function output(data, outFile, cb) {
    fs.writeFile(outFile, data, (err) => {
        if(err) {
            console.error(`Couldn't write ${outFile}: ${err}`);
            process.exit(1);
        } else {
            cb();
        }
    });
}

function processArgs(args, cb) {
    if (args.length === 0) {
        cb();
    } else {
        const arg = args.shift();
        if (arg === '--out') {
            const outFile = args.shift();
            const path = args.shift();
            if (path.startsWith('http')){
                webCat(path, (data) => {
                    output(data, outFile, () => {
                        processArgs(args, cb);
                    });
                });
            } else {
                cat(path, (data) => {
                    output(data, outFile, () => {
                        processArgs(args, cb);
                    });
                });
            }
        } else {
            if (arg.startsWith('http')) {
                webCat(arg, console.log);
            } else {
                cat(arg, console.log);
            }
            processArgs(args, cb);
        }
    }
}
const args = process.argv.slice(2);
const outIdx = args.findIndex(arg => arg === '--out');
const outFile = args[outIdx + 1];
const cb = (data) => {
    fs.writeFile(outFile, data, (err) => {
        if (err) {
            console.error(`Couldn't write ${outFile}: ${err}`);
            process.exit(1);
        }
    });
};
processArgs(args, () => {});