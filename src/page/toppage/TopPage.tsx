import React, { useCallback, useEffect, useState } from "react";
import "../../App.css";
import Header from "../../component/Header";
import CategoryModal from "../../component/modal/CategoryModal";
import { Filter, Todo, category } from "./type";
import { priorityList } from "./const";
import Radio from "../../component/Radio";
import localforage from "localforage";
import { parse } from "date-fns";

function TopPage() {
  const [text, setText] = useState("");
  // Stateの定義に<>を使用すると、<>内以外の型の値が入らなくなるので安全。
  const [todos, setTodos] = useState<Todo[]>([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  //カテゴリーのステート
  const [categories, setCategories] = useState<category[]>([]);
  //優先度のステート
  const [priority, setPriority] = useState<string>("0");

  // モーダルの開閉
  const [isOpen, setIsOpen] = useState(false);

  //フィルターのステート
  const [filter, setFilter] = useState<Filter>("all");

  //タスク追加関数
  const handleSubmit = () => {
    if (!text) return;
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
    setTodos((todos) => [...todos, newTodo]);

    //フォームクリア
    setText("");
    setDate("");
    setTime("");
    setCategories((categories) => {
      const clearedCategories = categories.map((category) => {
        return { ...category, checked: false };
      });
      return clearedCategories;
    });
  };

  //タスク入力関数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  //タスク編集関数
  const handleEdit = (id: number, value: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, value };
        }
        return todo;
      });
      return newTodos;
    });
  };

  //チェックボックス押下時関数
  const handleCheck = useCallback(
    (id: number, checked: boolean) => {
      setTodos((todos) => {
        const newTodos = todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, checked };
          }
          return todo;
        });
        return newTodos;
      });
    },
    [todos]
  );

  //削除ボタン押下時関数
  const handleDelete = (id: number, removed: boolean) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, removed };
        }
        return todo;
      });
      return newTodos;
    });
  };

  //期限日選択時
  const handleDueDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(() => {
      return e.target.value;
    });
  };

  //期限時間取得時
  const handleDueTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(() => {
      return e.target.value;
    });
  };

  // カテゴリーを子コンポーネントで追加する関数
  const handleAddCategory = (newCategories: category[]) => {
    setCategories(() => {
      return newCategories;
    });
  };

  // カテゴリーモーダルを開く関数
  const handleOpenCategory = () => {
    setIsOpen(() => {
      return true;
    });
  };

  // カテゴリーチェックボックス選択関数
  const handleCheckCategory = (id: number, checked: boolean) => {
    setCategories((categories) => {
      const newCategories = categories.map((category) => {
        if (id === category.id) {
          return { ...category, checked };
        }
        return category;
      });
      return newCategories;
    });
  };

  // フィルターセレクト選択関数
  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  // 削除済みタスクを完全削除
  const handleRemovedTask = () => {
    setTodos((todos) => {
      return todos.filter((todo) => {
        return !todo.removed;
      });
    });
  };
  // フィルター選択関数
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return !todo.removed;
      case "checked":
        return todo.checked && !todo.removed;
      case "unchecked":
        return !todo.checked && !todo.removed;
      case "removed":
        return todo.removed;
      default:
        return todo;
    }
  });

  // 優先度ラジオボタン押下関数
  const handlePriorityRadio = (priority: string) => {
    setPriority(priority);
  };

  // // ソート関数
  const handleSort = () => {
    setTodos((todos) => {
      const sortedTodos = [...todos];

      sortedTodos.sort((a, b) => {
        return a.value.localeCompare(b.value, "ja");
      });

      return sortedTodos;
    });
  };

  // ソート関数（Due）
  const handleSortByDue = () => {
    setTodos(() => {
      const formatDate = "yyyy-MM-dd";
      const formatTime = "yyyy-MM-dd HH:mm";
      const sortedTodos = [...todos];
      sortedTodos.sort((a, b) => {
        const aHasDate = !!(a.due_date !== "");

        const bHasDate = !!(b.due_date !== "");

        if (!(aHasDate || bHasDate)) {
          return 0;
        } else if (aHasDate != bHasDate) {
          return aHasDate ? -1 : 1;
        } else {
          // 両方日付指定ありの場合、日付の大きさで比較
          const aDateStr = parse(`${a.due_date}`, formatDate, new Date());
          const bDateStr = parse(`${b.due_date}`, formatDate, new Date());
          // 日付の大小比較
          if (aDateStr < bDateStr) {
            return -1;
          } else if (aDateStr > bDateStr) {
            return 1;
          } else {
            // 両方とも同日の場合、時刻で比較
            // a,bの日付有無
            const aHasTime = !!a.due_time;
            const bHasTime = !!b.due_time;
            if (!(aHasTime || bHasTime)) {
              // 両方時刻なしの場合、ソートなし
              return 0;
            } else if (aHasTime != bHasTime) {
              // 片方だけ時刻ありの場合、ある方を前へ
              return aHasTime ? -1 : 1;
            } else {
              // 両方時刻ありの場合、時刻の大きさで比較
              const aTimeStr = parse(
                `${a.due_date} ${a.due_time}`,
                formatTime,
                new Date()
              );
              const bTimeStr = parse(
                `${b.due_date} ${b.due_time}`,
                formatTime,
                new Date()
              );
              return aTimeStr.getTime() - bTimeStr.getTime();
            }
          }
        }
      });
      return sortedTodos;
    });
  };

  // ソート関数（priority）
  const handleSortByPriority = () => {
    setTodos((todos) => {
      const sortedTodos = [...todos];

      sortedTodos.sort((a, b) => {
        return a.priority.localeCompare(b.priority, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      return sortedTodos;
    });
  };

  useEffect(() => {
    localforage.getItem("todo-react").then((todoValue) => {
      setTodos(todoValue as Todo[]);
    });
    localforage.getItem("category-react").then((categoryValue) => {
      setCategories(categoryValue as category[]);
    });
  }, []);

  // 永続化
  useEffect(() => {
    localforage.setItem("todo-react", todos);
  }, [todos]);

  useEffect(() => {
    localforage.setItem("category-react", categories);
  }, [categories]);

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
                onChange={(e) => handleFilter(e.target.value as Filter)}
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
                    handleRemovedTask();
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
                        handleSort();
                      }}
                    >
                      タスク
                    </button>
                  </th>
                  <th>
                    <button
                      className="th-filter-btn"
                      onClick={() => {
                        handleSortByDue();
                      }}
                    >
                      due
                    </button>
                  </th>
                  <th>
                    <button
                      className="th-filter-btn"
                      onClick={() => {
                        handleSortByPriority();
                      }}
                    >
                      priority
                    </button>
                  </th>
                  <th>
                    <button className="th-filter-btn">category</button>
                  </th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredTodos.map((todo) => {
                  return (
                    <tr key={todo.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="chk-box"
                          disabled={todo.removed}
                          checked={todo.checked}
                          onChange={() => {
                            handleCheck(todo.id, !todo.checked);
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
                              handleEdit(todo.id, e.target.value);
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
                            handleDelete(todo.id, !todo.removed);
                          }}
                        >
                          {todo.removed ? "復元" : "削除"}
                        </button>
                      </td>
                      <td className="td-center">
                        <button className="edit-btn">編集</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="new-task-area">
            <h4 className="new-task-title">New Task</h4>
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
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <input
                  type="submit"
                  className="second-btn"
                  disabled={filter === "checked" || filter === "removed"}
                  value="ADD!"
                />
                <p>due date</p>
                <span />
                <input
                  type="date"
                  className="input-due-date-input"
                  disabled={filter === "checked" || filter === "removed"}
                  value={date}
                  onChange={(e) => {
                    handleDueDate(e);
                  }}
                />
                <input
                  type="time"
                  className="input-due-date-input"
                  step={900}
                  value={time}
                  onChange={(e) => {
                    handleDueTime(e);
                  }}
                />
                <span />
                <p className="beside-button-p">category</p>
                <input
                  type="button"
                  className="inpute-category-add"
                  value="+"
                  onClick={() => {
                    handleOpenCategory();
                  }}
                />
                <ul>
                  {categories.map((category) => {
                    return (
                      <li key={category.id}>
                        <input
                          type="checkbox"
                          value={category.name}
                          className="category-chk-box"
                          id={category.name}
                          checked={category.checked}
                          onChange={() => {
                            handleCheckCategory(category.id, !category.checked);
                          }}
                        />
                        <label
                          htmlFor={category.name}
                          className="category-chk-box"
                        >
                          {category.name}
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
                  onChangeFunction={(selectedValue) => {
                    handlePriorityRadio(selectedValue);
                  }}
                ></Radio>
              </form>
            </div>
          </div>
        </div>
      </main>
      {/* <div className="modal-container"> */}
      <CategoryModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        categories={categories}
        setCategories={handleAddCategory}
      ></CategoryModal>
      {/* </div> */}
    </div>
  );
}

export default TopPage;
