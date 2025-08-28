import React from "react";
type RadioProps = {
  radioName: string;
  checkedValue: string;
  labelAndValueArray: LabelandValue[];

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
            <label>
              <input
                type="radio"
                name={radioName}
                value={item.value}
                onChange={handleRadio}
                checked={checkedValue === item.value}
                className="radio-input"
              />
              <span className="input-label">{item.label}</span>
            </label>
          </React.Fragment>
        );
      })}
    </>
  );
};
export default React.memo(Radio);
