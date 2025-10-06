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
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateSubscriptionMutation } from "@/redux/api/adminApi"

interface CreateSubscriptionDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

interface CreateFormData {
    clientName: string
    contactPerson: string
    email: string
    subscriptionExport: boolean
    subscriptionImport: boolean
    dataTypeRaw: boolean
    dataTypeClean: boolean
    chapterNumber: number[]
    productCount: string
    subscribedDurationDownload: string
    subscribedDurationView: string
    subscriptionCost: string
    paymentMethod: string
    paymentId: string
    autoRenew: boolean
}

export default function CreateSubscriptionDialog({
    isOpen,
    onClose,
    onSuccess
}: CreateSubscriptionDialogProps) {
    const [createSubscription, { isLoading }] = useCreateSubscriptionMutation()

    const [formData, setFormData] = useState<CreateFormData>({
        clientName: "",
        contactPerson: "",
        email: "",
        subscriptionExport: true,
        subscriptionImport: true,
        dataTypeRaw: true,
        dataTypeClean: true,
        chapterNumber: [1, 2, 3, 4, 5],
        productCount: "",
        subscribedDurationDownload: "",
        subscribedDurationView: "",
        subscriptionCost: "",
        paymentMethod: "credit_card",
        paymentId: "",
        autoRenew: true
    })

    const [errors, setErrors] = useState<Partial<CreateFormData>>({})

    const handleInputChange = (field: keyof CreateFormData, value: string | boolean | number[] | string[]) => {
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
        const newErrors: Partial<CreateFormData> = {}

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

        if (!formData.productCount.trim()) {
            newErrors.productCount = "Product count is required"
        } else if (isNaN(Number(formData.productCount)) || Number(formData.productCount) <= 0) {
            newErrors.productCount = "Please enter a valid positive number"
        }

        if (!formData.subscribedDurationDownload.trim()) {
            newErrors.subscribedDurationDownload = "Download duration is required"
        } else if (isNaN(Number(formData.subscribedDurationDownload)) || Number(formData.subscribedDurationDownload) <= 0) {
            newErrors.subscribedDurationDownload = "Please enter a valid positive number"
        }

        if (!formData.subscribedDurationView.trim()) {
            newErrors.subscribedDurationView = "View duration is required"
        } else if (isNaN(Number(formData.subscribedDurationView)) || Number(formData.subscribedDurationView) <= 0) {
            newErrors.subscribedDurationView = "Please enter a valid positive number"
        }

        if (!formData.subscriptionCost.trim()) {
            newErrors.subscriptionCost = "Subscription cost is required"
        } else if (isNaN(Number(formData.subscriptionCost)) || Number(formData.subscriptionCost) <= 0) {
            newErrors.subscriptionCost = "Please enter a valid positive number"
        }

        if (!formData.paymentId.trim()) {
            newErrors.paymentId = "Payment ID is required"
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
            await createSubscription({
                clientName: formData.clientName.trim(),
                contactPerson: formData.contactPerson.trim(),
                email: formData.email.trim(),
                subscriptionExport: formData.subscriptionExport,
                subscriptionImport: formData.subscriptionImport,
                dataTypeRaw: formData.dataTypeRaw,
                dataTypeClean: formData.dataTypeClean,
                chapterNumber: formData.chapterNumber,
                productCount: Number(formData.productCount),
                subscribedDurationDownload: Number(formData.subscribedDurationDownload),
                subscribedDurationView: Number(formData.subscribedDurationView),
                subscriptionCost: formData.subscriptionCost.trim(),
                paymentMethod: formData.paymentMethod,
                paymentId: formData.paymentId.trim(),
                autoRenew: formData.autoRenew
            }).unwrap()

            onSuccess?.()
            handleClose()
        } catch (error) {
            console.error("Failed to create subscription:", error)
            // You might want to show a toast notification here
        }
    }

    const handleClose = () => {
        setFormData({
            clientName: "",
            contactPerson: "",
            email: "",
            subscriptionExport: true,
            subscriptionImport: true,
            dataTypeRaw: true,
            dataTypeClean: true,
            chapterNumber: [1, 2, 3, 4, 5],
            productCount: "",
            subscribedDurationDownload: "",
            subscribedDurationView: "",
            subscriptionCost: "",
            paymentMethod: "credit_card",
            paymentId: "",
            autoRenew: true
        })
        setErrors({})
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white p-6 border-[#e0e0e0] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Create New Subscription</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        Fill in the details to create a new subscription. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-2 bg-white">
                    {/* Basic Information */}
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

                    {/* Subscription Types */}
                    <div className="grid gap-3">
                        <Label className="text-sm font-medium">Subscription Types</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="subscriptionExport"
                                    checked={formData.subscriptionExport}
                                    onCheckedChange={(checked) => handleInputChange("subscriptionExport", !!checked)}
                                />
                                <Label htmlFor="subscriptionExport" className="text-sm font-medium">Export</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="subscriptionImport"
                                    checked={formData.subscriptionImport}
                                    onCheckedChange={(checked) => handleInputChange("subscriptionImport", !!checked)}
                                />
                                <Label htmlFor="subscriptionImport" className="text-sm font-medium">Import</Label>
                            </div>
                        </div>
                    </div>

                    {/* Data Types */}
                    <div className="grid gap-3">
                        <Label className="text-sm font-medium">Data Types</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="dataTypeRaw"
                                    checked={formData.dataTypeRaw}
                                    onCheckedChange={(checked) => handleInputChange("dataTypeRaw", !!checked)}
                                />
                                <Label htmlFor="dataTypeRaw" className="text-sm font-medium">Raw Data</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="dataTypeClean"
                                    checked={formData.dataTypeClean}
                                    onCheckedChange={(checked) => handleInputChange("dataTypeClean", !!checked)}
                                />
                                <Label htmlFor="dataTypeClean" className="text-sm font-medium">Clean Data</Label>
                            </div>
                        </div>
                    </div>

                    {/* Numeric Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="productCount" className="text-sm font-medium">Product Count</Label>
                            <Input
                                id="productCount"
                                type="number"
                                min="1"
                                value={formData.productCount}
                                onChange={(e) => handleInputChange("productCount", e.target.value)}
                                placeholder="Enter product count"
                                className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.productCount ? "border-red-500" : ""}`}
                            />
                            {errors.productCount && (
                                <span className="text-sm text-red-500">{errors.productCount}</span>
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
                                placeholder="Enter cost"
                                className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.subscriptionCost ? "border-red-500" : ""}`}
                            />
                            {errors.subscriptionCost && (
                                <span className="text-sm text-red-500">{errors.subscriptionCost}</span>
                            )}
                        </div>
                    </div>

                    {/* Duration Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subscribedDurationDownload" className="text-sm font-medium">Download Duration (months)</Label>
                            <Input
                                id="subscribedDurationDownload"
                                type="number"
                                min="1"
                                value={formData.subscribedDurationDownload}
                                onChange={(e) => handleInputChange("subscribedDurationDownload", e.target.value)}
                                placeholder="Enter months"
                                className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.subscribedDurationDownload ? "border-red-500" : ""}`}
                            />
                            {errors.subscribedDurationDownload && (
                                <span className="text-sm text-red-500">{errors.subscribedDurationDownload}</span>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="subscribedDurationView" className="text-sm font-medium">View Duration (months)</Label>
                            <Input
                                id="subscribedDurationView"
                                type="number"
                                min="1"
                                value={formData.subscribedDurationView}
                                onChange={(e) => handleInputChange("subscribedDurationView", e.target.value)}
                                placeholder="Enter months"
                                className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.subscribedDurationView ? "border-red-500" : ""}`}
                            />
                            {errors.subscribedDurationView && (
                                <span className="text-sm text-red-500">{errors.subscribedDurationView}</span>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method</Label>
                            <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                                <SelectTrigger className="bg-white text-gray-700 border-gray-300 text-sm h-9">
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-gray-700 border-gray-300">
                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                    <SelectItem value="debit_card">Debit Card</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="paypal">PayPal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="paymentId" className="text-sm font-medium">Payment ID</Label>
                            <Input
                                id="paymentId"
                                value={formData.paymentId}
                                onChange={(e) => handleInputChange("paymentId", e.target.value)}
                                placeholder="Enter payment ID"
                                className={`bg-white text-gray-700 border-gray-300 text-sm h-9 ${errors.paymentId ? "border-red-500" : ""}`}
                            />
                            {errors.paymentId && (
                                <span className="text-sm text-red-500">{errors.paymentId}</span>
                            )}
                        </div>
                    </div>

                    {/* Auto Renew */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="autoRenew"
                            checked={formData.autoRenew}
                            onCheckedChange={(checked) => handleInputChange("autoRenew", !!checked)}
                        />
                        <Label htmlFor="autoRenew" className="text-sm font-medium">Auto Renew</Label>
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
                            {isLoading ? "Creating..." : "Create Subscription"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
