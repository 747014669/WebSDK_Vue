# AssetLibraryCommand API 文档

## 概述
提供资源库 UI 的打开与关闭能力，用于浏览已挂载 pak 文件中的资源并进行筛选与拖拽操作。

---

## Command 列表

### 1. LoadAssetLibraryUI - 打开资源库UI

#### 功能描述
挂载指定 pak 文件并打开资源库界面，按指定类型筛选显示资源。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pakFilePath | String | 是 | - | 需要浏览的 pak 文件绝对路径 |
| libraryName | String | 否 | - | 资源库名称（展示用途） |
| assetType | String | 否 | "All" | 资源筛选类型：All/StaticMesh/Material/Texture |

#### 调用示例
```json
{
  "CMD": "/assetLibrary/LoadAssetLibraryUI",
  "Data": {
    "pakFilePath": "D:/Libraries/MaterialLibrary.pak",
    "libraryName": "MaterialLibrary",
    "assetType": "Material"
  }
}

```

#### 演示视频
> 📹 [LoadAssetLibraryUI 操作演示视频](待添加视频链接)

---

### 2. CloseAssetLibraryUI - 关闭资源库UI

#### 功能描述
关闭当前显示的资源库界面。可根据业务在关闭时选择是否卸载 pak（当前默认仅关闭界面）。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| libraryName | String | 否 | - | 指定关闭某个库名对应的界面（留空则关闭所有） |

#### 调用示例
```json
{
  "CMD": "/assetLibrary/CloseAssetLibraryUI",
  "Data": {
    "libraryName": "MaterialLibrary"
  }
}

```

#### 演示视频
> 📹 [CloseAssetLibraryUI 操作演示视频](待添加视频链接)

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 缺少必需参数 | 必选参数未提供 | 检查参数名是否正确，确保提供所有必选参数 |
| pak 挂载失败 | pak 文件无法挂载 | 检查路径与权限，确认文件存在且未损坏 |
| 创建UI失败 | 无法创建资源库界面 | 检查世界上下文与 UI 依赖是否就绪 |

### 错误返回示例
```json
{
  "success": false,
  "error": "挂载Pak失败: D:/Libraries/MaterialLibrary.pak"
}

```

---

## 使用注意事项

1. pak 必须是可读的绝对路径。
2. assetType 不区分大小写，未识别将按 All 处理。
3. 关闭 UI 不等同于卸载 pak，如需卸载，请使用 pakLoadManager 的卸载命令。 
