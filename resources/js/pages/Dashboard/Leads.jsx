import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

function Stat({ label, value }) {
    return (
        <div className="rounded border border-gray-200 bg-white p-5">
            <div className="text-xs font-bold tracking-wider text-gray-500 uppercase">{label}</div>
            <div className="mt-2 text-3xl font-bold text-navy">{value}</div>
        </div>
    );
}

export default function Leads({ leads, filters, stats }) {
    const [search, setSearch] = useState(filters.search);
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        const t = setTimeout(() => {
            router.get('/dashboard/leads', search ? { search } : {}, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    // Refresh the list periodically so new leads show up without reloading.
    useEffect(() => {
        const t = setInterval(() => router.reload({ only: ['leads', 'stats'] }), 30000);
        return () => clearInterval(t);
    }, []);

    const destroy = (lead) => {
        if (confirm(`Delete the lead from ${lead.name}?`)) {
            router.delete(`/dashboard/leads/${lead.id}`, { preserveScroll: true });
        }
    };

    const toggleRead = (lead) => router.patch(`/dashboard/leads/${lead.id}/read`, {}, { preserveScroll: true });

    const exportUrl = `/dashboard/leads/export${search ? `?search=${encodeURIComponent(search)}` : ''}`;

    return (
        <DashboardLayout
            title="Leads"
            actions={
                <a href={exportUrl} className="rounded bg-navy px-4 py-2 text-sm font-bold text-white hover:bg-navy-light">
                    Export CSV
                </a>
            }
        >
            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Total leads" value={stats.total} />
                <Stat label="Today" value={stats.today} />
                <Stat label="New (unread)" value={stats.unread} />
            </div>

            <div className="mt-6 overflow-hidden rounded border border-gray-200 bg-white">
                <div className="border-b border-gray-200 p-4">
                    <input
                        type="search"
                        placeholder="Search by name, mobile or answer…"
                        className="w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs tracking-wider text-gray-500 uppercase">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Mobile</th>
                                <th className="px-4 py-3">Answer</th>
                                <th className="px-4 py-3">Submitted</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                        No leads yet.
                                    </td>
                                </tr>
                            )}
                            {leads.data.map((lead) => (
                                <tr key={lead.id} className={lead.read_at ? '' : 'bg-blue-50/50'}>
                                    <td className="px-4 py-3 font-bold text-ink">
                                        {!lead.read_at && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600 align-middle" />}
                                        {lead.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`tel:${lead.mobile.replace(/[^+\d]/g, '')}`} className="text-navy hover:underline">
                                            {lead.mobile}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{lead.question}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(lead.created_at).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <button onClick={() => toggleRead(lead)} className="mr-3 text-gray-600 hover:text-ink">
                                            {lead.read_at ? 'Mark unread' : 'Mark read'}
                                        </button>
                                        <button onClick={() => destroy(lead)} className="text-red-600 hover:text-red-800">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {leads.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 p-4 text-sm">
                        <span className="text-gray-500">
                            Showing {leads.from}–{leads.to} of {leads.total}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {leads.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded px-3 py-1 ${link.active ? 'bg-navy text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={i} className="px-3 py-1 text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                ),
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
