const { createRandomJsonFiles, deleteFiles } = require('../problem1.js');

const directory_path="./using_callbacks/random_json_files";

const files_count = 10;

createRandomJsonFiles(directory_path, files_count, (err) => {
    if (err) {
        console.log("Error creating files:", err);
        return;
    }
deleteFiles(directory_path, (err) => {
        if (err) {
            console.log("Error deleting files:", err);
            return;
        }
    });
});