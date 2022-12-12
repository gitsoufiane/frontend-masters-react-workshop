import React from 'react';
import { createMachine ,assign} from 'xstate';
import { useMachine  } from '@xstate/react';


const alarmMachine = createMachine({
  initial: 'inactive',
  context: {
    count: 10
  },
  states: {
    inactive: {
      on: {
        TOGGLE: 'pending',
      }
    },
    pending: {
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
  },
},  {
    actions: {
      incrementCount: assign({
        count: ctx=> ctx.count + 1
      })
    }
  })

export const ScratchApp = () => {
  const [state, send] = useMachine(alarmMachine)
  const status = state.value
  const {count}=state.context

  React.useEffect(() => { 
    const timer = setTimeout(() => send({ type: 'SUCCESS' }), 1000)
    return ()=> clearTimeout(timer)
  },[status,send])
  return (
    <div className="scratch">
      <div className="alarm">
        <div className="alarmTime">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          ({count})
        </div>
        <div className="alarmToggle" data-active={status==='active' || undefined} onClick={()=>send({type:'TOGGLE'})}></div>
      </div>
    </div>
  );
};
