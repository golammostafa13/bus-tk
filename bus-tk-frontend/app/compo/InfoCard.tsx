
const InfoCard = () => {
    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ℹ️ How it works
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Choose locations or enter distance directly</li>
                <li>• Select bus type (AC buses cost more but offer comfort)</li>
                <li>• Apply discounts for students or monthly pass holders</li>
                <li>• Backend service calculates fare based on current rates and distance</li>
                <li>• Real-time API integration with Go backend service</li>
            </ul>
        </div>
    )
}

export default InfoCard
