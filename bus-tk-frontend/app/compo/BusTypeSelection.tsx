import { FareAction, FareState } from '@/types/api'
import React from 'react'

const BusTypeSelection = ({ state, dispatch }: { state: FareState, dispatch: React.Dispatch<FareAction> }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Bus Type
            </label>
            <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${state.busType === 'nonAC'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}>
                    <input
                        type="radio"
                        name="busType"
                        value="nonAC"
                        checked={state.busType === 'nonAC'}
                        onChange={(e) => dispatch({ type: 'SET_BUS_TYPE', payload: e.target.value as 'nonAC' })}
                        className="sr-only"
                    />
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">🚌</span>
                        <div>
                            <div className="font-semibold text-gray-800 dark:text-white">Non-AC Bus</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Standard local bus</div>
                        </div>
                    </div>
                </label>

                <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${state.busType === 'AC'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}>
                    <input
                        type="radio"
                        name="busType"
                        value="AC"
                        checked={state.busType === 'AC'}
                        onChange={(e) => dispatch({ type: 'SET_BUS_TYPE', payload: e.target.value as 'AC' })}
                        className="sr-only"
                    />
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">❄️</span>
                        <div>
                            <div className="font-semibold text-gray-800 dark:text-white">AC Bus</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Air-conditioned bus</div>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default BusTypeSelection
