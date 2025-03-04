import { chordInversionsByChordType, inversionNames } from '../const';
import { onItemClick } from '../utils';
import Checkbox from './Checkbox';

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
      <button
        id="allInversions"
        name="Select / Deselect all inversions"
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
      >
        Select / Deselect all inversions
      </button>
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
