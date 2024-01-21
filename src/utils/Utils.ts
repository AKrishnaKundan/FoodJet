import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { getEnvironmentVariables } from "../environments/enviroment";

export class Utils{

    MAX_TOKEN_TIME = 5*60*1000;

    static generateVerificationToken = (digit: number)=>{
        let otp = '';
        for (let i=0; i<digit; i++){
            otp = otp + Math.floor(Math.random() * 10);
        }
        return otp;
    }

    static encryptPassword = (password)=>{
        const saltRounds = 10;
        return new Promise((resolve, reject)=>{
            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) reject(err);
                else{
                    resolve(hash);
                }
            })
        })
    }
    
    static comparePassword = (textPassword, hashedPassword)=>{

        return new Promise((resolve, reject)=>{
            bcrypt.compare(textPassword, hashedPassword, function(err, result) {
                let passwordError:any = new Error("Incorrect Password");
                passwordError.status_code = 400;
                if (!result) reject(passwordError);
                if (err) reject(err);
                resolve("Correct Password");
            });
        })
    }

    static verifyOTP = (verification_token, verification_token_time)=>{
        return new Promise((resolve, reject)=>{

            if (verification_token_time.getTime()  <= Date.now()){
                let error:any = new Error("OTP expired. Please try again.")
                error.status_code = 400;
                reject(error);  
            }
            if (verification_token !== verification_token){
                let error:any = new Error("Wrong OTP. Please try again.")
                error.status_code = 400;
                reject(error);
            }

            resolve("OTP verified");
        })
    }

    static generateJwtToken = (payload)=>{
        const token = jwt.sign(payload, 
            getEnvironmentVariables().jwt_secret_key, 
            {expiresIn: "30d", issuer: "A Krishna Kundan"});
        return token;
    }

    static verifyJwtToken = (token:string):Promise <any>=>{
        
        return new Promise((resolve, reject)=>{
            jwt.verify(token, getEnvironmentVariables().jwt_secret_key, function(err, decoded) {
                if (!decoded) reject(new Error("User is not authorized"));
                if (err) reject(err);
                resolve(decoded);  
            });
        })
    }

}