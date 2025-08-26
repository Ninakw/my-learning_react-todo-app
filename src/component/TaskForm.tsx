import React from "react";
import { category } from "../page/toppage/type";
import { priorityList } from "../page/toppage/const";

import Radio from "./Radio";

type Props = {
  text: string;
  date: string;
  time: string;
  priority: string;
  categories: category[];
  errors?: { [key: string]: string };
  disabled?: boolean;

  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriorityChange: (val: string) => void;
  onCategoryCheck: (id: number, checked: boolean) => void;
  onOpenCategoryModal?: () => void;
};

const TaskForm: React.FC<Props> = ({
  text,
  date,
  time,
  priority,
  categories,
  errors = {},
  disabled = false,
  onTextChange,
  onDateChange,
  onTimeChange,
  onPriorityChange,
  onCategoryCheck,
  onOpenCategoryModal,
}) => {
  return (
    <div className="task-form-container">
      <p>task</p>
      <input
        type="text"
        value={text}
        onChange={onTextChange}
        disabled={disabled}
      />
      {errors.text && <p className="error">{errors.text}</p>}

      <p>due date</p>
      <input
        type="date"
        value={date}
        onChange={onDateChange}
        disabled={disabled}
      />
      <input
        type="time"
        value={time}
        step={900}
        onChange={onTimeChange}
        disabled={disabled}
      />
      {errors.date && <p className="error">{errors.date}</p>}

      <p>category</p>
      <input
        type="button"
        value="+"
        onClick={onOpenCategoryModal}
        disabled={disabled}
      />
      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            <input
              type="checkbox"
              checked={c.checked}
              onChange={() => onCategoryCheck(c.id, !c.checked)}
              disabled={disabled}
            />
            <label>{c.name}</label>
          </li>
        ))}
      </ul>

      <p>priority</p>
      <Radio
        radioName="priority-radio"
        checkedValue={priority}
        labelAndValueArray={priorityList}
        onChangeFunction={onPriorityChange}
      />
    </div>
  );
};

export default TaskForm;
