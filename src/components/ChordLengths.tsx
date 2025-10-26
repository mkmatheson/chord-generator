import { chordTypes } from '../const';
import { onItemClick } from '../utils';
import Checkbox from './Checkbox';
import ToggleAllButton from './ToggleAllButton';

const ChordLengths = ({
  activeChordTypes,
  setActiveChordTypes
}: {
  activeChordTypes: Array<string>;
  setActiveChordTypes: React.Dispatch<React.SetStateAction<Array<string>>>;
}) => {
  return (
    <div className="column">
      <ToggleAllButton
        toggleSubject="Types"
        onClick={() => {
          if (
            activeChordTypes.length >= 0 &&
            activeChordTypes.length < chordTypes.length
          ) {
            setActiveChordTypes(chordTypes);
          } else {
            setActiveChordTypes([]);
          }
        }}
      />
      {/* Generate chord lengths */}
      {chordTypes.map((chordType: string) => (
        <Checkbox
          key={chordType}
          keyName={chordType}
          isSelected={activeChordTypes.includes(chordType)}
          onClick={() => {
            onItemClick(chordType, activeChordTypes, setActiveChordTypes);
          }}
        />
      ))}
    </div>
  );
};

export default ChordLengths;
