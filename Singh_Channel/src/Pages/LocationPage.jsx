import React from "react";
import FilteredArticlesPage from "../Components/FilteredArticlesPage";

/**
 * Location page - displays articles filtered by location
 * Uses the reusable FilteredArticlesPage component
 */
const LocationPage = () => {
    return <FilteredArticlesPage filterType="location" titleSuffix="News" />;
};

export default LocationPage;
