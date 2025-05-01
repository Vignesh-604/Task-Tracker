import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { decrypt } from '../utils';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        country: ''
    });
    const [see, setSee] = useState(false)

    useEffect(() => {
        const user = decrypt()
        if (user?._id) navigate("/home")
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                const res = await axios.post("/api/users/login", formData, { withCredentials: true })
                if (res.data?.success) {
                    const user = decrypt()
                    if (user?._id) navigate("/home")
                }
            } else {
                const res = await axios.post("/api/users/signup", formData, { withCredentials: true })
                if (res.data?.data) {
                    const user = decrypt()
                    if (user?._id) navigate("/home")
                }
            }
        } catch (error) {
            console.log(error?.response.data)
        }
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    <div className="flex mb-6">
                        <button
                            className={`w-1/2 py-2 text-center focus:outline-none transition-colors ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`w-1/2 py-2 text-center focus:outline-none transition-colors ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div>
                        {!isLogin && (
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required={!isLogin}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="mb-4 flex">
                            <div className='w-full'>
                                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type={see ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button className='flex items-end mb-3 px-2 cursor-pointer ' onClick={() => setSee(!see)}>
                                {see ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {!isLogin && (
                            <div className="mb-6">
                                <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
                                    Country
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    required={!isLogin}
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="India"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}