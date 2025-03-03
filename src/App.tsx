import './App.css';
import React, { useEffect, useRef } from 'react';
import Checkbox from './components/Checkbox';
import { useState } from 'react';
import {
  chordInversionsByChordType,
  accidentals,
  accidentalSymbols,
  keys,
  chordTypes,
  chordQualitiesByType,
  inversionNames,
  waveforms
} from './const';
import {
  generateAvailableKeys,
  generateChord,
  onItemClick,
  playTone,
  selectKey,
  stopOscillators
} from './utils';
import { ChordConfig, GeneratedKey, KeyNames } from './types';
import ResultChord from './components/ResultChord';

function App() {
  // to read:
  // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
  // https://developer.mozilla.org/en-US/docs/Web/API/PeriodicWave

  const audioContextRef = useRef<AudioContext>(null);
  const mainGainNodeRef = useRef<GainNode>(null);
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    mainGainNodeRef.current = audioContextRef.current.createGain();

    mainGainNodeRef.current.connect(audioContextRef.current.destination);
    mainGainNodeRef.current.gain.value = 0.1;
  }, []);

  console.log({ audioContextRef, mainGainNodeRef });

  // let noteFreq = null;
  // let customWaveform = null;
  // let sineTerms = null;
  // let cosineTerms = null;

  // sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  // cosineTerms = new Float32Array(sineTerms.length);
  // customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

  // TODO: select triads AND sevenths
  // select enharmonic keys i.e. showEnharmonicKeysAs
  // TODO: play chord on generate toggle
  // TODO: bug: if F is selected and i switch to sharps, it doesn't unselect

  const [activeKeys, setActiveKeys] = useState<GeneratedKey[]>([
    { name: 'C', accidental: 0 }
  ]); // C, Db, Eb
  const [activeChordType, setActiveChordType] = useState<string>('triad'); // triad or seventh
  const [activeChord, setActiveChord] = useState<ChordConfig>({});
  const [activeQualities, setActiveQualities] = useState<string[]>(['maj']); // maj, min, dom
  const [activeInversions, setActiveInversions] = useState<number[]>([0]); // 0, 1, 2
  const [accidentalType, setAccidentalType] = useState<number>(-1); // # or b
  const [activeMode] = useState<string>('ionian');
  const [waveForm] = useState<OscillatorType>('sine');
  const [oscList, setOscList] = useState<OscillatorNode[]>([]);

  // play chord when change
  useEffect(() => {
    stopOscillators(oscList);
    setOscList(
      activeChord.notes
        ?.map((note) => {
          return playTone({
            freq: note.hz,
            audioContext: audioContextRef.current,
            waveFormType: waveForm,
            gainNode: mainGainNodeRef.current
          });
        })
        .filter((osc) => !!osc) || []
    );
  }, [activeChord.notes, waveForm]);

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
      <section className="builder">
        <div className="column">
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
          <div key={'all keys'}>
            <input
              type="radio"
              id={'all keys'}
              name={'all keys'}
              value={0}
              checked={accidentalType === 0}
              onClick={() => setAccidentalType(0)}
            />
            <label htmlFor={'all keys'}>{'All keys'}</label>
          </div>
          {keys.map((key: KeyNames) => {
            const selectedKey = selectKey(key, accidentalType, activeMode);
            if (selectedKey) {
              return (
                <Checkbox
                  key={`${selectedKey.name}${accidentalSymbols[selectedKey.accidental || 0]}`}
                  disabled={selectedKey.name.includes('/')}
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
        </div>
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
                setActiveQualities(
                  chordQualitiesByType[activeChordType].chords
                );
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
                  chordInversionsByChordType[activeChordType].map(
                    (_, idx) => idx
                  )
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
        <div className="column">
          TODOS:
          <ul>
            <li>Make the site look pretty</li>
            <li>Allow for selecting triads AND sevenths (and 9ths? 11ths?)</li>
            <li>Keep sound off upon chord re-generation</li>
            <li>Roman numeral notation</li>
            <li>Modes?</li>
            <li>when displaying flats and sharps, prefer the sharp or flat of an enharmonic key, allowing for all keys to be selected</li>
            <li>Bug: if a flat key is still selected when switching to sharps, it is still included in the list of potential chord roots</li>
          </ul>
        </div>
      </section>
      {/* Generate and display chord */}
      <button
        id="generateChord"
        onClick={() => {
          stopOscillators(oscList);
          generateChord({
            activeKeys,
            activeInversions,
            activeQualities,
            activeChordType,
            setActiveChord
          });
        }}
      >
        Generate Chord
      </button>
      <button
        onClick={() => {
          stopOscillators(oscList);
          setActiveChord({});
        }}
      >
        Clear Chord
      </button>
      <ResultChord activeChord={activeChord} />
      <br />
      <button
        onClick={() => {
          stopOscillators(oscList);
          setOscList(
            activeChord.notes
              ?.map((note) => {
                return playTone({
                  freq: note.hz,
                  audioContext: audioContextRef.current,
                  waveFormType: waveForm,
                  gainNode: mainGainNodeRef.current
                });
              })
              .filter((osc) => !!osc) || []
          );
        }}
      >
        play chord
      </button>
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
}

export default App;
