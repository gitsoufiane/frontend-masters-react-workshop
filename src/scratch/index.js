import React from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';


const alarmMachine = createMachine({
  initial: 'inactive',
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
        TOGGLE: 'inactive'
      }
    },
  }
})

export const ScratchApp = () => {
  const [state, send] = useMachine(alarmMachine)
  const status = state.value

  React.useEffect(() => { 
    const timer = setTimeout(() => send({ type: 'SUCCESS' }), 3000)
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
        </div>
        <div className="alarmToggle" data-active={status==='active' || undefined} onClick={()=>send({type:'TOGGLE'})}></div>
      </div>
    </div>
  );
};
