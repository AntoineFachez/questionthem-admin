// src/lib/registries/widget-library.js
import DataBaseOverview from "../../app/(features)/dataBase/DataBaseOverview";
import FeaturedCarousel from "../../app/(features)/carousel/Carousel";
import SearchBarGrouped from "../../components/searchBar/SearchBarGrouped";
import StatCard from "../../components/card/StatCard";

export const widgetRegistry = {
  userDashboard: DataBaseOverview,
  SearchBarGrouped: SearchBarGrouped,
  FeaturedCarousel: FeaturedCarousel,
  ArticleGrid: DataBaseOverview,
  StatCard: StatCard,
};
