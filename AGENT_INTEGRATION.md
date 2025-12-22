# Egypt Connect - Multi-Agent Integration

Egypt Connect now uses a centralized multi-agent service for AI-powered features. This approach provides:

## 🎯 Architecture Benefits

- **Separation of Concerns**: AI logic is centralized in a dedicated service
- **Reusability**: Multiple applications can use the same agent service
- **Scalability**: Scale the agent service independently
- **Self-Building Capability**: The agents can build and modify applications, including Egypt Connect itself

## 🤖 Available Agents

The centralized service provides these specialized agents:

1. **Planner** - Strategic task decomposition and planning
2. **Coder** - Code generation and implementation
3. **Reviewer** - Code review and quality assurance
4. **Integrator** - System integration and component coordination
5. **Tester** - Test case design and validation
6. **Documenter** - Documentation creation
7. **Debugger** - Error analysis and debugging
8. **Optimizer** - Performance optimization
9. **Architect** - System architecture design
10. **Security** - Security analysis and recommendations
11. **Researcher** - Technical research and analysis

## 🚀 Setup

### 1. Start the Multi-Agent Service

```bash
cd multi-agent-service
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

The service will run on `http://localhost:3001`

### 2. Configure Egypt Connect

```bash
cd egypt-connect
cp .env.example .env.local
# Add MULTI_AGENT_SERVICE_URL and MULTI_AGENT_API_KEY
```

### 3. Run Egypt Connect

```bash
npm install
npm run dev
```

## 📡 API Endpoints

### Execute Single Agent
```bash
POST /api/agents/execute
{
  "agentName": "coder",
  "task": "Create a React component for user authentication",
  "context": { "framework": "Next.js 15" }
}
```

### Orchestrate Multi-Agent Task
```bash
POST /api/agents/orchestrate
{
  "taskDescription": "Build a REST API with authentication and user management",
  "context": { "language": "TypeScript", "framework": "Express" }
}
```

### Build Complete Application
```bash
POST /api/agents/build
{
  "name": "Task Manager",
  "description": "A task management application with user authentication",
  "features": [
    "User authentication",
    "Create, update, delete tasks",
    "Task categories and tags",
    "Search and filter"
  ],
  "techStack": {
    "frontend": "Next.js",
    "backend": "Node.js",
    "database": "PostgreSQL"
  }
}
```

### List Available Agents
```bash
GET /api/agents/orchestrate
```

## 💻 Usage in Code

```typescript
import { getMultiAgentClient } from '@/lib/multi-agent-client';

const client = getMultiAgentClient();

// Execute a single agent
const result = await client.executeAgent({
  agentName: 'coder',
  task: 'Create a user profile component',
  context: { framework: 'React', styling: 'Tailwind CSS' }
});

// Orchestrate multiple agents
const orchestrationResult = await client.orchestrate({
  taskDescription: 'Build a complete user authentication system',
  context: { framework: 'Next.js', database: 'Prisma' }
});

// Build an application
const appResult = await client.buildApplication({
  name: 'Blog Platform',
  description: 'A modern blogging platform',
  features: ['Posts', 'Comments', 'User profiles'],
  techStack: {
    frontend: 'Next.js',
    backend: 'Prisma',
    database: 'PostgreSQL'
  }
});
```

## 🔧 Self-Building Capability

The multi-agent system can build and modify applications, including Egypt Connect itself:

```typescript
// Example: Add a new feature to Egypt Connect
const result = await client.orchestrate({
  taskDescription: `Add a notification system to Egypt Connect with:
  - Real-time notifications
  - Email notifications
  - Notification preferences
  - Unread count badge`,
  context: {
    existingApp: 'egypt-connect',
    framework: 'Next.js 15',
    database: 'Prisma + PostgreSQL'
  }
});
```

## 🏗️ How It Works

1. **Request** → Client app sends task to Egypt Connect API
2. **Forward** → Egypt Connect forwards to multi-agent service
3. **Plan** → Planner agent creates execution plan
4. **Execute** → Specialized agents execute tasks in parallel
5. **Review** → Reviewer agent checks quality
6. **Integrate** → Integrator agent combines results
7. **Response** → Complete solution returned to client

## 📚 Documentation

- [Multi-Agent Service README](../multi-agent-service/README.md)
- [Quick Start Guide](../multi-agent-service/QUICKSTART.md)
- [Original Multi-Agent Documentation](../MULTI_AGENT_README.md)

## 🔐 Security

- API key authentication required
- Rate limiting enabled
- Input validation on all endpoints
- Service runs separately from main application

## 🚧 Migration Notes

The following local files are now deprecated (kept for reference):
- `src/lib/agents/*` - Use centralized service instead
- `src/examples/agent-examples.ts` - See multi-agent-service examples

## 🌟 Benefits

1. **Centralized Intelligence**: One service serves all apps
2. **Scalable**: Independent scaling of AI capabilities
3. **Maintainable**: Single codebase for agent logic
4. **Self-Improving**: Agents can build and modify applications
5. **Cost Effective**: Shared API usage across applications
