export type ChordConfig = {
  tonic?: GeneratedKey;
  inversion?: Array<string>;
  inversionName?: string;
  numeral?: string;
  symbol?: string;
  notes?: Array<GeneratedKey>;
};

export type KeyNote = {
  key: string;
  accidental: number;
  modes?: string[];
  accidentalType?: number;
  isEnharmonic?: boolean;
};

export type KeyNames = KeyNote[];
export type GeneratedKey = {
  name: string;
  accidental: number;
  isEnharmonic?: boolean;
  hz?: number;
};
