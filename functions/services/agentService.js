// functions/services/agentService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  functionDeclarations,
} = require("../agenticEngine/functionDeclarations.js");
const { getSchemaContext } = require("./schemaService");
const { executeTool } = require("./toolService");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest", // Updated model
  tools: { functionDeclarations },
});

const MAX_TURNS = 10;

/**
 * Runs the agentic loop to answer a user's query.
 * @param {object} options - The options for running the query.
 * @param {object} options.logger - The Firebase Functions logger instance.
 * @param {string} options.userQuery - The user's question.
 * @returns {Promise<string>} The final text answer from the agent.
 */
async function runAgentQuery({ logger, userQuery }) {
  const context = await getSchemaContext(logger);
  let conversationHistory = [
    { role: "user", parts: [{ text: context }] },
    { role: "user", parts: [{ text: userQuery }] },
  ];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const result = await model.generateContent({
      contents: conversationHistory,
    });
    const content = result.response.candidates?.[0]?.content;
    if (!content) {
      throw new Error("Agent received an empty response from the AI.");
    }

    const functionCall = content.parts.find(
      (part) => part.functionCall,
    )?.functionCall;

    if (functionCall) {
      logger.info(
        `🔄 Turn ${turn + 1}: Agent wants to call tool '${functionCall.name}'`,
      );
      const toolResult = await executeTool({
        logger,
        toolName: functionCall.name,
        args: functionCall.args,
      });
      conversationHistory.push(
        { role: "model", parts: [{ functionCall }] },
        {
          role: "function",
          parts: [
            {
              functionResponse: {
                name: functionCall.name,
                response: { result: toolResult },
              },
            },
          ],
        },
      );
    } else {
      logger.info("✅ Loop finished. Generating final answer.");
      return content.parts.map((part) => part.text).join("");
    }
  }

  throw new Error("Agent could not determine an answer after multiple turns.");
}

module.exports = { runAgentQuery };
