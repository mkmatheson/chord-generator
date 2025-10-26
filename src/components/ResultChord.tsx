import React, { useState } from 'react';
import { accidentalSymbols } from '../const';
import { ChordConfig } from '../types';

const ResultChord = ({ activeChord }: { activeChord: ChordConfig }) => {
  const [showNotes, setShowNotes] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  return (
    <div>
      <div className="chord"></div>
      <button
        onClick={() => {
          setShowNotes((prevState) => !prevState);
        }}
      >
        Toggle notes
      </button>
      <br />
      <span className="chordLetter">
        {activeChord?.tonic &&
          `${activeChord?.tonic.name}${accidentalSymbols[activeChord.tonic.accidental || 0]}`}
      </span>
      {activeChord?.symbol && <sup>{activeChord?.symbol}</sup>}
      <div className="fraction">
        {activeChord?.inversion?.[0] && activeChord?.inversion?.[1] && (
          <span>
            <sup>{activeChord.inversion[0]}</sup>
            <sub>{activeChord.inversion[1]}</sub>
          </span>
        )}
        {activeChord?.inversion?.[0] && !activeChord?.inversion?.[1] && (
          <span>
            <sup>{activeChord.inversion[0]}</sup>
            <span>&ensp;</span>
          </span>
        )}
      </div>
      {showNotes && (
        <div>
          {activeChord?.notes?.map(
            (note) => ` ${note.name}${accidentalSymbols[note.accidental || 0]} `
          )}
          <br />
          {activeChord.tonic && activeChord.inversion && activeChord.notes
            ? `${activeChord.inversionName} inversion`
            : 'Select a value from each column and click Generate Chord'}
        </div>
      )}
    </div>
  );
};

export default ResultChord;
