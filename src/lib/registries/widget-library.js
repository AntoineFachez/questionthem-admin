// filename: components/widget-library.js
import DataBaseOverview from "../../widgets/dataBase/DataBaseOverview";
import FeaturedCarousel from "../../widgets/carousel/Carousel";
import SearchBarGrouped from "../../components/searchBar/SearchBarGrouped";

export const widgetRegistry = {
  userDashboard: DataBaseOverview,
  SearchBarGrouped: SearchBarGrouped,
  FeaturedCarousel: FeaturedCarousel,
  ArticleGrid: DataBaseOverview,
};
