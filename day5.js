// Event
// EventEmitter is class in which we have to use emit("event emit param") for trigger event./create/fire event and 0n("emit para", callback) is a listener that will for register event
// Program 1 and 2
// const EventEmitter=require("events");
// const event=new EventEmitter();
// event.on("greet",()=>{
//     console.log("this is event emmiter");
// })
// event.once("greet",()=>{
//     console.log("event trigger only one time");
// })
// event.emit("greet");
// event.emit("greet");
// event.emit("greet");
// event.emit("greet");
// Program 1: create custom EventEmitter that  trigger "greet" or "exit"
class MyEmitter extends EventEmitter{}
const event=new MyEmitter()
event.on("greet",(name)=>{
    console.log('hello ${name}');//template literals'${'
})
event.on("exit",()=>{
    console.log("exits mycustom event emmiter...")
})
event.emit("greet","cse25");
event.emit("exit");