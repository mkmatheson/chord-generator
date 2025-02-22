import React from "react";
import { accidentalSymbols } from "../const";
import { ChordConfig } from "../types";

const ResultChord = ({ activeChord }: { activeChord: ChordConfig }) => {
  return (
    <div>
      <div className="chord"></div>
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
      <div>
        {activeChord?.notes?.map(
          (note) => ` ${note.name}${accidentalSymbols[note.accidental || 0]} `
        )}
      </div>
    </div>
  );
};

export default ResultChord;
