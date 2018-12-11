import { createStore } from 'redux';

const defaultState = {}

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
}

export default createStore(rootReducer);
