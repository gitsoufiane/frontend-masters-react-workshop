import { createMachine } from 'xstate';

// Use the machine you created in Exercise 00
export const timerMachine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        TOGGLE: 'running',
      }
    },
    running: {
      on: {
        TOGGLE:'paused'
      }
    },
    paused: {
      on: {
        TOGGLE: 'running',
        RESET:'idle'
      }
    }
  }
  
})
