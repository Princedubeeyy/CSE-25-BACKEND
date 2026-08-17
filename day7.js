import fs from "fs/promises"
const filename="student.txt";
async function createFile(){
try{
    await fs.writeFile(
        fileName,
        "Name:Prince Dubey\nEmail:princedubey907@gmail.com,Btech,CSE"
    );
    console.log("file created..");
}
catch(error){
    console.log(error)

}
}