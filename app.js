//function in javascript
//Synchronous javascript
// console.log("basic java script function known as synchronous function");

// function hello(){
//     console.log("this js function");
// }
// hello();
// console.log("synchronous javascript");
//Asynchronous Java script
//arrow function
//variable:var,let and const
//Syntax : ()=>{}
    // const hello= ()=>{
    //  console.log("asynch function");
    //  setTimeout(()=>{
    //   console.log("A");
      
    //  },2000);
     
    // }
    // hello();
    // console.log("B");
    //function as paramenter argument
    // function hello(n1,n2){
    // console.log(n1+n2);
    // console.log(arguments);
    // }
    // let a=10;
    // let b=20;
    // hello(a,b);
    const app=()=>{
        console.log(arguments);
        console.log(window);
        
        
    }
    app();