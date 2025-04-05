// src/app/admin/dashboard/page.tsx
import { auth } from '../../../../../auth'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'


export default async function Page() {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    return <AdminDashboard />
}
