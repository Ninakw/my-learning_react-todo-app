import { useCallback, useState } from "react";
import { category } from "../page/toppage/type";

type Errors = {
  name?: string;
};

export function useCategoryForm(categories: category[]) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [isValid, setIsValid] = useState(true);

  //テキスト入力時関数
  const handleAddCategory = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

  const validate = useCallback(() => {
    const newErrors: Errors = {};

    if (!text.trim()) {
      newErrors.name = "カテゴリー名を入力してください。";
    } else if (
      categories.some(
        (c) => c.name.trim().toLowerCase() === text.trim().toLowerCase()
      )
    ) {
      newErrors.name = "同じ名前のカテゴリーがすでに存在します。";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [text, categories]);

  const clear = useCallback(() => {
    setText("");
    setErrors({});
    setIsValid(true);
  }, []);

  return {
    text,
    handleAddCategory,
    validate,
    clear,
    errors,
  };
}
