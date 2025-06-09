
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import { auth } from '@/lib/authOptions'


export default async function Page() {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    return <AdminDashboard />
}
