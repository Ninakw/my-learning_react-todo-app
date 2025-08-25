export type Todo = {
  readonly id: number;
  value: string;
  checked: boolean;
  removed: boolean;
  due_date?: string;
  due_time?: string;
  category?: category[];
  priority: string;
};

export type category = {
  readonly id: number;
  name: string;
  checked?: boolean;
  filterChecked?: boolean;
};

export type priorityLevel = "high" | "middle" | "low";

export type sortKey = "VALUE" | "DATE" | "PRIORITY";

export type LabelandValue = {
  id: number;
  label: string;
  value: string;
};

export type Filter = "all" | "checked" | "unchecked" | "removed";
