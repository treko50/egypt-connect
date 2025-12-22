/**
 * Multi-Agent Service Client SDK for Egypt Connect
 * 
 * This client provides a simple interface to interact with the centralized
 * multi-agent service for application development and orchestration.
 */

export interface AgentInfo {
  name: string;
  role: string;
}

export interface OrchestrateRequest {
  taskDescription: string;
  context?: Record<string, any>;
  agents?: string[];
  maxIterations?: number;
  timeout?: number;
}

export interface AgentTask {
  id: string;
  agentName: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface OrchestrateResponse {
  success: boolean;
  taskId: string;
  result?: any;
  tasks: AgentTask[];
  executionTime: number;
  error?: string;
}

export interface ExecuteAgentRequest {
  agentName: string;
  task: string;
  context?: Record<string, any>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ExecuteAgentResponse {
  success: boolean;
  agentName: string;
  result: any;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  executionTime: number;
  error?: string;
}

export interface MultiAgentClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class MultiAgentClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(config: MultiAgentClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 300000; // 5 minutes default
  }

  /**
   * Get list of available agents
   */
  async listAgents(): Promise<AgentInfo[]> {
    const response = await this.fetch('/api/agents', {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to list agents');
    }

    return response.agents;
  }

  /**
   * Get detailed information about a specific agent
   */
  async getAgent(name: string): Promise<any> {
    const response = await this.fetch(`/api/agents/${name}`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.error || `Failed to get agent: ${name}`);
    }

    return response.agent;
  }

  /**
   * Execute a single agent task
   */
  async executeAgent(request: ExecuteAgentRequest): Promise<ExecuteAgentResponse> {
    const response = await this.fetch('/api/agents/execute', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response;
  }

  /**
   * Orchestrate a multi-agent task
   */
  async orchestrate(request: OrchestrateRequest): Promise<OrchestrateResponse> {
    const response = await this.fetch('/api/orchestrate', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response;
  }

  /**
   * Build an application using the multi-agent system
   * This uses planner, coder, reviewer, and integrator agents
   */
  async buildApplication(spec: {
    name: string;
    description: string;
    features: string[];
    techStack?: {
      frontend?: string;
      backend?: string;
      database?: string;
      [key: string]: any;
    };
    context?: Record<string, any>;
  }): Promise<OrchestrateResponse> {
    const taskDescription = `
Build a complete application with the following specifications:

**Application Name**: ${spec.name}
**Description**: ${spec.description}

**Features**:
${spec.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

${spec.techStack ? `**Tech Stack**:
${Object.entries(spec.techStack).map(([key, value]) => `- ${key}: ${value}`).join('\n')}` : ''}

**Requirements**:
1. Use the planner agent to break down the application into components
2. Use the coder agent to implement features
3. Use the reviewer agent to ensure code quality
4. Use the integrator agent to connect all components
5. Ensure the application is production-ready with proper error handling, testing, and documentation

Provide complete code, configuration files, and deployment instructions.
    `.trim();

    return this.orchestrate({
      taskDescription,
      context: {
        ...spec.context,
        applicationType: 'full-application',
        buildMode: 'comprehensive',
      },
      agents: ['planner', 'coder', 'reviewer', 'integrator'],
      maxIterations: 15,
      timeout: 600000, // 10 minutes for application builds
    });
  }

  /**
   * Plan a task using the planner agent
   */
  async planTask(taskDescription: string, context?: Record<string, any>): Promise<ExecuteAgentResponse> {
    return this.executeAgent({
      agentName: 'planner',
      task: taskDescription,
      context,
    });
  }

  /**
   * Generate code using the coder agent
   */
  async generateCode(specification: string, context?: Record<string, any>): Promise<ExecuteAgentResponse> {
    return this.executeAgent({
      agentName: 'coder',
      task: specification,
      context,
    });
  }

  /**
   * Review code using the reviewer agent
   */
  async reviewCode(code: string, context?: Record<string, any>): Promise<ExecuteAgentResponse> {
    return this.executeAgent({
      agentName: 'reviewer',
      task: `Review the following code:\n\n${code}`,
      context,
    });
  }

  /**
   * Integrate components using the integrator agent
   */
  async integrateComponents(components: any[], context?: Record<string, any>): Promise<ExecuteAgentResponse> {
    return this.executeAgent({
      agentName: 'integrator',
      task: `Integrate the following components:\n\n${JSON.stringify(components, null, 2)}`,
      context,
    });
  }

  /**
   * Check service health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetch('/health', {
        method: 'GET',
      });
      return response.success && response.status === 'healthy';
    } catch {
      return false;
    }
  }

  private async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('Unknown error');
    }
  }
}

// Singleton instance for the application
let clientInstance: MultiAgentClient | null = null;

export function getMultiAgentClient(): MultiAgentClient {
  if (!clientInstance) {
    clientInstance = new MultiAgentClient({
      baseUrl: process.env.MULTI_AGENT_SERVICE_URL || 'http://localhost:3001',
      apiKey: process.env.MULTI_AGENT_API_KEY,
      timeout: 300000,
    });
  }
  return clientInstance;
}

export function createMultiAgentClient(config: MultiAgentClientConfig): MultiAgentClient {
  return new MultiAgentClient(config);
}
