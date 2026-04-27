import NavMenu from './NavMenu';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <NavMenu />
            <main>
                {children}
            </main>
        </div>
    );
}