// Callback:
// function hello(n1,n2,callback){
//     console.log(n1+n2);
//     callback();

// }

// let a=10;
// let b=20;
// hello(a,b,sayHi);
// console.log(hello(a,b,sayHi));
// console.log(hello(a,b,sayHello()));
// console.log(hello(a,b, function demo(){
//     console.log("callback is calling")
// }))
//  function sayHi(){
//     console.log("callback function");
//  }
// sayHi();
// function sayHello(){
//     console.log("this is 2nd callback fun")

// }
// sayHello();

// ********* Promises **********//

// const promiseOne=new Promise((resolve,reject)=>{
//     console.log("successfull data passed...")
//     resolve("resolve promise");
// });
// promiseOne.then((result)=>{
//     console.log(result);

// }).catch((error)=>{
//     console.log(error);


// }

new Promise(function(resolve,reject){
setTimeout(function(){
    let msg=true;
    if(!msg){
        resolve("user :Asynch task")
    }else{
        reject("ERROR : undefineed data...")
    }

    console.log("asynchrounous task...");
    resolve();

},1000)
}).then().catch(function(result){
    console.log("asyun task 2");

}).catch(function(error){
    console.log(error);
})