/**
 * Deal store frames onto the screen wall: a cols x rows grid, filled row by
 * row. Every frame appears at least once when there are enough slots, and no
 * tile shares its app's palette with the tile beside it or above it whenever
 * the mix of apps allows.
 */
export function dealWall<T>(groups: { key: string; items: T[] }[], cols: number, rows: number): T[][] {
  const slots = cols * rows;
  const queues = groups.map((g) => ({ key: g.key, items: [...g.items] }));
  const order: { key: string; item: T }[] = [];

  // Greedy: always take from the app with the most frames left, skipping any
  // app that would sit beside (left) or under (above) one of its own. Once
  // every frame is placed, spare slots draw from a fresh copy of each set.
  for (let k = 0; k < slots; k++) {
    if (queues.every((q) => q.items.length === 0)) {
      groups.forEach((g, i) => (queues[i].items = [...g.items]));
    }
    const left = k % cols === 0 ? undefined : order[k - 1]?.key;
    const above = order[k - cols]?.key;
    const ranked = queues
      .filter((q) => q.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length);
    const pick =
      ranked.find((q) => q.key !== left && q.key !== above) ??
      ranked.find((q) => q.key !== left) ??
      ranked[0];
    order.push({ key: pick.key, item: pick.items.shift() as T });
  }

  return Array.from({ length: cols }, (_, c) =>
    Array.from({ length: rows }, (_, r) => order[c + r * cols].item),
  );
}
