/**
 * Orchestrator API Route
 * Coordinates specialized agents to perform tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { uxDesignerAgent } from '@/lib/agents/ux-designer';
import { pricingAnalystAgent } from '@/lib/agents/pricing-analyst';
import { testEngineerAgent } from '@/lib/agents/test-engineer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskDescription, agents: requestedAgents } = body;

    if (!taskDescription) {
      return NextResponse.json(
        { success: false, error: 'Task description is required' },
        { status: 400 }
      );
    }

    const results: Record<string, any> = {};

    // Execute requested agents or all agents if none specified
    const agentsToExecute = requestedAgents || [
      'ux-designer',
      'pricing-analyst',
      'test-engineer',
    ];

    for (const agentName of agentsToExecute) {
      try {
        let result;

        switch (agentName) {
          case 'ux-designer':
            result = await uxDesignerAgent.analyzeCurrentUX();
            results[agentName] = result;
            break;

          case 'pricing-analyst':
            result = await pricingAnalystAgent.analyzePricing();
            results[agentName] = result;
            break;

          case 'test-engineer':
            result = await testEngineerAgent.generateTestPlan();
            results[agentName] = result;
            break;

          default:
            results[agentName] = { error: `Unknown agent: ${agentName}` };
        }
      } catch (error) {
        results[agentName] = {
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return NextResponse.json({
      success: true,
      taskDescription,
      results,
      executedAgents: agentsToExecute,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    agents: [
      {
        name: 'ux-designer',
        description: 'Analyzes UI/UX and provides modern design recommendations',
        capabilities: [
          'UI/UX analysis',
          'Design pattern recommendations',
          'Accessibility audit',
          'Component improvements',
        ],
      },
      {
        name: 'pricing-analyst',
        description: 'Analyzes and optimizes pricing for DMV market',
        capabilities: [
          'Market research',
          'Competitive analysis',
          'Pricing recommendations',
          'Revenue projections',
        ],
      },
      {
        name: 'test-engineer',
        description: 'Implements comprehensive testing coverage',
        capabilities: [
          'Test plan generation',
          'Test setup configuration',
          'Regression test suites',
          'Coverage analysis',
        ],
      },
    ],
  });
}
