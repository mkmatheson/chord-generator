import { useState } from 'react';
import { waveforms } from '../const';
import { ChordConfig } from '../types';
import { stopOscillators } from '../utils';
import ResultChord from './ResultChord';

const ChordDisplay = ({
  activeChord,
  oscList,
  generateChord,
  clearChord,
  playChord,
  isPaused,
  isMuted,
  setIsMuted,
  setWaveform
}: {
  activeChord: ChordConfig;
  oscList: OscillatorNode[];
  generateChord: () => void;
  clearChord: () => void;
  playChord: (isMuted: boolean) => void;
  isPaused: boolean;
  isMuted: boolean;
  setIsMuted: () => void;
  setWaveform: (waveform: OscillatorType) => void;
}) => {
  return (
    <div>
      <button id="generateChord" onClick={generateChord}>
        Generate Chord
      </button>
      <button onClick={clearChord}>Clear Chord</button>
      <ResultChord activeChord={activeChord} />
      <br />
      <button onClick={() => playChord(isMuted)}>
        {isPaused ? '⏵' : '⏹'}
      </button>
      <button onClick={setIsMuted}>{isMuted ? 'unmute' : 'mute'}</button>
      <br />
      <div>
        <span>Current waveform: </span>
        <select
          name="waveform"
          onChange={(event) =>
            setWaveform(event.target.value as OscillatorType)
          }
        >
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
