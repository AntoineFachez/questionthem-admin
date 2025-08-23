export function transformStatsToBlueprint(rawData) {
  const statCards = rawData.stats.map((data) => {
    console.log("data", data);

    return {
      component: "StatCard",
      props: {
        title: data.collection,
        count: data.documentCount,
        lastUpdated: data.lastUpdated,
      },
    };
  });

  return {
    component: "Box",
    props: {
      style: {
        display: "flex",
        flexWrap: "wrap",
        fontFamily: "sans-serif",
      },
    },
    children: statCards,
  };
}
