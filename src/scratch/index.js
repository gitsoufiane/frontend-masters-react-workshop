import React,{useEffect} from 'react';
import { createMachine ,assign} from 'xstate';
import { useMachine  } from '@xstate/react';


const greetingMachine = createMachine({
  initial: 'unknown',
  states: {
    unknown: {
      always: [{
        target: 'morning',
        cond: ()=> new Date().getHours() < 12
      }, {
        target:'day'
      }]
    },
    morning: {},
    day:{}
  }
})

const alarmMachine = createMachine({
  initial: 'inactive',
  context: {
    count: 0
  },
  states: {
    inactive: {
      on: {
        TOGGLE: [{
          target: 'pending',
          actions: 'incrementCount',
          cond: 'tooMuch' //! Guarded transition
        },
        {
            target: 'rejected' //! if  previous cond is false , use this target
        }]
      }
    },
    pending: {
      entry: 'telemetry',
      on: {
        SUCCESS: 'active',
        TOGGLE: 'inactive'
      }
    },
    active: {
      on: {
        TOGGLE: {
          target: 'inactive',
          actions: 'incrementCount'
        }
      }
    },
    rejected: {}
  },
},  {
    actions: {
      incrementCount: assign({
        count: (ctx,event)=> ctx.count + 1
      }),
      telemetry: (ctx,event)=> console.log({ctx,event})
  },
  guards: {
    tooMuch: (ctx,event)=> ctx.count <5
  }
  })

export const ScratchApp = () => {
  const [greetingState] = useMachine(greetingMachine)
  const [alarmState, send, service] = useMachine(alarmMachine)

  //value of the state
  const status = alarmState.value
  const {count}=alarmState.context

  useEffect(() => {
    const timer = setTimeout(() => send({ type: 'SUCCESS' }), 500)
    return ()=> clearTimeout(timer)
  }, [status, send])

  return (
    <div className="scratch">
      <h2>Good {greetingState.value}</h2>
      <div className="alarm">
        <div className="alarmTime">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          ({count}) ({alarmState.toStrings().join(' ')})
        </div>
        <div className="alarmToggle" data-active={status==='active' || undefined} onClick={()=>send({type:'TOGGLE'})}></div>
      </div>
    </div>
  );
};
