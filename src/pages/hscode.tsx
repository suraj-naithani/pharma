import { useState, useEffect } from 'react'
import HSCodeAccordion from '@/components/HSCodeAccordion'
import { Loader2 } from 'lucide-react'

const HSCode = () => {
    const [csvData, setCsvData] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCSVData = async () => {
            try {
                setLoading(true)
                const response = await fetch('/hscode.csv')
                if (!response.ok) {
                    throw new Error('Failed to fetch HS Code data')
                }
                const text = await response.text()
                setCsvData(text)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchCSVData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading HS Code data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">Error loading HS Code data</p>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <HSCodeAccordion csvData={csvData} />
        </div>
    )
}

export default HSCode