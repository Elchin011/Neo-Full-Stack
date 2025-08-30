import { Cog, Settings } from 'lucide-react'
import React from 'react'

const AdminPage = () => {
    return (
        <div className='container mx-auto p-4'>
            <div className='flex items-center justify-center gap-2 mt-10'>
                <Cog size={30} strokeWidth={3.5} />
                <h1 className='text-4xl font-bold text-center uppercase'>Admin Page</h1>
            </div>
            <p className='text-center text-gray-500'>This is the admin page where you can manage users and settings.</p>

        </div>
    )
}

export default AdminPage
