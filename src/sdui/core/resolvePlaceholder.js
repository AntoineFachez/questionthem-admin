// --- Block 4: Placeholder Resolver ---
/**
 * Resolves a single placeholder string (e.g., "item.title") into its final value
 * by using the rules defined in the dataMap's bindings.
 * @param {string} placeholder - The placeholder to resolve (e.g., "item.title").
 * @param {object} item - The specific data item for the current context.
 * @param {object} bindingsContext - The set of binding rules to use for resolution.
 * @returns {*} The final resolved value (can be a string, object, etc.).
 */
export function resolvePlaceholder(
  placeholder,
  item,
  bindingsContext,
  contextData,
  widgetProps,
  options
) {
  const expandedItems = options.expandedItems;
  const menuAnchor = options.menuAnchor;
  const [context, prop] = placeholder.split(".");

  if (context === "context") {
    if (contextData && contextData.hasOwnProperty(prop)) {
      return contextData[prop]; // Returns the index from the context
    }

    return `[Unknown context: ${prop}]`;
  }
  if (context === "widget") {
    // If the placeholder is asking for 'widgetProps', return the whole object.
    if (prop === "widgetProps") {
      return widgetProps;
    }

    // You could add more app-level props here later if needed.
    return `[Unknown widget prop: ${prop}]`;
  }
  if (context === "template") {
    const templateName = options.dataMap.bindings[prop].slice(1, -1);
    if (templateName) return templateName;

    // You could add more app-level props here later if needed.
    return `[Unknown template: ${prop}]`;
  }

  if (!item) return placeholder;

  // Case 1: The rule is a client-side state placeholders.
  if (prop === "isExpanded") {
    const itemId = resolvePlaceholder(
      "item.id",
      item,
      bindingsContext,
      contextData,
      widgetProps,
      options
    );
    return !!expandedItems[itemId];
  }
  const bindingRule = bindingsContext[prop];

  if (prop === "dataObject") {
    // console.log("parentProps", options, prop === "dataObject", contextData);
    // console.log("parentProps", options.rawData);
    // Get the source key from the dataMap (e.g., "stats")
    // and return the corresponding array from the rawData.
    return options.rawData || [];
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
          widgetProps,
          options
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
