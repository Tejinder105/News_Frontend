import React from "react";
import FilteredArticlesPage from "../Components/FilteredArticlesPage";

/**
 * Category page - displays articles filtered by tag
 * Uses the reusable FilteredArticlesPage component
 */
const CategoryPage = () => {
    return <FilteredArticlesPage filterType="tag" titleSuffix="" />;
};

export default CategoryPage;
