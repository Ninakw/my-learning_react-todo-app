import Modal from "react-modal";
import "../../App.css";
import { category } from "../../page/toppage/type";
import { useState } from "react";
import React from "react";
import Header from "../Header";
import { useCategoryForm } from "../../hooks/useCategoryForm";

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
  const { text, handleAddCategory, validate, clear, errors } =
    useCategoryForm(categories);

  //カテゴリー追加関数
  const handleSubmitCategory = () => {
    if (!validate()) return;
    const newCategory: category = {
      id: categories.length + 1,
      name: text,
      checked: false,
    };

    const newCategories = [...categories, newCategory];

    setCategories(newCategories);
    clear();
    setIsOpen(false);
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
              clear();
              return false;
            })
          }
        />
        {errors.name && <p className="error">{errors.name}</p>}
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
