import { ROLE } from "../modules/user/user.interfaces"

declare global{
    namespace Express{
        interface Request{
            user:{
                userId:string,
                email:string,
                role:ROLE
            }
        }
    }
}