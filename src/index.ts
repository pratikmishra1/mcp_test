import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "mcp-server-sample", version: "0.1.0" });

server.registerTool(
  "ping",
  {
    description: "Simple liveness check.",
    inputSchema: z.object({
      message: z.string().describe("Message to echo back."),
    }),
  },
  async (input) => ({
    message: `pong: ${input.message}`,
  })
);

server.registerTool(
  "time_now",
  {
    description: "Return the current server timestamp (ISO).",
    inputSchema: z.object({}),
  },
  async () => ({
    timestamp: new Date().toISOString(),
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server ready on stdio");
}

main().catch((err) => {
  console.error("Failed to start MCP server", err);
  process.exit(1);
});

