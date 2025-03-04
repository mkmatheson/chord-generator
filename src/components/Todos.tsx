const Todos = () => {
  return (
    <div className="column">
      TODOS:
      <ul>
        <li>
          Catchall: If something's broken it's because I haven't felt inspired
          to fix it
        </li>
        <li>Make the site look pretty</li>
        <li>Allow for selecting triads AND sevenths (and 9ths? 11ths?)</li>
        <li>Keep sound off upon chord re-generation</li>
        <li>Roman numeral notation</li>
        <li>Modes?</li>
        <li>
          when displaying flats and sharps, prefer the sharp or flat of an
          enharmonic key, allowing for all keys to be selected
        </li>
        <li>
          Bug: if a flat key is still selected when switching to sharps, it is
          still included in the list of potential chord roots
        </li>
        <li>
          Have an alert if no keys/qualities/inversions get selected upon chord
          generation
        </li>
        <li>
          Sine is the only waveform available, despite the lies the dropdown
          displays.
        </li>
        <li>
          update material UI to "@mui/material": "^6.4.6" whenever they fix
          @next
        </li>
      </ul>
    </div>
  );
};

export default Todos;
