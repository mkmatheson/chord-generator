import './App.css';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { generateChord, playTone, stopOscillators } from './utils';
import { ChordConfig, GeneratedKey } from './types';
import Notes from './components/Notes';
import ChordLengths from './components/ChordLengths';
import ChordQualities from './components/ChordQualities';
import ChordInversions from './components/ChordInversions';
import Todos from './components/Todos';
import ChordDisplay from './components/ChordDisplay';
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
        <Notes
          accidentalType={accidentalType}
          activeMode={activeMode}
          activeKeys={activeKeys}
          setActiveKeys={setActiveKeys}
          setAccidentalType={setAccidentalType}
        />
        <ChordLengths
          activeChordType={activeChordType}
          setActiveChordType={setActiveChordType}
        />
        <ChordQualities
          activeChordType={activeChordType}
          activeQualities={activeQualities}
          setActiveQualities={setActiveQualities}
        />
        <ChordInversions
          activeChordType={activeChordType}
          activeInversions={activeInversions}
          setActiveInversions={setActiveInversions}
        />
        <Todos />
      </section>
      {/* Generate and display chord */}
      <ChordDisplay
        activeChord={activeChord}
        oscList={oscList}
        playChord={() => {
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
        clearChord={() => {
          stopOscillators(oscList);
          setActiveChord({});
        }}
        generateChord={() => {
          stopOscillators(oscList);
          generateChord({
            activeKeys,
            activeInversions,
            activeQualities,
            activeChordType,
            setActiveChord
          });
        }}
      />
    </div>
  );
}

export default App;
