import { FareState, InputMode } from '@/types/api'
import RouteInfo from './RouteInfo'

const ResultCard = ({ state, inputMode }: { state: FareState, inputMode: InputMode }) => {
    return (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-4">
                <span className="text-5xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Calculated Fare</h2>
            <div className="text-4xl font-bold mb-6">৳{state?.fareDetails?.fare}</div>

            {/* Detailed Breakdown */}
            <div className="bg-white/20 rounded-lg p-6 text-sm mb-4">
                <h3 className="font-semibold text-lg mb-4">Fare Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                        <span className="font-semibold">Distance:</span> {state?.fareDetails?.distance.toFixed(1)} km
                    </div>
                    <div>
                        <span className="font-semibold">Bus Type:</span> {state?.fareDetails?.busType}
                    </div>
                    <div>
                        <span className="font-semibold">Base Rate:</span> ৳{state?.fareDetails?.baseRate}
                    </div>
                    <div>
                        <span className="font-semibold">Discount Applied:</span> {state?.fareDetails?.discountApplied}
                    </div>
                    {state?.fareDetails?.discountPercentage && state?.fareDetails?.discountPercentage > 0 && (
                        <div className="md:col-span-2">
                            <span className="font-semibold">Discount:</span> {state?.fareDetails?.discountPercentage}% off
                        </div>
                    )}
                </div>
            </div>

            {/* Route Information */}
            {inputMode === 'locations' && (
                <RouteInfo state={state} />
            )}
        </div>
    )
}

export default ResultCard
