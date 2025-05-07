export function generateWorkspaceName(withScope = false) {
  const adjectives = [
    'fast',
    'cool',
    'smart',
    'tiny',
    'mighty',
    'lazy',
    'snappy',
    'shiny',
    'neat',
    'stealthy',
  ];
  const nouns = [
    'engine',
    'parser',
    'utils',
    'core',
    'runner',
    'helper',
    'stack',
    'logger',
    'manager',
    'agent',
  ];

  const randomFrom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const name = `${randomFrom(adjectives)}-${randomFrom(nouns)}`;

  if (withScope) {
    const scopes = ['@myteam', '@acme', '@openai', '@devtools', '@awesome'];
    return `${randomFrom(scopes)}/${name}`;
  }

  return name;
}
