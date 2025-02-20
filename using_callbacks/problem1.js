/*
    Problem 1:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Create a directory of random JSON files
        2. Delete those files simultaneously 
*/
const fs = require('fs');
const path = require('path');

function createRandomJsonFiles(directory_path, files_count, callback) {
    fs.mkdir(directory_path, (err) => {
        if (err) {
            console.log("Error creating directory:", err);
            callback(err);
            return;
        } else {
            console.log("random_json_files created");
        }

        let files_created = 0;

        // Create the random JSON files
        for (let i = 0; i < files_count; i++) {
            const file_name = `file${i + 1}.json`;  
            const file_path = path.join(directory_path, file_name);
            const fileContent = JSON.stringify({
                name: `File ${i + 1}`,
            }, null, 2);

            fs.writeFile(file_path, fileContent, (err) => {
                if (err) {
                    console.log("Error writing file:", err);
                    callback(err); 
                    return;
                } else {
                    console.log("File created");
                }

                files_created++;
                if (files_created === files_count) {
                    callback(null); 
                }
            });
        }
    });
}

 // Delete files in the directory
function deleteFiles(directory_path, callback) {
    fs.readdir(directory_path, (err, files) => {
        if (err) {
            console.log("Error reading directory:", err);
            callback(err);
            return;
        }

        let files_deleted = 0; 

        files.forEach((file) => {
            const file_path = path.join(directory_path, file);
            
            fs.unlink(file_path, (err) => {
                if (err) {
                    console.log("Error deleting file:", err);
                    callback(err);
                    return;
                } else {
                    console.log("File deleted");
                }

                files_deleted++;

                if (files_deleted === files.length) {
                    callback(null); 
                }
            });
        });
    });
}


module.exports = { createRandomJsonFiles, deleteFiles };
