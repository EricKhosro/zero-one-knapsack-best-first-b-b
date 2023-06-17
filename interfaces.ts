export interface Item {
  weight: number;
  value: number;
}

export interface Bound {
  lower: number;
  upper: number;
}

export interface Node {
  level: number;
  value: number;
  weight: number;
  bound: Bound;
  parent?: Node;
  children: Node[];
}
