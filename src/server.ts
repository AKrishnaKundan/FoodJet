import cors from "cors";
import express, {Request, Response, NextFunction} from "express";
import mongoose from "mongoose";

import bodyParser from "body-parser";

import UserRouter from "./routers/UserRouter";
import { getEnvironmentVariables } from "./environments/enviroment";


interface CustomError {
    message: string;
    status_code: number;
}
  
class server {
    public app: express.Application;

    constructor(){
        this.app = express();
        this.setConfigs();
        this.setRoutes();
        this.pathNotFound();
        this.handleErrors();
    }
    setConfigs(){
        this.connectToMongoDB();
        this.app.use(cors());
        this.configureBodyParser();
    }
    setRoutes(){
        this.app.use("/api/user", UserRouter)
    }

    pathNotFound(){
        this.app.use((req: Request, res: Response)=>{
            res.status(404).json({
                message: "Not Found",
                status_code : 404
            })
        })
    }

    connectToMongoDB(){
        mongoose.connect(`${getEnvironmentVariables().db_uri}`)
        .then(()=>{
            console.log("connected to database");
        })
        .catch(()=>{
            console.log("error connecting to database");
        })
    }

    configureBodyParser(){
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    handleErrors(){
        this.app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
            const errorStatus = error.status_code || 500;
            res.status(errorStatus).json({
                message: error.message || "Something went wrong, Please try again",
                status_code : errorStatus
            })
        })    
    }
}

export default server;