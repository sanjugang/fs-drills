const { readingFile } = require('../problem2.js');

readingFile((err) => {
    if (err) {
        console.log("Error occured");
    } else {
        console.log("Executed successfully");
    }
});
