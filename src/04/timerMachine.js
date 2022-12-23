import { createMachine, assign } from 'xstate';

export const timerMachine = createMachine({
  initial: 'idle',
  context: {
    duration: 5,
    elapsed: 0,
    interval: 0.1,
  },
  states: {
    idle: {
      entry: assign({
        duration: 5,
        elapsed: 0,
      }),
      on: {
        TOGGLE: 'running',
      },
    },
    running: {
      on: {
        // Change this TICK transition into a guarded transition
        // to go to `expired` when `context.elapsed + context.interval`
        // is greater than the total `context.duration`.
        TICK: [{
          actions: assign({
            elapsed: (ctx) => ctx.elapsed + ctx.interval,
          }),
          cond: (ctx)=> ctx.elapsed + ctx.interval <= ctx.duration
        }, {
          target:'expired'
        }],
        TOGGLE: 'paused',
        ADD_MINUTE: {
          actions: assign({
            duration: (ctx) => ctx.duration + 60,
          }),
        },
      },
    },
    paused: {
      on: {
        TOGGLE: 'running',
        RESET: 'idle',
      },
    },
    expired: {
      on: {
        RESET: 'idle'
      }
    }
  },
});
