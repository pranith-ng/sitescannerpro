'use client'

import React, { useContext, useState, useEffect } from 'react'
import AuthHandler from '../components/AuthHandler'
import { motion } from 'framer-motion'
import { AppContext } from '../Context/AppContext'
import { useRouter } from 'next/navigation'

const page = () => {

    const router = useRouter()

    const { user } = useContext(AppContext)
    const [loading, setloading] = useState(false)


    const handleSignOut = async () => {
        console.log('clicked')
        setloading(true)
        const result = await AuthHandler({ action: "signout" })
        if (result.error) {
            // setMessage(result.error)
            console.log(result.error)
            setloading(false)
        }
        if (result) {
            console.log(result)
            setloading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            router.push("/")
        }
    }, [user])

    if (!user) {
        return null
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#E0DAD0] px-4 ">
            <div className="w-full max-w-md p-8 rounded-2xl neumorphic flex flex-col gap-8 items-center">
                <h2 className='text-3xl font-bold text-center '>Account</h2>

                <div className='flex flex-col items-center gap-5'>
                    <div className='neumorphic rounded-full w-24 h-24 flex items-center justify-center'>
                        <p className='text-5xl font-extrabold '>{user?.email[0].toUpperCase()}</p>
                    </div>
                    <div className='flex flex-col justify-center items-center md:flex-row gap-1 pt-3'>
                        <h5 className='text-lg'>Email : </h5>
                        <span className='text-lg'>{user?.email}</span>
                    </div>
                </div>

                <div>
                    <button
                        disabled={loading}
                        className=" p-2 rounded-md font-semibold text-red-600"
                        onClick={handleSignOut}
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-7 h-7 border-red-600 border-4 border-t-transparent rounded-full"
                            />
                        ) : (
                            "Sign out"
                        )}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default page
