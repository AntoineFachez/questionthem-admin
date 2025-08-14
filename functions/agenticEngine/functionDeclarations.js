module.exports = [
  {
    name: "findEntities",
    description:
      "Finds entities (like persons, events, organizations) in the knowledge graph based on a set of filters.",
    parameters: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "The type of entity to search for.",
          enum: ["persons", "events", "organizations", "companies"], // Add all your entity types
        },
        filters: {
          type: "array",
          description: "A list of filters to apply to the query.",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                description:
                  "The document field to filter on, using dot notation for nested fields (e.g., 'primary_location.city').",
              },
              operator: {
                type: "string",
                description: "The comparison operator.",
                enum: [
                  "==",
                  "!=",
                  "<",
                  "<=",
                  ">",
                  ">=",
                  "array-contains",
                  "in",
                  "array-contains-any",
                ],
              },
              value: {
                type: "any",
                description: "The value to compare against.",
              },
            },
            required: ["field", "operator", "value"],
          },
        },
        limit: {
          type: "integer",
          description: "The maximum number of results to return.",
        },
      },
      required: ["collection", "filters"],
    },
  },
  {
    name: "findEventsByLocation",
    description:
      "Finds events that occurred within a certain radius of a geographic coordinate.",
    parameters: {
      type: "object",
      properties: {
        center_coords: {
          type: "object",
          description:
            "The latitude and longitude of the center of the search area.",
          properties: {
            lat: { type: "number" },
            lng: { type: "number" },
          },
          required: ["lat", "lng"],
        },
        radius_km: {
          type: "number",
          description: "The search radius in kilometers.",
        },
        limit: { type: "integer" },
      },
      required: ["center_coords", "radius_km"],
    },
  },
];
