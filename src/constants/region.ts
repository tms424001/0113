// src/constants/region.ts
// 地区选项常量

/**
 * 地区级联选项（简化版，实际应从 API 获取）
 */
export const REGION_OPTIONS = [
  {
    value: '四川省',
    label: '四川省',
    children: [
      {
        value: '成都市',
        label: '成都市',
        children: [
          { value: '锦江区', label: '锦江区' },
          { value: '青羊区', label: '青羊区' },
          { value: '金牛区', label: '金牛区' },
          { value: '武侯区', label: '武侯区' },
          { value: '成华区', label: '成华区' },
          { value: '龙泉驿区', label: '龙泉驿区' },
          { value: '青白江区', label: '青白江区' },
          { value: '新都区', label: '新都区' },
          { value: '温江区', label: '温江区' },
          { value: '双流区', label: '双流区' },
          { value: '郫都区', label: '郫都区' },
          { value: '新津区', label: '新津区' },
          { value: '都江堰市', label: '都江堰市' },
          { value: '彭州市', label: '彭州市' },
          { value: '邛崃市', label: '邛崃市' },
          { value: '崇州市', label: '崇州市' },
          { value: '简阳市', label: '简阳市' },
          { value: '金堂县', label: '金堂县' },
          { value: '大邑县', label: '大邑县' },
          { value: '蒲江县', label: '蒲江县' },
        ],
      },
      {
        value: '绵阳市',
        label: '绵阳市',
        children: [
          { value: '涪城区', label: '涪城区' },
          { value: '游仙区', label: '游仙区' },
          { value: '安州区', label: '安州区' },
        ],
      },
      {
        value: '德阳市',
        label: '德阳市',
        children: [
          { value: '旌阳区', label: '旌阳区' },
          { value: '罗江区', label: '罗江区' },
          { value: '广汉市', label: '广汉市' },
          { value: '什邡市', label: '什邡市' },
          { value: '绵竹市', label: '绵竹市' },
        ],
      },
      {
        value: '宜宾市',
        label: '宜宾市',
        children: [
          { value: '翠屏区', label: '翠屏区' },
          { value: '南溪区', label: '南溪区' },
          { value: '叙州区', label: '叙州区' },
        ],
      },
    ],
  },
  {
    value: '重庆市',
    label: '重庆市',
    children: [
      {
        value: '重庆市',
        label: '重庆市',
        children: [
          { value: '渝中区', label: '渝中区' },
          { value: '江北区', label: '江北区' },
          { value: '南岸区', label: '南岸区' },
          { value: '九龙坡区', label: '九龙坡区' },
          { value: '沙坪坝区', label: '沙坪坝区' },
          { value: '渝北区', label: '渝北区' },
          { value: '巴南区', label: '巴南区' },
          { value: '北碚区', label: '北碚区' },
        ],
      },
    ],
  },
  {
    value: '云南省',
    label: '云南省',
    children: [
      {
        value: '昆明市',
        label: '昆明市',
        children: [
          { value: '五华区', label: '五华区' },
          { value: '盘龙区', label: '盘龙区' },
          { value: '官渡区', label: '官渡区' },
          { value: '西山区', label: '西山区' },
        ],
      },
    ],
  },
  {
    value: '贵州省',
    label: '贵州省',
    children: [
      {
        value: '贵阳市',
        label: '贵阳市',
        children: [
          { value: '南明区', label: '南明区' },
          { value: '云岩区', label: '云岩区' },
          { value: '花溪区', label: '花溪区' },
          { value: '乌当区', label: '乌当区' },
        ],
      },
    ],
  },
]