import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Button from "../Components/Ui/Button";

const NotFound = () => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-[150px] font-black leading-none text-gray-200 md:text-[200px]">
                    404
                </h1>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    {/* You could put an illustration here if you had one, but strict styling is safer */}
                    <span className="text-2xl font-bold uppercase tracking-widest text-gray-400">Not Found</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-md"
            >
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                    Oops! You seem to be lost.
                </h2>
                <p className="mb-8 text-gray-600">
                    The page you are looking for does not exist, has been removed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link to="/">
                        <Button
                            variant="primary"
                            iconLeft={<Home size={18} />}
                            className="w-full sm:w-auto"
                        >
                            Back to Home
                        </Button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
