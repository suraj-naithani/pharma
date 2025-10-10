import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface HSCodeItem {
    section: string
    hscode: string
    description: string
    parent: string
    level: number
}

interface HSCodeAccordionProps {
    csvData: string
}

interface TreeNode {
    item: HSCodeItem
    children: TreeNode[]
}

const HSCodeAccordion: React.FC<HSCodeAccordionProps> = ({ csvData }) => {
    const [data, setData] = useState<HSCodeItem[]>([])
    const [treeData, setTreeData] = useState<TreeNode[]>([])
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (csvData) {
            const lines = csvData.trim().split('\n')
            const parsedData: HSCodeItem[] = []

            for (let i = 1; i < lines.length; i++) {
                const values = parseCSVLine(lines[i])
                if (values.length >= 5) {
                    parsedData.push({
                        section: values[0],
                        hscode: values[1],
                        description: values[2],
                        parent: values[3],
                        level: parseInt(values[4]) || 0
                    })
                }
            }
            setData(parsedData)
        }
    }, [csvData])

    useEffect(() => {
        if (data.length > 0) {
            const tree = buildTree(data)
            setTreeData(tree)
        }
    }, [data])

    const parseCSVLine = (line: string): string[] => {
        const result: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
            const char = line[i]

            if (char === '"') {
                inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }

        result.push(current.trim())
        return result
    }

    const buildTree = (items: HSCodeItem[]): TreeNode[] => {
        const itemMap = new Map<string, TreeNode>()
        const roots: TreeNode[] = []

        // Create nodes for all items
        items.forEach(item => {
            itemMap.set(item.hscode, {
                item,
                children: []
            })
        })

        // Build parent-child relationships
        items.forEach(item => {
            const node = itemMap.get(item.hscode)!
            if (item.parent === 'TOTAL' || !itemMap.has(item.parent)) {
                roots.push(node)
            } else {
                const parentNode = itemMap.get(item.parent)
                if (parentNode) {
                    parentNode.children.push(node)
                }
            }
        })

        // Sort children by HS code
        const sortChildren = (nodes: TreeNode[]) => {
            nodes.sort((a, b) => a.item.hscode.localeCompare(b.item.hscode))
            nodes.forEach(node => sortChildren(node.children))
        }

        sortChildren(roots)
        return roots
    }

    const toggleNode = (hscode: string) => {
        const newExpanded = new Set(expandedNodes)
        if (newExpanded.has(hscode)) {
            newExpanded.delete(hscode)
        } else {
            newExpanded.add(hscode)
        }
        setExpandedNodes(newExpanded)
    }

    const getLevelColor = (level: number) => {
        switch (level) {
            case 2: return 'bg-blue-100 text-blue-800 border-blue-200'
            case 4: return 'bg-green-100 text-green-800 border-green-200'
            case 6: return 'bg-purple-100 text-purple-800 border-purple-200'
            case 8: return 'bg-orange-100 text-orange-800 border-orange-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getLevelPadding = (level: number) => {
        switch (level) {
            case 2: return 'pl-4'
            case 4: return 'pl-8'
            case 6: return 'pl-12'
            case 8: return 'pl-16'
            default: return 'pl-4'
        }
    }

    const renderTreeNode = (node: TreeNode, depth: number = 0) => {
        const isExpanded = expandedNodes.has(node.item.hscode)
        const hasChildren = node.children.length > 0

        return (
            <div key={node.item.hscode} className="border-b border-gray-100 last:border-b-0">
                <button
                    onClick={() => hasChildren && toggleNode(node.item.hscode)}
                    className={`w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors ${getLevelPadding(node.item.level)} ${hasChildren ? 'cursor-pointer' : 'cursor-default'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(node.item.level)}`}>
                                Level {node.item.level}
                            </span>
                            <span className="font-mono text-sm font-semibold text-gray-900">
                                {node.item.hscode}
                            </span>
                            <span className="text-gray-700 text-sm">{node.item.description}</span>
                        </div>
                        {hasChildren && (
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">({node.children.length} items)</span>
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                            </div>
                        )}
                    </div>
                </button>

                {hasChildren && isExpanded && (
                    <div className="bg-gray-50" style={{ boxShadow: 'inset 0 2px 4px rgba(59, 130, 246, 0.06)' }}>
                        {node.children.map(child => renderTreeNode(child, depth + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">HS Code Classification</h1>
                <p className="text-gray-600 text-sm">Browse through the Harmonized System (HS) Code classifications</p>
            </div>

            <div className="space-y-4">
                {treeData.map((rootNode) => (
                    <div key={rootNode.item.hscode} className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ boxShadow: '0 1px 2px 0 rgba(59, 130, 246, 0.05)' }}>
                        <button
                            onClick={() => toggleNode(rootNode.item.hscode)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="font-mono text-lg font-semibold text-gray-900">
                                    {rootNode.item.hscode}
                                </span>
                                <span className="text-gray-700 text-sm">{rootNode.item.description}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">({rootNode.children.length} items)</span>
                                {expandedNodes.has(rootNode.item.hscode) ? (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <ChevronRight className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                        </button>

                        {expandedNodes.has(rootNode.item.hscode) && (
                            <div className="border-t border-gray-200">
                                {rootNode.children.map(child => renderTreeNode(child))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HSCodeAccordion
