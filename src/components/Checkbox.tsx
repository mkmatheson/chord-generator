import React from "react";
const Checkbox = ({
  keyName,
  isSelected,
  onClick,
}: {
  keyName: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div>
      <input
        type="checkbox"
        name={keyName}
        onClick={onClick}
        checked={isSelected}
      />
      <label>{keyName}</label>
    </div>
  );
};

export default Checkbox;
