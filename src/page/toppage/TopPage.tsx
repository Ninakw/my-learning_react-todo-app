import React, { useCallback, useEffect, useState } from "react";
import "../../App.css";
import Header from "../../component/Header";
import CategoryModal from "../../component/modal/CategoryModal";
import { Todo, category } from "./type";
import { propertyList } from "./const";
import Radio from "../../component/Radio";
import localforage from "localforage";

function TopPage() {
  const [text, setText] = useState("");
  // Stateの定義に<>を使用すると、<>内以外の型の値が入らなくなるので安全。
  const [todos, setTodos] = useState<Todo[]>([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  //カテゴリーのステート
  const [categories, setCategories] = useState<category[]>([]);
  //優先度のステート
  const [priority, setPriority] = useState<string>("high");

  // モーダルの開閉
  const [isOpen, setIsOpen] = useState(false);

  //タスク追加関数
  const handleSubmit = () => {
    if (!text) return;
    const newTodo: Todo = {
      id: new Date().getTime(),
      value: text,
      checked: false,
      removed: false,
      category: categories,
      priority: priority,
    };
    setTodos((todos) => [...todos, newTodo]);

    //フォームクリア
    setText("");
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
    setDate((date) => {
      return e.target.value;
    });
  };

  //期限時間取得時
  const handleDueTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime((time) => {
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
    console.log(isOpen);
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

  // 優先度ラジオボタン押下関数
  const handlePriorityRadio = (property: string) => {
    setPriority(property);
  };

  useEffect(() => {
    localforage.getItem("todo-react").then((todoValue) => {
      setTodos(todoValue as Todo[]);
    });
    localforage.getItem("category-react").then((categoryValue) => {
      setCategories(categoryValue as category[]);
    });

    setDate(() => {
      const today = new Date()
        .toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .join("-");

      return today;
    });
    console.log(date);
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
            <ul>
              {todos.map((todo) => {
                return (
                  <li key={todo.id}>
                    <input
                      type="checkbox"
                      className="chk-box"
                      disabled={todo.removed}
                      checked={todo.checked}
                      onChange={() => {
                        handleCheck(todo.id, !todo.checked);
                      }}
                    />
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
                    {/* {todo.category
                      ?.filter((ctg) => {
                        return ctg.checked === true;
                      })
                      .map((filtered) => {
                        return <li key={filtered.id}>{filtered.name}</li>;
                      })} */}
                    {/* <p>{todo.priority}</p> */}

                    <button
                      className="del-btn"
                      onClick={() => {
                        handleDelete(todo.id, !todo.removed);
                      }}
                    >
                      {todo.removed ? "復元" : "削除"}
                    </button>
                  </li>
                );
              })}
            </ul>
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
                  value={text}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <input type="submit" className="second-btn" value="ADD!" />
                <p>due date</p>
                <span />
                <input
                  type="date"
                  className="input-due-date-input"
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
                    console.log(isOpen);
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
                          checked={category.checked}
                          onChange={() => {
                            handleCheckCategory(category.id, !category.checked);
                          }}
                        />
                        <label className="category-chk-box">
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
                  labelAndValueArray={propertyList}
                  onChangeFunction={(selectedValue) => {
                    handlePriorityRadio(selectedValue);
                  }}
                ></Radio>
              </form>
            </div>
          </div>
        </div>
      </main>
      <CategoryModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        categories={categories}
        setCategories={handleAddCategory}
      ></CategoryModal>
    </div>
  );
}

export default TopPage;
