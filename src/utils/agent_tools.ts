import { Type } from '@google/genai';

export const AgentTools = [
  {
    name: 'vision_analysis',
    description:
      'Analyze an image to identify crop, pest, or disease.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        imageUrl: { type: Type.STRING },
      },
      required: ['imageUrl'],
    },
  },
  {
    name: 'get_weather',
    description: 'Get weather data for a location.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER },
      },
    },
  },
  {
    name: 'chemical_lookup',
    description:
      'Search for a NEW chemical product by name. Use this tool ONLY when the user explicitly mentions a chemical name that is NOT already in the conversation context, or when searching for chemicals to treat a specific crop/pest combination. Do NOT use this tool when the user asks about "it", "this product", "this chemical", or refers to a chemical already discussed.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        chemical: { type: Type.STRING },
        crop: { type: Type.STRING },
        pest: { type: Type.STRING },
      },
      required: [],
    },
  },
  {
    name: 'chemical_followup',
    description:
      'Get conversation history and chemical context for answering follow-up questions about a chemical product that is already in context. Use this tool when the user asks questions about a chemical using pronouns or references like "it", "this product", "this chemical", "the product", "the chemical", or when asking follow-up questions such as "what pests does it target?", "what can I use it for?", "what crops can I use this product on?", "what pests can be targeted when using this chemical?", or any questions about application rates, dosage, or usage details for the chemical already being discussed.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_treatment_history',
    description: 'Retrieve past treatments for memory queries.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING },
      },
      required: ['query'],
    },
  },
  {
    name: 'generate_treatment_plan',
    description:
      'Generate a structured treatment plan using all retrieved data.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        crop: { type: Type.STRING },
        pest: { type: Type.STRING },
        chemical: { type: Type.STRING },
        weather: { type: Type.OBJECT },
        dosageInfo: { type: Type.OBJECT },
      },
      required: ['crop', 'pest', 'chemical', 'weather', 'dosageInfo'],
    },
  },
  {
    name: 'create_reminder',
    description:
      'Create a follow-up reminder for the farmer.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        userId: { type: Type.STRING },
        message: { type: Type.STRING },
        remindAt: { type: Type.STRING },
      },
      required: ['userId', 'message', 'remindAt'],
    },
  },
  {
    name: 'save_message',
    description:
      'Store this final answer into long-term memory.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        conversationId: { type: Type.STRING },
        role: { type: Type.STRING },
        content: { type: Type.STRING },
      },
      required: ['conversationId', 'role', 'content'],
    },
  },
];

export const PlannerTool = {
  name: 'create_action_plan',
  description:
    "Break the user's request into a multi-step plan using the defined agent tools. Each step has an action, tool, params, and can depend on previous steps.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING },
            tool: { type: Type.STRING },
            params: { type: Type.OBJECT },
            requires_previous_step: { type: Type.BOOLEAN },
          },
          required: ['action', 'tool', 'params'],
        },
      },
    },
    required: ['steps'],
  },
};

export const AllTools = [PlannerTool, ...AgentTools];
