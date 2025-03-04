import { chordTypes } from '../const';

const ChordLengths = ({
  activeChordType,
  setActiveChordType
}: {
  activeChordType: string;
  setActiveChordType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="column">
      {/* Generate chord lengths */}
      {chordTypes.map((chordType: string) => (
        <div key={chordType}>
          <input
            type="radio"
            id={chordType}
            name={chordType}
            value={chordType}
            checked={activeChordType === chordType}
            onClick={() => setActiveChordType(chordType)}
          />
          <label>{chordType}</label>
        </div>
      ))}
    </div>
  );
};

export default ChordLengths;
