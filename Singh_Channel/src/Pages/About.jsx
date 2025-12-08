import React from "react";
import { SectionHeading } from "../Components";

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-16 text-center">
                    <h1 className="mb-4 font-playfair text-4xl font-bold text-gray-900 md:text-5xl">
                        About Us
                    </h1>
                    <div className="mx-auto h-1 w-24 bg-blue-600"></div>
                    <p className="mt-6 text-lg text-gray-600 font-serif leading-relaxed">
                        Delivering the truth with integrity, speed, and perspective since 2024.
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="mb-16 rounded-2xl bg-white p-8 shadow-sm md:p-12">
                    <SectionHeading title="Our Mission" color="blue" />
                    <p className="mt-6 text-lg text-gray-700 font-serif leading-loose">
                        At Singh Channel, we believe that information is the lifeblood of a
                        thriving democracy. Our mission is to provide accurate, unbiased, and
                        timely news that empowers our readers to make informed decisions. We
                        are committed to journalistic excellence and the pursuit of truth in
                        an increasingly complex world.
                    </p>
                </div>

                {/* Who We Are Grid */}
                <div className="grid gap-8 md:grid-cols-2 mb-16">
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                        <h3 className="mb-4 font-playfair text-2xl font-bold text-gray-900">
                            Who We Are
                        </h3>
                        <p className="text-gray-600 font-serif leading-relaxed">
                            We are a dedicated team of journalists, editors, and digital
                            creators passionate about storytelling. From breaking news to
                            in-depth analysis, our team works around the clock to bring you
                            stories that matter from your local community and around the globe.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white p-8 shadow-sm">
                        <h3 className="mb-4 font-playfair text-2xl font-bold text-gray-900">
                            Our Values
                        </h3>
                        <ul className="space-y-3 text-gray-600 font-serif">
                            <li className="flex items-start">
                                <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                <span><strong>Integrity:</strong> Uncompromising commitment to truth.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                <span><strong>Independence:</strong> Free from external influence.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-3 mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                <span><strong>Community:</strong> Serving the people's interest first.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 border-t border-gray-200 py-12 text-center">
                    <div>
                        <div className="text-3xl font-bold text-blue-600 font-playfair">50K+</div>
                        <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Daily Readers</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-blue-600 font-playfair">100+</div>
                        <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Countries</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-blue-600 font-playfair">24/7</div>
                        <div className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Coverage</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
