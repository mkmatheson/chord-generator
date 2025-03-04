import { waveforms } from '../const';
import { ChordConfig } from '../types';
import { stopOscillators } from '../utils';
import ResultChord from './ResultChord';

const ChordDisplay = ({
  activeChord,
  oscList,
  generateChord,
  clearChord,
  playChord
}: {
  activeChord: ChordConfig;
  oscList: OscillatorNode[];
  generateChord: () => void;
  clearChord: () => void;
  playChord: () => void;
}) => {
  return (
    <div>
      <button id="generateChord" onClick={generateChord}>
        Generate Chord
      </button>
      <button onClick={clearChord}>Clear Chord</button>
      <ResultChord activeChord={activeChord} />
      <br />
      <button onClick={playChord}>play chord</button>
      <button onClick={() => stopOscillators(oscList)}>stop noise</button>
      <br />
      <div>
        <span>Current waveform: </span>
        <select name="waveform">
          {waveforms.map((waveform) => (
            <option key={waveform} value={waveform.toLowerCase()}>
              {waveform}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default ChordDisplay;
