import React, { useState, useEffect } from "react"
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
import { useUpdateCompanyMutation } from "@/redux/api/adminApi"
import type { Company, UpdateCompanyData } from "@/types/company"
import { toast } from "sonner"

interface EditCompanyDialogProps {
    company: Company | null
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function EditCompanyDialog({
    company,
    isOpen,
    onClose,
    onSuccess
}: EditCompanyDialogProps) {
    const [updateCompany, { isLoading }] = useUpdateCompanyMutation()

    const [formData, setFormData] = useState<UpdateCompanyData>({
        name: "",
        contactPerson: "",
        address: "",
        phone: "",
        status: "active"
    })

    const [errors, setErrors] = useState<Partial<Record<keyof UpdateCompanyData, string>>>({})

    // Initialize form data when company changes
    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                contactPerson: company.contactPerson || "",
                address: company.address || "",
                phone: company.phone || "",
                status: company.status || "active"
            })
            setErrors({})
        }
    }, [company])

    const handleInputChange = (field: keyof UpdateCompanyData, value: string) => {
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
        const newErrors: Partial<Record<keyof UpdateCompanyData, string>> = {}

        if (!formData.name?.trim()) {
            newErrors.name = "Company name is required"
        }

        if (!formData.contactPerson?.trim()) {
            newErrors.contactPerson = "Contact person is required"
        }

        if (!formData.address?.trim()) {
            newErrors.address = "Address is required"
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = "Phone number is required"
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
            newErrors.phone = "Phone number must be 10 digits"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!company || !validateForm()) {
            return
        }

        try {
            const updateData: UpdateCompanyData = {
                name: formData.name?.trim(),
                contactPerson: formData.contactPerson?.trim(),
                address: formData.address?.trim(),
                phone: formData.phone?.replace(/\D/g, ""),
                status: formData.status
            }

            const result = await updateCompany({
                id: company.id,
                data: updateData
            }).unwrap()

            toast.success("Company updated successfully!", {
                description: `Company ${result.data?.name || formData.name} has been updated.`,
                duration: 3000,
            })

            onSuccess?.()
            handleClose()
        } catch (error: unknown) {
            console.error("Failed to update company:", error)

            let errorMessage = "Failed to update company. Please check the form and try again."
            if (error && typeof error === "object" && "data" in error) {
                const errorData = error.data as { errors?: Array<{ msg: string; path: string }>; message?: string }
                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    const errorMessages = errorData.errors.map(err => `${err.path}: ${err.msg}`).join(", ")
                    errorMessage = errorMessages
                } else if (errorData?.message) {
                    errorMessage = errorData.message
                }
            }

            toast.error("Failed to update company", {
                description: errorMessage,
                duration: 4000,
            })
        }
    }

    const handleClose = () => {
        setFormData({
            name: "",
            contactPerson: "",
            address: "",
            phone: "",
            status: "active"
        })
        setErrors({})
        onClose()
    }

    if (!company) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white p-6 border-[#e0e0e0] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Edit Company</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Update the company information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2 bg-white">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium">Company Name</Label>
                        <Input
                            id="name"
                            value={formData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter company name"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && (
                            <span className="text-sm text-red-500">{errors.name}</span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</Label>
                        <Input
                            id="contactPerson"
                            value={formData.contactPerson || ""}
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
                            value={formData.address || ""}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter company address"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.address ? "border-red-500" : ""}`}
                        />
                        {errors.address && (
                            <span className="text-sm text-red-500">{errors.address}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone || ""}
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

                        <div className="grid gap-2">
                            <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                            <Select value={formData.status || "active"} onValueChange={(value) => handleInputChange("status", value)}>
                                <SelectTrigger className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.status ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-700 border-gray-300">
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <span className="text-sm text-red-500">{errors.status}</span>
                            )}
                        </div>
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
                            {isLoading ? "Updating..." : "Update Company"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

