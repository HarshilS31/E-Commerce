import { userPayload } from "./auth.types.ts"
declare global {
    namespace Express {
        interface Request {
            user:userPayload
        }
    }
}