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
import { Checkbox } from "@/components/ui/checkbox"
import { useUpdateSubscriptionMutation } from "@/redux/api/adminApi"
import type { Subscription } from "@/types/subscription"

interface EditSubscriptionDialogProps {
    subscription: Subscription | null
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

interface EditFormData {
    clientName: string
    contactPerson: string
    email: string
    subscriptionCost: string
    autoRenew: boolean
}

export default function EditSubscriptionDialog({
    subscription,
    isOpen,
    onClose,
    onSuccess
}: EditSubscriptionDialogProps) {
    const [updateSubscription, { isLoading }] = useUpdateSubscriptionMutation()

    const [formData, setFormData] = useState<EditFormData>({
        clientName: "",
        contactPerson: "",
        email: "",
        subscriptionCost: "",
        autoRenew: false
    })

    const [errors, setErrors] = useState<Partial<EditFormData>>({})

    // Initialize form data when subscription changes
    useEffect(() => {
        if (subscription) {
            setFormData({
                clientName: subscription.clientName || "",
                contactPerson: subscription.contactPerson || "",
                email: subscription.email || "",
                subscriptionCost: subscription.subscriptionCost || "",
                autoRenew: subscription.autoRenew || false
            })
            setErrors({})
        }
    }, [subscription])

    const handleInputChange = (field: keyof EditFormData, value: string | boolean) => {
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
        const newErrors: Partial<EditFormData> = {}

        if (!formData.clientName.trim()) {
            newErrors.clientName = "Client name is required"
        }

        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = "Contact person is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.subscriptionCost.trim()) {
            newErrors.subscriptionCost = "Subscription cost is required"
        } else if (isNaN(Number(formData.subscriptionCost)) || Number(formData.subscriptionCost) <= 0) {
            newErrors.subscriptionCost = "Please enter a valid positive number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!subscription || !validateForm()) {
            return
        }

        try {
            await updateSubscription({
                id: subscription.id,
                data: {
                    clientName: formData.clientName.trim(),
                    contactPerson: formData.contactPerson.trim(),
                    email: formData.email.trim(),
                    subscriptionCost: formData.subscriptionCost.trim(),
                    autoRenew: formData.autoRenew
                }
            }).unwrap()

            onSuccess?.()
            onClose()
        } catch (error) {
            console.error("Failed to update subscription:", error)
            // You might want to show a toast notification here
        }
    }

    const handleClose = () => {
        setFormData({
            clientName: "",
            contactPerson: "",
            email: "",
            subscriptionCost: "",
            autoRenew: false
        })
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-white p-6 border-[#e0e0e0]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Edit Subscription</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Update subscription details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2 bg-white">
                    <div className="grid gap-2">
                        <Label htmlFor="clientName" className="text-sm font-medium">Client Name</Label>
                        <Input
                            id="clientName"
                            value={formData.clientName}
                            onChange={(e) => handleInputChange("clientName", e.target.value)}
                            placeholder="Enter client name"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.clientName ? "border-red-500" : ""}`}
                        />
                        {errors.clientName && (
                            <span className="text-sm text-red-500">{errors.clientName}</span>
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
                        <Label htmlFor="subscriptionCost" className="text-sm font-medium">Subscription Cost</Label>
                        <Input
                            id="subscriptionCost"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.subscriptionCost}
                            onChange={(e) => handleInputChange("subscriptionCost", e.target.value)}
                            placeholder="Enter subscription cost"
                            className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.subscriptionCost ? "border-red-500" : ""}`}
                        />
                        {errors.subscriptionCost && (
                            <span className="text-sm text-red-500">{errors.subscriptionCost}</span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="autoRenew"
                            checked={formData.autoRenew}
                            onCheckedChange={(checked) => handleInputChange("autoRenew", !!checked)}
                        />
                        <Label htmlFor="autoRenew" className="text-sm font-medium text-gray-700">Auto Renew</Label>
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
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
