import React from "react";
import BasicTimeline from "./BasicTimeLIne";
const Timeline = ({ events = [] }) => {
  // This component has its own internal logic for mapping 'events'
  const timelineMap = {
    title: "phase",
    date: "startDate",
    location: "location.city", // Uses dot notation
    description: "description",
  };

  return (
    <div>
      {events.map((event, i) => (
        <BasicTimeline
          key={i}
          title={event[timelineMap.title]}
          date={event[timelineMap.date]}
          location={
            event[timelineMap.location.split(".")[0]][
              timelineMap.location.split(".")[1]
            ]
          } // Simplified pathing
          description={event[timelineMap.description]}
        />
      ))}
    </div>
  );
};

export default Timeline;
