import React from "react";
const Checkbox = ({
  keyName,
  isSelected,
  onClick,
  disabled
}: {
  keyName: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean
}) => {
  return (
    <div>
      <input
        type="checkbox"
        name={keyName}
        onClick={onClick}
        checked={isSelected}
        disabled={disabled}
      />
      <label>{keyName}</label>
    </div>
  );
};

export default Checkbox;
