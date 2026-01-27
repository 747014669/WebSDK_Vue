# PakLoadManager API 文档

## 概述

PakLoadManager 负责管理 UE5 Pak 文件的加载、卸载和挂载点注册，支持加密 Pak 文件的读取。

**命令路径格式**: `/pakLoadManager/CommandName`

**包含命令组**:

- **Pak挂载命令** (3个): 基础挂载、带注册挂载、注册挂载点
- **Pak查询命令** (1个): 获取Pak文件列表
- **Pak卸载命令** (1个): 卸载Pak文件
- **加密管理命令** (1个): 注册加密密钥

---

## Pak挂载命令

### 1. mountPakFile - 挂载Pak文件(基础版)

#### 功能描述
挂载指定的 Pak 文件到虚拟文件系统，使 Pak 中的资源可被引擎访问。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pakFileName | String | 是 | - | Pak文件的完整路径(如 D:/Assets/content.pak) |
| MountPath | String | 否 | "../.../../" | Pak文件的挂载路径 |

#### 调用示例

```json
{
  "CMD": "/pakLoadManager/mountPakFile",
  "Data": {
    "pakFileName": "D:/Assets/BuildingLibrary.pak"
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200,
  "message": "Pak文件挂载成功",
  "pakFileName": "D:/Assets/BuildingLibrary.pak",
  "mountPath": "../.../../"
}

```

#### 特性说明

- **自动验证**: 挂载前自动检查文件是否存在
- **Reset支持**: Factory重置时自动卸载已挂载的Pak
- **状态跟踪**: 记录已挂载的Pak文件名

#### 注意事项

- Pak文件路径必须是有效的绝对路径
- 同一个Pak文件重复挂载会覆盖之前的挂载
- 挂载失败时会返回错误信息

---

### 2. mountPakFile2 - 挂载Pak文件(高级版)

#### 功能描述
挂载 Pak 文件并自动注册挂载点，适用于需要自定义虚拟路径映射的场景。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pakFileName | String | 是 | - | Pak文件的完整路径 |
| MountPath | String | 否 | "../.../../" | Pak文件的挂载路径 |
| RegisterName | String | 否 | "/Game/" | 虚拟路径前缀(如 /Game/, /MyContent/) |

#### 调用示例

```json
{
  "CMD": "/pakLoadManager/mountPakFile2",
  "Data": {
    "pakFileName": "D:/Assets/MaterialLibrary.pak",
    "MountPath": "../../../MaterialContent/",
    "RegisterName": "/MaterialLib/"
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 与 mountPakFile 的区别

| 特性 | mountPakFile | mountPakFile2 |
|------|--------------|---------------|
| 基础挂载 | ✅ | ✅ |
| 自动注册挂载点 | ❌ | ✅ |
| 自定义虚拟路径 | ❌ | ✅ |
| 返回详细信息 | ✅ | ❌ |

#### 使用场景

- 需要将Pak内容映射到特定虚拟路径(如 /CustomLib/)
- 多个Pak需要使用不同的路径前缀避免冲突
- 需要与现有资源路径规范保持一致

---

### 3. registerMountPoint - 注册挂载点

#### 功能描述
注册虚拟路径到物理路径的映射关系，用于自定义资源加载路径。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| RootPath | String | 是 | - | 虚拟根路径(如 /Game/, /MyContent/) |
| ContentPath | String | 是 | - | 物理内容路径(相对或绝对路径) |

#### 调用示例

```json
{
  "CMD": "/pakLoadManager/registerMountPoint",
  "Data": {
    "RootPath": "/CustomAssets/",
    "ContentPath": "../../../CustomContent/"
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200
}

```

#### 特性说明

- **路径映射**: 建立虚拟路径与物理路径的对应关系
- **灵活配置**: 支持任意虚拟路径前缀
- **自动清理**: Factory重置时自动注销注册的挂载点

#### 使用场景

- 为已挂载的Pak文件配置访问路径
- 将多个物理路径映射到统一的虚拟路径下
- 实现自定义的资源组织结构

---

## Pak查询命令

### 4. getFilesInPak - 获取Pak中的文件列表

#### 功能描述
读取指定 Pak 文件中包含的所有文件路径列表，用于浏览 Pak 内容。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pakFileName | String | 是 | - | Pak文件的完整路径 |

#### 调用示例

```json
{
  "CMD": "/pakLoadManager/getFilesInPak",
  "Data": {
    "pakFileName": "D:/Assets/BuildingLibrary.pak"
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200,
  "files": [
    "/Game/Buildings/Mesh/Building_A.uasset",
    "/Game/Buildings/Mesh/Building_B.uasset",
    "/Game/Buildings/Materials/M_Brick.uasset",
    "/Game/Buildings/Textures/T_Brick_D.uasset"
  ],
  "count": 4,
  "pakFileName": "D:/Assets/BuildingLibrary.pak"
}

```

#### 返回字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| files | Array[String] | Pak中所有文件的虚拟路径列表 |
| count | Integer | 文件总数 |
| pakFileName | String | Pak文件路径(回显) |

#### 特性说明

- **无需挂载**: 可在未挂载Pak的情况下查询内容
- **完整路径**: 返回的是虚拟路径,可直接用于资源加载
- **文件验证**: 自动检查Pak文件是否存在

#### 使用场景

- 在挂载前预览Pak内容
- 实现资源库浏览功能
- 验证Pak打包是否正确
- 生成资源清单

---

## Pak卸载命令

### 5. unmountPakFile - 卸载Pak文件

#### 功能描述
从虚拟文件系统卸载指定的 Pak 文件，释放相关资源。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| pakFileName | String | 是 | - | 需要卸载的Pak文件路径 |

#### 调用示例
```json
{
  "CMD": "/pakLoadManager/unmountPakFile",
  "Data": {
    "pakFileName": "D:/Assets/BuildingLibrary.pak"
  }
}

```

#### 返回示例

```json
{
  "StatusCode": 200,
  "message": "Pak文件卸载成功",
  "pakFileName": "D:/Assets/BuildingLibrary.pak"
}

```

#### 特性说明

- **完全卸载**: 移除Pak文件及其所有映射关系
- **资源清理**: 卸载后Pak中的资源将无法访问
- **安全检查**: 验证Pak是否已挂载

#### 注意事项

- 卸载后,正在使用该Pak资源的对象可能出现问题
- 建议在卸载前确保没有活动引用
- 卸载不存在的Pak会返回错误

---

## 加密管理命令

### 6. registerEncryptionKey - 注册加密密钥

#### 功能描述
注册 AES 加密密钥,用于挂载和读取加密的 Pak 文件。

#### 参数说明

| 参数名 | 类型 | 必选 | 默认值 | 说明 |
|--------|------|------|--------|------|
| AesKey | String | 是 | - | AES加密密钥(Base64或Hex格式) |

#### 调用示例
```json
{
  "CMD": "/pakLoadManager/registerEncryptionKey",
  "Data": {
    "AesKey": "1234567890ABCDEF1234567890ABCDEF"
  }
}

```

#### 返回示例
```json
{
  "StatusCode": 200,
  "message": "加密密钥注册成功"
}

```

#### 特性说明

- **全局注册**: 注册后对所有后续挂载的加密Pak生效
- **持久有效**: 注册后在整个会话期间有效
- **无法撤销**: UE5引擎不提供移除密钥的API

#### 密钥格式说明

| 格式 | 说明 | 示例 |
|------|------|------|
| Hex | 十六进制字符串(32字符) | `1234567890ABCDEF1234567890ABCDEF` |
| Base64 | Base64编码字符串 | `EjRWeJCrvd4xIjNEVWiQq73e` |

#### 使用流程

1. **先注册密钥**: 调用 registerEncryptionKey
2. **再挂载Pak**: 调用 mountPakFile/mountPakFile2
3. **正常使用**: 引擎会自动解密并加载资源

#### 注意事项

- 必须在挂载加密Pak之前注册密钥
- 密钥长度和格式必须与打包时使用的密钥匹配
- 错误的密钥会导致挂载失败或资源损坏

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| INVALID_PARAMETERS | 缺少必需参数 | 检查参数名是否正确,确保提供所有必选参数 |
| INVALID_PARAMETERS | 文件不存在 | 验证Pak文件路径是否正确,文件是否存在 |
| EXECUTION_FAILED | 挂载Pak失败 | 检查Pak文件格式、加密状态、权限问题 |
| EXECUTION_FAILED | 卸载Pak失败 | 检查Pak是否已挂载,路径是否正确 |
| EXECUTION_FAILED | 注册密钥失败 | 检查密钥格式和长度是否正确 |
| RESOURCE_NOT_FOUND | Pak中未找到文件 | 检查Pak文件是否为空或已损坏 |

### 错误返回示例

**参数错误**:

```json
{
  "StatusCode": 400,
  "Message": "缺少必需参数: pakFileName"
}

```

**文件不存在**:

```json
{
  "StatusCode": 400,
  "Message": "文件不存在: D:/Assets/invalid.pak"
}

```

**挂载失败**:

```json
{
  "StatusCode": 500,
  "Message": "挂载Pak文件失败: D:/Assets/encrypted.pak"
}

```

**卸载失败**:

```json
{
  "StatusCode": 500,
  "Message": "卸载Pak文件失败: D:/Assets/notmounted.pak"
}

```

---

## 使用注意事项

### 1. Pak文件路径规范

- 必须使用完整的绝对路径(如 `D:/Assets/content.pak`)
- 支持正斜杠(`/`)和反斜杠(`\`)
- 路径中不要包含特殊字符

### 2. 挂载顺序建议

```
步骤1: registerEncryptionKey  (如果是加密Pak)
步骤2: mountPakFile/mountPakFile2
步骤3: registerMountPoint      (如果需要自定义路径)
步骤4: 使用Pak中的资源

```

### 3. 挂载路径说明

| 挂载路径 | 说明 | 适用场景 |
|----------|------|----------|
| `../.../../` | 默认挂载路径 | 大多数情况 |
| `../../../Content/` | 挂载到Content目录 | 与项目资源同级 |
| 自定义路径 | 按需配置 | 特殊组织结构 |

### 4. 虚拟路径映射规则

- 虚拟路径必须以 `/` 开头和结尾(如 `/Game/`)
- 建议使用有意义的前缀(如 `/BuildingLib/`, `/MaterialLib/`)
- 避免与现有挂载点冲突

### 5. 加密Pak最佳实践

- 使用强密钥(至少32字节)
- 密钥统一管理,避免硬编码
- 定期更换密钥提高安全性
- 只对敏感资源使用加密

### 6. 性能优化建议

- 避免频繁挂载/卸载Pak
- 按功能模块组织Pak,实现按需加载
- 大型Pak考虑拆分为多个小Pak
- 使用 getFilesInPak 预加载资源清单

### 7. Reset机制说明

当 PakLoadManagerFactory 重置时(如PIE重启、关卡切换):

- 自动卸载所有通过 mountPakFile/mountPakFile2 挂载的Pak
- 自动注销所有通过 registerMountPoint 注册的挂载点
- 已注册的加密密钥不会被清除(引擎限制)

---

## 完整使用示例

### 示例1: 加载普通Pak并使用资源

```json
// 1. 挂载Pak
{
  "CMD": "/pakLoadManager/mountPakFile",
  "Data": {
    "pakFileName": "D:/Assets/BuildingLibrary.pak"
  }
}

// 2. 查询Pak内容(可选)
{
  "CMD": "/pakLoadManager/getFilesInPak",
  "Data": {
    "pakFileName": "D:/Assets/BuildingLibrary.pak"
  }
}

// 3. 使用Pak中的资源(通过其他命令)
// 例如: 加载资源库UI、生成Actor等

// 4. 使用完毕后卸载
{
  "CMD": "/pakLoadManager/unmountPakFile",
  "Data": {
    "pakFileName": "D:/Assets/BuildingLibrary.pak"
  }
}

```

### 示例2: 加载加密Pak

```json
// 1. 先注册密钥
{
  "CMD": "/pakLoadManager/registerEncryptionKey",
  "Data": {
    "AesKey": "1234567890ABCDEF1234567890ABCDEF"
  }
}

// 2. 再挂载加密Pak
{
  "CMD": "/pakLoadManager/mountPakFile2",
  "Data": {
    "pakFileName": "D:/Assets/SecretLibrary.pak",
    "MountPath": "../../../SecretContent/",
    "RegisterName": "/Secret/"
  }
}

```

### 示例3: 自定义路径映射

```json
// 1. 挂载Pak(基础版)
{
  "CMD": "/pakLoadManager/mountPakFile",
  "Data": {
    "pakFileName": "D:/Assets/CustomLibrary.pak"
  }
}

// 2. 注册自定义挂载点
{
  "CMD": "/pakLoadManager/registerMountPoint",
  "Data": {
    "RootPath": "/CustomLib/",
    "ContentPath": "../../../CustomContent/"
  }
}

// 3. 现在可以通过 /CustomLib/ 访问Pak中的资源

```

---

## 相关命令

### AssetLibrary命令

- [loadAssetLibraryUI](AssetLibraryManager_API.md#1-loadassetlibraryui) - 内部使用 mountPakFile 挂载Pak
- [closeAssetLibraryUI](AssetLibraryManager_API.md#2-closeassetlibraryui) - 可选择是否卸载Pak

### 关系说明

PakLoadManager 提供底层Pak管理能力,AssetLibraryManager 在此基础上提供UI层功能。建议:

- 只需要UI浏览功能时,使用 AssetLibrary 命令
- 需要底层控制或自定义加载逻辑时,使用 PakLoadManager 命令

---

## 技术实现说明

### 底层库

所有命令都基于 `UWebCorePakLoaderLibrary` 实现:

- **MountPakFile**: 调用 FPakPlatformFile 挂载Pak
- **UnmountPakFile**: 移除Pak文件映射
- **RegisterMountPoint**: 调用 FPackageName::RegisterMountPoint
- **GetFilesInPak**: 读取Pak文件头获取文件列表
- **RegisterEncryptionKey**: 注册到 FCoreDelegates::GetPakEncryptionKeyDelegate

### 文件路径

- **源代码**: `WebCore/Source/WebCore/Private/Commands/PakLoadCommands.cpp`
- **工厂类**: `WebCore/Source/WebCore/Private/CommandFactories/PakLoadManagerFactory.cpp`
- **库函数**: `WebCore/Source/WebCore/Private/Libraries/WebCorePakLoaderLibrary.cpp`

---
