/**
 * Multi-Agent Orchestrator for Egypt Connect
 * Coordinates specialized agents to improve the application
 */

export interface Agent {
  name: string;
  role: string;
  responsibilities: string[];
  priority: number;
}

export interface Task {
  id: string;
  agentName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  dependencies: string[];
  result?: any;
  error?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface OrchestratorConfig {
  agents: Agent[];
  maxConcurrentTasks: number;
  timeout: number;
}

export class Orchestrator {
  private config: OrchestratorConfig;
  private tasks: Map<string, Task> = new Map();
  private taskQueue: Task[] = [];
  private activeTasks: Set<string> = new Set();

  constructor(config: OrchestratorConfig) {
    this.config = config;
  }

  /**
   * Add a task to the orchestrator
   */
  addTask(task: Omit<Task, 'id' | 'status'>): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullTask: Task = {
      ...task,
      id,
      status: 'pending',
    };

    this.tasks.set(id, fullTask);
    this.taskQueue.push(fullTask);
    return id;
  }

  /**
   * Execute all tasks in the queue
   */
  async executeTasks(): Promise<Map<string, Task>> {
    while (this.taskQueue.length > 0 || this.activeTasks.size > 0) {
      await this.processNextBatch();
    }
    return this.tasks;
  }

  /**
   * Process the next batch of tasks
   */
  private async processNextBatch(): Promise<void> {
    const availableSlots = this.config.maxConcurrentTasks - this.activeTasks.size;

    if (availableSlots <= 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return;
    }

    const readyTasks = this.getReadyTasks();
    const tasksToExecute = readyTasks.slice(0, availableSlots);

    if (tasksToExecute.length === 0 && this.activeTasks.size === 0) {
      return;
    }

    const promises = tasksToExecute.map(task => this.executeTask(task));
    await Promise.allSettled(promises);
  }

  /**
   * Get tasks that are ready to execute
   */
  private getReadyTasks(): Task[] {
    return this.taskQueue
      .filter(task => {
        if (task.status !== 'pending') return false;
        if (this.activeTasks.has(task.id)) return false;

        return task.dependencies.every(depId => {
          const depTask = this.tasks.get(depId);
          return depTask?.status === 'completed';
        });
      })
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Execute a single task
   */
  private async executeTask(task: Task): Promise<void> {
    this.activeTasks.add(task.id);
    task.status = 'in_progress';
    task.startTime = new Date();

    try {
      const agent = this.config.agents.find(a => a.name === task.agentName);
      if (!agent) {
        throw new Error(`Agent ${task.agentName} not found`);
      }

      const result = await this.callAgent(task.agentName, task.description);

      task.result = result;
      task.status = 'completed';
      task.endTime = new Date();
    } catch (error) {
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.status = 'failed';
      task.endTime = new Date();
    } finally {
      this.activeTasks.delete(task.id);
      this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
    }
  }

  /**
   * Call an agent to perform work
   */
  private async callAgent(agentName: string, description: string): Promise<any> {
    const response = await fetch('/api/agents/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentName,
        task: description,
        context: {
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Agent ${agentName} failed: HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Agent execution failed');
    }

    return result.result;
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: Task['status']): Task[] {
    return Array.from(this.tasks.values()).filter(t => t.status === status);
  }
}

/**
 * Create the default orchestrator for Egypt Connect
 */
export function createEgyptConnectOrchestrator(): Orchestrator {
  const config: OrchestratorConfig = {
    agents: [
      {
        name: 'ux-designer',
        role: 'UX/UI Designer',
        responsibilities: [
          'Analyze current UI/UX and identify improvements',
          'Create modern, industry-standard designs',
          'Ensure accessibility compliance',
          'Optimize user flows',
          'Design responsive layouts',
        ],
        priority: 10,
      },
      {
        name: 'pricing-analyst',
        role: 'Pricing Model Analyst',
        responsibilities: [
          'Analyze DMV area market rates',
          'Optimize pricing strategy',
          'Calculate competitive pricing',
          'Recommend pricing tiers',
          'Monitor market trends',
        ],
        priority: 8,
      },
      {
        name: 'test-engineer',
        role: 'Test Engineer',
        responsibilities: [
          'Create comprehensive test suites',
          'Implement regression testing',
          'Ensure code coverage',
          'Perform integration testing',
          'Automate test execution',
        ],
        priority: 9,
      },
      {
        name: 'calendar-specialist',
        role: 'Calendar Specialist',
        responsibilities: [
          'Optimize calendar scheduling',
          'Implement booking logic',
          'Add availability management',
          'Improve calendar UI/UX',
          'Integrate with backend',
        ],
        priority: 7,
      },
      {
        name: 'profile-manager',
        role: 'Profile Manager',
        responsibilities: [
          'Implement profile editing',
          'Add settings management',
          'Create user preferences',
          'Handle profile updates',
          'Manage user data',
        ],
        priority: 6,
      },
      {
        name: 'auth-specialist',
        role: 'Authentication Specialist',
        responsibilities: [
          'Fix login issues',
          'Improve auth flow',
          'Add security features',
          'Manage user sessions',
          'Handle auth errors',
        ],
        priority: 8,
      },
      {
        name: 'upload-engineer',
        role: 'Upload Engineer',
        responsibilities: [
          'Implement file upload',
          'Add document management',
          'Create upload UI',
          'Handle file storage',
          'Ensure security',
        ],
        priority: 7,
      },
    ],
    maxConcurrentTasks: 3,
    timeout: 300000, // 5 minutes
  };

  return new Orchestrator(config);
}
