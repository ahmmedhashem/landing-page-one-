import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const inputClass = 'mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy';

function Field({ label, error, hint, children }) {
    return (
        <label className="block">
            <span className="text-sm font-bold text-gray-700">{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
            {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
        </label>
    );
}

function Section({ title, children }) {
    return (
        <section className="rounded border border-gray-200 bg-white p-6">
            <h2 className="mb-5 text-sm font-bold tracking-wider text-gray-500 uppercase">{title}</h2>
            <div className="space-y-5">{children}</div>
        </section>
    );
}

function ListEditor({ label, items, onChange, errors, addLabel, placeholder }) {
    const update = (i, value) => onChange(items.map((item, j) => (j === i ? value : item)));
    const remove = (i) => onChange(items.filter((_, j) => j !== i));
    const move = (i, dir) => {
        const next = [...items];
        [next[i], next[i + dir]] = [next[i + dir], next[i]];
        onChange(next);
    };

    return (
        <div>
            <span className="text-sm font-bold text-gray-700">{label}</span>
            <div className="mt-1 space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                        <input className={`${inputClass} mt-0`} value={item ?? ''} placeholder={placeholder} onChange={(e) => update(i, e.target.value)} />
                        <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded border border-gray-300 px-2 text-gray-600 disabled:opacity-30" aria-label="Move up">
                            ↑
                        </button>
                        <button
                            type="button"
                            disabled={i === items.length - 1}
                            onClick={() => move(i, 1)}
                            className="rounded border border-gray-300 px-2 text-gray-600 disabled:opacity-30"
                            aria-label="Move down"
                        >
                            ↓
                        </button>
                        <button type="button" onClick={() => remove(i)} className="rounded border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50">
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={() => onChange([...items, ''])} className="mt-2 text-sm font-bold text-navy hover:underline">
                + {addLabel}
            </button>
            {errors && <span className="mt-1 block text-sm text-red-600">{errors}</span>}
        </div>
    );
}

export default function Content({ page }) {
    const { image_url, ...initial } = page;
    const [preview, setPreview] = useState(image_url);
    const { data, setData, post, processing, errors, isDirty } = useForm({
        ...initial,
        image: null,
        remove_image: false,
    });

    const text = (key) => ({ value: data[key] ?? '', onChange: (e) => setData(key, e.target.value) });

    const pickImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData((d) => ({ ...d, image: file, remove_image: false }));
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/dashboard/content', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setData((d) => ({ ...d, image: null, remove_image: false })),
        });
    };

    const listError = (key) => errors[key] || Object.entries(errors).find(([k]) => k.startsWith(`${key}.`))?.[1];

    return (
        <DashboardLayout
            title="Page content"
            actions={
                <button
                    form="content-form"
                    type="submit"
                    disabled={processing}
                    className="rounded bg-navy px-5 py-2 text-sm font-bold text-white hover:bg-navy-light disabled:opacity-60"
                >
                    {processing ? 'Saving…' : isDirty ? 'Save changes' : 'Save'}
                </button>
            }
        >
            <form id="content-form" onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <Section title="Header & footer">
                        <Field label="Brand name" error={errors.brand_name}>
                            <input className={inputClass} {...text('brand_name')} />
                        </Field>
                        <Field label="Header phone number" error={errors.header_phone} hint="Leave empty to hide it.">
                            <input className={inputClass} {...text('header_phone')} />
                        </Field>
                        <Field label="Footer text" error={errors.footer_text}>
                            <input className={inputClass} {...text('footer_text')} />
                        </Field>
                    </Section>

                    <Section title="Main content">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Back link text" error={errors.back_link_text} hint="Leave empty to hide it.">
                                <input className={inputClass} {...text('back_link_text')} />
                            </Field>
                            <Field label="Back link URL" error={errors.back_link_url}>
                                <input className={inputClass} {...text('back_link_url')} />
                            </Field>
                        </div>
                        <Field label="Title" error={errors.title}>
                            <input className={inputClass} {...text('title')} />
                        </Field>
                        <Field label="Description" error={errors.description} hint="Each new line is shown as its own line.">
                            <textarea rows={5} className={inputClass} {...text('description')} />
                        </Field>
                        <Field label="Details label" error={errors.details_label}>
                            <input className={inputClass} {...text('details_label')} />
                        </Field>
                        <ListEditor
                            label="Details list"
                            items={data.details}
                            onChange={(v) => setData('details', v)}
                            errors={listError('details')}
                            addLabel="Add detail"
                            placeholder="e.g. Date: 5 September, 2026 (Saturday)"
                        />
                        <Field label="Button text" error={errors.button_text}>
                            <input className={inputClass} {...text('button_text')} />
                        </Field>
                    </Section>
                </div>

                <div className="space-y-6">
                    <Section title="Image">
                        <img src={preview} alt="" className="aspect-[764/541] w-full rounded bg-gray-100 object-cover" />
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="cursor-pointer rounded border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
                                Upload new image
                                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pickImage} />
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setData((d) => ({ ...d, image: null, remove_image: true }));
                                    setPreview('/images/open-house.jpg');
                                }}
                                className="text-sm text-gray-600 hover:text-ink"
                            >
                                Reset to default
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">JPG, PNG or WEBP, up to 5 MB. Recommended ratio about 7:5.</p>
                        {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                    </Section>

                    <Section title="Registration form">
                        <Field label="Form title" error={errors.form_title}>
                            <input className={inputClass} {...text('form_title')} />
                        </Field>
                        <Field label="Form subtitle" error={errors.form_subtitle}>
                            <textarea rows={2} className={inputClass} {...text('form_subtitle')} />
                        </Field>
                        <Field label="Dropdown question" error={errors.question_label}>
                            <input className={inputClass} {...text('question_label')} />
                        </Field>
                        <ListEditor
                            label="Dropdown options"
                            items={data.question_options}
                            onChange={(v) => setData('question_options', v)}
                            errors={listError('question_options')}
                            addLabel="Add option"
                        />
                        <Field label="Submit button text" error={errors.submit_text}>
                            <input className={inputClass} {...text('submit_text')} />
                        </Field>
                        <Field label="Success message" error={errors.success_message}>
                            <textarea rows={2} className={inputClass} {...text('success_message')} />
                        </Field>
                    </Section>
                </div>
            </form>
        </DashboardLayout>
    );
}
