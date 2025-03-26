'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { FaFacebook } from "react-icons/fa"; // Facebook icon

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberFlag, setRememberFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Load saved credentials on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        const savedPassword = localStorage.getItem("savedPassword");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberFlag(true);
        }
    }, []);

    // Function to validate email syntax
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
        return regex.test(email);
    };

    // Function to validate password length
    const validatePassword = (password: string) => {
        return password.length >= 8; // Password must be at least 8 characters
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error message
        setIsLoading(true); // Start loading state
        try {
            // Validate email syntax
            if (!validateEmail(email)) {
                toast.error("Please enter a valid email address.");
                setErrorMessage("Please enter a valid email address.");
                setIsLoading(false);
                return;
            }

            // Validate password length
            if (!validatePassword(password)) {
                toast.error("Password must be at least 8 characters long.");
                setErrorMessage("Password must be at least 8 characters long.");
                setIsLoading(false);
                return;
            }

            // Proceed with sign-in if validation passes
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                toast.error("Error signing in. Please try again.");
                setErrorMessage("Incorrect email or password. Please try again.");
                setIsLoading(false);
            } else {
                toast.success("Successfully signed in!");

                // Store credentials if "Remember Me" is checked, otherwise clear them
                if (rememberFlag) {
                    localStorage.setItem("savedEmail", email);
                    localStorage.setItem("savedPassword", password);
                } else {
                    localStorage.removeItem("savedEmail");
                    localStorage.removeItem("savedPassword");
                }

                router.push('/home');
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An unexpected error occurred.");
            setErrorMessage("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-red-200 flex flex-col sm:flex-row min-h-screen m-0 p-0 overflow-hidden">
            <div className="relative hidden sm:block w-full sm:w-1/2">
                <Image width={1000} height={1000} className="w-full h-screen object-cover" src="/images/login/bg.png" alt="CoverLogin" />

                <div className="absolute w-2/3 bottom-8 left-1/2 transform -translate-x-1/2 bg-opacity-70 bg-gray-300 opacity-70 rounded-full flex items-center justify-between px-5 py-2 space-x-4">
                    <span className="text-black font-semibold whitespace-nowrap">You don’t have an account?</span>
                    <button onClick={() => { router.push("/signup") }} className="bg-white text-purple-600 font-bold py-2 px-5 rounded-full hover:bg-gray-100 transition duration-300 whitespace-nowrap">
                        Sign Up
                    </button>
                </div>
            </div>

            <div className="bg-white w-full sm:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 min-h-screen sm:min-h-0 overflow-y-auto">
                <div className="w-full max-w-sm flex flex-col items-center">
                    <Image width={40} height={40} src="/images/login/Logo.png" alt="Logo" className="m-4" />
                    <h1 className="font-bold text-3xl text-gray-800 mb-2">Sign in</h1>
                    <p className="text-gray-500 mb-6 text-center">Take the next step and sign in to your account.</p>
                    <form className="w-full" onSubmit={submitHandler}>
                        <div className="mb-1">
                            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">Enter your email</label>
                            <input
                                name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorMessage("");
                                }}
                                className="border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">Enter your password</label>
                            <input
                                name="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorMessage("");
                                }}
                                className="border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Password"
                            />
                        </div>

                        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

                        <div className="flex items-right justify-between mb-4">

                            <Link href="/forgotPassword">
                                <p className="inline-block align-baseline font-bold text-sm text-purple-600 hover:text-purple-800">Forgot Password?</p>
                            </Link>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging In...' : 'Sign In'}
                            </button>
                        </div>

                        <div className="flex items-center my-3">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="mx-2 text-gray-500">or</span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>


                        <div className="flex flex-col justify-evenly gap-4 mb-6">
                            <Button
                                type="button" // Add this line
                                onClick={async () => await signIn("google", { callbackUrl: "/home" })}
                                className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition duration-300"
                            >
                                <FcGoogle className="mr-2" size={20} />
                                Google
                            </Button>

                            <Button
                                type="button" // Add this line
                                onClick={async () => await signIn("facebook", { callbackUrl: "/home" })}
                                className="w-full flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                            >
                                <FaFacebook className="mr-2" size={20} />
                                Facebook
                            </Button>
                        </div>

                        <div className="sm:hidden w-full text-center">
                            <span className="text-gray-700 font-semibold">Don't have an account? </span>
                            <button onClick={() => { router.push("/signup") }} className="text-purple-600 font-bold hover:text-purple-800 whitespace-nowrap">
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}