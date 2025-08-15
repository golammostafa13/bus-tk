
const ErrorMessage = ({ error }: { error: string }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <div className="flex items-center">
                <span className="text-2xl mr-3">❌</span>
                <div>
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
                        Calculation Failed
                    </h3>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
            </div>
        </div>
    )
}

export default ErrorMessage
