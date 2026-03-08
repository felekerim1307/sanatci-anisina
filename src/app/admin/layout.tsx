import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

export const metadata = {
    title: 'Admin Paneli - Sanatçı Anısına',
    description: 'Sanatçı Anma Sitesi Yönetim Paneli',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-neutral-900 text-neutral-100 font-sans" style={{ height: 'calc(100vh - 96px)', marginTop: '96px' }}>
            {/* Dinamik Sidebar Bileşeni: Login sayfasında gizlenir, diğer sayfalarda gösterilir. */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
