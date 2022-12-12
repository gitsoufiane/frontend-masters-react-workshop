import { createMachine, assign } from 'xstate';

// Parameterize the assign actions here:
// const tick = ...
// const addMinute = ...
// const reset = ...

export const timerMachine = createMachine({
  initial: 'idle',
  context: {
    duration: 60,
    elapsed: 0,
    interval: 0.1,
  },
  states: {
    idle: {
      entry: 'resetAction',

      on: {
        TOGGLE: 'running',
      },
    },
    running: {
      on: {
        TICK: {
          actions: 'tickAction'
        },

        TOGGLE: 'paused',
        ADD_MINUTE: {
          actions: 'addMinuteAction'
        },
      },
    },
    paused: {
      on: {
        TOGGLE: 'running',
        RESET: 'idle',
      },
    },
  },
}, {
  actions: {
    resetAction: assign({
        duration: 60,
        elapsed: 0,
    }),
    addMinuteAction:assign({
            duration: (ctx) => ctx.duration + 60,
    }),
    tickAction: assign({
      elapsed:ctx=> ctx.elapsed+ctx.interval
    })
  }
});
