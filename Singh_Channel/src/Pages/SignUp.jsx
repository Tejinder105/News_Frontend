import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../Components";
import axios from "axios";
import {useForm}  from "react-hook-form";

const SignUp = () => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm()

    return (
        <div className="mx-auto w-full max-w-sm">
            <div className="mb-4 text-center">
                <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                    Create account
                </h1>
            
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div>
                    <Input
                        label="Full Name:"
                        {...register("name", {
                            required: true,
                        })}
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                    />
                </div>

                <div>
                    <Input
                        label="Email: "
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                                        value
                                    ) ||
                                    "Email address must be a valid address",
                            },
                        })}
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
                    />
                </div>

                <div>
                    <Input
                        lable="Password: "
                        type="password"
                        placeholder="Create a password"
                        {...register("password", {
                            required: true,
                        })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-transparent focus:ring-2 focus:ring-sky-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"

                    />
                </div>

              
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-sky-500 px-4 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:bg-sky-300 dark:focus:ring-offset-slate-800"
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </Button>

                <div className="pt-4 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-sky-500 transition-colors hover:text-sky-600"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <a
                    href="/api/auth/google"
                    className="flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                        alt="Google"
                        className="mr-3 h-5 w-5"
                    />
                    Sign up with Google
                </a>
            </form>
        </div>
    );
};

export default SignUp;
