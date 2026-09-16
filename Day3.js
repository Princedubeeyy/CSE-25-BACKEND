//Asynchronous js using async/await
// async function test(){
//     await console.log("2:message");
//     await console.log("3:message");
//     console.log("4:message");
// }
// console.log("1:message");

// test()
// console.log("5:message");
//create promises that resolve with Assisgnment submitted
//and print using then() ,reject with submission failed
//class practice question:async function that display user data
//Async function for data json data fetch
async function data(){
    await console.log("2:message");
    const response= await fetch("./studentdata.json");
    console.log(response.status);
    const std=await response.json()
    return std;
    await console.log("3:message");
    console.log("4:message");
}
console.log("1:message");
data()
   .then((res)=>{
   console.log(res);
   
}).catch((err)=>{
    console.log(err);
    
})