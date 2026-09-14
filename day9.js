// create your own server using http module
import http from "http";
const server=http.createServer((req,res)=>{
    res.writeHead(200,{"content-type":"text/html"});
    res.write("<h1>this is my own server</h1>");
    
})
server.listen(3000,()=>{
    console.log("server is running on port 3000")
})
