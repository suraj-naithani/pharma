import React from "react"

interface LoadingProps {
    size?: "sm" | "md" | "lg"
    className?: string
}

const Loading: React.FC<LoadingProps> = ({ size = "md", className = "" }) => {
    const sizeClasses = {
        sm: "h-6 w-6 border-2",
        md: "h-10 w-10 border-3",
        lg: "h-16 w-16 border-4"
    }

    return (
        <div className={`flex justify-center items-center min-h-screen ${className}`}>
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-[#C7D2FE] border-t-[#3B82F6]`}></div>
        </div>
    )
}

export default Loading
