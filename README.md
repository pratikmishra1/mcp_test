# MCP Server Sample

Minimal Model Context Protocol server for security training. Focus on intentionally vulnerable behaviors; keep it isolated and never deploy.

## Setup

```
cd /Users/pratik.mishra/Documents/mcp_test
npm install --cache ./.npm-cache --no-progress
```

The custom cache directory keeps npm writes inside the workspace sandbox.

## Intentionally vulnerable MCP server (for training only)

**Do not deploy.** This variant exposes obvious security flaws to practice review/exploitation.

```
npm run dev        # runs src/vulnerable.ts
npm run build      # emits dist/vulnerable.js
npm start          # runs compiled vulnerable server
```

Tools and vulnerabilities:
- `shell_exec`: arbitrary command execution / command injection.
- `read_file_unsafe`: path traversal / arbitrary file read.
- `write_file_unsafe`: arbitrary file write/overwrite.
- `http_fetch_unsafe`: SSRF to arbitrary URL.
- `leak_env`: leaks all environment variables/secrets.
- `eval_js`: arbitrary code execution via `eval`.
- `prompt_poison`: prompt/tool poisoning payload to subvert the agent.
- `arm_rug_pull` + `trusted_info`: benign until armed, then exfiltrates secrets.
- `register_tool_unsafe`: dynamically registers tools from untrusted code (supply-chain/rug pull).
- `override_tool`: overwrites existing tools with attacker-supplied handlers.
- `list_tools_poisoned`: returns misleading tool metadata to trick agents.

## Minimal demo MCP client (for training)

Spawns the vulnerable server and issues sample unsafe calls (env leak, file read, rug pull).

```
npm run dev:client
```

## Scanning with mcp-scan

This server is designed to be scanned with [mcp-scan](https://github.com/invariantlabs-ai/mcp-scan) to detect security vulnerabilities.

### Install mcp-scan

```bash
pipx install mcp-scan
# Or: pip install mcp-scan
```

### Scan commands

**Inspect tools without verification:**
```bash
~/.local/bin/mcp-scan inspect --server-timeout 15 mcp.json
```

**Full security scan (with --opt-out to skip API if it times out):**
```bash
~/.local/bin/mcp-scan scan --opt-out --full-toxic-flows --server-timeout 15 --print-errors mcp.json
```

**Full scan with API verification (if API is available):**
```bash
~/.local/bin/mcp-scan scan --full-toxic-flows --server-timeout 15 --print-errors mcp.json
```

**JSON output:**
```bash
~/.local/bin/mcp-scan scan --opt-out --json --full-toxic-flows --server-timeout 15 mcp.json > mcp_scan_report.json
```

Note: If `~/.local/bin` is not in your PATH, run `pipx ensurepath` or use the full path as shown above.

