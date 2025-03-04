import { chordQualitiesByType } from '../const';
import { onItemClick } from '../utils';
import Checkbox from './Checkbox';

const ChordQualities = ({
  activeQualities,
  activeChordType,
  setActiveQualities
}: {
  activeChordType: string;
  activeQualities: string[];
  setActiveQualities: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <div className="column">
      {/* Generate chord qualities */}
      <button
        id="allQualities"
        name="Select / Deselect all qualities"
        onClick={() => {
          if (
            activeQualities.length <
            chordQualitiesByType[activeChordType].length
          ) {
            setActiveQualities(chordQualitiesByType[activeChordType].chords);
          } else {
            setActiveQualities([]);
          }
        }}
      >
        Select / Deselect all qualities
      </button>

      {chordQualitiesByType[activeChordType].chords.map((quality) => (
        <Checkbox
          key={quality}
          keyName={quality}
          isSelected={activeQualities.includes(quality)}
          onClick={() => {
            onItemClick(quality, activeQualities, setActiveQualities);
          }}
        />
      ))}
    </div>
  );
};

export default ChordQualities;
