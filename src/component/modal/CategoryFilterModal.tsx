import Modal from "react-modal";
import "../../App.css";
import { category } from "../../page/toppage/type";
import { useCallback, useState } from "react";
import React from "react";
import Header from "../Header";

type CategoryFilterModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: category[];
  setCategories: React.Dispatch<React.SetStateAction<category[]>>;
  setFilterCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

const CategoryFilterModal = ({
  isOpen,
  setIsOpen,
  categories,
  setCategories,
  setFilterCategories,
}: CategoryFilterModalProps) => {
  //チェックボックス選択関数
  const handleCheckCategory = useCallback(
    (id: number, filterChecked: boolean) => {
      console.log(filterChecked);
      setCategories((category) => {
        const selectCategory = category.map((category) => {
          if (id === category.id) {
            console.log(category);
            return { ...category, filterChecked: filterChecked };
          }
          return category;
        });
        return selectCategory;
      });
    },
    [categories]
  );

  // フィルターボタン押下時関数
  const handleSubmitCategory = () => {
    console.log(categories);
    setIsOpen(false);

    setFilterCategories(() => {
      const newFilterdCategory = categories
        .filter((category) => {
          return category.filterChecked;
        })
        .map((selected) => {
          return selected.name;
        });
      return newFilterdCategory;
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      className="small-modal"
      overlayClassName="modal-overlay"
    >
      <Header title="Priority Filter" />
      <form>
        {categories.map((category) => {
          return (
            <li key={category.id}>
              <input
                type="checkbox"
                value={category.name}
                className="category-chk-box"
                id={category.name}
                checked={category.filterChecked}
                onChange={() => {
                  console.log("clicked");
                  handleCheckCategory(category.id, !category.filterChecked);
                }}
              />
              <label htmlFor={category.name} className="category-chk-box">
                {category.name}
              </label>
            </li>
          );
        })}
        <br />
        <input
          type="button"
          value="Filter"
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
    </Modal>
  );
};

export default React.memo(CategoryFilterModal);
