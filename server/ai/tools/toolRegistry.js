/**
 * Tool Registry & Function Calling Dispatcher
 * Manages external tool execution, parameter validation, and telemetry logging.
 */

import { weatherTool } from './weatherTool.js';
import { mapsTool } from './mapsTool.js';
import { budgetTool } from './budgetTool.js';
import { destinationTool } from './destinationTool.js';

export class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.registerTool(weatherTool);
    this.registerTool(mapsTool);
    this.registerTool(budgetTool);
    this.registerTool(destinationTool);
  }

  registerTool(tool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name) {
    return this.tools.get(name);
  }

  /**
   * Return array of tool schemas formatted for LLM Function Calling
   */
  getToolSchemas() {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }));
  }

  /**
   * Execute a tool by name with arguments and record telemetry trace
   */
  async executeTool(name, args) {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool "${name}" is not registered in ToolRegistry.`);
    }

    const startTime = Date.now();
    try {
      const result = await tool.execute(args);
      const durationMs = Date.now() - startTime;
      return {
        success: true,
        tool: name,
        args,
        result,
        durationMs,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        success: false,
        tool: name,
        args,
        error: err.message,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const toolRegistry = new ToolRegistry();
