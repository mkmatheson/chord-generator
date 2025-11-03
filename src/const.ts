import { KeyNote } from './types';

// todo: make key remapper so I can reuse the existing keys array but for different modes
// i.e. map C to A

export const naturalKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const keyRelationToANatural = [
  [-9, 3],
  [-8, 4],
  [-7, 5],
  [-6, 6],
  [-5, 7],
  [-4, 8],
  [-3, 9],
  [-2, 10],
  [-1, 11],
  [0, 0],
  [-11, 1],
  [-10, 2]
];

export const keys = [
  [
    { key: 'B', accidental: 1 },
    { key: 'C', accidental: 0, modes: ['ionian'] },
    { key: 'D', accidental: -2 }
  ],
  [
    {
      key: 'C',
      accidental: 1,
      modes: ['ionian'],
      isEnharmonic: true,
      accidentalType: 1
    },
    {
      key: 'D',
      accidental: -1,
      accidentalType: -1,
      modes: ['ionian'],
      isEnharmonic: true
    }
  ],
  [
    { key: 'D', accidental: 0, accidentalType: 1, modes: ['ionian'] },
    { key: 'E', accidental: -2 }
  ],
  [
    { key: 'D', accidental: 1, modes: ['aeolian'] },
    { key: 'E', accidental: -1, modes: ['ionian'] },
    { key: 'F', accidental: -2 }
  ],
  [
    { key: 'F', accidental: -1 },
    { key: 'E', accidental: 0, accidentalType: 1, modes: ['ionian'] }
  ],
  [
    { key: 'E', accidental: 1 },
    { key: 'F', accidental: 0, accidentalType: -1, modes: ['ionian'] },
    { key: 'G', accidental: -2 }
  ],
  [
    {
      key: 'F',
      accidental: 1,
      accidentalType: 1,
      modes: ['ionian'],
      isEnharmonic: true
    },
    {
      key: 'G',
      accidental: -1,
      accidentalType: -1,
      modes: ['ionian'],
      isEnharmonic: true
    }
  ],
  [
    { key: 'G', accidental: 0, accidentalType: 1, modes: ['ionian'] },
    { key: 'F', accidental: 2 },
    { key: 'A', accidental: -2 }
  ],
  [
    { key: 'G', accidental: 1, modes: ['aeolian'] },
    { key: 'A', accidental: -1, modes: ['ionian'] },
    { key: 'B', accidental: -3 }
  ],
  [
    { key: 'A', accidental: 0, accidentalType: 1, modes: ['ionian'] },
    { key: 'G', accidental: 2 },
    { key: 'B', accidental: -2 }
  ],
  [
    { key: 'A', accidental: 1, modes: ['aeolian'] },
    { key: 'B', accidental: -1, modes: ['ionian'] },
    { key: 'C', accidental: -2 }
  ],
  [
    {
      key: 'B',
      accidental: 0,
      accidentalType: 1,
      modes: ['ionian'],
      isEnharmonic: true
    },
    {
      key: 'C',
      accidental: -1,
      accidentalType: -1,
      modes: ['ionian'],
      isEnharmonic: true
    }
  ]
];

export const blankKey: KeyNote = { key: '', accidental: 0, modes: [] };

export const chordTypes = ['triad', 'seventh'];

export const chordQualitiesByType: {
  [key: string]: { chords: string[]; length: number };
} = {
  triad: {
    chords: ['maj', 'min', 'dim', 'aug'],
    length: 3
  },
  seventh: {
    chords: ['maj', 'dom', 'min', 'halfDim', 'dim', 'aug'],
    length: 4
  }
};

export const chordInversionsByChordType: {
  [chordType: string]: string[][];
} = {
  triad: [[''], ['6'], ['6', '4']],
  seventh: [['7'], ['6', '5'], ['4', '3'], ['4', '2']]
};

export const chordQualities: {
  [key: string]: {
    semiToneSpacing: number[];
    symbol?: string;
    specificChords?: string[];
  };
} = {
  maj: { semiToneSpacing: [4, 3, 4], symbol: 'maj' },
  dom: { semiToneSpacing: [4, 3, 3] },
  min: { semiToneSpacing: [3, 4, 3], symbol: 'm' },
  halfDim: {
    semiToneSpacing: [3, 3, 4],
    symbol: 'ø'
  },
  dim: { semiToneSpacing: [3, 3, 3], symbol: 'o' },
  aug: { semiToneSpacing: [4, 4, 2], symbol: '+' }
};

/**
 * 1. Decide the tonic between all twelve keys -
 * 2. Decide major/minor key signature
 * 3. Decide flat/sharp notation (if applicable)
 *
 */

// export const keySignatureWithAccidentalOrder = ["F", "B", "E", "A", "D", "G"]

export const accidentals: { name: 'flats' | 'sharps'; value: -1 | 1 }[] = [
  { name: 'flats', value: -1 },
  { name: 'sharps', value: 1 }
];

export const accidentalSymbols: { [key: string]: string } = {
  '-3': '𝄫♭',
  '-2': '𝄫',
  '-1': '♭',
  '0': '',
  '1': '♯',
  '2': '𝄪'
};

// todo: use scales to determine chord based on scale degree
// remember that ionian is 1 but has index 0
export const modes = [
  'ionian',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian',
  'locrian'
];

export const numerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];

export const inversionNames: { [key: number]: string } = {
  0: 'root',
  1: '1st',
  2: '2nd',
  3: '3rd'
};

export const waveforms = ['Sine', 'Square', 'Sawtooth', 'Triangle', 'Custom'];

// export const chordStructures: {
//   [key: string]: { idx: number; intervals: Array<string> };
// } = {
//   C: {
//     idx: 0,
//     intervals: ["E", "G", "B"],
//   },
//   D: {
//     idx: 2,
//     intervals: ["F", "A", "C"],
//   },
//   E: {
//     idx: 4,
//     intervals: ["G", "B", "D"],
//   },
//   F: {
//     idx: 5,
//     intervals: ["A", "C", "E"],
//   },
//   G: {
//     idx: 7,
//     intervals: ["B", "D", "F"],
//   },
//   A: {
//     idx: 9,
//     intervals: ["C", "E", "G"],
//   },
//   B: {
//     idx: 11,
//     intervals: ["D", "F", "A"],
//   },
// };
