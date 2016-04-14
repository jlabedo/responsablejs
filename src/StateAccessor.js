export default class StateAccessor {
  constructor(key, initialValue) {
    this.key = key;
    this.initialValue = initialValue;
  }

  getState(state) {
      return state[this.key] || this.initialValue;
  }

  updateState(state, newValue) {
    if (state[this.key] !== newValue) {
      return {...state, [this.key]: newValue}
    } else {
      return state;
    }
  }

  init(state) {
    this.initialized = true;
    return this.updateState(state, this.initialValue);
  }
}
