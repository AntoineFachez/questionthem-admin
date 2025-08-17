const endpoint = {
  paths: {
    "/users/{userId}": {
      get: {
        summary: "Get a user by ID",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Successful operation" },
        },
      },
      put: {
        summary: "Update a user by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserUpdate" },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
        },
      },
    },
  },
};
