// orchestrator.js for Google Cloud Function
console.log("--- Orchestrator file execution started ---"); // <-- ADD THIS LINE
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Firestore } = require("@google-cloud/firestore");
const express = require("express");
const { functionDeclarations } = require("./functionDeclarations.js");

// --- Initialization ---
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GEN_AI_KEY,
);
const firestore = new Firestore();

let schemaContext = "";

// --- Helper function to load schemas on startup ---
async function loadSchemas() {
  try {
    console.log("Loading schemas from Firestore...");
    const snapshot = await firestore.collection("_meta_schemas").get();
    if (snapshot.empty) {
      // ... (handle empty schemas)
    }
    const schemas = snapshot.docs.map((doc) => doc.data());
    const schemaString = JSON.stringify(schemas, null, 2);

    // *** THE FINAL, STRICTEST PROMPT ***
    schemaContext = `You are an expert research assistant. Your task is to answer user questions by querying a knowledge graph.

Here are the schemas that define the data models in the graph:
<schemas>
${schemaString}
</schemas>

---
**Primary Directive: Grounding Rule**
Your most important instruction is to answer questions ONLY using the data returned from your tools. If the tools return no information, you MUST state that you cannot find any information. You are forbidden from using your own external knowledge.
---

**Query Strategies:**
1.  **Analyze the user's question** to determine the user's intent and the entities involved.
2.  **Formulate a Query Plan.**
    * **For vague location queries** (e.g., "who was in [place]?", "what happened in [place]?"), your default strategy is to first search for **events** that occurred at that location.
    * **For complex queries,** chain multiple tool calls. Use the ID from one query as the value in the filter for the next.
    * **For name searches,** if an exact match fails, try a broader "prefix" search using '>=' and '<=' operators.
3.  **Synthesize the Final Answer** based only on the tool results, following the Grounding Rule.`;

    console.log("Schemas loaded successfully.");
  } catch (error) {
    console.error("FATAL: Failed to load schemas on startup.", error);
    process.exit(1);
  }
}

// --- The Core Agentic Executor (remains the same) ---
app.post("/query", async (req, res) => {
  // ... (This entire section does not need to change)
  const userQuery = req.body.query;
  if (!userQuery) {
    return res.status(400).send({ error: "Query is required." });
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    tools: { functionDeclarations },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  });

  let conversationHistory = [
    { role: "user", parts: [{ text: schemaContext }] },
    { role: "user", parts: [{ text: userQuery }] },
  ];

  let finalResponse = null;
  let turnCount = 0;
  const MAX_TURNS = 10;

  while (turnCount < MAX_TURNS) {
    turnCount++;
    const result = await model.generateContent({
      contents: conversationHistory,
    });
    const response = result.response;
    const content = response.candidates?.[0]?.content;
    if (!content) {
      console.error("No content in response candidate.");
      return res
        .status(500)
        .send({ error: "Agent received an empty response from the AI." });
    }

    const call = content.parts.find((part) => part.functionCall)?.functionCall;

    if (call) {
      console.log(
        `🔄 Turn ${turnCount}: Agent wants to call tool '${call.name}' with args:`,
        call.args,
      );
      const toolResult = await executeTool(call.name, call.args);
      conversationHistory.push(
        { role: "model", parts: [{ functionCall: call }] },
        {
          role: "function",
          parts: [
            {
              functionResponse: {
                name: call.name,
                response: { result: toolResult },
              },
            },
          ],
        },
      );
    } else {
      console.log("✅ Loop finished. Generating final answer.");
      finalResponse = content.parts.map((part) => part.text).join("");
      break;
    }
  }

  if (finalResponse) {
    res.status(200).send({ answer: finalResponse });
  } else {
    res.status(500).send({
      error: "Agent could not determine an answer after multiple turns.",
    });
  }
});

// --- Tool Execution Logic (remains the same) ---
async function executeTool(toolName, args) {
  // ... (This function does not need to change)
  console.log(`   Executing tool '${toolName}' with args:`, args);
  switch (toolName) {
    case "findEntities":
      try {
        let query = firestore.collection(args.collection);
        if (args.filters && Array.isArray(args.filters)) {
          args.filters.forEach((filter) => {
            query = query.where(filter.field, filter.operator, filter.value);
          });
        }
        if (args.limit) {
          query = query.limit(args.limit);
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
          return [];
        }
        return snapshot.docs.map((doc) => doc.data());
      } catch (e) {
        console.error("Firestore query failed:", e);
        return {
          error: `Error executing query for ${args.collection}: ${e.message}`,
        };
      }
    case "findEventsByLocation":
      // ... (geo-query logic remains the same)
      return []; // Placeholder
    default:
      return { error: `Tool '${toolName}' not found.` };
  }
}

// --- Start Server and Load Schemas ---
loadSchemas().then(() => {
  console.log("Service is ready to accept requests.");
});

// Export the Express app as a Cloud Function
exports.agenticQueryEngine = app;
