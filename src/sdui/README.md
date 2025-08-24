# **SDUI Mapping Engine: Developer's Guide**

Welcome to our Server-Driven UI (SDUI) system\! This guide explains how our backend transformation engine works. The goal of this system is to allow the server to control not only the data but also the structure and layout of the UI, providing maximum flexibility.  
At the heart of this system is the **Transformer**, a server-side function that generates a final UI blueprint by combining three key inputs.

## **Core Concepts 🧩**

Our SDUI system is built on three pillars:

1. **uiTemplate (The "What"):** A generic, data-agnostic JSON object that describes the structure of a UI component or an entire page. It uses generic placeholders for data (e.g., {{item.title}}).
2. **rawData (The "With"):** The raw JSON data fetched from our database or an external API (e.g., a list of users or stats).
3. **dataMap (The "How"):** The "instruction manual" or "bridge" that tells the transformer how to map the specific fields from the rawData to the generic placeholders in the uiTemplate.

The transformer takes these three inputs to produce the final uiBlueprint that is sent to the client renderer.

## **The dataMap Schema**

The dataMap is the most important part of the system. It defines the mapping rules.  
{  
 "source": "stats",  
 "bindings": {  
 "id": "collection",  
 "title": "collection | capitalize",  
 "cardType": "'statsCard'",  
 "dataObject": ".",  
 "subtitle": { /\* ... advanced rule ... \*/ }  
 }  
}

- **source**: A string indicating which top-level key in the rawData object contains the array of items to be mapped.
- **bindings**: An object where each key corresponds to a placeholder in the uiTemplate (e.g., title maps to {{item.title}}), and the value is the rule for how to get that data.

## **Binding Rules & Syntax**

The value of a binding can be a simple string that follows specific syntax rules.

### **1\. Direct Data Binding**

This is the most common rule. It maps a template placeholder directly to a data field.

- **Syntax:** "fieldName"
- **Example:** "title": "collection"
- **Result:** The transformer will look for the collection property on the current data item and use its value.

### **2\. Literal String Binding**

This rule tells the transformer to use the exact string value provided, rather than looking up a data field.

- **Syntax:** "'stringValue'" (Note the **single quotes** inside the double quotes)
- **Example:** "cardType": "'statsCard'"
- **Result:** The transformer will use the literal string statsCard. This is crucial for specifying which component template to use.

### **3\. Binding with Filters**

This rule transforms the data before it's placed in the UI.

- **Syntax:** "fieldName | filterName"
- **Example:** "title": "collection | capitalize"
- **Result:** The transformer gets the value from the collection field and then applies the capitalize filter to it.

### **4\. "Self" Binding (The Whole Object)**

This rule passes the entire raw data object for the current item.

- **Syntax:** "."
- **Example:** "dataObject": "."
- **Result:** The transformer will pass the full item object (e.g., { "collection": "stories", "documentCount": 12, ... }) to a data prop on the component.

## **Advanced Binding Objects**

For more complex transformations, a binding's value can be an object containing special directives (keys starting with \_\_).

### **\_\_format: Formatted Strings**

Constructs a single string from multiple data points.

- **Example:**  
  "subtitle": {  
   "\_\_format": "{count} Docs",  
   "bindings": {  
   "count": "documentCount"  
   }  
  }

- **Result:** The transformer resolves the nested count binding to get the value of documentCount (e.g., 12\) and injects it into the format string, producing "12 Docs".

### **\_\_forEach: Array Mapping**

Iterates over an array within the data item, extracts a value from each object, and joins the results.

- **Example:**  
  "detail": {  
   "\_\_format": "Top Tags: {tags}",  
   "bindings": {  
   "tags": {  
   "\_\_forEach": "topTags",  
   "template": "{{item.tag}}",  
   "\_\_join": ", "  
   }  
   }  
  }

- **Result:** The transformer finds the topTags array, maps over it, extracts the tag property from each object, and joins them with ", ". If topTags was \[{ "tag": "awesome" }, { "tag": "cool" }\], the result for {tags} would be "awesome, cool".

## **Quick Reference Table**

| Syntax          | Example                      | Purpose                           |
| :-------------- | :--------------------------- | :-------------------------------- | ----------- | ------------------------- |
| "fieldName"     | "title": "collection"        | Map to a data property.           |
| "'stringValue'" | "cardType": "'statsCard'"    | Use a literal string value.       |
| "fieldName      | filterName"                  | "title": "collection              | capitalize" | Transform the data value. |
| "."             | "dataObject": "."            | Pass the entire data item object. |
| \_\_format      | "\_\_format": "{count} Docs" | Create a formatted string.        |
| \_\_forEach     | "\_\_forEach": "topTags"     | Map over a nested array.          |
