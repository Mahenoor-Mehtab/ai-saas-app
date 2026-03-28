import { auth } from "@clerk/nextjs/server"
import prismadb from "./prismadb"

export const increaseApiLimit = async () =>{
  const session = await auth() 
  const userId = session.userId  
    if(!userId) return 

    // Implementation for increasing API limit
    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: {
        userId: userId
      }
    })

    if(userApiLimit){
        await prismadb.userApiLimit.update({
            where:{  userId: userId  },
            data:{   count: userApiLimit.count + 1 }
    })

} else {
    await prismadb.userApiLimit.create({
        data:{ userId: userId , count: 1}
    })
}

}

export const checkApiLimit = async () =>{
    const session = await auth() 
  const userId = session.userId  
    if(!userId) return false

    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userId: userId
        }
    })
     
    if(!userApiLimit || userApiLimit.count < 5){
        return true
    }   
    else {
        return false
    }


}