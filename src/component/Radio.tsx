import React from "react";
type RadioProps = {
  radioName: string;
  checkedValue: string;
  labelAndValueArray: LabelandValue[];
  inputClassName?: string;
  labelClassName?: string;
  onChangeFunction: (str: string) => void;
};

type LabelandValue = {
  id: number;
  label: string;
  value: string;
};

const Radio = ({
  radioName,
  checkedValue,
  labelAndValueArray,
  inputClassName,
  labelClassName,
  onChangeFunction,
}: RadioProps) => {
  // ラジオボタン押下関数
  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFunction(e.target.value);
  };

  return (
    <>
      {labelAndValueArray.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <input
              type="radio"
              name={radioName}
              value={item.value}
              onChange={handleRadio}
              checked={checkedValue === item.value}
              className={inputClassName}
            />
            <label className={labelClassName}>{item.label}</label>
          </React.Fragment>
        );
      })}
    </>
  );
};
export default React.memo(Radio);
