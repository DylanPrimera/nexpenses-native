const TEXT_SIZE = /^text-(xs|sm|base|lg|xl|[2-9]xl|\[\d+(\.\d+)?(px|rem|em)\])$/;
const TEXT_NON_COLOR = /^text-(left|center|right|justify|start|end|auto)$/;

const TEXT_GROUPS = [
  {
    fallback: 'text-foreground',
    pattern: {
      test: (token: string) =>
        /^text-([a-z][a-z0-9-]*(\/\d+)?|\[#[0-9a-fA-F]+\])$/.test(token) &&
        !TEXT_SIZE.test(token) &&
        !TEXT_NON_COLOR.test(token),
    },
  },
  { fallback: 'text-base', pattern: TEXT_SIZE },
  { fallback: 'font-figtree-regular', pattern: /^font-(figtree-[a-z]+|mono)$/ },
] as const;

export function textClassName(...layers: (string | undefined)[]) {
  const tokens = layers.map((layer) => (layer ?? '').split(/\s+/).filter(Boolean));
  const owner = TEXT_GROUPS.map(({ pattern }) => {
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].some((t) => pattern.test(t))) return i;
    }
    return -1;
  });
  const kept = tokens.flatMap((layer, i) =>
    layer.filter((t) =>
      TEXT_GROUPS.every(({ pattern }, g) => !pattern.test(t) || owner[g] === i)
    )
  );
  const fallbacks = TEXT_GROUPS.filter((_, g) => owner[g] === -1).map((g) => g.fallback);
  return [...fallbacks, ...kept].join(' ');
}
