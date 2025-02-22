import "./App.css";
import React, { useEffect } from "react";
import Checkbox from "./components/Checkbox";
import { useState } from "react";
import {
  chordInversionsByChordType,
  accidentals,
  accidentalSymbols,
  keys,
  chordTypes,
  chordQualitiesByType,
  inversionNames,
} from "./const";
import {
  generateAvailableKeys,
  generateChord,
  onItemClick,
  selectKey,
} from "./utils";
import { ChordConfig, GeneratedKey, KeyNames } from "./types";
import ResultChord from "./components/ResultChord";

function App() {


  const [activeKeys, setActiveKeys] = useState<GeneratedKey[]>([]); // C, Db, Eb
  const [activeChordType, setActiveChordType] = useState<string>("triad"); // triad or seventh
  const [activeChord, setActiveChord] = useState<ChordConfig>({});
  const [activeQualities, setActiveQualities] = useState<string[]>([]); // maj, min, dom
  const [activeInversions, setActiveInversions] = useState<number[]>([]); // 0, 1, 2
  const [accidentalType, setAccidentalType] = useState<number>(-1); // # or b
  const [activeMode] = useState<string>("ionian");

  // show sharps or flats
  useEffect(() => {
    if (accidentalType > 0) {
      setActiveKeys((activeKeys) =>
        activeKeys.filter((key) => key.accidental !== -1 && !key.isEnharmonic)
      );
    } else {
      setActiveKeys((activeKeys) =>
        activeKeys.filter((key) => key.accidental !== 1 && !key.isEnharmonic)
      );
    }
  }, [accidentalType]);

  return (
    <div className="App">
      {/* Generate accidentals for notation */}
      <button
        onClick={() => {
          const availableKeys = generateAvailableKeys(
            accidentalType,
            activeMode
          );
          if (activeKeys.length === availableKeys.length) {
            setActiveKeys([]);
          } else {
            setActiveKeys(availableKeys);
          }
        }}
      >
        Select / Deselect All
      </button>
      {accidentals.map((accidental) => (
        <div key={accidental.name}>
          <input
            type="radio"
            id={accidental.name}
            name={accidental.name}
            value={accidental.value}
            checked={accidentalType === accidental.value}
            onClick={() => setAccidentalType(accidental.value)}
          />
          <label htmlFor={accidental.name}>{accidental.name}</label>
        </div>
      ))}
      {/* Generate all keys (tonics) */}
      <div key={"all keys"}>
        <input
          type="radio"
          id={"all keys"}
          name={"all keys"}
          value={0}
          checked={accidentalType === 0}
          onClick={() => setAccidentalType(0)}
        />
        <label htmlFor={"all keys"}>{"All keys"}</label>
      </div>
      {keys.map((key: KeyNames) => {
        const selectedKey = selectKey(key, accidentalType, activeMode);
        if (selectedKey) {
          return (
            <Checkbox
              key={`${selectedKey.name}${accidentalSymbols[selectedKey.accidental || 0]}`}
              disabled={selectedKey.name.includes("/")}
              keyName={`${selectedKey.name}${accidentalSymbols[selectedKey.accidental || 0]}`}
              isSelected={
                !!activeKeys.find(
                  (activeKey) =>
                    activeKey.name === selectedKey.name &&
                    activeKey.accidental === selectedKey.accidental
                )
              }
              onClick={() => {
                onItemClick(
                  selectedKey,
                  activeKeys,
                  setActiveKeys,
                  (currentKey: GeneratedKey) =>
                    currentKey.name === selectedKey.name &&
                    currentKey.accidental === selectedKey.accidental
                );
              }}
            />
          );
        }
        return undefined;
      })}
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
      {/* Generate chord qualities */}
      <input
        type="checkbox"
        id="allQualities"
        name="Select / Deselect all qualities"
        checked={
          activeQualities.length ===
            chordQualitiesByType[activeChordType].chords.length &&
          activeQualities.every((quality) =>
            chordQualitiesByType[activeChordType].chords.includes(quality)
          )
        }
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
      <label>{"Select / Deselect all qualities"}</label>
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
      {/* Generate chord inversions */}
      <input
        type="checkbox"
        id="allInversions"
        name="Select / Deselect all inversions"
        checked={
          activeInversions.length ===
            chordInversionsByChordType[activeChordType].length &&
          chordInversionsByChordType[activeChordType].every((_, idx) =>
            activeInversions.includes(idx)
          )
        }
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
      <label>{"Select / Deselect all inversions"}</label>
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
      {/* Generate and display chord */}
      <button
        onClick={() =>
          generateChord({
            activeKeys,
            activeInversions,
            activeQualities,
            activeChordType,
            setActiveChord,
          })
        }
      >
        Generate Chord
      </button>
      <button
        onClick={() => {
          setActiveChord({});
        }}
      >
        Clear Chord
      </button>
      <ResultChord activeChord={activeChord} />
    </div>
  );
}

export default App;
