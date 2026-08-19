//File module:fs module in node js
//CRUD operations: Create, Read, Update, Delete
//create a file:writefile() and readfile()
// const fs=require('fs');
// fs.writeFile('myfile.tx)t', 'this is create command in fs using writeFile("filename","content",callback fun for error)', (err) => {
//     if (err) throw err;
//     console.log('File created successfully!');
// });
//Read a file:readfile()
// const fs=require('fs');
// let data=fs.readFile('myfile.txt','utf-8',(err) => {
//     if(err) throw err;
//     console.log(data);
// });
//CRUD using async and await

import fs from "fs/promises";

const fileName = "student.txt";

// 1. CREATE
async function createFile() {
    try {
        await fs.writeFile(
            fileName,
            "Name: Satwik\nCourse: B.Tech CSE",
            "utf8"
        );

        console.log("File created successfully");
    } catch (error) {
        console.log("Error:", error.message);
    }
}


// 2. READ
async function readFile() {
    try {
        const data = await fs.readFile(fileName, "utf8");

        console.log("\nFile Content:");
        console.log(data);
    } catch (error) {
        console.log("Error:", error.message);
    }
}


// 3. UPDATE
async function updateFile() {
    try {
        await fs.appendFile(
            fileName,
            "\nCollege: ABES Engineering College............",
            "utf8"
        );

        console.log("\nFile updated successfully");
    } catch (error) {
        console.log("Error:", error.message);
    }
}


// 4. DELETE
// async function deleteFile() {
//     try {
//         await fs.unlink(fileName);

//         console.log("\nFile deleted successfully");
//     } catch (error) {
//         console.log("Error:", error.message);
//     }
// }

// Execute CRUD operations
async function main() {

    await createFile();

    await readFile();

    await updateFile();

    // await deleteFile();
}

main();