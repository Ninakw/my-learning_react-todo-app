import { useCallback, useState } from "react";

type Errors = {
  text?: string;
  date?: string;
  time?: string;
};

export function useTaskForm() {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("0");

  const [errors, setErrors] = useState<Errors>({});
  const [isValid, setIsValid] = useState(true);

  // 入力変更ハンドラ
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
    },
    []
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTime(e.target.value);
    },
    []
  );

  const handlePriorityChange = useCallback((value: string) => {
    setPriority(value);
  }, []);

  const clearForm = useCallback(() => {
    setText("");
    setDate("");
    setTime("");
    setPriority("0");
    setErrors({});
    setIsValid(true);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: Errors = {};

    if (!text.trim()) {
      newErrors.text = "タスク内容を入力してください。";
    }

    const valid = Object.keys(newErrors).length === 0;

    setErrors(newErrors);
    setIsValid(valid);

    return valid;
  }, [text]);

  return {
    text,
    date,
    time,
    priority,
    setText,
    setDate,
    setTime,
    setPriority,
    handleTextChange,
    handleDateChange,
    handleTimeChange,
    handlePriorityChange,
    clearForm,
    validateForm,
    errors,
    isValid,
  };
}
