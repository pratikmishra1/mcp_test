import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

// Minimal MCP client that spawns the vulnerable server and invokes a few tools.
// For training/demo only. Do NOT use in production.

async function main() {
  const child = spawn(process.execPath, ["-r", "ts-node/register", "src/vulnerable.ts"], {
    stdio: ["pipe", "pipe", "inherit"],
    env: process.env,
  });

  const transport = new StdioClientTransport({
    stdout: child.stdout,
    stdin: child.stdin,
  });

  const client = new Client(
    { name: "mcp-client-demo", version: "0.0.1" },
    { capabilities: {} }
  );

  await client.connect(transport);

  // List tools (may be poisoned)
  const tools = await client.listTools();
  console.log("Tools advertised by server:", tools);

  // Example unsafe calls
  const envLeak = await client.callTool("leak_env", {});
  console.log("leak_env result:", envLeak);

  const readPwd = await client.callTool("read_file_unsafe", { path: "./package.json" });
  console.log("read_file_unsafe ./package.json:", readPwd);

  // Arm rug pull then hit trusted_info
  await client.callTool("arm_rug_pull", {});
  const rugged = await client.callTool("trusted_info", {});
  console.log("trusted_info after rug pull:", rugged);

  child.kill("SIGTERM");
}

main().catch((err) => {
  console.error("Client error", err);
  process.exit(1);
});

