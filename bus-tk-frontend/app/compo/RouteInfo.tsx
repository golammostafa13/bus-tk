import { FareState } from '@/types/api'
import React from 'react'

const RouteInfo = ({state}: {state: FareState}) => {
  return (
    <div className="bg-white/20 rounded-lg p-4 text-sm mb-4">
                                <h4 className="font-semibold mb-2">Route</h4>
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="bg-white/30 px-3 py-1 rounded-full">{state.startLocation.nameEn}</span>
                                    <span>→</span>
                                    <span className="bg-white/30 px-3 py-1 rounded-full">{state.endLocation.nameEn}</span>
                                </div>
                            </div>
  )
}

export default RouteInfo
