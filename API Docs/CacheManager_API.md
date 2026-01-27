# CacheManager API 文档

## 概述

CacheManager 负责管理图片预加载和缓存清理功能。支持批量预加载图片、自动去重、缓存检查和清理操作。

**命令路径格式**: `/CacheManager/CommandName`

**包含命令组**:

- **缓存管理** (2个): 预加载图片、清理缓存

---

## 缓存命令

### 1. preloadImages - 预加载图片

**功能描述**:

批量预加载图片到缓存中。支持自动去重（跳过已缓存的图片）、并发下载、超时控制和失败重试。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| images | Array[Object] | 是 | - | 图片配置数组，每个对象为 {注册名: URL} 的键值对 |

**images 参数格式**:

```json
{
  "images": [
    {
      "image_1": "https://example.com/image1.png",
      "image_2": "https://example.com/image2.jpg"
    },
    {
      "image_3": "https://example.com/image3.png"
    }
  ]
}

```

**调用示例**:

```json
{
  "CMD": "/CacheManager/preloadImages",
  "Data": {
    "images": [
      {
        "avatar_user_1": "https://cdn.example.com/avatars/user1.png",
        "avatar_user_2": "https://cdn.example.com/avatars/user2.png",
        "avatar_user_3": "https://cdn.example.com/avatars/user3.png"
      },
      {
        "texture_building": "https://cdn.example.com/textures/building.jpg",
        "texture_road": "https://cdn.example.com/textures/road.jpg"
      }
    ]
  }
}

```

**返回示例**:

```json
{
  "total": 5,
  "skipped": 1,
  "success": 4,
  "failed": 0
}

```

**返回字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| total | Integer | 总共处理的图片数量（包括已缓存的） |
| skipped | Integer | 跳过的图片数量（已在缓存中） |
| success | Integer | 成功下载的图片数量 |
| failed | Integer | 下载失败的图片数量 |
| failedKeys | Array[String] | 失败的图片注册名列表（仅在有失败时返回） |

**返回示例（包含失败列表）**:

```json
{
  "total": 5,
  "skipped": 1,
  "success": 3,
  "failed": 1,
  "failedKeys": ["image_timeout"]
}

```

**特性说明**:

- **自动去重**: 自动检查图片是否已在缓存中，跳过已缓存的图片
- **并发下载**: 支持多个图片并发下载，提高效率
- **超时控制**: 单个图片下载超时时间为 15 秒
- **失败处理**: 下载失败的图片会在返回结果中列出
- **异步操作**: 使用延迟响应机制，下载完成后返回结果

**注意事项**:

- 图片注册名必须唯一，重复的注册名会返回错误
- URL 必须是有效的 HTTP/HTTPS 地址
- 下载失败可能原因：网络错误、URL 无效、超时、服务器错误
- 已缓存的图片不会重新下载，直接返回成功

---

### 2. clearImageCache - 清理图片缓存

**功能描述**:

清理指定的图片缓存或清空所有缓存。支持按注册名清理或全量清理。

**参数说明**:

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| all | Boolean | 否 | false | 是否清空所有缓存，true=清空所有，false=按 keys 清理 |
| keys | Array[String] | 否 | [] | 要清理的图片注册名数组（当 all=false 时使用） |

**调用示例 - 清理指定图片**:

```json
{
  "CMD": "/CacheManager/clearImageCache",
  "Data": {
    "keys": ["image_1", "image_2", "avatar_user_1"]
  }
}

```

**调用示例 - 清空所有缓存**:

```json
{
  "CMD": "/CacheManager/clearImageCache",
  "Data": {
    "all": true
  }
}

```

**返回示例**:

```json
{
  "removed": 3
}

```

**返回字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| removed | Integer | 实际删除的缓存项数量 |

**特性说明**:

- **精确清理**: 按注册名精确清理指定的缓存项
- **全量清理**: 一次清空所有缓存
- **安全操作**: 清理不存在的项不会报错，直接跳过
- **同步操作**: 清理操作立即完成，无需等待

**注意事项**:

- 清理后无法恢复，如需保留请先备份
- 清理不存在的注册名不会报错
- 全量清理会释放所有内存，谨慎使用

---

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| INVALID_PARAMETERS | 参数验证失败 | 检查 images 是否为非空数组，keys 是否为数组 |
| INVALID_PARAMETERS | 缺少必需参数 | 确保提供了 images 或 all/keys 参数 |
| INVALID_PARAMETERS | 重复的注册名 | 检查 images 中是否有重复的注册名 |
| INVALID_PARAMETERS | 空的注册名或 URL | 检查注册名和 URL 是否为空字符串 |

**错误返回示例**:

```json
{
  "StatusCode": 400,
  "Message": "缺少必需参数: images"
}

```

```json
{
  "StatusCode": 400,
  "Message": "重复的注册名: image_1"
}

```

---

## 缓存管理说明

### 缓存存储

- **内存缓存**: 图片数据存储在内存中，快速访问
- **缓存键**: 使用注册名作为缓存键
- **缓存值**: 存储图片的二进制数据和元数据

### 缓存生命周期

1. **预加载**: 调用 `preloadImages` 下载图片到缓存
2. **使用**: 应用程序可以通过注册名访问缓存的图片
3. **清理**: 调用 `clearImageCache` 删除不需要的缓存

### 缓存大小管理

- **内存占用**: 每张图片的内存占用取决于其分辨率和格式
- **建议**: 监控内存使用情况，定期清理不需要的缓存
- **优化**: 使用压缩格式（如 WebP）减少内存占用

---

## 使用注意事项

### 最佳实践

1. **批量预加载**: 使用数组一次预加载多张图片，提高效率
2. **去重检查**: 利用自动去重功能避免重复下载
3. **错误处理**: 检查返回结果中的 failed 字段，处理失败的图片
4. **定期清理**: 定期清理不需要的缓存，释放内存

### 性能考虑

- **并发数**: 系统自动管理并发下载数，无需手动配置
- **超时时间**: 单个图片下载超时为 15 秒，无法修改
- **内存限制**: 根据系统内存情况调整预加载数量
- **网络带宽**: 大量预加载可能占用较多网络带宽

### 错误处理

- **网络错误**: 检查网络连接和 URL 有效性
- **超时错误**: 增加超时时间或分批预加载
- **服务器错误**: 检查服务器状态和 URL 可访问性
- **重试机制**: 失败的图片可以重新调用 preloadImages 重试

### 注册名规范

- 使用有意义的名称（如 `avatar_user_1`、`texture_building`）
- 避免使用特殊字符，建议使用字母、数字和下划线
- 保持命名一致性，便于管理和查询

---

## 完整使用流程示例

### 场景1: 预加载用户头像

```json
// 1. 预加载多个用户头像
{
  "CMD": "/CacheManager/preloadImages",
  "Data": {
    "images": [
      {
        "avatar_user_1": "https://cdn.example.com/avatars/user1.png",
        "avatar_user_2": "https://cdn.example.com/avatars/user2.png",
        "avatar_user_3": "https://cdn.example.com/avatars/user3.png"
      }
    ]
  }
}
// 返回: {"total": 3, "skipped": 0, "success": 3, "failed": 0}

// 2. 再次预加载，部分已缓存
{
  "CMD": "/CacheManager/preloadImages",
  "Data": {
    "images": [
      {
        "avatar_user_1": "https://cdn.example.com/avatars/user1.png",
        "avatar_user_4": "https://cdn.example.com/avatars/user4.png"
      }
    ]
  }
}
// 返回: {"total": 2, "skipped": 1, "success": 1, "failed": 0}

// 3. 清理特定用户的头像
{
  "CMD": "/CacheManager/clearImageCache",
  "Data": {
    "keys": ["avatar_user_1", "avatar_user_2"]
  }
}
// 返回: {"removed": 2}

```

### 场景2: 预加载场景纹理

```json
// 1. 预加载建筑纹理
{
  "CMD": "/CacheManager/preloadImages",
  "Data": {
    "images": [
      {
        "texture_building_wall": "https://cdn.example.com/textures/building_wall.jpg",
        "texture_building_roof": "https://cdn.example.com/textures/building_roof.jpg",
        "texture_building_door": "https://cdn.example.com/textures/building_door.jpg"
      }
    ]
  }
}

// 2. 预加载道路纹理
{
  "CMD": "/CacheManager/preloadImages",
  "Data": {
    "images": [
      {
        "texture_road_asphalt": "https://cdn.example.com/textures/road_asphalt.jpg",
        "texture_road_concrete": "https://cdn.example.com/textures/road_concrete.jpg"
      }
    ]
  }
}

// 3. 清空所有缓存
{
  "CMD": "/CacheManager/clearImageCache",
  "Data": {
    "all": true
  }
}
// 返回: {"removed": 5}

```

### 场景3: 处理预加载失败

```json
// 1. 预加载包含无效 URL 的图片
{
  "CMD": "/CacheManager/preloadImages",
  "Data": {
    "images": [
      {
        "image_valid": "https://cdn.example.com/image_valid.png",
        "image_invalid": "https://invalid-domain.com/image.png",
        "image_timeout": "https://slow-server.com/image.png"
      }
    ]
  }
}
// 返回: {"total": 3, "skipped": 0, "success": 1, "failed": 2, "failedKeys": ["image_invalid", "image_timeout"]}

// 2. 重试失败的图片
{
  "CMD": "/CacheManager/preloadImages",
  "Data": {
    "images": [
      {
        "image_invalid": "https://cdn.example.com/image_valid.png"
      }
    ]
  }
}
// 返回: {"total": 1, "skipped": 0, "success": 1, "failed": 0}

```

---

## 技术实现说明

### 下载流程

1. **参数解析**: 解析 images 数组，提取注册名和 URL
2. **去重检查**: 检查注册名是否已在缓存中
3. **并发下载**: 启动后台线程并发下载图片
4. **超时控制**: 单个图片下载超时为 15 秒
5. **缓存存储**: 下载成功的图片存储到内存缓存
6. **结果返回**: 下载完成后返回统计结果

### 缓存结构

- **缓存键**: 注册名（字符串）
- **缓存值**: 图片数据（二进制）
- **元数据**: 下载时间、大小、格式等

### 线程管理

- **下载线程**: 使用独立的后台线程进行下载
- **线程池**: 支持多个并发下载任务
- **线程安全**: 使用线程安全的缓存容器

### 错误处理

- **网络错误**: 捕获网络异常，记录失败原因
- **超时处理**: 超过 15 秒自动中止下载
- **重试机制**: 失败的图片可以重新调用预加载重试

---

## 版本历史

- **v1.0** - 初始版本，包含 2 个命令
  - preloadImages - 预加载图片
  - clearImageCache - 清理缓存

---

## 参考资料

- **命令基类**: `UCommandBase` - WebFrameWork 插件
- **工厂基类**: `UCommandFactoryBase` - WebFrameWork 插件
- **日志宏**: `.kiro/steering/logging-macros.md`
- **相关命令工厂**:

  - GlsCommandFactory - 场景和对象管理
  - CameraManager - 相机控制
  - HeatmapManager - 热力图管理
