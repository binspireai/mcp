import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPTransport } from "@hono/mcp";
import { config } from "dotenv";
import { Hono } from "hono";
import { registerAuditTools } from "./tools/audit";
import { registerHistoryTools } from "./tools/history";
import { registerIssueTools } from "./tools/issue";

config({ path: ".env" });

function createMCPServer() {
  const mcpServer = new McpServer({
    name: "Binspire MCP Server",
    version: "1.0.0",
  });

  return mcpServer;
}

export const server = createMCPServer();
const transport = new StreamableHTTPTransport();
const TRANSPORT_TYPE = process.env.TRANSPORT || "stdio";

registerAuditTools(server);
registerHistoryTools(server);
registerIssueTools(server);

async function main() {
  if (TRANSPORT_TYPE === "stdio") {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Binspire MCP Server running on stdio");
  } else {
    const app = new Hono({ strict: false }).all("/mcp", async (c) => {
      if (!server.isConnected()) {
        await server.connect(transport);
      }

      return transport.handleRequest(c);
    });

    const port = Number(process.env.PORT) || 3000;

    console.log(
      `Binspire MCP HTTP Server listening on http://localhost:${port}/mcp`,
    );

    Bun.serve({
      idleTimeout: 255,
      port,
      fetch: app.fetch,
    });
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
