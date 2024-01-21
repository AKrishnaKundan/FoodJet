
import {User} from "../models/User";

import { Utils } from "../utils/Utils";
import {sendMail} from "../utils/NodeMailer"

class UserController{   

    static signup = async (req, res, next) =>{

        const { email, name, phone, type, status } = req.body;

        try{
            const hash = await Utils.encryptPassword(req.body.password);

            const userData = {
                email,
                verification_token: Utils.generateVerificationToken(5), 
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                password:hash, 
                phone, 
                name,
                type, 
                status
            }
            const user = await new User(userData).save()

            const payload = {
                //user._id = user._id
                aud: user._id,
                email: user.email
            }
            const token = Utils.generateJwtToken(payload);

            sendMail({
                email : userData.email,
                name: userData.name,
                verification_token: userData.verification_token
            });

            res.send({
                user,
                token
            });
        }
        catch(e){
            next(e);
        }
    }

    static signin = async (req, res, next) =>{
        try{
            const user = req.user;
            const passwordMatch = await Utils.comparePassword(req.body.password, user.password);
            
            const payload = {   
                //user._id : user._id
                aud: user._id,
                email: user.email
            }
            const token = Utils.generateJwtToken(payload);
            res.send({user, token});
        }
        catch(e){
            next(e);
        }
    }

    static verifyUserEmail = async(req, res, next)=>{
        try{
            const verification_token = req.body.verification_token.toString();
            const user = req.user;
            
            const otpVerified = await Utils.verifyOTP(verification_token, user.verification_token_time);


            await User.findOneAndUpdate(
                {_id: user._id},
                {
                    email_verified: true,
                    updatedAt: new Date()
                },
            )
            
            res.send({message: "Email verified successfully"});
            
        }
        catch(e){
            next(e);
        }
    }

    static sendVerificationEmail = async(req, res, next) =>{
        try{
            let user = req.user;
            const verification_token = Utils.generateVerificationToken(5);
            
            user = await User.findOneAndUpdate({
                _id: user._id
            },
            {
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                updatedAt: new Date()
            },
            {
                new: true
            });

            const main_content =  "Use the following otp to verify your email address";

            sendMail(
            {
                email : user.email, 
                name: user.name,
                main_content: main_content,
                verification_token: user.verification_token
            })
            res.send({
                "message": "Verification Email sent",
            })
            
        }
        catch(e){
            next(e);
        }
    }

    static resetPasswordSendOTP = async(req, res, next)=>{
        try{
            console.log("controller");
            let user = req.user;
            if (!user.email_verified){
                let error:any = new Error("You cannot reset the password without verifying your email address")
                error.status_code = 422;
                throw error;
            }   

            const verification_token = Utils.generateVerificationToken(5);
            
            user = await User.findOneAndUpdate({
                _id: user._id
            },
            {
                verification_token: verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                updatedAt: new Date()
            },
            {
                new: true
            });

            const main_content = "Use the following otp to reset your password";

            sendMail(
            {
                email : user.email, 
                name: user.name,
                main_content: main_content,
                verification_token: user.verification_token
            })
            res.send({
                "message": "Verification Email sent",
            })   
        }   
        catch(e){
            next(e);
        }  
    }

    static resetPassword = async(req, res, next)=>{
        try{
            const verification_token = req.body.verification_token.toString();
            const user = req.user;
            
            const otpVerified = await Utils.verifyOTP(verification_token, user.verification_token_time);

            const hash = await Utils.encryptPassword(req.body.new_password);

            await User.findOneAndUpdate(
                {_id: user._id},
                {
                    password: hash,
                    updatedAt: new Date()
                },
            )
            
            res.send({message: "Password reset successful"});
            
        }
        catch(e){
            next(e);
        }
    }
}

export default UserController;