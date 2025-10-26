const ToggleAllButton = ({
  toggleSubject,
  onClick
}: {
  toggleSubject: string;
  onClick: () => void;
}) => {
  return (
    <div>
      <button onClick={onClick}>Toggle All {toggleSubject}</button>
      <button onClick={onClick}>Randomize {toggleSubject}</button>
    </div>
  );
};

export default ToggleAllButton;
