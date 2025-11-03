import { accidentals, accidentalSymbols, keys } from '../const';
import { GeneratedKey, KeyNames } from '../types';
import { generateAvailableKeys, onItemClick, selectKey } from '../utils';
import Checkbox from './Checkbox';
import ToggleAllButton from './ToggleAllButton';

const Notes = ({
  accidentalType,
  activeMode,
  activeKeys,
  setActiveKeys,
  setAccidentalType
}: {
  accidentalType: number;
  activeMode: string;
  activeKeys: GeneratedKey[];
  setActiveKeys: React.Dispatch<React.SetStateAction<GeneratedKey[]>>;
  setAccidentalType: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="column">
      {/* Generate accidentals for notation */}
      <ToggleAllButton
        toggleSubject="Keys"
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
      />
      {accidentals.map((accidental) => (
        <div key={accidental.name}>
          <input
            type="radio"
            id={accidental.name}
            name={accidental.name}
            value={accidental.value}
            checked={accidentalType === accidental.value}
            onClick={() => {
              setAccidentalType(accidental.value);
              setActiveKeys(
                activeKeys.filter((key) => key.accidental === accidental.value)
              );
            }}
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
  );
};

export default Notes;
