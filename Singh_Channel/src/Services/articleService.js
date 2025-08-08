import axios from "axios";

const getAllArticles = async (language = "en", page = 1, limit = 20) => {
    try {
        console.log('Making request to:', `${import.meta.env.VITE_API_URL}/api/v1/articles/getarticles`);
        console.log('With params:', { language, page, limit });
        
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/articles/getarticles`,
            {
                params: {
                    language,
                    page,
                    limit,
                },
            }
        );

        console.log("Fetched articles:", response.data);
        return response.data;
    } catch (error) {
        console.error('Article service error:', error);
        throw error;
    }
};

export default {
    getAllArticles,
};
