// src/pages/collect/OverviewPage/components/QuickActions.tsx
// 快捷操作组件

import { Card, Row, Col, Typography } from 'antd'
import {
  FileAddOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './QuickActions.module.css'

const { Text } = Typography

interface QuickAction {
  key: string
  icon: React.ReactNode
  title: string
  path: string
  color: string
  bgColor: string
}

/**
 * 快捷操作组件
 */
export const QuickActions = () => {
  const navigate = useNavigate()

  const actions: QuickAction[] = [
    {
      key: 'upload',
      icon: <FileAddOutlined />,
      title: '上传造价文件',
      path: '/collect/cost-files',
      color: '#1890ff',
      bgColor: '#e6f7ff',
    },
    {
      key: 'material',
      icon: <TagsOutlined />,
      title: '导入材料价格',
      path: '/collect/materials',
      color: '#52c41a',
      bgColor: '#f6ffed',
    },
    {
      key: 'boq',
      icon: <UnorderedListOutlined />,
      title: '导入清单数据',
      path: '/collect/boqs',
      color: '#fa8c16',
      bgColor: '#fff7e6',
    },
    {
      key: 'pr',
      icon: <SendOutlined />,
      title: '发起入库申请',
      path: '/pr/create',
      color: '#722ed1',
      bgColor: '#f9f0ff',
    },
  ]

  const handleClick = (action: QuickAction) => {
    navigate(action.path)
  }

  return (
    <Card title="🚀 快捷操作" className={styles.card}>
      <Row gutter={16}>
        {actions.map((action) => (
          <Col key={action.key} xs={12} sm={6}>
            <div
              className={styles.actionItem}
              onClick={() => handleClick(action)}
            >
              <div
                className={styles.actionIcon}
                style={{ backgroundColor: action.bgColor, color: action.color }}
              >
                {action.icon}
              </div>
              <Text className={styles.actionTitle}>{action.title}</Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default QuickActions