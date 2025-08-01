export type Todo = {
  readonly id: number;
  value: string;
  checked: boolean;
  removed: boolean;
  category?: category[];
  priority?: string;
};

export type category = {
  readonly id: number;
  name: string;
  checked?: boolean;
};

export type priorityLevel = "high" | "middle" | "low";

export type LabelandValue = {
  id: number;
  label: string;
  value: string;
};
