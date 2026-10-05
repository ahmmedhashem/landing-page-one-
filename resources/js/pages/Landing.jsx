import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Phone } from '../components/Icons';
import RegisterModal from '../components/RegisterModal';

export default function Landing({ page }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Head title={page.title} />

            <div className="flex min-h-screen flex-col">
                <header className="border-b border-gray-100">
                    <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-[10%]">
                        <a href="/" className="font-display text-xl tracking-[0.18em] text-ink uppercase">
                            {page.brand_name}
                        </a>
                        <div className="flex items-center gap-6">
                            {page.header_phone && (
                                <a
                                    href={`tel:${page.header_phone.replace(/[^+\d]/g, '')}`}
                                    className="hidden items-center gap-2 text-sm tracking-wider text-gray-600 transition hover:text-ink sm:flex"
                                >
                                    <Phone />
                                    {page.header_phone}
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="border border-navy px-5 py-2.5 text-xs font-bold tracking-[0.12em] text-navy uppercase transition hover:bg-navy hover:text-white"
                            >
                                {page.button_text}
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    <div className="mx-auto max-w-[1600px] px-6 pt-12 pb-20 lg:px-[10%] lg:pt-16 lg:pb-28">
                        {page.back_link_text && (
                            <a
                                href={page.back_link_url || '#'}
                                className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.15em] text-gray-500 uppercase transition hover:text-ink"
                            >
                                <ArrowLeft />
                                {page.back_link_text}
                            </a>
                        )}

                        <div className="mt-5 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
                            <div className="overflow-hidden bg-gray-100">
                                <img src={page.image_url} alt={page.title} className="aspect-[764/541] w-full object-cover" />
                            </div>

                            <div className="lg:pt-1">
                                <h1 className="font-display text-3xl leading-tight tracking-wide text-ink uppercase sm:text-4xl">{page.title}</h1>

                                {page.description && (
                                    <div className="mt-10 space-y-0 text-lg leading-[1.85] font-light text-gray-800">
                                        {page.description.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>
                                )}

                                {page.details.length > 0 && (
                                    <div className="mt-10">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold tracking-[0.12em] text-gray-400 uppercase">{page.details_label}</span>
                                            <span className="h-px w-32 bg-gray-400" />
                                        </div>
                                        <ul className="mt-5 space-y-2.5">
                                            {page.details.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-[17px] tracking-[0.12em] text-ink">
                                                    <ArrowRight className="mt-[0.3em] h-4 w-4 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className="mt-10 w-full bg-navy px-16 py-5 text-sm font-bold tracking-[0.12em] text-white uppercase transition hover:bg-navy-light sm:w-auto sm:min-w-[278px]"
                                >
                                    {page.button_text}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="bg-navy text-white/70">
                    <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-6 py-8 text-sm sm:flex-row lg:px-[10%]">
                        <span className="font-display tracking-[0.18em] text-white uppercase">{page.brand_name}</span>
                        <span>{page.footer_text}</span>
                    </div>
                </footer>
            </div>

            <RegisterModal open={open} onClose={() => setOpen(false)} page={page} />
        </>
    );
}
