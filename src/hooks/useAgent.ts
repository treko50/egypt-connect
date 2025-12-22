/**
 * Helper hook for calling multi-agent system from client components
 * Use this in your React components instead of importing the client directly
 */

'use client';

import { useState } from 'react';

interface UseAgentOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAgent(options?: UseAgentOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  /**
   * Execute a single agent task
   */
  const executeAgent = async (
    agentName: string,
    task: string,
    context?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName,
          task,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Agent execution failed');
      }

      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Orchestrate a multi-agent task
   */
  const orchestrate = async (
    taskDescription: string,
    context?: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Orchestration failed');
      }

      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Build a complete application
   */
  const buildApplication = async (spec: {
    name: string;
    description: string;
    features: string[];
    techStack?: Record<string, string>;
    context?: Record<string, any>;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spec),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Application build failed');
      }

      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * List available agents
   */
  const listAgents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents/orchestrate', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to list agents');
      }

      setData(result.agents);
      options?.onSuccess?.(result.agents);
      return result.agents;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    executeAgent,
    orchestrate,
    buildApplication,
    listAgents,
    loading,
    error,
    data,
  };
}

/**
 * Example usage in a component:
 * 
 * 'use client';
 * 
 * import { useAgent } from '@/hooks/useAgent';
 * 
 * export default function MyComponent() {
 *   const { orchestrate, loading, error, data } = useAgent({
 *     onSuccess: (result) => console.log('Success!', result),
 *     onError: (err) => console.error('Error!', err)
 *   });
 * 
 *   const handleClick = async () => {
 *     await orchestrate(
 *       'Build a user authentication system',
 *       { framework: 'Next.js' }
 *     );
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleClick} disabled={loading}>
 *         {loading ? 'Building...' : 'Build Feature'}
 *       </button>
 *       {error && <p>Error: {error.message}</p>}
 *       {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
 *     </div>
 *   );
 * }
 */
