import React from 'react'
import AdminDashboard from './dashboard/AdminDashboard'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const Admin = async () => {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return (
        <div>
            <AdminDashboard />
        </div>
    )
}
export default Admin
