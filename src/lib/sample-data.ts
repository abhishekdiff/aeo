// Sample project seed data for Descope AEO Audit

export const SAMPLE_PROJECT = {
  name: 'Descope AEO Audit',
  targetCompany: 'Descope',
  targetDomain: 'descope.com',
  selectedEngines: JSON.stringify(['openai', 'claude', 'gemini']),
}

export const SAMPLE_COMPETITORS = [
  { company: 'Okta', domain: 'okta.com' },
  { company: 'Auth0', domain: 'auth0.com' },
]

export const SAMPLE_QUERIES = [
  { text: 'What are the best authentication platforms for enterprises?', cluster: 'best_tools', intent: 'commercial', weight: 1.2 },
  { text: 'Okta vs Auth0 vs Descope', cluster: 'comparison', intent: 'commercial', weight: 1.5 },
  { text: 'What is passwordless authentication?', cluster: 'definition', intent: 'informational', weight: 1.0 },
  { text: 'Best customer identity and access management platforms', cluster: 'best_tools', intent: 'commercial', weight: 1.3 },
  { text: 'Which auth platform is best for developers?', cluster: 'use_case', intent: 'commercial', weight: 1.2 },
  { text: 'What is Descope used for?', cluster: 'use_case', intent: 'informational', weight: 1.0 },
  { text: 'Best alternatives to Auth0', cluster: 'alternatives', intent: 'commercial', weight: 1.4 },
  { text: 'Top SSO and CIAM vendors', cluster: 'best_tools', intent: 'commercial', weight: 1.1 },
  { text: 'Which authentication platform supports passwordless login best?', cluster: 'definition', intent: 'commercial', weight: 1.3 },
]
