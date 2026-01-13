// src/app/sidebar/types.ts
import type { ReactNode } from "react";

export type SidebarMode = "simple" | "workspace" | "workflow";
export type PermissionKey = string;
export type BadgeKey = string;
export type SidebarKey = string;

export interface SidebarBaseItem {
  key: SidebarKey;
  label: string;
  icon?: ReactNode;
  path?: string;
  badgeKey?: BadgeKey;
  permissionKey?: PermissionKey;
  disabled?: boolean;
  /** 可选：标签（如 "新"、"Beta"） */
  tag?: {
    text: string;
    color?: "blue" | "green" | "orange" | "red";
  };
}

export interface SidebarGroup extends SidebarBaseItem {
  type: "group";
  defaultOpen?: boolean;
  /** 可选：当所有子项无权限时，是否隐藏整个分组（默认true） */
  hideWhenEmpty?: boolean;
  children: SidebarLeafItem[];
}

export interface SidebarLeafItem extends SidebarBaseItem {
  type: "item";
  path: string;
  /** 可选：是否外链（新窗口打开） */
  external?: boolean;
  /** 可选：额外匹配的路径（用于子页面高亮） */
  matchPaths?: string[];
  children?: never;
}

/** 分割线 */
export interface SidebarDivider {
  type: "divider";
  key: string;
}

export type SidebarNode = SidebarGroup | SidebarLeafItem | SidebarDivider;

export interface SidebarConfig {
  mode: SidebarMode;
  header?: {
    title: string;
    description?: string;
  };
  workspace?: {
    current: string;
    options: Array<{
      key: string;
      label: string;
      defaultPath: string;
      permissionKey?: PermissionKey;
    }>;
  };
  nodes: SidebarNode[];
  defaultPath: string;
}

/** 运行时校验：防止 3 级 children、缺 path、key 重复 */
export function assertSidebarConfig(config: SidebarConfig): void {
  const keySet = new Set<string>();
  const pushKey = (k: string) => {
    if (keySet.has(k)) throw new Error(`[SidebarConfig] duplicate key: ${k}`);
    keySet.add(k);
  };
  for (const node of config.nodes) {
    pushKey(node.key);
    if (node.type === "group") {
      if (!node.children?.length) throw new Error(`[SidebarConfig] group has no children: ${node.key}`);
      for (const child of node.children) {
        pushKey(child.key);
        if (child.type !== "item") throw new Error(`[SidebarConfig] group child must be item: ${child.key}`);
        if (!child.path) throw new Error(`[SidebarConfig] item missing path: ${child.key}`);
        if ((child as any).children) throw new Error(`[SidebarConfig] item cannot have children: ${child.key}`);
      }
    } else if (node.type === "item") {
      if (!node.path) throw new Error(`[SidebarConfig] item missing path: ${node.key}`);
    }
    // divider 不需要校验
  }
}