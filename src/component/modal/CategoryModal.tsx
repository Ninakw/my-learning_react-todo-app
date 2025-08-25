import Modal from "react-modal";
import "../../App.css";
import { category } from "../../page/toppage/type";
import { useState } from "react";
import React from "react";
import Header from "../Header";

type CategoryModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: category[];
  setCategories: (newCategories: category[]) => void;
};

const CategoryModal = ({
  isOpen,
  setIsOpen,
  categories,
  setCategories,
}: CategoryModalProps) => {
  const [text, setText] = useState("");

  //テキスト入力時関数
  const handleAddCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  //カテゴリー追加関数
  const handleSubmitCategory = () => {
    const newCategory: category = {
      id: categories.length + 1,
      name: text,
      checked: false,
    };

    const newCategories = [...categories, newCategory];

    setCategories(newCategories);
    setText("");
  };
  return (
    <Modal
      isOpen={isOpen}
      className="large-modal"
      overlayClassName="modal-overlay"
    >
      <Header title="ADD Category" />
      <form>
        <input
          type="text"
          value={text}
          className="input-text"
          onChange={(e) => {
            handleAddCategory(e);
          }}
        />
        <input
          type="button"
          value="ADD"
          className="second-btn"
          onClick={() => {
            handleSubmitCategory();
          }}
        />
        <input
          type="button"
          value={"close"}
          className="main-btn"
          onClick={() =>
            setIsOpen(() => {
              return false;
            })
          }
        />
      </form>
      <ul>
        {categories.map((category) => {
          return <li key={category.id}>{category.name}</li>;
        })}
      </ul>
    </Modal>
  );
};

export default React.memo(CategoryModal);
