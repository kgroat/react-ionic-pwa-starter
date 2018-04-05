
import { Action, Reducer } from 'redux'
import { FlatMap } from 'state/FlatMap'

export interface ActorMap<S> {
  [name: string]: Reducer<S>
}

export function buildReducer<S> (initialState: S, map: ActorMap<S>): Reducer<S> {
  return (prev = initialState, action): S => {
    let actor = map[action.type]
    return actor ? actor(prev, action) : prev
  }
}

export function buildFlatMap<S> (childReducer: Reducer<S | undefined>): Reducer<FlatMap<S>> {
  return (prev = {}, action: Action & { id: string }) => {
    const { id } = action
    const newVal = childReducer(prev[id]!, action)
    if (newVal === undefined) {
      const newOut = {...prev}
      delete newOut[id]
      return newOut
    } else {
      return {
        ...prev,
        [id]: newVal,
      }
    }
  }
}
