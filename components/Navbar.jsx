"use client"
import React from 'react';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import {House} from 'lucide-react'
import {Button} from './ui/button'

const Navbar = () =>{
    return(
        <div className='flex items-center justify-between'>
            <Link href={'/'} className='ml-10 flex gap-2'>
                <p><House /></p>
                <p className='font-bold'>Home</p>
            </Link>
            <div className='flex items-center py-7 px-5 justify-end gap-5'>
                <SignedOut>
                    <Link href={'/sign-up'}>
                        <Button>
                            Get Started
                        </Button>
                    </Link>
                    </SignedOut>
                    <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )
}

export default Navbar