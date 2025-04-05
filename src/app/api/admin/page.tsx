import React from 'react'
import AdminDashboard from './dashboard/AdminDashboard'
import { auth } from '../../../../auth'
import { NextResponse } from 'next/server'

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
