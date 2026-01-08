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
import { useCreateCompanyMutation } from "@/redux/api/adminApi"
import { toast } from "sonner"

interface CreateCompanyDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

interface CompanyFormData {
    name: string
    email: string
    contactPerson: string
    address: string
    phone: string
}

export default function CreateCompanyDialog({
    isOpen,
    onClose,
    onSuccess
}: CreateCompanyDialogProps) {
    const [createCompany, { isLoading }] = useCreateCompanyMutation()

    const [formData, setFormData] = useState<CompanyFormData>({
        name: "",
        email: "",
        contactPerson: "",
        address: "",
        phone: ""
    })

    const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormData, string>>>({})

    const handleInputChange = (field: keyof CompanyFormData, value: string) => {
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
        const newErrors: Partial<Record<keyof CompanyFormData, string>> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Company name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = "Contact person is required"
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
            newErrors.phone = "Phone number must be 10 digits"
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
            const result = await createCompany({
                name: formData.name.trim(),
                email: formData.email.trim(),
                contactPerson: formData.contactPerson.trim(),
                address: formData.address.trim(),
                phone: formData.phone.replace(/\D/g, "")
            }).unwrap()

            toast.success("Company created successfully!", {
                description: `Company ${result.data?.name || formData.name} has been created.`,
                duration: 3000,
            })

            onSuccess?.()
            handleClose()
        } catch (error: unknown) {
            console.error("Failed to create company:", error)

            let errorMessage = "Failed to create company. Please check the form and try again."
            if (error && typeof error === "object" && "data" in error) {
                const errorData = error.data as { errors?: Array<{ msg: string; path: string }>; message?: string }
                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    const errorMessages = errorData.errors.map(err => `${err.path}: ${err.msg}`).join(", ")
                    errorMessage = errorMessages
                } else if (errorData?.message) {
                    errorMessage = errorData.message
                }
            }

            toast.error("Failed to create company", {
                description: errorMessage,
                duration: 4000,
            })
        }
    }

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            contactPerson: "",
            address: "",
            phone: ""
        })
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white p-6 border-[#e0e0e0] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Create New Company</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Fill in the details to create a new company. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2 bg-white">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium">Company Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter company name"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && (
                            <span className="text-sm text-red-500">{errors.name}</span>
                        )}
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

                    <div className="grid gap-2">
                        <Label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</Label>
                        <Input
                            id="contactPerson"
                            value={formData.contactPerson}
                            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                            placeholder="Enter contact person name"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.contactPerson ? "border-red-500" : ""}`}
                        />
                        {errors.contactPerson && (
                            <span className="text-sm text-red-500">{errors.contactPerson}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter company address"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.address ? "border-red-500" : ""}`}
                        />
                        {errors.address && (
                            <span className="text-sm text-red-500">{errors.address}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                                handleInputChange("phone", value)
                            }}
                            placeholder="Enter 10 digit phone number"
                            maxLength={10}
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.phone ? "border-red-500" : ""}`}
                        />
                        {errors.phone && (
                            <span className="text-sm text-red-500">{errors.phone}</span>
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
                            {isLoading ? "Creating..." : "Create Company"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

