import React, { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router";
import { observer } from 'mobx-react-lite';
import { Context } from "../main.jsx";
import { useDocumentTitle } from "../hooks/documentTitleHook.jsx";
import { CircleLoader } from "react-spinners";

const Auth = observer(() => {
    const { setIsAuth, setUser, setIsAdmin } = useContext(Context);
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useDocumentTitle(isLogin ? 'Login | Recipe Hub' : 'Registration | Recipe Hub');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name" && !/^[a-zA-Z0-9]*$/.test(value)) return;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = `https://recipehubserver-pi.vercel.app/api/auth/${isLogin ? 'login' : 'register'}`;
            const body = isLogin
                ? { email: form.email, password: form.password }
                : { name: form.name, email: form.email, password: form.password };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.message || (isLogin ? 'Incorrect email or password' : 'Registration error'));
                return;
            }

            if (isLogin) {
                setUser(data.user);
                setIsAuth(true);
                setIsAdmin(data.user.role === "ADMIN");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate('/');
            } else {
                alert('Successful registration! Now Sign In');
                setForm({ name: '', email: '', password: '' });
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="border bg-white border-gray-300 flex flex-col gap-6 rounded-xl w-full max-w-md mx-auto items-start p-6">
                <div className="flex flex-col">
                    <h4 className="leading-none text-base font-medium">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h4>
                    <p className="text-gray-500 text-base font-normal pt-1">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form className="mt-4 flex flex-col w-full [&:last-child]:pb-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="flex flex-col mb-4">
                            <label className="text-base font-medium">Full Name / username</label>
                            <input
                                required
                                name="name"
                                value={form.name}
                                maxLength={18}
                                onChange={handleChange}
                                className="pl-3 bg-gray-100 rounded-md mt-1 h-9 w-full transition-[color,box-shadow] outline-none md:text-sm focus-visible:ring-[3px] focus-visible:ring-gray-300"
                            />
                        </div>
                    )}
                    <label className="text-base font-medium">Email</label>
                    <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="pl-3 bg-gray-100 rounded-md mt-1 h-9 w-full transition-[color,box-shadow] outline-none md:text-sm focus-visible:ring-[3px] focus-visible:ring-gray-300"
                    />
                    <label className="text-base font-medium mt-4">Password</label>
                    <input
                        required
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="pl-3 bg-gray-100 rounded-md mt-1 h-9 w-full transition-[color,box-shadow] outline-none md:text-sm focus-visible:ring-[3px] focus-visible:ring-gray-300"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center mt-4 cursor-pointer min-h-12 bg-gray-900 text-white p-2 rounded-md font-medium text-base transition-all hover:bg-gray-800 disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <CircleLoader color="white" size={25} />
                        ) : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="flex items-center justify-center w-full">
                    <NavLink
                        to={isLogin ? '/registration' : '/login'}
                        className="mt-4 p-2 font-medium text-base hover:underline underline-offset-10"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </NavLink>
                </div>
            </div>
        </div>
    );
});

export default Auth;
