import {
  accidentalSymbols,
  blankKey,
  chordInversionsByChordType,
  chordQualities,
  chordQualitiesByType,
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
) => {
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
  setActiveChord
}: {
  activeKeys: GeneratedKey[];
  activeInversions: Array<number>;
  activeQualities: Array<string>;
  activeChordType: string;
  setActiveChord: React.Dispatch<React.SetStateAction<ChordConfig>>
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
    const selectedInversion = activeInversions[inversionIdx];

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

    const chordLetters: Array<GeneratedKey> = [chordKey];

    // Set natural key scale
    const naturalKeyStartIdx = naturalKeys.findIndex(
      (key) => key === chordKey.name
    );
    const naturalKeyLineup = shiftScale(naturalKeyStartIdx, naturalKeys);
    let naturalKeyIdx = 0;

    // find each key by iterating through the key array containing enharmonical equivalents
    // and select keys that match correct natural key names and semitone intervals
    chordQualities[quality].semiToneSpacing
      .slice(0, chordQualitiesByType[activeChordType].length - 1)
      .forEach((spacing) => {
        currentIdx = (currentIdx + spacing) % 12;
        naturalKeyIdx += 2;

        const note = keys
          .find((key, idx) =>
            key.find(
              (keyName) =>
                keyName.key === naturalKeyLineup[naturalKeyIdx] &&
                currentIdx === idx
            )
          )
          ?.find((keyName) => keyName.key === naturalKeyLineup[naturalKeyIdx]);

        if (note) {
          chordLetters.push({
            name: note.key,
            accidental: note.accidental,
          });
        }
      });

    let i = 0;
    while (i < selectedInversion) {
      const movedLetter = chordLetters.shift();
      if (movedLetter) {
        chordLetters.push(movedLetter);
      }
      i += 1;
    }
    chordConfig.notes = chordLetters;
  }
  setActiveChord(chordConfig);
};


export const generateAvailableKeys = (accidentalType: number, activeMode: string) => 
  keys
            .map((key) => selectKey(key, accidentalType, activeMode))
            .filter((key) => {
              return (
                key?.name &&
                ((accidentalType === 0 && !key.isEnharmonic) ||
                  accidentalType !== 0)
              );
            }) as GeneratedKey[];

