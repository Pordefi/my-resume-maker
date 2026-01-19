# 简历设计器 Resume Designer

基于 React + Konva.js 的可视化简历设计工具，类似 Figma/Canva 的拖拽式编辑体验。

## 技术栈

- React 18 + TypeScript
- Vite
- Konva.js + react-konva
- Tailwind CSS
- Zustand
- jsPDF + html2canvas

## 功能特性

### 核心功能
- ✅ A4 尺寸画布 (210mm × 297mm)
- ✅ 可视化网格辅助
- ✅ 自由拖拽布局
- ✅ 组件大小调整
- ✅ 多选、对齐、分布

### 组件类型
- ✅ 文本框（富文本编辑）
- ✅ 图片
- ✅ 形状（矩形、圆形、椭圆）
- ✅ 线条（水平/垂直）
- ✅ 图标

### 样式系统
- ✅ 背景色、边框、阴影
- ✅ 字体、颜色、对齐
- ✅ 层级管理（z-index）

### 其他功能
- ✅ 自动保存
- ✅ 导入/导出 JSON
- ✅ 导出 PDF
- ✅ 导出 PNG
- ✅ 撤销/重做
- ✅ 复制/粘贴/剪切

## 快捷键

- `Ctrl+Z`: 撤销
- `Ctrl+Shift+Z`: 重做
- `Ctrl+C`: 复制
- `Ctrl+V`: 粘贴
- `Ctrl+X`: 剪切
- `Ctrl+A`: 全选
- `Delete/Backspace`: 删除选中组件

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```

## 预览

```bash
npm run preview
```
