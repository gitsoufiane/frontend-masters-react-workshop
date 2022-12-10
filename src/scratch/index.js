import React from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';


const initialState = 'inactive'
const alarmMachine = {
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
}
const timeReducer = (state, event) => {
  const nextState = alarmMachine.states[state].on[event.type] || state
  return nextState
  // switch (state) {
  //   case 'inactive': {
  //     if(event.type==='TOGGLE') return 'pending'
  //     return state
  //   }
  //   case 'pending': {
  //     if (event.type === 'SUCCESS') return 'active'
  //     if(event.type ==='TOGGLE') return 'inactive'
  //     return state
  //   }
  //   case 'active': {
  //     if(event.type === 'TOGGLE') return 'inactive'
  //     return state;
  //   }
  //   default: return state;
  // }
}
export const ScratchApp = () => {
  const [state,dispatch] = React.useReducer(timeReducer,initialState)
  console.log({state})

  React.useEffect(() => { 
    const timer = setTimeout(() => dispatch({ type: 'SUCCESS' }), 3000)
    return ()=> clearTimeout(timer)
  },[state])
  return (
    <div className="scratch">
      <div className="alarm">
        <div className="alarmTime">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className="alarmToggle" data-active={state==='active' || undefined} onClick={()=>dispatch({type:'TOGGLE'})}></div>
      </div>
    </div>
  );
};
