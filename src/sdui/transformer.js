import componentTemplates from "./templates/organisms.json";

/**
 * Generates a final, renderable UI blueprint by hydrating a generic template with raw data,
 * guided by a data map. This is the core engine of the SDUI system.
 * @param {object} uiTemplate - The generic UI structure, containing placeholders.
 * @param {object} rawData - The raw data object from an API, containing arrays of items.
 * @param {object} dataMap - The schema that maps rawData fields to uiTemplate placeholders.
 * @param {object | null} itemInFocus - The currently selected item's data, used for conditional styling.
 * @returns {object} The final, hydrated UI blueprint ready for the client-side renderer.
 */
export function generateBlueprint(
  uiTemplate,
  rawData,
  dataMap,
  itemInFocus,
  expandedItems,
  menuAnchor,
  widgetProps,
  options
) {
  const generationContext = {
    uiTemplate: options.uiTemplate,
    rawData: options.rawData,
    dataMap: options.dataMap,
    clientState: {
      itemInFocus: options.itemInFocus,
      expandedItems: options.expandedItems,
      menuAnchor: options.menuAnchor,
    },
    widgetProps: options.widgetProps,
  };
  // --- Block 1: Initial Input Validation & Error Helper ---
  // Ensures that all necessary inputs are provided and valid before processing begins.
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
  if (!dataMap || !dataMap.source || !dataMap.bindings) {
    console.error(
      "generateBlueprint Error: `dataMap` is invalid or incomplete.",
      { dataMap }
    );
    return createErrorBlueprint("Data Map is missing or invalid.");
  }

  /**
   * Creates a fallback UI blueprint to display a visible error on the client
   * in case of a critical failure during generation.
   * @param {string} message - The error message to display.
   * @returns {object} A valid UI blueprint for an error component.
   */
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
        { type: "atom.typography", props: { color: "error", text: message } },
      ],
    };
  }

  // --- Block 2: Directive Handlers ---
  // A registry that contains the logic for handling special keywords (directives)
  // found in the templates. This keeps the core engine clean and extensible.
  const directiveHandlers = {
    /**
     * Handles template composition by replacing itself with another template from the library.
     */
    __includeTemplate: (node, contextData) => {
      const placeholderString = node.__includeTemplate;
      const placeholder = placeholderString.match(/\{\{(\w+\.\w+)\}\}/)?.[1];

      if (!placeholder) {
        console.warn("Invalid __includeTemplate format:", placeholderString);
        return null;
      }

      const templateName = resolvePlaceholder(
        placeholder,
        contextData.item,
        dataMap.bindings,
        contextData,
        widgetProps
      );
      const templateToInclude = componentTemplates[templateName];

      if (!templateToInclude) {
        console.warn(`Template "${templateName}" not found.`);
        return null;
      }
      // Recursively hydrate the included template with the same data context.
      return hydrateNode(templateToInclude, contextData);
    },

    /**
     * Handles list rendering by iterating over a data array and hydrating a
     * template for each item.
     */
    __mapOver: (node, contextData) => {
      // Use the `dataMap.source` to get the correct array from the rawData object.

      if (!Array.isArray(rawData)) {
        console.warn(`Expected 'rawData.${dataMap.source}' to be an array.`);
        return [];
      }
      const itemTemplate = node.__template;
      // Map over the source array, hydrating the item template for each item.
      return rawData.map((item, index) =>
        hydrateNode(itemTemplate, { ...contextData, item, index: index })
      );
    },

    /**
     * Handles conditional rendering, typically for styling, based on whether
     * the current item is the one "in focus" (selected).
     */
    __if_selected: (node, contextData) => {
      const currentItemId = contextData.item
        ? resolvePlaceholder(
            "item.id",
            contextData.item,
            dataMap.bindings,
            contextData,
            widgetProps
          )
        : null;
      const selectedItemId = itemInFocus ? itemInFocus.selectedId : null;

      if (currentItemId && currentItemId === selectedItemId) {
        return hydrateNode(node.__if_selected.then, contextData);
      } else {
        return hydrateNode(node.__if_selected.else, contextData);
      }
    },
  };

  // --- Block 3: The Core Recursive Engine (Hydrate Node) ---
  /**
   * Recursively walks through a template node (object, array, or primitive) and
   * processes it. It acts as a dispatcher, handing off special nodes to the
   * directive handlers or processing standard objects by hydrating their values.
   * @param {*} node - The current part of the template being processed.
   * @param {object} contextData - The current data context (includes the full rawData and the specific 'item' if inside a loop).
   * @returns {*} The hydrated version of the node.
   */
  function hydrateNode(node, contextData) {
    if (Array.isArray(node)) {
      return node.map((item) => hydrateNode(item, contextData));
    }
    if (typeof node !== "object" || node === null) {
      return node;
    }

    // Check if the node contains a known directive and dispatch to the handler if so.
    const directiveKey = Object.keys(directiveHandlers).find((key) =>
      node.hasOwnProperty(key)
    );
    if (directiveKey) {
      return directiveHandlers[directiveKey](node, contextData);
    }

    // If no directive is found, it's a standard object. Process its properties.
    const result = {};
    for (const key in node) {
      const value = node[key];
      if (typeof value === "string" && value.includes("{{")) {
        // Check if the string is a single, standalone placeholder.
        const match = value.match(/^\{\{(\w+\.\w+)\}\}$/);
        if (match) {
          // If so, resolve it directly to preserve its data type (e.g., an object).
          result[key] = resolvePlaceholder(
            match[1],
            contextData.item,
            dataMap.bindings,
            contextData,
            widgetProps
          );
        } else {
          // Otherwise, it's a string with embedded placeholders; use .replace().
          result[key] = value.replace(
            /\{\{(\w+\.\w+)\}\}/g,
            (match, placeholder) => {
              return resolvePlaceholder(
                placeholder,
                contextData.item,
                dataMap.bindings,
                contextData,
                widgetProps
              );
            }
          );
        }
      } else {
        // If it's not a string with a placeholder, or it's a nested object, recurse.
        result[key] = hydrateNode(value, contextData);
      }
    }
    return result;
  }

  // --- Block 4: Placeholder Resolver ---
  /**
   * Resolves a single placeholder string (e.g., "item.title") into its final value
   * by using the rules defined in the dataMap's bindings.
   * @param {string} placeholder - The placeholder to resolve (e.g., "item.title").
   * @param {object} item - The specific data item for the current context.
   * @param {object} bindingsContext - The set of binding rules to use for resolution.
   * @returns {*} The final resolved value (can be a string, object, etc.).
   */
  function resolvePlaceholder(
    placeholder,
    item,
    bindingsContext,
    contextData,
    widgetProps
  ) {
    if (!item) return placeholder;
    const [context, prop] = placeholder.split(".");

    // Case 1: The rule is a client-side state placeholders.
    if (prop === "isExpanded") {
      const itemId = resolvePlaceholder(
        "item.id",
        item,
        bindingsContext,
        contextData,
        widgetProps
      );
      return !!expandedItems[itemId];
    }
    if (context === "widget") {
      // If the placeholder is asking for 'widgetProps', return the whole object.
      if (prop === "widgetProps") {
        return widgetProps;
      }
      if (prop === "tableHeader") {
        // Use the 'tableHeadType' from the dataMap to find the template name
        const templateName = dataMap.bindings.tableHeadType.slice(1, -1); // Removes single quotes
        return templateName;
      }
      // You could add more app-level props here later if needed.
      return `[Unknown widget prop: ${prop}]`;
    }
    if (prop === "isMenuOpen") {
      // The menu is open if the anchor is not null
      return !!menuAnchor;
    }
    if (prop === "menuAnchor") {
      // Pass the anchor element object directly
      return menuAnchor;
    }
    if (prop === "closeMenuAction") {
      // Return a blueprint for the onClose action
      return { type: "TOGGLE_MENU", payload: {} };
    }
    if (context === "context") {
      if (contextData && contextData.hasOwnProperty(prop)) {
        return contextData[prop]; // Returns the index from the context
      }
      return `[Unknown context: ${prop}]`;
    }
    const bindingRule = bindingsContext[prop];
    if (context !== "item" || !bindingRule) return placeholder;

    // Case 2: The rule is a simple string.
    if (typeof bindingRule === "string") {
      // Handle literal strings (e.g., "'statsCard'").
      if (bindingRule.startsWith("'") && bindingRule.endsWith("'"))
        return bindingRule.slice(1, -1);
      // Handle "self" binding (e.g., ".").
      if (bindingRule === ".") return item;
      // Handle standard data field lookups with optional filters.
      let [dataField, filter] = bindingRule.split(/\s*\|\s*/);
      if (!item.hasOwnProperty(dataField)) return `[Missing ${dataField}]`;
      let value = item[dataField];
      if (filter === "capitalize")
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
      if (filter === "toLocaleDateString")
        return new Date(value).toLocaleDateString();
      return value;
    }

    // Case 3: The rule is a complex object with its own directives.
    if (typeof bindingRule === "object" && bindingRule !== null) {
      // Handle formatted strings.
      if (bindingRule.__format) {
        let formattedString = bindingRule.__format;
        for (const key in bindingRule.bindings) {
          const nestedPlaceholder = `item.${key}`;
          const resolvedValue = resolvePlaceholder(
            nestedPlaceholder,
            item,
            bindingRule.bindings,
            contextData,
            widgetProps
          );
          formattedString = formattedString.replace(`{${key}}`, resolvedValue);
        }
        return formattedString;
      }
      // Handle nested array mapping.
      if (bindingRule.__forEach) {
        const sourceArray = item[bindingRule.__forEach];
        if (!Array.isArray(sourceArray)) return "";
        const mappedArray = sourceArray.map((subItem) =>
          bindingRule.template.replace(
            /\{\{item\.(\w+)\}\}/g,
            (match, prop) => subItem[prop] || ""
          )
        );
        return mappedArray.join(bindingRule.__join || "");
      }
    }

    return placeholder;
  }
  console.log("generationContext", rawData === generationContext.rawData);

  // --- Start the process ---
  // Kick off the recursion with the top-level template and the global rawData object.
  // return hydrateNode(uiTemplate, rawData);
  return hydrateNode(generationContext.uiTemplate, generationContext.rawData);
}
