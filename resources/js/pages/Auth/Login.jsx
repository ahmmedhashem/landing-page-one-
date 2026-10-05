import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Head title="Log in" />
            <form onSubmit={submit} className="w-full max-w-sm space-y-5 border border-gray-200 bg-white p-8 shadow-sm">
                <h1 className="font-display text-2xl tracking-wide uppercase">Dashboard login</h1>

                <div>
                    <label htmlFor="email" className="text-sm font-bold text-gray-600">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        className="mt-1 block w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-bold text-gray-600">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className="mt-1 block w-full border border-gray-300 px-3 py-2.5 outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                    Remember me
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-navy py-3 text-sm font-bold tracking-[0.12em] text-white uppercase hover:bg-navy-light disabled:opacity-60"
                >
                    Log in
                </button>
            </form>
        </div>
    );
}
