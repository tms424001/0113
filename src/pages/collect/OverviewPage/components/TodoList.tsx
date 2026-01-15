// src/pages/collect/OverviewPage/components/TodoList.tsx
// 待处理事项组件

import { Card, List, Typography, Button, Tag, Empty } from 'antd'
import {
  WarningOutlined,
  FileTextOutlined,
  RollbackOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './TodoList.module.css'

const { Text } = Typography

/**
 * 待处理事项类型
 */
export type TodoType = 'incomplete' | 'mapping' | 'rejected' | 'pending'

/**
 * 待处理事项
 */
export interface TodoItem {
  id: string
  type: TodoType
  title: string
  description: string
  path: string
  time?: string
}

interface TodoListProps {
  items: TodoItem[]
  loading?: boolean
}

/**
 * 获取事项图标和颜色
 */
function getTodoIcon(type: TodoType) {
  switch (type) {
    case 'incomplete':
      return { icon: <WarningOutlined />, color: '#faad14', bgColor: '#fffbe6' }
    case 'mapping':
      return { icon: <FileTextOutlined />, color: '#1890ff', bgColor: '#e6f7ff' }
    case 'rejected':
      return { icon: <RollbackOutlined />, color: '#ff4d4f', bgColor: '#fff2f0' }
    case 'pending':
      return { icon: <BellOutlined />, color: '#722ed1', bgColor: '#f9f0ff' }
    default:
      return { icon: <FileTextOutlined />, color: '#1890ff', bgColor: '#e6f7ff' }
  }
}

/**
 * 待处理事项组件
 */
export const TodoList = ({ items, loading }: TodoListProps) => {
  const navigate = useNavigate()

  const handleClick = (item: TodoItem) => {
    navigate(item.path)
  }

  return (
    <Card
      title={
        <span>
          📥 待处理事项
          {items.length > 0 && (
            <Tag color="orange" style={{ marginLeft: 8 }}>{items.length}</Tag>
          )}
        </span>
      }
      className={styles.card}
      bodyStyle={{ padding: items.length === 0 ? 24 : 0 }}
    >
      {items.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无待处理事项"
        />
      ) : (
        <List
          loading={loading}
          dataSource={items.slice(0, 5)}
          renderItem={(item) => {
            const { icon, color, bgColor } = getTodoIcon(item.type)
            return (
              <List.Item className={styles.listItem}>
                <div className={styles.itemContent}>
                  <div
                    className={styles.itemIcon}
                    style={{ backgroundColor: bgColor, color }}
                  >
                    {icon}
                  </div>
                  <div className={styles.itemInfo}>
                    <Text strong className={styles.itemTitle}>{item.title}</Text>
                    <Text type="secondary" className={styles.itemDesc}>
                      {item.description}
                    </Text>
                  </div>
                </div>
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleClick(item)}
                >
                  {item.type === 'pending' ? '查看' : '去处理'}
                </Button>
              </List.Item>
            )
          }}
        />
      )}
    </Card>
  )
}

export default TodoList