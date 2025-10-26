import { chordQualitiesByType } from '../const';
import { onItemClick } from '../utils';
import Checkbox from './Checkbox';
import ToggleAllButton from './ToggleAllButton';

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
      <ToggleAllButton
        toggleSubject="Qualities"
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
      />
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
