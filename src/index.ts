import server from "./server";

let app = new server().app;
let port = 3000;

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
});

