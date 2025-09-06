#!/usr/bin/env node

/**
 * MCP Playwright 测试脚本
 * 用于验证Playwright MCP服务器是否正常工作
 */

const { spawn } = require('child_process');

console.log('🚀 启动Playwright MCP测试...\n');

// 测试Playwright MCP服务器
const playwrightMCP = spawn('npx', ['-y', '@playwright/mcp'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'production' }
});

playwrightMCP.stdout.on('data', (data) => {
  console.log('📤 Playwright MCP输出:', data.toString());
});

playwrightMCP.stderr.on('data', (data) => {
  console.log('⚠️  Playwright MCP错误:', data.toString());
});

playwrightMCP.on('close', (code) => {
  console.log(`\n✅ Playwright MCP进程结束，退出码: ${code}`);
});

// 发送测试消息
setTimeout(() => {
  console.log('\n📝 发送测试消息到Playwright MCP...');
  
  const testMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  playwrightMCP.stdin.write(JSON.stringify(testMessage) + '\n');
}, 2000);

// 5秒后关闭测试
setTimeout(() => {
  console.log('\n🛑 结束测试...');
  playwrightMCP.kill();
  process.exit(0);
}, 5000);
