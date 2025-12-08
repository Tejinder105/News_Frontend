import React from 'react';
import { Star, Zap } from 'lucide-react';
import { Toggle } from '/src/Components';

const ArticleSettings = ({ watch, setValue }) => {
    return (
        <div className="mt-4 space-y-4 sm:mt-6">
            {/* Featured Article */}
            <div className="group relative overflow-hidden rounded-sm border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
                            <Star className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold font-serif text-gray-800 sm:text-base">
                                Featured Article
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Toggle
                            checked={watch("isFeatured")}
                            onChange={(e) =>
                                setValue("isFeatured", e.target.checked)
                            }
                            variant="featured"
                        />
                    </div>
                </div>
            </div>

            {/* Breaking News */}
            <div className="group relative overflow-hidden rounded-sm border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold font-serif text-gray-800 sm:text-base">
                                Breaking News
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Toggle
                            checked={watch("isBreaking")}
                            onChange={(e) =>
                                setValue("isBreaking", e.target.checked)
                            }
                            variant="breaking"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleSettings;
