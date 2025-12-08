import React from 'react';
import { Video } from 'lucide-react';
import { Input } from '/src/Components';

const VideoSection = ({ register, errors, watch }) => {
    const youtubeLink = watch("youtubeLink");

    const getVideoPreview = (url) => {
        if (!url) return null;
        let videoId = null;
        try {
            if (url.includes("youtu.be")) {
                videoId = url.split("youtu.be/")[1]?.split("?")[0];
            } else if (url.includes("v=")) {
                videoId = url.split("v=")[1]?.split("&")[0];
            } else if (url.includes("/embed/")) {
                videoId = url.split("/embed/")[1]?.split("?")[0];
            }

            if (videoId) {
                return (
                    <div className="mt-3 aspect-video w-full overflow-hidden rounded-md bg-black">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                );
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    return (
        <div className="group relative overflow-hidden rounded-sm border border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
                    <Video className="h-5 w-5" />
                </div>

                <h4 className="text-sm font-semibold font-serif text-gray-800 sm:text-base">
                    YouTube Video
                </h4>
            </div>
            <Input
                placeholder="https://youtube.com/watch?v=..."
                className="mb-1 text-sm mt-3"
                {...register("youtubeLink", {
                    pattern: {
                        value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                        message: "Please enter a valid YouTube URL"
                    }
                })}
                error={errors.youtubeLink}
            />

            {/* Video Preview */}
            {youtubeLink && !errors.youtubeLink && getVideoPreview(youtubeLink)}
        </div>
    );
};

export default VideoSection;
