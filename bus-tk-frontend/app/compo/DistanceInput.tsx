import { FareAction, FareState } from '@/types/api'
import React from 'react'

const DistanceInput = ({ state, dispatch }: { state: FareState, dispatch: React.Dispatch<FareAction> }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Distance (km)
            </label>
            <input
                type="number"
                step="0.1"
                min="0"
                value={state.distance}
                onChange={(e) => dispatch({ type: 'SET_DISTANCE', payload: e.target.value })}
                placeholder="e.g., 10.5"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
            />
        </div>
    )
}

export default DistanceInput
