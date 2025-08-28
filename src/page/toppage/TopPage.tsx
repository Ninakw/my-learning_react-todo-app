import "../../App.css";
import Header from "../../component/Header";
import CategoryModal from "../../component/modal/CategoryModal";
import { Filter } from "./type";
import { priorityList } from "./const";
import { useTodo } from "../../hooks/useTodo";
import { useTaskForm } from "../../hooks/useTaskForm";
import CategoryFilterModal from "../../component/modal/CategoryFilterModal";
import { useCategory } from "../../hooks/useCategory";
import { useCallback, useMemo } from "react";
import TaskForm from "../../component/TaskForm";

function TopPage() {
  const {
    todos,
    addTodo,
    editTodo,
    toggleCheck,
    toggleRemove,
    removeDeleted,
    sortByDue,
    sortByPriority,
    sortByName,
    filter,
    setFilter,
    filteredTodos,
    categoryFilteredTodos,
    filterCategories,
    setFilterCategories,
  } = useTodo();

  const {
    categories,
    setCategories,
    checkCategory,
    isOpen,
    setIsOpen,
    isFilterOpen,
    setIsFilterOpen,
    clearFormCategory,
  } = useCategory();

  const {
    text,
    date,
    time,
    priority,
    handleTextChange,
    handleDateChange,
    handleTimeChange,
    handlePriorityChange,
    clearForm,
    validateForm,
    errors,
  } = useTaskForm();

  // カテゴリー追加モーダルを開く関数
  const handleOpenCategory = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  // カテゴリーフィルターモーダルを開く関数
  const handleOpenCategoryFilter = useCallback(() => {
    setIsFilterOpen(true);
  }, [setIsFilterOpen]);

  const displayedTodos = useMemo(() => {
    return filterCategories.length === 0
      ? filteredTodos
      : categoryFilteredTodos;
  }, [filterCategories, filteredTodos, categoryFilteredTodos]);

  return (
    <div className="main">
      <Header title="TODO" />
      <main>
        <div className="all-task-area">
          <div className="current-task-area">
            <h4 className="current-task-title">Current Task</h4>
            <div className="horizontal-contents">
              <select
                className="fliter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
              >
                <option value="all">ALL TASK</option>
                <option value="checked">DONE TASK</option>
                <option value="unchecked">UNDONE TASK</option>
                <option value="removed">DELETED TASK</option>
              </select>
              {filter === "removed" && (
                <button
                  className="trush-button"
                  onClick={() => {
                    removeDeleted();
                  }}
                  disabled={
                    todos.filter((todo) => {
                      return todo.removed;
                    }).length === 0
                  }
                ></button>
              )}
            </div>

            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <button
                      className="th-filter-btn"
                      onClick={() => {
                        sortByName();
                      }}
                    >
                      task
                    </button>
                  </th>
                  <th>
                    <button
                      className="th-filter-btn"
                      onClick={() => {
                        sortByDue();
                      }}
                    >
                      due
                    </button>
                  </th>
                  <th>
                    <button
                      className="th-filter-btn"
                      onClick={() => {
                        sortByPriority();
                      }}
                    >
                      priority
                    </button>
                  </th>
                  <th>
                    <button
                      className="th-filter-btn"
                      onClick={() => {
                        handleOpenCategoryFilter();
                      }}
                    >
                      category
                    </button>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayedTodos.map((todo) => {
                  return (
                    <tr key={todo.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="todo-chk-box"
                          disabled={todo.removed}
                          checked={todo.checked}
                          onChange={() => {
                            toggleCheck(todo.id, !todo.checked);
                          }}
                        />
                      </td>
                      <td>
                        {todo.checked ? (
                          <s>{todo.value}</s>
                        ) : (
                          <input
                            type="text"
                            className="current-text"
                            disabled={todo.checked || todo.removed}
                            value={todo.value}
                            onChange={(e) => {
                              editTodo(todo.id, e.target.value);
                            }}
                          />
                        )}
                      </td>
                      <td id="td_due">
                        {todo.due_date} {todo?.due_time}
                      </td>
                      <td className="td-center">
                        {
                          priorityList.find(
                            (item) => item.value === todo.priority
                          )?.label
                        }
                      </td>
                      <td>
                        {todo.category
                          ?.filter((c) => {
                            return c.checked === true;
                          })
                          .map((c) => {
                            return <span key={c.id}>{c.name}</span>;
                          })}
                      </td>
                      <td className="td-center">
                        <button
                          className="del-btn"
                          onClick={() => {
                            toggleRemove(todo.id, !todo.removed);
                          }}
                        >
                          {todo.removed ? "復元" : "削除"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="new-task-area">
            <h4 className="new-task-title">New Task</h4>
            <TaskForm
              text={text}
              date={date}
              time={time}
              priority={priority}
              categories={categories}
              errors={errors}
              filter={filter}
              validateForm={validateForm}
              addTodo={addTodo}
              clearForm={clearForm}
              clearFormCategory={clearFormCategory}
              onTextChange={handleTextChange}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              onPriorityChange={handlePriorityChange}
              onCategoryCheck={checkCategory}
              onOpenCategoryModal={handleOpenCategory}
            />
          </div>
        </div>
      </main>
      <CategoryModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        categories={categories}
        setCategories={setCategories}
      />
      <CategoryFilterModal
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        categories={categories}
        setCategories={setCategories}
        setFilterCategories={setFilterCategories}
      />
    </div>
  );
}

export default TopPage;
