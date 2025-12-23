export interface AgentActionStep {
    action: string;
    tool: string;
    params: Record<string, any>;
    requires_previous_step: boolean;
}

export interface AgentPlan {
    steps: AgentActionStep[];
}