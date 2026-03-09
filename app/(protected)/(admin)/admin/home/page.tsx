import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <section className='p-4 grid grid-cols-2 gap-20'>
      <div>
        <h2>Building Family Tree.</h2>
        <h1>Who are they?</h1>
        <p>Make your family tree live with Rikhye Family Tree and do not leave it just a memory hanging. build it with the participation of everyone and make it stretch to infinity.</p>
      </div>
      <Card className='p-10'>
        <CardHeader>
         <h2>My Family Tree</h2> 
          <p>List Of the trees you manage!</p>
        </CardHeader>
        <CardContent className='border-t p-4'>
          <p> No Result Found!</p>
        </CardContent>
      </Card>
    </section>
  )
}

export default page