// function in javascript
// Synchronous

// console.log("basic  java script function known as synchronous function");

// function hello(){
//     console.log("this js function");
// }
// hello();
// console.log("synchronous javascript");


// Asynchronous Java script
// arrow function
// Variable : var , let and const
// Syntax : ()=>{}

    // const hello= ()=>{
    //     console.log("asynch function");
    //     setTimeout(()=>{
    //         console.log("A");

    //     },2000);

    // }
    // hello();
    // console.log("B");

    // *********** function as parameter argument***************//
    function hello(n1,n2){
        console.log(n1+n2);
        console.log(argument);
    }
    let a=10;
    let b=20;
    hello(a,b);
    const app=()=>{
        console.log(arguments);
        console.log(window);
    }
    app();
