import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const nav = [
    { href: '/dashboard/leads', label: 'Leads' },
    { href: '/dashboard/content', label: 'Page content' },
];

export default function DashboardLayout({ title, actions, children }) {
    const { url, props } = usePage();
    const [flash, setFlash] = useState(props.flash?.success);

    useEffect(() => {
        setFlash(props.flash?.success);
        if (!props.flash?.success) return;
        const t = setTimeout(() => setFlash(null), 3500);
        return () => clearTimeout(t);
    }, [props.flash?.success]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={title} />

            <header className="bg-navy text-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-8">
                        <span className="font-display text-lg tracking-[0.15em] uppercase">Dashboard</span>
                        <nav className="flex gap-1">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`rounded px-3 py-1.5 text-sm transition ${
                                        url.startsWith(item.href) ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <a href="/" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">
                            View page ↗
                        </a>
                        <span className="hidden text-white/50 sm:inline">{props.auth.user?.email}</span>
                        <Link href="/logout" method="post" as="button" className="rounded border border-white/30 px-3 py-1.5 hover:bg-white/10">
                            Log out
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-ink">{title}</h1>
                    {actions}
                </div>
                {children}
            </main>

            {flash && (
                <div className="fixed right-4 bottom-4 z-50 rounded bg-emerald-600 px-4 py-3 text-sm text-white shadow-lg">{flash}</div>
            )}
        </div>
    );
}
