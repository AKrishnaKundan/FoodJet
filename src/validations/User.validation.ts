import {body, query} from "express-validator";

import { User } from "../models/User";

export class UserValidators{

    static signup(){
        return[
                body('email', "Provide a valid Email address").isEmail()
                .custom(async value => {
                    const user = await User.findOne({email: value});
                    if (user) {
                      throw new Error('E-mail already in use');
                    }
                }),
                body("phone", "Phone number is required").isString(),
                body('password', "Password is required")
                .isAlphanumeric()
                .withMessage("Password must contain only alphabets and numbers")
                .isLength({ min: 8, max:25 })
                .withMessage("Password must be between 8 and 20 characters"),
                body('name', "Name is required").isString(),
                body('type', 'User role type is required').isString(),
                body('status', 'User status is required').isString()
            ]
        
    }

    static signin = ()=>{
        return [
            body('email', "Provide valid Email address").isEmail(),
            body("email").custom(async (value, {req}) => {
                const user = await User.findOne({email: value});
                if (!user) {
                  throw new Error('No user with this email. Please Signup to continue.');
                }
                req.user = user;
            }),
            body("password", "Password is required").isString()
        ]
    }

    static verifyUserEmail = ()=>{
        return [
            body("verification_token", "Email verification otp is required").isNumeric(),
            body("email", "Email is required").isEmail().custom(async (email, {req})=>{
                const user = await User.findOne({
                    email:email, 
                })
                if (user){
                    req.user = user;
                    return true;
                }
                else{
                    throw new Error("No user with this email. Please signup to continue")
                }
            })
        ]
    }

    static sendVerificationEmail = ()=>{
        return [
            query("email", "Provide a valid email address").isEmail(),
            query("email")
            .custom(async (email, {req})=>{
                const user = await User.findOne({email:email})
                if (user){
                    req.user = user;
                    return true;
                }
                else{
                    throw new Error("No user registered with this email")
                }
            })
        ]  
    }

    static resetPasswordSendOTP = ()=>{
        return [
            query('email', "Provide a valid email").isEmail().custom(async (email, {req})=>{
                const user = await User.findOne({email: email})
                if (user){
                    req.user = user;
                    return true;
                }
                else{
                    throw new Error("No user registered with this email")
                }
            }),
        ] 
    }

    static resetPassword = ()=>{
        
        return [
            body("verification_token", "Reset password OTP is required").isNumeric(),
            body("email", "Email is required").isEmail().custom(async (email, {req})=>{
                const user = await User.findOne({
                    email:email, 
                })
                if (user){
                    req.user = user;
                    return true;
                }
                else{
                    throw new Error("No user with this email. Please signup to continue")
                }
            }),
            body("new_password", "New password is required").isAlphanumeric()
        ]
    
    }

}

