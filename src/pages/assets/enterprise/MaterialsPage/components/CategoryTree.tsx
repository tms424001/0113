// src/pages/assets/enterprise/MaterialsPage/components/CategoryTree.tsx
// 左侧分类树组件

import { useState, useEffect } from 'react'
import { Tree, Spin, Typography, Divider } from 'antd'
import type { TreeDataNode } from 'antd'
import type { CategoryNode } from '../types'
import { mockCategoryTree, mockStatistics } from '@/mocks/enterpriseMaterial'
import styles from './CategoryTree.module.css'

const { Text } = Typography

interface CategoryTreeProps {
  selectedCategoryId: string
  onSelect: (categoryId: string, categoryName: string) => void
}

/**
 * 将分类数据转换为 Tree 组件需要的格式
 */
const convertToTreeData = (nodes: CategoryNode[]): TreeDataNode[] => {
  return nodes.map((node) => ({
    key: node.id,
    title: (
      <span className={styles.treeNode}>
        <span className={styles.nodeName}>{node.name}</span>
        <span className={styles.nodeCount}>{node.count.toLocaleString()}</span>
      </span>
    ),
    children: node.children ? convertToTreeData(node.children) : undefined,
    isLeaf: node.isLeaf,
  }))
}

/**
 * 左侧分类树组件
 */
export const CategoryTree: React.FC<CategoryTreeProps> = ({
  selectedCategoryId,
  onSelect,
}) => {
  const [loading, setLoading] = useState(true)
  const [treeData, setTreeData] = useState<TreeDataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['all', 'civil'])

  useEffect(() => {
    // 模拟加载分类树
    const loadTree = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setTreeData(convertToTreeData(mockCategoryTree))
      setLoading(false)
    }
    loadTree()
  }, [])

  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const categoryId = selectedKeys[0] as string
      // 查找分类名称
      const findName = (nodes: CategoryNode[], id: string): string => {
        for (const node of nodes) {
          if (node.id === id) return node.name
          if (node.children) {
            const found = findName(node.children, id)
            if (found) return found
          }
        }
        return ''
      }
      const categoryName = findName(mockCategoryTree, categoryId)
      onSelect(categoryId, categoryName)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Spin tip="加载分类..." />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.treeWrapper}>
        <Tree
          treeData={treeData}
          selectedKeys={[selectedCategoryId]}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys)}
          onSelect={handleSelect}
          blockNode
          showLine={{ showLeafIcon: false }}
        />
      </div>

      <Divider className={styles.divider} />

      <div className={styles.statistics}>
        <div className={styles.statItem}>
          <Text type="secondary">材料总数</Text>
          <Text strong>{mockStatistics.totalCount.toLocaleString()}</Text>
        </div>
        <div className={styles.statItem}>
          <Text type="secondary">本月更新</Text>
          <Text strong style={{ color: '#1890ff' }}>
            {mockStatistics.monthlyUpdated.toLocaleString()}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default CategoryTree
