
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { Loader } from '../Loader/Loader'

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status])

    if (status === 'loading') return <Loader />
    if (!session) return null

    return <>
        {children}
    </>
}
