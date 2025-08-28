import { use, useCallback, useEffect, useState } from "react";
import localforage from "localforage";
import { category } from "../page/toppage/type";

export function useCategory() {
  const [categories, setCategories] = useState<category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 永続化: 読み込み
  useEffect(() => {
    localforage.getItem("category-react").then((stored) => {
      if (stored) {
        setCategories(stored as category[]);
      }
    });
  }, []);

  // 永続化: 保存
  useEffect(() => {
    localforage.setItem("category-react", categories);
  }, [categories]);

  // チェック状態の更新
  const checkCategory = useCallback((id: number, checked: boolean) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked } : c))
    );
  }, []);

  // カテゴリ更新
  const updateCategories: React.Dispatch<React.SetStateAction<category[]>> = (
    value
  ) => {
    setCategories(value);
  };

  // クリア
  const clearFormCategory = useCallback(() => {
    setCategories((prev) =>
      prev.map((category) => ({ ...category, checked: false }))
    );
  }, []);

  return {
    categories,
    setCategories: updateCategories,
    checkCategory,
    isOpen,
    setIsOpen,
    isFilterOpen,
    setIsFilterOpen,
    clearFormCategory,
  };
}
