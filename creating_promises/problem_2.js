/*
    Problem 2:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Read the given file lipsum.txt
        2. Convert the content to uppercase & write to a new file. Store the name of the new file in filenames.txt
        3. Read the new file and convert it to lower case. Then split the contents into sentences. Then write it to a new file. Store the name of the new file in filenames.txt
        4. Read the new files, sort the content, write it out to a new file. Store the name of the new file in filenames.txt
        5. Read the contents of filenames.txt and delete all the new files that are mentioned in that list simultaneously.
*/

const fs=require('fs');
const path=require('path');

function read_file(){
    return new Promise((resolve,reject)=>{
        fs.readFile('lipsum.txt','utf-8',(err,data)=>{
            if(err){
                reject("Error occured in reading file");
            }
            else{
                resolve(data);
            }
        })
    })
} 
function convert_to_uppercase(data){
    return new Promise((resolve,reject)=>{
        const Upper_case=data.toUpperCase();
        const new_file='upper_case.txt';
        fs.writeFile(new_file,Upper_case,(err)=>{
            if(err){
                reject(err)
            }
            else resolve(Upper_case);
        })
    })
}
function append_file(new_file){
    return new Promise((resolve,reject)=>{
        fs.appendFile('file_names.txt',new_file+"\n",(err)=>{
            if(err){
                reject(err)
            }
            else{
                resolve();
            }
        })
    })
        
}


function convert_to_lowercase(newFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(newFile, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const lowerCase = data.toLowerCase();
                const sentences = lowerCase.split('\n').map(sentence => sentence.trim());
                const sentencesFile = 'sentences.txt';
                fs.writeFile(sentencesFile, sentences.join('\n'), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        append_file(sentencesFile).then(() => resolve(sentencesFile));  // append filename and resolve
                    }
                });
            }
        });
    });
}

function sorted_text(sentencesFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(sentencesFile, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const sortedContent = data.split('\n').sort().join('\n');
                const sortedFile = 'sorted.txt';
                fs.writeFile(sortedFile, sortedContent, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        append_file(sortedFile).then(() => resolve(sortedFile));  
                    }
                });
            }
        });
    });
}

function delete_files() {
    return new Promise((resolve, reject) => {
        fs.readFile('file_names.txt', 'utf-8', (err, data) => {
            if (err) {
                reject("Error reading file_names.txt");
            } else {
                const delete_files = data.split('\n').filter(file => file.trim() !== '');
                const deletePromises = delete_files.map((file) => {
                    return new Promise((resolve, reject) => {
                        fs.unlink(file, (err) => {
                            if (err) {
                                console.log(`Error in deleting file: ${file}`, err);
                                reject(`Error in deleting file: ${file}`);
                            } else {
                                console.log(`File ${file} deleted`);
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(deletePromises)
                    .then(() => {
                        resolve("All files deleted successfully");
                    })
                    .catch(reject);
            }
        });
    });
}

read_file()
.then((data)=>{
    return convert_to_uppercase(data);
})
.then((Upper_case)=>{
    return append_file('upper_case.txt').then(()=>'upper_case.txt')
})
.then((Upper_case)=>{
    return convert_to_lowercase(Upper_case);
})
.then((sentences)=>{
    return sorted_text(sentences);
})
.then(()=>{
    return delete_files()
})
.then((result)=>{
    console.log(result);
})
.catch((err)=>{
    console.log(err);
})