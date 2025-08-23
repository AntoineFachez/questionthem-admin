/**
 * A helper function to safely retrieve a value from a nested object using a string path.
 * @param {object} obj The object to search within.
 * @param {string} path The string path (e.g., 'stats.stories.documentCount').
 * @returns {*} The value found at the path, or undefined if not found.
 */
function getValueByPath(obj, path) {
  // Split the path into an array of keys and traverse the object
  return path.split(".").reduce((currentObject, key) => {
    // If the current object is valid and has the key, move to the next level
    return currentObject && currentObject[key] !== undefined
      ? currentObject[key]
      : undefined;
  }, obj);
}

/**
 * Transforms raw data into a UI blueprint using a view model.
 * @param {object} rawData The raw, nested data object from the server.
 * @param {object} viewModel The configuration object that defines the transformation.
 * @returns {object} The final UI blueprint object ready to be sent to the client.
 */
export function generateUIBlueprint(rawData, viewModel) {
  // 1. Map over the transformation rules defined in the viewModel
  const data = viewModel.mappings.map((mapping) => {
    // 2. For each mapping, get the value from the rawData using its sourcePath
    let value = getValueByPath(rawData, mapping.sourcePath);

    // 3. Handle special formatting for empty or null values if a rule exists
    const isEmptyArray = Array.isArray(value) && value.length === 0;
    const isNullOrUndefined = value === null || value === undefined;

    if ((isEmptyArray || isNullOrUndefined) && mapping.formatIfEmpty) {
      value = mapping.formatIfEmpty;
    }

    // 4. Construct the flat data row object required by the UI component
    return {
      metric: mapping.metricLabel,
      value: value,
    };
  });

  // 5. Assemble the final UI blueprint object
  return {
    component: viewModel.targetComponent,
    props: {
      columns: viewModel.columns,
      data: data,
    },
  };
}
