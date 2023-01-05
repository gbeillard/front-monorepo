import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';

// fonction de mapping pour retourner un event conforme à celui attendu par SearchHeader.jsx
const mapEvent = (value, property, kindFilter) => ({
  isChecked: true,
  from: value[0],
  to: value[1],
  input: [
    {
      dataset: {
        property,
        kindfilter: kindFilter,
      },
    },
  ],
});

const INITIAL_SLIDER_RANGE = [0, 500];

const FilterRange = ({ title, property, kindFilter, values, handleRequest }) => {
  /*
        useState: permet d'utiliser du state dans un composant fonctionnel
        https://fr.reactjs.org/docs/hooks-state.html
    */
  const [value, setValue] = useState(INITIAL_SLIDER_RANGE);
  const [lastValue, setLastValue] = useState(null);

  const resetValues = () => {
    setValue(INITIAL_SLIDER_RANGE);
  };

  /*
        useEffect s'execute au mount puis à chaque changement de prop
        Le tableau en 2nd paramètre permet de filtrer sur les props qui vont déclencher l'execution du useEffect
        Un tableau vide permet de faire en sorte que l'effet soit seulement executé au mount.
        La fonction en return est une fonction de nettoyage executée au unmount.
        https://fr.reactjs.org/docs/hooks-effect.html
    */
  useEffect(() => {
    document.getElementById('handle-reset-button').addEventListener('click', resetValues);

    return () => {
      document.getElementById('handle-reset-button').removeEventListener('click', resetValues);
    };
  }, []);

  // handlers, pas besoin de binding
  const onChangeHandler = (event, updatedValue) => {
    setValue(updatedValue);
  };
  const onChangeCommittedHandler = (event, updatedValue) => {
    // on évite les appels non nécessaires
    if (lastValue !== null && value[0] === lastValue[0] && value[1] === lastValue[1]) {
      setLastValue(updatedValue);
      return;
    }

    setLastValue(updatedValue);
    window.updated = values.PropertyId; // legacy code?
    const mappedEvent = mapEvent(updatedValue, property, kindFilter);

    handleRequest(mappedEvent, false);
  };

  return (
    <div className="col-md-5 col-xs-21 col-xs-offset-1">
      <div className="filter-item">
        <div className="category-header filter-to-hide">{title}</div>
        <div className="slider-container">
          <Slider
            value={value}
            min={0}
            max={500}
            step={100}
            onChange={onChangeHandler}
            onChangeCommitted={onChangeCommittedHandler}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterRange;