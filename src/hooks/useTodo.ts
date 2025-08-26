// hooks/useTodo.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { parse } from "date-fns";
import localforage from "localforage";
import { Todo, Filter } from "../page/toppage/type";

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);

  // 初期読み込み
  useEffect(() => {
    localforage.getItem("todo-react").then((todoValue) => {
      if (todoValue) {
        setTodos(todoValue as Todo[]);
      }
    });
  }, []);

  // 永続化
  useEffect(() => {
    localforage.setItem("todo-react", todos);
  }, [todos]);

  // タスク追加
  const addTodo = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  };

  // 編集
  const editTodo = (id: number, value: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, value } : todo))
    );
  };

  // チェック
  const toggleCheck = useCallback((id: number, checked: boolean) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, checked } : todo))
    );
  }, []);

  // 削除／復元
  const toggleRemove = (id: number, removed: boolean) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, removed } : todo))
    );
  };

  // 完全削除
  const removeDeleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.removed));
  };

  // フィルター処理
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
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
  }, [todos, filter]);

  const categoryFilteredTodos = useMemo(() => {
    return filteredTodos.filter((todo) => {
      if (!Array.isArray(todo.category) || todo.category.length === 0) {
        return false;
      }
      return todo.category
        .filter((c) => c.checked)
        .some((c) => filterCategories.includes(c.name));
    });
  }, [filteredTodos, filterCategories]);

  // ソート関数（Due）
  const sortByDue = () => {
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

  // ソート（優先度）
  const sortByPriority = () => {
    const sorted = [...todos].sort((a, b) =>
      a.priority.localeCompare(b.priority, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );
    setTodos(sorted);
  };

  // ソート（タスク名）
  const sortByName = () => {
    const sorted = [...todos].sort((a, b) =>
      a.value.localeCompare(b.value, "ja")
    );
    setTodos(sorted);
  };

  return {
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
  };
}
