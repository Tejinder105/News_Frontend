import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api/v1",
    }),
    tagTypes: ["Article"],
    endpoints: (builder) => ({
        getArticles: builder.query({
            query: ({ language = "en", page = 1, limit = 20, tag = null, location = null }) => {
                const params = { language, page, limit };
                if (tag) params.tag = tag;
                if (location) params.location = location;
                return {
                    url: "/articles/getarticles",
                    params,
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.articles.map(({ slug }) => ({ type: "Article", id: slug })),
                        { type: "Article", id: "LIST" },
                    ]
                    : [{ type: "Article", id: "LIST" }],
            // Transform response to match existing frontend structure (if needed)
            // transformResponse: (response) => response.data, 
            // Note: Backend returns { data: { articles: [], pagination: {} } }, so we might need strict transform depending on component expectations.
            // Based on articleService, it returns { articles, pagination }.
            transformResponse: (response) => {
                const payload = response?.data ?? {};
                return {
                    articles: payload.articles || [],
                    pagination: payload.pagination || {}
                };
            }
        }),
        getBreakingNews: builder.query({
            query: ({ language = "en", limit = 3 }) => ({
                url: "/articles/getbreakingnews",
                params: { language, limit },
            }),
            transformResponse: (response) => response?.data?.BreakingNews || []
        }),
    }),
});

export const { useGetArticlesQuery, useGetBreakingNewsQuery } = apiSlice;
