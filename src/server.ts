import app from  "./app.js"
import dotenv from "dotenv" 
import dns from "dns"
import connectDB from "./db/db.js"
dotenv.config()
dns.setServers(['8.8.8.8','8.8.4.4'])
const PORT:number = Number(process.env.PORT) || 4000
try{
    await connectDB()
    app.listen(PORT,()=>{
        console.log(`App is working on port:${PORT}`)
    
})
}catch(error) {
    console.error(error)

}


