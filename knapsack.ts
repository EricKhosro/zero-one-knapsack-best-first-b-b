import { Item, Node, Bound } from "./interfaces";

function knapsack(items: Item[], capacity: number): number {
  // Create the root node
  const root: Node = {
    level: 0,
    value: 0,
    weight: 0,
    bound: { lower: 0, upper: 0 },
    children: [],
  };

  // Create a priority queue to store the nodes to be explored
  const queue: Node[] = [root];

  // Create a map to store the lower bounds for each node
  const lowerBounds: Map<string, number> = new Map();
  lowerBounds.set(root.level.toString(), 0);

  // Create a map to store the upper bounds for each node
  const upperBounds: Map<string, number> = new Map();
  upperBounds.set(root.level.toString(), Number.POSITIVE_INFINITY);

  // Create a map to store the explored nodes for each level
  const explored: Map<number, Set<string>> = new Map();

  // Explore the nodes using Best-First Search with Branch and Bound Pruning
  while (queue.length > 0) {
    // Sort the nodes by their lower bound
    queue.sort((a, b) => a.bound.lower - b.bound.lower);

    // Get the node with the lowest lower bound
    const node = queue.shift()!;

    // Check if the node has a bound that is greater than the capacity
    if (node.bound.lower > capacity) {
      continue;
    }

    // Check if the node is the leaf node
    if (node.level === items.length) {
      // Return the value of the leaf node
      return node.value;
    }

    // Check if the node has already been explored
    const level = node.level;
    const key = level.toString();
    if (!explored.has(level)) {
      explored.set(level, new Set());
    }
    if (explored.get(level)!.has(key)) {
      continue;
    }

    // Explore the node
    explored.get(level)!.add(key);

    // Calculate the value and weight of the node
    let value = node.value;
    let weight = node.weight;
    for (let i = node.level; i < items.length; i++) {
      if (weight + items[i].weight <= capacity) {
        value += items[i].value;
        weight += items[i].weight;
      }
    }

    // Calculate the lower and upper bounds of the node
    const bound = {
      lower: value,
      upper: node.bound.lower,
    };
    for (let i = node.level + 1; i < items.length; i++) {
      const childKey = i.toString();
      if (!explored.has(i)) {
        explored.set(i, new Set());
      }
      if (!explored.get(i)!.has(childKey)) {
        const child: Node = {
          level: i,
          value: node.value,
          weight: node.weight,
          bound: { lower: 0, upper: 0 },
          parent: node,
          children: [],
        };
        node.children.push(child);
        queue.push(child);
        explored.get(i)!.add(childKey);
      }
      const child = node.children.find((c) => c.level === i)!;
      bound.lower += child.bound.lower;
      bound.upper += child.bound.upper;
    }

    // Update the lower and upper bounds of the node
    lowerBounds.set(key, bound.lower);
    upperBounds.set(key, bound.upper);

    // Push the node back onto the queue if it has not been explored
    if (bound.lower < bound.upper) {
      queue.push(node);
    }
  }

  // Return the value of the root node
  return root.value;
}
