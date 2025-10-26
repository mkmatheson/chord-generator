import { chordInversionsByChordType, inversionNames } from '../const';
import { onItemClick } from '../utils';
import Checkbox from './Checkbox';
import ToggleAllButton from './ToggleAllButton';

const ChordInversions = ({
  activeChordType,
  activeInversions,
  setActiveInversions
}: {
  activeChordType: string;
  activeInversions: number[];
  setActiveInversions: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  return (
    <div className="column">
      {/* Generate chord inversions */}
      <ToggleAllButton
        toggleSubject="Inversions"
        onClick={() => {
          if (
            activeInversions.length <
            chordInversionsByChordType[activeChordType].length
          ) {
            setActiveInversions(
              chordInversionsByChordType[activeChordType].map((_, idx) => idx)
            );
          } else {
            setActiveInversions([]);
          }
        }}
      />
      {chordInversionsByChordType[activeChordType].map((_, idx) => (
        <Checkbox
          key={inversionNames[idx]}
          keyName={inversionNames[idx]}
          isSelected={activeInversions.includes(idx)}
          onClick={() =>
            onItemClick(idx, activeInversions, setActiveInversions)
          }
        />
      ))}
    </div>
  );
};

export default ChordInversions;
