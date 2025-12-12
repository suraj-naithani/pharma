import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRegisterUserMutation } from "@/redux/api/adminUserApi"
import type { RegisterUserData } from "@/types/users"
import { toast } from "sonner"

interface CreateUserDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function CreateUserDialog({
    isOpen,
    onClose,
    onSuccess
}: CreateUserDialogProps) {
    const [registerUser, { isLoading }] = useRegisterUserMutation()

    const [formData, setFormData] = useState<RegisterUserData>({
        name: "",
        email: "",
        password: "",
        role: "parent",
        mobileNumber: "",
        partyName: ""
    })

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterUserData, string>>>({})

    const handleInputChange = (field: keyof RegisterUserData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof RegisterUserData, string>> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long"
        }

        if (!formData.role.trim()) {
            newErrors.role = "Role is required"
        }

        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile number is required"
        } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
            newErrors.mobileNumber = "Mobile number must be 10 digits"
        }

        if (!formData.partyName.trim()) {
            newErrors.partyName = "Party name is required"
        } else if (formData.partyName.trim().length < 2) {
            newErrors.partyName = "Party name must be at least 2 characters long"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const result = await registerUser({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
                mobileNumber: formData.mobileNumber.replace(/\D/g, ""), // Remove non-digits
                partyName: formData.partyName.trim()
            }).unwrap()

            toast.success("User created successfully!", {
                description: `User ${result.data?.name || formData.name} has been created.`,
                duration: 3000,
            })

            onSuccess?.()
            handleClose()
        } catch (error: unknown) {
            console.error("Failed to create user:", error)

            // Handle API validation errors
            let errorMessage = "Failed to create user. Please check the form and try again."
            if (error && typeof error === "object" && "data" in error) {
                const errorData = error.data as { errors?: Array<{ msg: string; path: string }>; message?: string }
                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    const errorMessages = errorData.errors.map(err => `${err.path}: ${err.msg}`).join(", ")
                    errorMessage = errorMessages
                } else if (errorData?.message) {
                    errorMessage = errorData.message
                }
            }

            toast.error("Failed to create user", {
                description: errorMessage,
                duration: 4000,
            })
        }
    }

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "parent",
            mobileNumber: "",
            partyName: ""
        })
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white p-6 border-[#e0e0e0] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Create New User</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Fill in the details to create a new user. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2 bg-white">
                    {/* Name and Role in single row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2 w-full">
                            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter user name"
                                className={`w-full bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.name ? "border-red-500" : ""}`}
                            />
                            {errors.name && (
                                <span className="text-sm text-red-500">{errors.name}</span>
                            )}
                        </div>

                        <div className="grid gap-2 w-full">
                            <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                                <SelectTrigger className={`w-full bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.role ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-700 border-gray-300">
                                    <SelectItem value="parent">Parent</SelectItem>
                                    <SelectItem value="kid">Kid</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <span className="text-sm text-red-500">{errors.role}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter email address"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && (
                            <span className="text-sm text-red-500">{errors.email}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="mobileNumber" className="text-sm font-medium">Mobile Number</Label>
                            <Input
                                id="mobileNumber"
                                type="tel"
                                value={formData.mobileNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                                    handleInputChange("mobileNumber", value)
                                }}
                                placeholder="Enter 10 digit mobile number"
                                maxLength={10}
                                className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.mobileNumber ? "border-red-500" : ""}`}
                            />
                            {errors.mobileNumber && (
                                <span className="text-sm text-red-500">{errors.mobileNumber}</span>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="partyName" className="text-sm font-medium">Party Name</Label>
                            <Input
                                id="partyName"
                                value={formData.partyName}
                                onChange={(e) => handleInputChange("partyName", e.target.value)}
                                placeholder="Enter party name"
                                className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.partyName ? "border-red-500" : ""}`}
                            />
                            {errors.partyName && (
                                <span className="text-sm text-red-500">{errors.partyName}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="Enter password (min 6 characters)"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.password ? "border-red-500" : ""}`}
                        />
                        {errors.password && (
                            <span className="text-sm text-red-500">{errors.password}</span>
                        )}
                    </div>

                    <DialogFooter className="gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isLoading ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

