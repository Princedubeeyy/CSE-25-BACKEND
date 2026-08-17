// File module:fs module iin node js
// CRUD operations: Create, Read, Update, Delete
// create a file, writefile() and readFile() and appendFile() and unlink() and rename() are methods of fs module
// const fs=require("fs");
// fs.writeFile("myfile.txt","this is my first file",(err)=>{
//     if(err) throw err;
//     console.log("file created successfully");
// });
// Read file
const fs=require("fs");
fs.readFile("myfile.txt","utf-8",(err,data)=>{
    if(err) throw err;
    console.log(data);
});