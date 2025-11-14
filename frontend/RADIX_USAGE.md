# Radix UI 使用指南

## 已安装的 Radix UI 组件

项目中已安装以下 Radix UI 组件包：

- `@radix-ui/react-dialog` - 对话框/模态框
- `@radix-ui/react-dropdown-menu` - 下拉菜单
- `@radix-ui/react-select` - 选择框
- `@radix-ui/react-tabs` - 标签页
- `@radix-ui/react-tooltip` - 工具提示
- `@radix-ui/react-slot` - 插槽组件
- `@radix-ui/react-separator` - 分隔符
- `@radix-ui/react-popover` - 弹出框
- `@radix-ui/react-avatar` - 头像
- `@radix-ui/react-accordion` - 手风琴/折叠面板

## 示例组件

在 `src/components/` 目录下已创建了三个示例组件：

### 1. ExampleDialog - 对话框示例
展示如何使用 Radix UI Dialog 组件创建模态对话框。

### 2. ExampleTooltip - 工具提示示例
展示如何使用 Radix UI Tooltip 组件。

### 3. ExampleDropdown - 下拉菜单示例
展示如何使用 Radix UI Dropdown Menu 组件。

## 快速开始

在你的组件中导入并使用：

```tsx
import { ExampleDialog } from './components/ExampleDialog';
import { ExampleTooltip } from './components/ExampleTooltip';
import { ExampleDropdown } from './components/ExampleDropdown';

function App() {
  return (
    <div className="p-8 space-y-4">
      <ExampleDialog />
      <ExampleTooltip />
      <ExampleDropdown />
    </div>
  );
}
```

## 更多组件

如果需要其他 Radix UI 组件，可以使用以下命令安装：

```bash
npm install @radix-ui/react-[组件名]
```

例如：
```bash
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-switch
npm install @radix-ui/react-radio-group
```

## 文档

Radix UI 官方文档：https://www.radix-ui.com/primitives

每个组件都有详细的 API 文档和使用示例。

