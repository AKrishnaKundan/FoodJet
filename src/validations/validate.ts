import express from 'express';
import { validationResult, ContextRunner } from 'express-validator';
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validations: ContextRunner[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (let validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
            break;
        }
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    res.status(400).json({ errors: errors.array().map(x=>x.msg) });
    };
};

export default validate;