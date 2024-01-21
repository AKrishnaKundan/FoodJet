import { Utils } from "../utils/Utils";

export class GlobalMiddlewares {

    static auth = async (req, res, next) => {
        try {
            let authHeader = req.headers.authorization ? 
                             req.headers.authorization.split(" ") : 
                             null;
            let token = authHeader && authHeader[1] ? authHeader[1] : null;
            if (!token) {
                //"Authorization header is missing"
                let error: any = new Error("Authentication failed. Please login to continue");
                error.status_code = 401;
                throw error;
            }

            const decoded = await Utils.verifyJwtToken(token);
            if (decoded.email !== req.user.email) {
                //Invalid JWT Token
                let error: any = new Error("Please provide email through which you have loggged in");
                error.status_code = 400;
                throw error;
            }
            next();
        }
        catch (err) {
            next(err);
        }
    }
}