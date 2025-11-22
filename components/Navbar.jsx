"use client"
import React from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import {House} from 'lucide-react'
import {Button} from './ui/button'
import {ModeToggle} from './ui/ModeToggle'

const Navbar = () =>{
    return(
        <div className='flex items-center justify-between'>
            <Link href={'/'} className='ml-10 flex gap-2'>
                <p><House /></p>
                <p className='font-bold'>Home</p>
            </Link>
            <div className='flex items-center py-7 px-5 justify-end gap-5'>
                <ModeToggle />
                <SignedOut>
                    <Link href={'/sign-up'}>
                        <Button>
                            Get Started
                        </Button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <div className="flex items-center gap-3">
                        <Link href="/profile">
                        <Button variant="outline" size="sm">
                            Profile
                        </Button>
                        </Link>
                        <UserButton showName={false} />
                    </div>
                </SignedIn>
            </div>
        </div>
    )
}

export default Navbar