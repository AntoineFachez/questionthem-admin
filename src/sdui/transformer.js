/**
 * Generates a final UI blueprint from a generic template, raw data, and a data map.
 * Includes robust error handling and descriptive logging.
 */
export function generateBlueprint(uiTemplate, rawData, dataMap) {
  // --- 1. Initial Input Validation ---
  if (!uiTemplate || typeof uiTemplate !== "object") {
    console.error("generateBlueprint Error: `uiTemplate` is invalid.", {
      uiTemplate,
    });
    return createErrorBlueprint("UI Template is missing or invalid.");
  }
  if (!rawData || typeof rawData !== "object") {
    console.error("generateBlueprint Error: `rawData` is invalid.", {
      rawData,
    });
    return createErrorBlueprint("Raw Data is missing or invalid.");
  }
  if (
    !dataMap ||
    typeof dataMap !== "object" ||
    !dataMap.source ||
    !dataMap.bindings
  ) {
    console.error(
      "generateBlueprint Error: `dataMap` is invalid or incomplete.",
      { dataMap }
    );
    return createErrorBlueprint("Data Map is missing or invalid.");
  }

  // This is the core recursive engine.
  function hydrateNode(node, contextData) {
    if (Array.isArray(node)) {
      return node.map((item) => hydrateNode(item, contextData));
    }
    if (typeof node !== "object" || node === null) {
      return node;
    }
    if (node.__mapOver) {
      const sourceArray = rawData[dataMap.source];
      // --- 2. Source Array Validation ---
      if (!Array.isArray(sourceArray)) {
        console.warn(
          `hydrateNode Warning: Expected 'rawData.${dataMap.source}' to be an array, but found:`,
          sourceArray
        );
        return []; // Return an empty array to prevent crashing
      }
      const itemTemplate = node.__template;
      return sourceArray.map((item) =>
        hydrateNode(itemTemplate, { ...contextData, item })
      );
    }
    const result = {};
    for (const key in node) {
      const value = node[key];
      if (typeof value === "string") {
        result[key] = value.replace(
          /\{\{(\w+\.\w+)\}\}/g,
          (match, placeholder) => {
            return resolvePlaceholder(
              placeholder,
              contextData.item,
              dataMap.bindings
            ); // CHANGED
          }
        );
      } else {
        result[key] = hydrateNode(value, contextData);
      }
    }
    return result;
  }

  // This helper resolves placeholders with added safety checks.
  function resolvePlaceholder(placeholder, item, bindingsContext) {
    // CHANGED: Added bindingsContext
    if (!item) {
      console.warn(
        `resolvePlaceholder Warning: No 'item' context for placeholder '${placeholder}'.`
      );
      return placeholder;
    }

    const [context, prop] = placeholder.split(".");
    // Use the passed-in context to find the rule, not the global dataMap
    const bindingRule = bindingsContext[prop]; // CHANGED

    if (context !== "item" || !bindingRule) {
      console.warn(
        `resolvePlaceholder Warning: No binding rule found for placeholder '${placeholder}' in the current context.`
      );
      return placeholder;
    }

    if (typeof bindingRule === "string") {
      let [dataField, filter] = bindingRule.split(/\s*\|\s*/);
      if (!item.hasOwnProperty(dataField)) {
        console.warn(
          `resolvePlaceholder Warning: Data item is missing property '${dataField}' for placeholder '${placeholder}'.`,
          { item }
        );
        return `[Missing ${dataField}]`;
      }
      let value = item[dataField];
      if (filter === "capitalize")
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
      if (filter === "toLocaleDateString")
        return new Date(value).toLocaleDateString();
      return value;
    }

    if (typeof bindingRule === "object" && bindingRule !== null) {
      if (bindingRule.__format) {
        let formattedString = bindingRule.__format;
        for (const key in bindingRule.bindings) {
          const nestedPlaceholder = `item.${key}`;
          // Pass the nested bindings as the new context for the recursive call
          const resolvedValue = resolvePlaceholder(
            nestedPlaceholder,
            item,
            bindingRule.bindings
          ); // CHANGED
          formattedString = formattedString.replace(`{${key}}`, resolvedValue);
        }
        return formattedString;
      }
      if (bindingRule.__forEach) {
        const sourceArray = item[bindingRule.__forEach];
        if (!Array.isArray(sourceArray)) {
          console.warn(
            `resolvePlaceholder Warning: Expected '${bindingRule.__forEach}' to be an array for placeholder '${placeholder}', but found:`,
            { sourceArray }
          );
          return "";
        }
        const mappedArray = sourceArray.map((subItem) => {
          return bindingRule.template.replace(
            /\{\{item\.(\w+)\}\}/g,
            (match, prop) => {
              if (!subItem.hasOwnProperty(prop)) {
                console.warn(
                  `resolvePlaceholder Warning: Sub-item in '__forEach' is missing property '${prop}'.`,
                  { subItem }
                );
                return `[Missing ${prop}]`;
              }
              return subItem[prop];
            }
          );
        });
        return mappedArray.join(bindingRule.__join || "");
      }
    }

    console.warn(
      `resolvePlaceholder Warning: Unhandled binding rule for placeholder '${placeholder}'.`,
      { bindingRule }
    );
    return placeholder;
  }

  // Helper to create a fallback UI on critical failure.
  function createErrorBlueprint(message) {
    return {
      type: "atom.box",
      props: {
        sx: { padding: 4, border: "2px solid red", backgroundColor: "#ffeeee" },
      },
      children: [
        {
          type: "atom.typography",
          props: {
            variant: "h5",
            color: "error",
            text: "SDUI Generation Failed",
          },
        },
        {
          type: "atom.typography",
          props: { color: "error", text: message },
        },
      ],
    };
  }

  // --- Start the process ---
  return hydrateNode(uiTemplate, rawData);
}
