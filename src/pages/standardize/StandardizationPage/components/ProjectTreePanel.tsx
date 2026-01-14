// src/pages/standardize/StandardizationPage/components/ProjectTreePanel.tsx
// 左侧工程列表树面板

import React, { useMemo } from 'react'
import { Tree, Button, Progress, Skeleton, Empty } from 'antd'
import { LeftOutlined, RightOutlined, PlayCircleOutlined } from '@ant-design/icons'
import type { DataNode, TreeProps } from 'antd/es/tree'
import type { ProjectTreeNode } from '@/types/dto.standardize'
import styles from '../StandardizationPage.module.css'

// ============================================================================
// Types
// ============================================================================

export interface ProjectTreePanelProps {
  /** 树数据 */
  data: ProjectTreeNode[]
  /** 勾选的 key 列表 */
  checkedKeys: string[]
  /** 勾选变化回调 */
  onCheck: (checkedKeys: string[]) => void
  /** 选中节点回调 */
  onSelect?: (selectedKey: string) => void
  /** 是否收起 */
  collapsed?: boolean
  /** 切换收起/展开 */
  onToggle?: () => void
  /** 加载中 */
  loading?: boolean
  /** 分析中 */
  analyzing?: boolean
  /** 分析进度 */
  analyzeProgress?: number
  /** 开始分析回调 */
  onStartAnalyze?: () => void
  /** 是否可以开始分析 */
  canAnalyze?: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * 转换为 Ant Design Tree 数据格式
 */
function convertToTreeData(nodes: ProjectTreeNode[]): DataNode[] {
  return nodes.map((node) => ({
    key: node.id,
    title: node.name,
    children: node.children ? convertToTreeData(node.children) : undefined,
  }))
}

// ============================================================================
// Component
// ============================================================================

export const ProjectTreePanel: React.FC<ProjectTreePanelProps> = ({
  data,
  checkedKeys,
  onCheck,
  onSelect,
  collapsed = false,
  onToggle,
  loading = false,
  analyzing = false,
  analyzeProgress = 0,
  onStartAnalyze,
  canAnalyze = true,
}) => {
  // 转换树数据
  const treeData = useMemo(() => convertToTreeData(data), [data])

  // 处理勾选
  const handleCheck: TreeProps['onCheck'] = (checked) => {
    if (Array.isArray(checked)) {
      onCheck(checked as string[])
    } else {
      onCheck(checked.checked as string[])
    }
  }

  // 处理选中
  const handleSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys.length > 0 && onSelect) {
      onSelect(selectedKeys[0] as string)
    }
  }

  return (
    <div className={`${styles.leftPanel} ${collapsed ? styles.collapsed : ''}`}>
      {/* 面板头部 */}
      <div className={styles.panelHeader}>
        <span>工程列表</span>
        <Button
          type="text"
          size="small"
          icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
          onClick={onToggle}
        />
      </div>

      {/* 树内容 */}
      <div className={styles.projectTree}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : treeData.length === 0 ? (
          <Empty description="暂无工程数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Tree
            checkable
            selectable
            defaultExpandAll
            treeData={treeData}
            checkedKeys={checkedKeys}
            onCheck={handleCheck}
            onSelect={handleSelect}
          />
        )}
      </div>

      {/* 面板底部 */}
      <div className={styles.panelFooter}>
        {/* 分析进度条 */}
        {analyzing && (
          <Progress
            percent={analyzeProgress}
            size="small"
            status="active"
            style={{ marginBottom: 12 }}
          />
        )}

        {/* 开始分析按钮 */}
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={onStartAnalyze}
          loading={analyzing}
          disabled={!canAnalyze || checkedKeys.length === 0}
          block
        >
          {analyzing ? '分析中...' : '开始分析'}
        </Button>

        {/* 提示信息 */}
        {checkedKeys.length === 0 && !analyzing && (
          <div className={styles.hint}>
            请勾选需要分析的单位工程
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectTreePanel
