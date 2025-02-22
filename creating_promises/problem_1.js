/*
    Problem 1:
    
    Using callbacks and the fs module's asynchronous functions, do the following:
        1. Create a directory of random JSON files
        2. Delete those files simultaneously 
*/

const fs = require("fs");
const path = require("path");

const dir_path = path.join(__dirname, "random_json_files");
const files_count = 10;

function create_directory(dir_path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir_path, (err) => {
      if (err) {
        reject("Error in creating Directory", err);
      } else {
        resolve("Directory created");
      }
    });
  });
}

function create_files() {
  return new Promise((resolve, reject) => {
    let filePromises = [];

    for (let i = 0; i < files_count; i++) {
      const file_name = `file${i + 1}.json`;
      const file_path = path.join(dir_path, file_name);
      const file_data = {
        name: `file_${i + 1}`,
      };
      const file_content = JSON.stringify(file_data, null, 2);

      const filePromise = new Promise((fileResolve, fileReject) => {
        fs.writeFile(file_path, file_content, (err) => {
          if (err) {
            fileReject(`Error creating file ${file_name}: ${err}`);
          } else {
            console.log(`File ${file_name} created`);
            fileResolve();
          }
        });
      });

      filePromises.push(filePromise);
    }

    Promise.all(filePromises)
      .then(() => resolve("All files created successfully"))
      .catch((err) => reject(`Error creating files:`, err));
  });
}
function readdir() {
  return new Promise((resolve, reject) => {
    fs.readdir(dir_path, "utf-8", (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}
function delete_files(dir_path) {
  return readdir().then((files) => {
    return Promise.all(
        
      files.map((file) => {
        const file_path = path.join(dir_path, file);
        return new Promise((resolve, reject) => {
          fs.unlink(file_path, (err) => {
            if (err) {
              reject(`error in deleting file ${file}`, err);
            } else {
              resolve()
              console.log(`File ${file} deleted`);
            }
          });
        });
      })
    );
  });
}

create_directory(dir_path)
  .then((result) => {
    console.log(result);
    return create_files();
  })
  .then((data) => {
    console.log(data);
    return delete_files(dir_path);
  })
  .then(() => {
    console.log("All files deleted");
  })
  .catch((err) => {
    console.log(err);
  });
