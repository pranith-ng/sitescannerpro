"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AppContext } from "../Context/AppContext";
import { useRouter } from "next/navigation";
import AuthHandler from "../components/AuthHandler";
import { motion } from "framer-motion";



export default function SignUpPage() {

    const router = useRouter();

    const { user, setUser } = useContext(AppContext)

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupActive, setSignupActive] = useState(false);
    const [loading, setloading] = useState(false)
    const [errormsg, seterrormsg] = useState("")


    const handleSignup = async (e) => {
        e.preventDefault()

        if (!password || password.length < 8) {
            seterrormsg("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            seterrormsg("Passwords do not match.");
            return;
        }

        setloading(true)

        const result = await AuthHandler({ email: username, password: password, action: "signup" })
        if (result.error) {
            seterrormsg(result.error)
            console.log(result.error)
            setloading(false)
        }
        if (result) {
            setloading(false)
            if (result.data.user) {
                router.push('/Mainapp')
            }
        }
    }

    useEffect(() => {
        if (user) {
            router.push("/Mainapp")
        }
    }, [user])

    useEffect(() => {

        if (!errormsg) return

        const timer = setTimeout(() => {
            seterrormsg("")
        }, 8000)

        return () => clearTimeout(timer)

    }, [errormsg])


    if (user) {
        return null
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-[#E0DAD0] px-4">
            <div className="w-full max-w-md p-8 rounded-2xl neumorphic">
                <h1 className="text-3xl font-bold text-center mb-8">Sign Up</h1>

                <form onSubmit={handleSignup} className="space-y-5">
                    {/* Username */}
                    <div className="relative flex items-center">
                        <span className="absolute left-3 top-4 flex items-center text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A9 9 0 1119 12v1a9 9 0 01-13.879 4.804z"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-4xl focus:outline-none neumorphic-pressed-input text-engraved"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative flex flex-col">
                        <div className="flex items-center w-full">
                            <span className="absolute left-3 flex items-center text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 11c.828 0 1.5.672 1.5 1.5S12.828 14 12 14s-1.5-.672-1.5-1.5S11.172 11 12 11zm6-2h-1V7a5 5 0 00-10 0v2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-7 0V7a3 3 0 016 0v2h-6z"
                                    />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 rounded-4xl focus:outline-none neumorphic-pressed-input text-engraved"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 flex items-center text-gray-500 p-1 rounded-full  hover:text-gray-700"
                            >
                                {showPassword ? (
                                     <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.062-3.368M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M3 3l18 18"
                                        />
                                    </svg>
                                ) : (
                                     <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {password && password.length < 8 && (
                            <span className="text-red-500 text-sm mt-1">
                                Password must be at least 8 characters
                            </span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative flex flex-col">
                        <div className="flex items-center w-full">
                            <span className="absolute left-3 flex items-center text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 11c.828 0 1.5.672 1.5 1.5S12.828 14 12 14s-1.5-.672-1.5-1.5S11.172 11 12 11zm6-2h-1V7a5 5 0 00-10 0v2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2zm-7 0V7a3 3 0 016 0v2h-6z"
                                    />
                                </svg>
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 rounded-4xl focus:outline-none neumorphic-pressed-input text-engraved"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 flex items-center text-gray-500 p-1 rounded-full hover:text-gray-700"
                            >
                                {showConfirmPassword ? (
                                  <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.062-3.368M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M3 3l18 18"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {confirmPassword && confirmPassword !== password && (
                            <span className="text-red-500 text-sm mt-1">
                                Passwords do not match
                            </span>
                        )}
                    </div>

                    {/* Sign Up button */}
                    <button
                        disabled={loading}
                        type="submit"
                        onMouseDown={() => setSignupActive(true)}
                        onMouseUp={() => setSignupActive(false)}
                        onMouseLeave={() => setSignupActive(false)}
                        className={`w-full py-3 rounded-4xl font-semibold neumorphic flex justify-center items-center`}
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-7 h-7 border-black border-4 border-t-transparent rounded-full"
                            />
                        ) : (
                            "Create account"
                        )}
                    </button>

                    {errormsg &&
                        <p className="text-center p-2 text-red-500 transition-opacity duation-500">{errormsg}</p>
                    }

                </form>

                {/* Login link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/Login"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
