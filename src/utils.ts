import {
  accidentalSymbols,
  blankKey,
  chordInversionsByChordType,
  chordQualities,
  chordQualitiesByType,
  inversionNames,
  keyRelationToANatural,
  keys,
  naturalKeys,
} from "./const";
import { ChordConfig, GeneratedKey, KeyNames, KeyNote } from "./types";

export const generateRandomArrayIdx = (length: number) =>
  Math.floor(Math.random() * length);

// remember that index starts at 0, so for aeolian, for example, we should put index + 5 I think
export const shiftScale = (index: number, notes: Array<string | number>) =>
  [...notes].slice(index).concat([...notes].slice(0, index));

export const onItemClick = <T extends string | number | GeneratedKey>(
  clickedValue: T,
  activeValues: T[],
  setActiveValues: React.Dispatch<React.SetStateAction<T[]>>,
  searchPredicate = (currVal: T) =>
    currVal.toString() === clickedValue.toString()
) => {
  const clickedKeyIdx = activeValues.findIndex(searchPredicate);

  if (clickedKeyIdx !== -1) {
    setActiveValues((currentKeys) => [
      ...currentKeys.slice(0, clickedKeyIdx),
      ...currentKeys.slice(clickedKeyIdx + 1),
    ]);
  } else {
    setActiveValues((prevActiveValues) => [...prevActiveValues, clickedValue]);
  }
};

export const selectKey = (
  key: KeyNames,
  accidentalType: number,
  selectedMode: string
): GeneratedKey | undefined => {
  let selectedKey: KeyNote =
    key.find((entry) => entry.accidental === 0 && !entry.isEnharmonic) ||
    blankKey;
  if (!selectedKey.key) {
    if (key.some((keyNote) => keyNote.isEnharmonic)) {
      if (accidentalType === 0) {
        const newKeys = key.map((keyNote) => generateKey(keyNote));
        return {
          name: newKeys
            .map(
              (newKeyNote) =>
                `${newKeyNote.name}${accidentalSymbols[newKeyNote.accidental || 0]}`
            )
            .join("/"),
          accidental: 0,
          isEnharmonic: true,
        };
      } else {
        const possibleKeyNote = key.find(
          (keyNote) => keyNote.accidentalType === accidentalType
        );
        if (possibleKeyNote) {
          selectedKey = possibleKeyNote;
        }
      }
    } else {
      selectedKey =
        key.find(
          (entry) =>
            entry.accidental === accidentalType ||
            (accidentalType === 0 &&
              entry.modes &&
              entry.modes.includes(selectedMode))
        ) || blankKey;
    }
  }

  if (
    (selectedKey.modes && !selectedKey.modes.includes(selectedMode)) ||
    (selectedKey.accidentalType &&
      accidentalType !== 0 &&
      selectedKey.accidentalType !== accidentalType)
  ) {
    return;
  }
  return generateKey(selectedKey);
};

export const generateKey = (selectedKey: KeyNote): GeneratedKey => {
  return {
    name: selectedKey.key,
    accidental: selectedKey.accidental,
    isEnharmonic: selectedKey.isEnharmonic,
  };
};

export const generateChord = ({
  activeKeys,
  activeInversions,
  activeQualities,
  activeChordType,
  setActiveChord,
}: {
  activeKeys: GeneratedKey[];
  activeInversions: Array<number>;
  activeQualities: Array<string>;
  activeChordType: string;
  setActiveChord: React.Dispatch<React.SetStateAction<ChordConfig>>;
}) => {
  const chordConfig: ChordConfig = {};

  if (
    activeKeys.length > 0 &&
    activeInversions.length > 0 &&
    activeQualities.length > 0
  ) {
    // set chord tonic
    const chordKeyIdx = generateRandomArrayIdx(activeKeys.length);
    const chordKey = activeKeys[chordKeyIdx];
    chordConfig.tonic = chordKey;

    // set inversion (root, 1st, 2nd)
    const inversionIdx =
      activeInversions[
        generateRandomArrayIdx(activeInversions.sort((a, b) => a - b).length)
      ];

    chordConfig.inversionName = inversionNames[inversionIdx];

    chordConfig.inversion =
      chordInversionsByChordType[activeChordType][inversionIdx];

    // set chord quality
    const quality =
      activeQualities[generateRandomArrayIdx(activeQualities.length)];

    chordConfig.symbol = chordQualities[quality].symbol;

    // TODO: roman numeral for mode-based generator
    // const rawNumeral = numerals[generateRandomArrayIdx(numerals.length)];
    // const numeral = ["maj", "aug"].includes(quality)
    //   ? rawNumeral.toUpperCase()
    //   : rawNumeral;
    // chordConfig.numeral = numeral;

    // Find tonic
    let currentIdx = keys.findIndex((key) =>
      key.find(
        (keyName) =>
          keyName.key === chordKey.name &&
          keyName.accidental === chordKey.accidental
      )
    );

    // Set natural key scale
    const naturalKeyStartIdx = naturalKeys.findIndex(
      (key) => key === chordKey.name
    );
    const naturalKeyLineup = shiftScale(naturalKeyStartIdx, naturalKeys);
    let naturalKeyIdx = 0;

    // todo: find distance between Anatural and corresponding note

    // const rootSpacing = naturalKeyLineup.
    // const hzSpacings = []

    const chordLetters: Array<GeneratedKey> = [chordKey];
    // find each key by iterating through the key array containing enharmonical equivalents
    // and select keys that match correct natural key names and semitone intervals
    chordQualities[quality].semiToneSpacing
      .slice(0, chordQualitiesByType[activeChordType].length - 1)
      .forEach((spacing) => {
        currentIdx = (currentIdx + spacing) % 12;
        naturalKeyIdx += 2;

        const noteIdx = keys.findIndex((key, idx) =>
          key.find(
            (keyName) =>
              keyName.key === naturalKeyLineup[naturalKeyIdx] &&
              currentIdx === idx
          )
        );

        console.log("noteIdx", noteIdx);
        const note = keys[noteIdx]?.find(
          (keyName) => keyName.key === naturalKeyLineup[naturalKeyIdx]
        );

        // RESUME: why does the hz only generate 880?
        console.log(keyRelationToANatural[noteIdx]);

        if (note) {
          chordLetters.push({
            name: note.key,
            accidental: note.accidental,
          });
        }
      });

    let i = 0;
    while (i < inversionIdx) {
      const movedLetter = chordLetters.shift();
      if (movedLetter) {
        chordLetters.push(movedLetter);
      }
      i += 1;
    }

    // TODO: A-flat keeps jumping up unnecessarily
    // likely due to how I'm calculating the Ab

    // Set natural key scale
    const hzKeyStartIdx = naturalKeys.findIndex(
      (key) => key === chordLetters[0].name
    );
    const hzKeyScale = shiftScale(hzKeyStartIdx, naturalKeys);
    const A4idx = hzKeyScale.findIndex((key) => key === "A");

    chordLetters.forEach((chordLetter) => {
      const naturalKeyIdx = hzKeyScale.findIndex(
        (key) => key === chordLetter.name
      );
      const hzOffset = naturalKeyIdx - A4idx <= 0 ? 0 : 1;
      const keyIdx = keys.findIndex((key) =>
        key.find(
          (keyName) =>
            keyName.key === chordLetter.name &&
            chordLetter.accidental === keyName.accidental
        )
      );

      chordLetter.hz =
        440 * 2 ** ((0 + keyRelationToANatural[keyIdx][hzOffset]) / 12);
    });
    chordConfig.notes = chordLetters;
    console.log(chordLetters);
  }
  setActiveChord(chordConfig);
};

export const generateAvailableKeys = (
  accidentalType: number,
  activeMode: string
) =>
  keys
    .map((key) => selectKey(key, accidentalType, activeMode))
    .filter((key) => {
      return (
        key?.name &&
        ((accidentalType === 0 && !key.isEnharmonic) || accidentalType !== 0)
      );
    }) as GeneratedKey[];

export const playTone = ({
  freq = 0,
  audioContext,
  gainNode,
  waveFormType,
}: {
  freq?: number;
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  waveFormType: OscillatorType;
}) => {
  if(audioContext && gainNode){
    const osc = audioContext.createOscillator();
    osc.connect(gainNode);
  
    // const type = wavePicker.options[wavePicker.selectedIndex].value;
  
    // if (waveFormType === "custom") {
    //   osc.setPeriodicWave(customWaveform);
    // } else {
    osc.type = waveFormType;
    // }
  
    osc.frequency.value = freq;
    osc.start();
  
    return osc;
  }
  return
  
};
