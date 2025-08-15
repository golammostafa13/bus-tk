import { FareAction, FareState } from '@/types/api'
import React from 'react'

const DiscountSelection = ({ state, dispatch }: { state: FareState, dispatch: React.Dispatch<FareAction> }) => {
    return (<div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Discount Type
        </label>
        <select
            value={state.discountType}
            onChange={(e) => dispatch({ type: 'SET_DISCOUNT_TYPE', payload: e.target.value as 'none' | 'student' | 'pass' })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
            <option value="none">No Discount</option>
            <option value="student">🎓 Student (50% off)</option>
            <option value="pass">🎫 Monthly Pass (20% off)</option>
        </select>
    </div>
    )
}

export default DiscountSelection
