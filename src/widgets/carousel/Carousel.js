import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const gcloudFnsUrl =
  "https://europe-west1-questionthem-90ccf.cloudfunctions.net";

// A component that fetches its own data, as defined by the server blueprint
const FeaturedCarousel = ({ props }) => {
  const { dataSource } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    // This widget is now responsible for its own data fetching
    fetch(`${gcloudFnsUrl}${dataSource}`)
      .then((res) => res.json())
      .then(setData);
  }, [dataSource]);

  if (!data) return <CircularProgress />;

  // Render the actual carousel with the fetched data
  return <Box>Your Carousel with {data.length} items goes here.</Box>;
};
export default FeaturedCarousel;
