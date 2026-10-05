import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Close } from './Icons';

const inputClass =
    'mt-2 block w-full border border-gray-300 bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-navy focus:ring-1 focus:ring-navy';

export default function RegisterModal({ open, onClose, page }) {
    const [submitted, setSubmitted] = useState(false);
    const nameRef = useRef(null);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        mobile: '',
        question: '',
    });

    useEffect(() => {
        if (!open) return;
        setSubmitted(false);
        clearErrors();
        const t = setTimeout(() => nameRef.current?.focus(), 50);
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            clearTimeout(t);
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    const submit = (e) => {
        e.preventDefault();
        post('/leads', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSubmitted(true);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="register-title">
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white p-8 shadow-2xl sm:p-10">
                <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-500 transition hover:text-ink" aria-label="Close">
                    <Close />
                </button>

                {submitted ? (
                    <div className="py-6 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <p className="text-lg leading-relaxed font-light text-ink">{page.success_message}</p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-8 bg-navy px-10 py-3.5 text-[13px] font-bold tracking-[0.12em] text-white uppercase transition hover:bg-navy-light"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 id="register-title" className="font-display text-2xl tracking-wide text-ink uppercase sm:text-3xl">
                            {page.form_title}
                        </h2>
                        {page.form_subtitle && <p className="mt-3 text-[15px] leading-relaxed font-light text-gray-600">{page.form_subtitle}</p>}

                        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
                            <div>
                                <label htmlFor="name" className="text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">
                                    Name
                                </label>
                                <input
                                    ref={nameRef}
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    className={inputClass}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="mobile" className="text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">
                                    Mobile
                                </label>
                                <input
                                    id="mobile"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    placeholder="+971 50 000 0000"
                                    className={inputClass}
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    required
                                />
                                {errors.mobile && <p className="mt-1.5 text-sm text-red-600">{errors.mobile}</p>}
                            </div>

                            <div>
                                <label htmlFor="question" className="text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">
                                    {page.question_label}
                                </label>
                                <select
                                    id="question"
                                    className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23111%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    {page.question_options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {errors.question && <p className="mt-1.5 text-sm text-red-600">{errors.question}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full bg-navy py-4 text-[13px] font-bold tracking-[0.12em] text-white uppercase transition hover:bg-navy-light disabled:opacity-60"
                            >
                                {processing ? 'Sending…' : page.submit_text}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
