import React from "react";
import { category, Filter, Todo } from "../page/toppage/type";
import { priorityList } from "../page/toppage/const";

import Radio from "./Radio";
import { useTaskForm } from "../hooks/useTaskForm";
import { useTodo } from "../hooks/useTodo";

type TaskFormProps = {
  text: string;
  date: string;
  time: string;
  priority: string;
  categories: category[];
  errors?: { [key: string]: string };
  filter: Filter;
  validateForm: () => boolean;
  addTodo: (todo: Todo) => void;
  clearForm: () => void;
  clearFormCategory: () => void;
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriorityChange: (val: string) => void;
  onCategoryCheck: (id: number, checked: boolean) => void;
  onOpenCategoryModal?: () => void;
};

const TaskForm = ({
  text,
  date,
  time,
  priority,
  categories,
  errors = {},
  filter,
  validateForm,
  addTodo,
  clearForm,
  clearFormCategory,
  onTextChange,
  onDateChange,
  onTimeChange,
  onPriorityChange,
  onCategoryCheck,
  onOpenCategoryModal,
}: TaskFormProps) => {
  const handleSubmit = () => {
    if (!validateForm()) return;
    // 期限日相関チェック
    let validatedDate = date;
    if (!date && time) {
      validatedDate = new Date()
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .join("-");
    }

    const newTodo: Todo = {
      id: new Date().getTime(),
      value: text,
      checked: false,
      removed: false,
      due_date: validatedDate,
      due_time: time,
      category: categories,
      priority: priority,
    };

    addTodo(newTodo);
    //フォームクリア
    clearForm();
    clearFormCategory();
  };
  return (
    <div className="new-task-inner-area">
      <form
        className="new-task-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <p>task</p>
        <span />
        <input
          type="text"
          className="input-text"
          disabled={filter === "checked" || filter === "removed"}
          value={text}
          onChange={onTextChange}
        />
        <input
          type="submit"
          className="second-btn"
          disabled={filter === "checked" || filter === "removed"}
          value="ADD!"
        />
        {errors.text && <p className="error">{errors.text}</p>}
        <p>due date</p>
        <span />
        <input
          type="date"
          className="input-due-date-input"
          disabled={filter === "checked" || filter === "removed"}
          value={date}
          onChange={onDateChange}
        />{" "}
        <input
          type="time"
          className="input-due-date-input"
          step={900}
          value={time}
          onChange={onTimeChange}
        />
        <span />
        <p className="beside-button-p">category</p>
        <input
          type="button"
          className="inpute-category-add"
          value="+"
          onClick={() => {
            onOpenCategoryModal?.();
          }}
        />
        <ul className="category-chk-box">
          {categories.map((category) => {
            return (
              <li className="" key={category.id}>
                <label htmlFor={category.name} className="category-chk-box">
                  <input
                    type="checkbox"
                    value={category.name}
                    className="category-chk-box"
                    id={category.name}
                    checked={category.checked}
                    onChange={() => {
                      onCategoryCheck(category.id, !category.checked);
                    }}
                  />
                  <span className="input-label">{category.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="beside-button-p">priority</p>
        <span />
        <Radio
          radioName={"property-radio"}
          checkedValue={priority}
          labelAndValueArray={priorityList}
          onChangeFunction={onPriorityChange}
        ></Radio>
      </form>
    </div>
  );
};

export default TaskForm;
