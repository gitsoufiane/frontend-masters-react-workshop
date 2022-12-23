import React from 'react';
import { createMachine ,assign} from 'xstate';
import { useMachine  } from '@xstate/react';


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
  const [state, send,service] = useMachine(alarmMachine)
  //value of the state
  const status = state.value
  const {count}=state.context

  React.useEffect(() => { 
    const timer = setTimeout(() => send({ type: 'SUCCESS' }), 1000)
    return ()=> clearTimeout(timer)
  }, [status, send])
  
  return (
    <div className="scratch">
      <div className="alarm">
        <div className="alarmTime">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          ({count}) ({state.toStrings().join(' ')})
        </div>
        <div className="alarmToggle" data-active={status==='active' || undefined} onClick={()=>send({type:'TOGGLE'})}></div>
      </div>
    </div>
  );
};
