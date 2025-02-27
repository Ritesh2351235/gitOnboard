import { db } from '@/server/db'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

const SyncUser = async() => {
 const {userId} = await auth()
 if(!userId){
  throw new Error('User not found')
 }

 const client = await clerkClient()
 const user = await client.users.getUser(userId)
 if(!user.emailAddresses[0]?.emailAddress){
  throw notFound()
 }

 await db.user.upsert({
  where: {
    email : user.emailAddresses[0]?.emailAddress?? " "
    },
    update: {
      FirstName: user.firstName,
      LastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    create: {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress?? " ",
      FirstName: user.firstName,
      LastName: user.lastName,
      imageUrl: user.imageUrl,
    },
 })

 return redirect('/dashboard')
}
export default SyncUser
