import express from "express";
import UserController from "../controllers/UserController";


import validate from "../validations/validate";
import {UserValidators} from "../validations/User.validation";

import { GlobalMiddlewares } from "../middlewares/GlobalMiddlewares";

class UserRouter{
    public router: express.Router;
    
    constructor(){
        this.router = express.Router();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes(){
        this.router.get('/send/verification/email', validate(UserValidators.sendVerificationEmail()), GlobalMiddlewares.auth, UserController.sendVerificationEmail); 
        this.router.get('/resetPassword/sendOTP', validate(UserValidators.resetPasswordSendOTP()), GlobalMiddlewares.auth, UserController.resetPasswordSendOTP); 
    }

    postRoutes(){

        this.router.post('/signup', validate(UserValidators.signup()), UserController.signup);        
        this.router.post('/signin', validate(UserValidators.signin()), UserController.signin);        
    }

    putRoutes(){

    }
    patchRoutes(){
        this.router.patch('/verify/user/email', validate(UserValidators.verifyUserEmail()), GlobalMiddlewares.auth, UserController.verifyUserEmail);        
        this.router.patch('/resetPassword', validate(UserValidators.resetPassword()), GlobalMiddlewares.auth, UserController.resetPassword);        

    }
    deleteRoutes(){

    }

}

export default new UserRouter().router;