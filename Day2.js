//callback function
// function hello(n1,n2,cb){
// console.log(n1+n2);
// //callback();
// cb()
// }

// let a=10;
// let b=20;
// hello(a,b,sayHi);
// console.log(hello(a,b,sayHello()));
// console.log(hello(a,b,function demo(){
//     console.log("callback is calling")
// }));
// function sayHi(){
//     console.log("callback function");

// }
// sayHi();
// function sayHello(){
//  console.log("this is 2nd callback fun")
// }
// sayHello();
//Promises
// const promiseOne=new Promise((resolve,reject)=>{
//  console.log("successfull data passed.....");
//  resolve("resolve promises");
// });
// promiseOne.then((result)=>{
//     console.log(result);

// }).catch((error)=>{
//  console.log(error);
 
// })
new Promise(function(resolve,reject){
setTimeout(function(){
    let msg=true;
    if(!msg){
        resolve("user :ASynch task")
    }else{
        reject("ERROR :undefined data...")
    }
    console.log("asynchronous task...");
    
},1000)
}).then(function(result){
 console.log("asynch task 2");
 
}).catch(function(error){
    console.log(error);
    
})