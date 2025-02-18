import "./App.css";
import React from "react";
import Checkbox from "./components/Checkbox";
import { useState } from "react";

type ChordConfig = {
  name?: string;
  inversion?: Array<string>;
  numeral?: string;
  symbol?: string;
};

const generateRandomArrayIdx = (length: number) =>
  Math.floor(Math.random() * length);

const keys = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const numerals = ["i", "ii", "iii", "iv", "v", "vi", "vii"];
const qualities: { [chordType: string]: Array<string> } = {
  triad: ["major", "minor", "dim", "aug"],
  seventh: ["major", "dom", "minor", "half-dim", "dim"],
};
const chordTypes = ["triad", "seventh"];
const inversions: { [chordType: string]: Array<Array<string>> } = {
  triad: [[""], ["6"], ["6", "4"]],
  seventh: [["7"], ["6", "5"], ["4", "3"], ["4", "2"]],
};

// todo: account for harmonic minor raised seventh
// const modes = ["ionian", "aeolian"]

function App() {
  // todo: establish base key major/minor mode before determining chord quality
  // todo: modes?
  // todo: show sharps or flats
  // todo: turn on abbreviations i.e. 6 instead of 6/3
  // todo: compute accidentals dynamically, probably using a flat/neutral/sharp semitone calculator
  // probably will just need to check the interval between different notes
  // this will allow me to provide a "check your answer"
  // todo: generate chord according to scale (i.e. diminished should only appear for vii)
  

  const [activeKeys, setActiveKeys] = useState<Array<string>>([]);
  const [activeChord, setActiveChord] = useState<ChordConfig>({});

  const onKeyClick = (clickedKey: string) => {
    if (activeKeys.includes(clickedKey)) {
      const clickedKeyIdx = activeKeys.findIndex(
        (currentKey) => currentKey === clickedKey
      );
      setActiveKeys((currentKeys) => [
        ...currentKeys.slice(0, clickedKeyIdx),
        ...currentKeys.slice(clickedKeyIdx + 1),
      ]);
    } else {
      setActiveKeys((currentKeys) => [...currentKeys, clickedKey]);
    }
  };

  const generateChord = () => {
    const chordConfig: ChordConfig = {};

    if (activeKeys.length > 0) {
      chordConfig.name = activeKeys[generateRandomArrayIdx(activeKeys.length)];

      const chordType = chordTypes[generateRandomArrayIdx(chordTypes.length)];
      const inversionSet = inversions[chordType];
      const selectedInversion =
        inversionSet[generateRandomArrayIdx(inversionSet.length)];
      chordConfig.inversion = selectedInversion;

      const rawNumeral = numerals[generateRandomArrayIdx(numerals.length)];
      const quality =
        qualities[chordType][
          generateRandomArrayIdx(qualities[chordType].length)
        ];
      const numeral = ["major", "aug"].includes(quality)
        ? rawNumeral.toUpperCase()
        : rawNumeral;
      chordConfig.numeral = numeral;
      if (quality === "aug") {
        chordConfig.symbol = "+";
      } else if (quality === "dim") {
        chordConfig.symbol = "o";
      } else if (quality === "half-dim") {
        chordConfig.symbol = "ø";
      }
    }
    setActiveChord(chordConfig);
  };

  return (
    <div className="App">
      <button
        onClick={() => {
          if (activeKeys.length > 0) {
            setActiveKeys([]);
          } else {
            setActiveKeys(keys);
          }
        }}
      >
        Select / Deselect All
      </button>
      {keys.map((key) => (
        <Checkbox
          key={key}
          keyName={key}
          isSelected={activeKeys.includes(key)}
          onClick={() => {
            onKeyClick(key);
          }}
        />
      ))}
      <button onClick={generateChord}>Generate Chord</button>
      <button
        onClick={() => {
          setActiveChord({});
        }}
      >
        Clear Chord
      </button>
      <div className="chord">
        <div>In the key of {activeChord.name}</div>
        <span className="chordLetter">
          {activeChord?.numeral && activeChord?.numeral}
        </span>
        {activeChord?.symbol && <sup>{activeChord?.symbol}</sup>}
        <div className="fraction">
          {activeChord?.inversion?.[0] && <sup>{activeChord.inversion[0]}</sup>}
          {activeChord?.inversion?.[1] && <sub>{activeChord.inversion[1]}</sub>}
        </div>

        {/* {activeChord.inversion?.map((interval, idx) => 

          idx % 2 == 0 ? (
            <sup>
              <span key={interval} className="inversion">
                {interval}
              </span>
            </sup>
          ) : (
            <sub>
              <span key={interval} className="inversion">
                {interval}
              </span>
            </sub>
          )
        )} */}
      </div>
    </div>
  );
}

export default App;
