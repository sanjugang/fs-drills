/*
    Problem 2:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Read the given file lipsum.txt
        2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
        3. Read the new file and convert it to lower case. Then split the contents into sentences. Then write it to a new file. Store the name of the new file in filenames.txt
        4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
        5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.
*/

const fs = require('fs');
const path = require('path');

// 1. Read the given file lipsum.txt
function readingFile(callback) {
    fs.readFile('lipsum.txt', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error in reading file", err);
            return callback(err);
        }
        convertToUpperCase(data, callback);
    });
}

// 2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
function convertToUpperCase(data, callback) {
    const upper_case = data.toUpperCase();
    const new_file = 'upper_case.txt';
    
    fs.writeFile(new_file, upper_case, (err) => {
        if (err) {
            console.error("Error in writing file", err);
            return callback(err);
        }
        fs.appendFile('filenames.txt', new_file + '\n', (err) => {
            if (err) {
                console.error("Error in appending file name", err);
                return callback(err);
            }
            convertToLowercase(new_file, callback);
        });
    });
}

// 3. Read the new file and convert it to lowercase, then split the contents into sentences. Write to a new file
function convertToLowercase(new_file, callback) {
    fs.readFile(new_file, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error in reading new file", err);
            return callback(err);
        }
        
        const lower_case = data.toLowerCase();
        const sentences = lower_case.split('.').map(sentence => sentence.trim());
        const new_file2 = 'sentences.txt';
        
        fs.writeFile(new_file2, sentences.join('.\n'), (err) => {
            if (err) {
                console.error("Error in writing new file2", err);
                return callback(err);
            }
            fs.appendFile('filenames.txt', new_file2 + '\n', (err) => {
                if (err) {
                    console.error("Error in appending file2", err);
                    return callback(err);
                }
                sortFile(new_file2, callback);
            });
        });
    });
}

// 4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
function sortFile(new_file2, callback) {
    fs.readFile(new_file2, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading new file2", err);
            return callback(err);
        }
        
        const sorted_text = data.split('\n').sort().join('\n');
        const new_file3 = 'sorted_file.txt';
        
        fs.writeFile(new_file3, sorted_text, (err) => {
            if (err) {
                console.error("Error in writing new file3", err);
                return callback(err);
            }
            fs.appendFile('filenames.txt', new_file3 + '\n', (err) => {
                if (err) {
                    console.error("Error in appending newfile3", err);
                    return callback(err);
                }
                deleteFiles(callback);
            });
        });
    });
}

// 5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously
function deleteFiles(callback) {
    fs.readFile('filenames.txt', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error in reading filenames.txt", err);
            return callback(err);
        }
        
        const delete_files = data.split('\n').filter(file => file.trim() !== '');
        const totalFiles = delete_files.length;
        let filesDeleted = 0;
        delete_files.forEach((file) => {
            fs.unlink(file, (err) => {
                if (err) {
                    console.error("Error in deleting file", err);
                } else {
                    console.log("File deleted:", file);
                    filesDeleted++;
                }
                if (filesDeleted === totalFiles) {
                    callback(); 
                }
            });
        });
        
        callback();
    });
}

module.exports = { readingFile, convertToUpperCase,convertToLowercase, sortFile, deleteFiles };



