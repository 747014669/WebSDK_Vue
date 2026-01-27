// src/config/apiSchema.ts

export type ParamType = 'string' | 'float' | 'integer' | 'boolean' | 'vector3' | 'json' | 'select' | 'array';

export interface CommandParam {
  key: string;
  label: string;
  type: ParamType;
  default: any;
  unit?: string;
  options?: { label: string; value: any }[];
  desc?: string;
}

export interface CommandDef {
  cmd: string;
  name: string;
  desc?: string;
  params?: CommandParam[];
}

export interface ManagerDef {
  title: string;
  iconStr: string;
  desc: string;
  commands: CommandDef[];
}

// 定义左侧菜单和按钮
export const apiSchema: Record<string, ManagerDef> = {
  CameraManager: {
    title: "相机管理",
    iconStr: "CM",
    desc: "相机位置、旋转、变焦、分屏、漫游",
    commands: [
      {
        cmd: "/cameraManager/setDesiredPosition",
        name: "设置相机综合状态",
        desc: "同时设置位置和旋转",
        params: [
          { key: "newLocation", label: "目标位置", type: "vector3", default: [0, 0, 0], unit: "米" },
          { key: "NewRotation", label: "目标旋转", type: "vector3", default: [0, 0, 0], unit: "度" },
          { key: "Zoom", label: "距离", type: "float", default: 50, unit: "米" },
          { key: "duration", label: "过渡时间", type: "float", default: 1.25, unit: "秒" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredLocation",
        name: "设置相机位置",
        params: [
          { key: "Location", label: "目标位置", type: "vector3", default: [0, 0, 0], unit: "米" },
          { key: "Zoom", label: "距离", type: "float", default: 50, unit: "米" },
          { key: "duration", label: "过渡时间", type: "float", default: 0.75, unit: "秒" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredYaw",
        name: "设置偏航角",
        params: [
          { key: "NewYaw", label: "偏航角", type: "float", default: 0, unit: "度" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredPitch",
        name: "设置俯仰角",
        params: [
          { key: "NewPitch", label: "俯仰角", type: "float", default: 0, unit: "度" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredZoom",
        name: "设置变焦",
        params: [
          { key: "Zoom", label: "变焦距离", type: "float", default: 50, unit: "米" }
        ]
      },
      {
        cmd: "/cameraManager/getCameraTransform",
        name: "获取相机变换",
        params: []
      },
      {
        cmd: "/cameraManager/splitScreen",
        name: "启用分屏对比",
        params: [
          { key: "Tag1", label: "主屏标签", type: "string", default: "PlanA" },
          { key: "Tag2", label: "分屏标签", type: "string", default: "PlanB" }
        ]
      },
      {
        cmd: "/cameraManager/endSplitScreen",
        name: "禁用分屏",
        params: []
      },
      {
        cmd: "/cameraManager/startCameraRoaming",
        name: "开始相机漫游",
        params: [
          { key: "waypoints", label: "路径点", type: "json", default: [[0,0,0], [100,0,0]] },
          { key: "rotations", label: "旋转", type: "json", default: [[0,0,0], [0,0,0]] },
          { key: "totalDuration", label: "总时长", type: "float", default: 10, unit: "秒" }
        ]
      },
      {
        cmd: "/cameraManager/pauseCameraRoaming",
        name: "暂停漫游",
        params: []
      },
      {
        cmd: "/cameraManager/resumeCameraRoaming",
        name: "恢复漫游",
        params: []
      },
      {
        cmd: "/cameraManager/stopCameraRoaming",
        name: "停止漫游",
        params: []
      },
      {
        cmd: "/cameraManager/getCameraRoamingStatus",
        name: "查询漫游状态",
        params: []
      }
    ]
  },

  AnalysisTool: {
    title: "分析工具",
    iconStr: "AT",
    desc: "天际线、可视域、通视、地形分析",
    commands: [
      { cmd: "/analysisTool/showSkyline", name: "显示天际线", params: [] },
      { cmd: "/analysisTool/show2DSkyline", name: "显示2D天际线", params: [
        { key: "bShow", label: "显示", type: "boolean", default: true },
        { key: "Position", label: "位置", type: "json", default: [100, 100] }
      ]},
      { cmd: "/analysisTool/hideSkyline", name: "隐藏天际线", params: [] },
      {
        cmd: "/analysisTool/activateViewshed",
        name: "激活可视域分析",
        params: [
          { key: "FOV", label: "视场角", type: "float", default: 90, unit: "度" },
          { key: "Resolution", label: "分辨率", type: "integer", default: 1024 },
          { key: "DepthBias", label: "深度偏移", type: "float", default: 20, unit: "厘米" }
        ]
      },
      { cmd: "/analysisTool/deactivateViewshed", name: "取消可视域", params: [] },
      {
        cmd: "/analysisTool/activateLineOfSight",
        name: "激活通视分析",
        params: [
          { key: "LineThickness", label: "线条粗细", type: "float", default: 2, unit: "像素" }
        ]
      },
      { cmd: "/analysisTool/deactivateLineOfSight", name: "取消通视", params: [] },
      {
        cmd: "/analysisTool/activateTerrainAnalysis",
        name: "激活地形分析",
        params: [
          { key: "AnalysisType", label: "分析类型", type: "select", default: "Contour", 
            options: [
              { label: "等高线", value: "Contour" },
              { label: "坡度坡向", value: "SlopeAspect" }
            ]
          },
          { key: "Resolution", label: "分辨率", type: "integer", default: 512 }
        ]
      },
      { cmd: "/analysisTool/deactivateTerrainAnalysis", name: "取消地形分析", params: [] },
      { cmd: "/analysisTool/getTerrainAnalysisInfo", name: "获取地形分析信息", params: [] }
    ]
  },

  GlsCommand: {
    title: "场景对象",
    iconStr: "GC",
    desc: "模型显隐、高亮、属性、方法、关卡",
    commands: [
      {
        cmd: "/gls/ShowModelByTags",
        name: "根据Tag显隐模型",
        params: [
          { key: "Tags", label: "标签配置", type: "json", default: [{"Tag": "Building_A", "Show": true}] }
        ]
      },
      {
        cmd: "/gls/ShowModelChildrenByTag",
        name: "显隐模型及子对象",
        params: [
          { key: "Tags", label: "标签配置", type: "json", default: [{"Tag": "ParentActor", "Show": true}] }
        ]
      },
      {
        cmd: "/gls/ShowModelByLayers",
        name: "根据Layer显隐",
        params: [
          { key: "Layers", label: "图层配置", type: "json", default: [{"Layer": "Architecture", "Show": true}] }
        ]
      },
      {
        cmd: "/gls/DestroyModelByTags",
        name: "根据Tag删除模型",
        params: [
          { key: "Tags", label: "标签数组", type: "json", default: ["TempObject"] }
        ]
      },
      {
        cmd: "/gls/HighlightModelByTag",
        name: "高亮模型",
        params: [
          { key: "Tag", label: "模型标签", type: "string", default: "SelectedBuilding" },
          { key: "Channel", label: "高亮通道", type: "integer", default: 1, desc: "1-6" }
        ]
      },
      {
        cmd: "/gls/CancelHighlightByTag",
        name: "取消高亮",
        params: [
          { key: "Tag", label: "模型标签", type: "string", default: "" }
        ]
      },
      {
        cmd: "/gls/LoadStreamingLevel",
        name: "加载流送关卡",
        params: [
          { key: "Levels", label: "关卡名称", type: "json", default: ["Level_District_A"] }
        ]
      },
      {
        cmd: "/gls/UnloadStreamingLevel",
        name: "卸载流送关卡",
        params: [
          { key: "Levels", label: "关卡名称", type: "json", default: ["Level_District_A"] }
        ]
      },
      {
        cmd: "/gls/PlaySequence",
        name: "播放序列",
        params: [
          { key: "Sequence", label: "序列路径", type: "string", default: "" },
          { key: "State", label: "状态", type: "select", default: "play",
            options: [
              { label: "播放", value: "play" },
              { label: "暂停", value: "pause" },
              { label: "重置", value: "reset" },
              { label: "重播", value: "replay" }
            ]
          },
          { key: "Speed", label: "速度", type: "float", default: 1.0 }
        ]
      },
      {
        cmd: "/gls/GetPropertyById",
        name: "获取属性(ID)",
        params: [
          { key: "Id", label: "Actor标识", type: "string", default: "Building_001" },
          { key: "Property", label: "属性名", type: "string", default: "ActorLocation" }
        ]
      },
      {
        cmd: "/gls/SetPropertyById",
        name: "设置属性(ID)",
        params: [
          { key: "Id", label: "Actor标识", type: "string", default: "Building_001" },
          { key: "Property", label: "属性名", type: "string", default: "ActorLocation" },
          { key: "PropertyValue", label: "属性值", type: "json", default: {"X": 0, "Y": 0, "Z": 0} }
        ]
      },
      {
        cmd: "/gls/ExecuteFunctionById",
        name: "执行方法(ID)",
        params: [
          { key: "Id", label: "Actor标识", type: "string", default: "Door_001" },
          { key: "Function", label: "方法名", type: "string", default: "OpenDoor" }
        ]
      },
      {
        cmd: "/gls/FrameSelect",
        name: "框选功能",
        params: [
          { key: "bActive", label: "激活", type: "boolean", default: true },
          { key: "TagPatterns", label: "排除前缀", type: "json", default: ["System_"] },
          { key: "bIncludeHidden", label: "包含隐藏", type: "boolean", default: false }
        ]
      },
      {
        cmd: "/gls/GetHitResultUnderCursor",
        name: "获取鼠标碰撞",
        params: [
          { key: "bActive", label: "激活", type: "boolean", default: true }
        ]
      },
      {
        cmd: "/gls/GetTagsWithPattern",
        name: "获取Tag列表",
        params: [
          { key: "Pattern", label: "前缀模式", type: "string", default: "Building_" }
        ]
      },
      { cmd: "/gls/ToolCancel", name: "工具取消", params: [] }
    ]
  },

  PoiManager: {
    title: "POI管理",
    iconStr: "PM",
    desc: "POI创建、更新、聚合、事件",
    commands: [
      {
        cmd: "/poiManager/CreatePoi",
        name: "创建POI",
        params: [
          { key: "Ids", label: "ID数组", type: "json", default: ["building"] },
          { key: "Group", label: "分组", type: "string", default: "Buildings" },
          { key: "Positions", label: "位置数组", type: "json", default: [[0,0,0]] },
          { key: "EnableClick", label: "启用点击", type: "boolean", default: true },
          { key: "EnableHover", label: "启用悬停", type: "boolean", default: false }
        ]
      },
      {
        cmd: "/poiManager/UpdatePoi",
        name: "更新POI",
        params: [
          { key: "Group", label: "分组", type: "string", default: "Buildings" },
          { key: "StyleJson", label: "样式", type: "json", default: {} }
        ]
      },
      {
        cmd: "/poiManager/SetAggregation",
        name: "设置聚合",
        params: [
          { key: "GroupID", label: "分组ID", type: "string", default: "Default" },
          { key: "EnableAggregation", label: "启用聚合", type: "boolean", default: true },
          { key: "AggregationDistance", label: "聚合距离", type: "float", default: 1000, unit: "米" },
          { key: "MinClusterSize", label: "最小簇大小", type: "integer", default: 4 },
          { key: "MaxTreeDepth", label: "最大深度", type: "integer", default: 6 }
        ]
      },
      {
        cmd: "/poiManager/DestroyPoi",
        name: "销毁POI",
        params: [
          { key: "Group", label: "分组", type: "string", default: "Buildings" }
        ]
      },
      {
        cmd: "/poiManager/BindPoiEvent",
        name: "绑定事件",
        params: [
          { key: "PoiID", label: "POI ID", type: "string", default: "poi_0" },
          { key: "EventType", label: "事件类型", type: "select", default: "click",
            options: [
              { label: "点击", value: "click" },
              { label: "悬停", value: "hover" },
              { label: "离开", value: "unhover" }
            ]
          }
        ]
      },
      {
        cmd: "/poiManager/UnbindPoiEvent",
        name: "解绑事件",
        params: [
          { key: "PoiID", label: "POI ID", type: "string", default: "poi_0" },
          { key: "EventType", label: "事件类型", type: "string", default: "click" }
        ]
      }
    ]
  },

  MarkManager: {
    title: "路径标记",
    iconStr: "MM",
    desc: "路径创建、绘制、漫游",
    commands: [
      {
        cmd: "/markManager/CreatePathFromPoints",
        name: "创建路径",
        params: [
          { key: "pathType", label: "路径类型", type: "select", default: "Default",
            options: [
              { label: "默认", value: "Default" },
              { label: "样条网格", value: "SplineMesh" },
              { label: "倒角", value: "Beveled" },
              { label: "分段着色", value: "SegmentedColor" },
              { label: "颜色曲线", value: "ColorCurve" }
            ]
          },
          { key: "points", label: "路径点", type: "json", default: [[0,0,0], [100,0,0]] }
        ]
      },
      {
        cmd: "/markManager/BeginDrawPath",
        name: "开始绘制路径",
        params: [
          { key: "pathType", label: "路径类型", type: "string", default: "Default" }
        ]
      },
      { cmd: "/markManager/FinishDrawPath", name: "完成绘制", params: [] },
      {
        cmd: "/markManager/UpdatePathStyle",
        name: "更新路径样式",
        params: [
          { key: "pathId", label: "路径ID", type: "string", default: "path_1" },
          { key: "style", label: "样式", type: "json", default: {} }
        ]
      },
      {
        cmd: "/markManager/DeletePath",
        name: "删除路径",
        params: [
          { key: "pathId", label: "路径ID", type: "string", default: "path_1" }
        ]
      },
      { cmd: "/markManager/ClearAllPaths", name: "清除所有路径", params: [] },
      {
        cmd: "/markManager/StartTravel",
        name: "开始漫游",
        params: [
          { key: "pathId", label: "路径ID", type: "string", default: "path_1" },
          { key: "duration", label: "时长", type: "float", default: 10, unit: "秒" },
          { key: "travelType", label: "漫游类型", type: "select", default: "Fly",
            options: [
              { label: "飞行", value: "Fly" },
              { label: "车辆", value: "Vehicle" },
              { label: "角色", value: "Character" }
            ]
          },
          { key: "loop", label: "循环", type: "boolean", default: false }
        ]
      },
      { cmd: "/markManager/StopTravel", name: "停止漫游", params: [] },
      {
        cmd: "/markManager/PauseTravel",
        name: "暂停漫游",
        params: [
          { key: "paused", label: "暂停", type: "boolean", default: true }
        ]
      },
      {
        cmd: "/markManager/SetTravelProgress",
        name: "设置漫游进度",
        params: [
          { key: "progress", label: "进度", type: "float", default: 0.5, desc: "0-1" }
        ]
      }
    ]
  },

  HeatmapManager: {
    title: "热力图",
    iconStr: "HM",
    desc: "热力图创建、更新、查询",
    commands: [
      {
        cmd: "/heatmapManager/createHeatmap",
        name: "创建热力图",
        params: [
          { key: "DataPoints", label: "数据点", type: "json", default: [[0,0,0.8], [10,0,0.5]] },
          { key: "InfluenceRadius", label: "影响半径", type: "float", default: 100, unit: "米" },
          { key: "FalloffType", label: "衰减类型", type: "select", default: 2,
            options: [
              { label: "线性", value: 0 },
              { label: "平方", value: 1 },
              { label: "高斯", value: 2 }
            ]
          }
        ]
      },
      {
        cmd: "/heatmapManager/updateHeatmap",
        name: "更新热力图",
        params: [
          { key: "DataPoints", label: "数据点", type: "json", default: [[0,0,0.9]] },
          { key: "InfluenceRadius", label: "影响半径", type: "float", default: 100, unit: "米" }
        ]
      },
      { cmd: "/heatmapManager/deleteHeatmap", name: "删除热力图", params: [] },
      { cmd: "/heatmapManager/getHeatmapInfo", name: "获取热力图信息", params: [] }
    ]
  },

  MeasurementFactory: {
    title: "测量工具",
    iconStr: "MF",
    desc: "坐标、距离、面积、高度测量",
    commands: [
      {
        cmd: "/measurement/measure",
        name: "一步测量",
        params: [
          { key: "Type", label: "测量类型", type: "select", default: "distance",
            options: [
              { label: "坐标", value: "coordinate" },
              { label: "距离", value: "distance" },
              { label: "面积", value: "area" },
              { label: "高度", value: "height" }
            ]
          },
          { key: "Points", label: "测量点", type: "json", default: [[0,0,0], [100,0,0]] }
        ]
      },
      {
        cmd: "/measurement/mouseMeasurement",
        name: "鼠标测量",
        params: [
          { key: "Type", label: "测量类型", type: "select", default: "distance",
            options: [
              { label: "坐标", value: "coordinate" },
              { label: "距离", value: "distance" },
              { label: "面积", value: "area" },
              { label: "高度", value: "height" }
            ]
          }
        ]
      },
      {
        cmd: "/measurement/clearMeasurement",
        name: "清除测量",
        params: [
          { key: "MeasurementId", label: "测量ID", type: "integer", default: 1 }
        ]
      }
    ]
  },

  AssetLibrary: {
    title: "资源库",
    iconStr: "AL",
    desc: "Pak文件资源浏览",
    commands: [
      {
        cmd: "/assetLibrary/loadAssetLibraryUI",
        name: "加载资源库UI",
        params: [
          { key: "pakFilePath", label: "Pak路径", type: "string", default: "D:/Assets/library.pak" },
          { key: "assetType", label: "资源类型", type: "select", default: "All",
            options: [
              { label: "全部", value: "All" },
              { label: "静态网格", value: "StaticMesh" },
              { label: "材质", value: "Material" },
              { label: "纹理", value: "Texture" }
            ]
          }
        ]
      },
      {
        cmd: "/assetLibrary/closeAssetLibraryUI",
        name: "关闭资源库UI",
        params: [
          { key: "libraryName", label: "库名称", type: "string", default: "" },
          { key: "unloadPak", label: "卸载Pak", type: "boolean", default: false }
        ]
      }
    ]
  },

  PakLoadManager: {
    title: "Pak管理",
    iconStr: "PL",
    desc: "Pak文件挂载、卸载、查询",
    commands: [
      {
        cmd: "/pakLoadManager/mountPakFile",
        name: "挂载Pak(基础)",
        params: [
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak" },
          { key: "MountPath", label: "挂载路径", type: "string", default: "../.../../" }
        ]
      },
      {
        cmd: "/pakLoadManager/mountPakFile2",
        name: "挂载Pak(高级)",
        params: [
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak" },
          { key: "MountPath", label: "挂载路径", type: "string", default: "../.../../" },
          { key: "RegisterName", label: "虚拟路径", type: "string", default: "/Game/" }
        ]
      },
      {
        cmd: "/pakLoadManager/registerMountPoint",
        name: "注册挂载点",
        params: [
          { key: "RootPath", label: "虚拟根路径", type: "string", default: "/Game/" },
          { key: "ContentPath", label: "物理路径", type: "string", default: "../../../Content/" }
        ]
      },
      {
        cmd: "/pakLoadManager/getFilesInPak",
        name: "获取Pak文件列表",
        params: [
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak" }
        ]
      },
      {
        cmd: "/pakLoadManager/unmountPakFile",
        name: "卸载Pak",
        params: [
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak" }
        ]
      },
      {
        cmd: "/pakLoadManager/registerEncryptionKey",
        name: "注册加密密钥",
        params: [
          { key: "AesKey", label: "AES密钥", type: "string", default: "" }
        ]
      }
    ]
  },

  CacheManager: {
    title: "缓存管理",
    iconStr: "CH",
    desc: "图片预加载和缓存清理",
    commands: [
      {
        cmd: "/CacheManager/preloadImages",
        name: "预加载图片",
        params: [
          { key: "images", label: "图片配置", type: "json", 
            default: [{"image_1": "https://example.com/image1.png"}] }
        ]
      },
      {
        cmd: "/CacheManager/clearImageCache",
        name: "清理缓存",
        params: [
          { key: "all", label: "清空所有", type: "boolean", default: false },
          { key: "keys", label: "缓存键", type: "json", default: ["image_1"] }
        ]
      }
    ]
  },

  SettingsManager: {
    title: "设置管理",
    iconStr: "SM",
    desc: "系统设置、Handler设置、地理参考",
    commands: [
      { cmd: "/settingsManager/getRegisteredSettingTypes", name: "获取设置类型", params: [] },
      {
        cmd: "/settingsManager/getSettings",
        name: "获取设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "select", default: "SystemSettings",
            options: [
              { label: "系统设置", value: "SystemSettings" },
              { label: "Handler设置", value: "HandlerSettings" },
              { label: "WebCore设置", value: "WebCoreSettings" }
            ]
          }
        ]
      },
      { cmd: "/settingsManager/getAllSettings", name: "获取所有设置", params: [] },
      {
        cmd: "/settingsManager/updateSettings",
        name: "更新设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings" },
          { key: "Settings", label: "设置内容", type: "json", default: {} }
        ]
      },
      {
        cmd: "/settingsManager/updateSettingProperty",
        name: "更新单个属性",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings" },
          { key: "PropertyPath", label: "属性路径", type: "string", default: "SystemUnit" },
          { key: "PropertyValue", label: "属性值", type: "string", default: "Meters" }
        ]
      },
      {
        cmd: "/settingsManager/resetSettings",
        name: "重置设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings" }
        ]
      },
      {
        cmd: "/settingsManager/reloadSettings",
        name: "重新加载设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings" }
        ]
      },
      {
        cmd: "/settingsManager/saveSettings",
        name: "保存设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings" }
        ]
      },
      { cmd: "/settingsManager/saveAllSettings", name: "保存所有设置", params: [] },
      { cmd: "/settingsManager/getSystemSettings", name: "获取系统设置(快捷)", params: [] },
      {
        cmd: "/settingsManager/updateSystemSettings",
        name: "更新系统设置(快捷)",
        params: [
          { key: "Settings", label: "设置内容", type: "json", default: {"SystemUnit": "Meters"} }
        ]
      },
      { cmd: "/settingsManager/getHandlerSettings", name: "获取Handler设置(快捷)", params: [] },
      {
        cmd: "/settingsManager/updateHandlerSettings",
        name: "更新Handler设置(快捷)",
        params: [
          { key: "Settings", label: "设置内容", type: "json", default: {} }
        ]
      },
      { cmd: "/settingsManager/getWebCoreSettings", name: "获取WebCore设置(快捷)", params: [] },
      {
        cmd: "/settingsManager/updateWebCoreSettings",
        name: "更新WebCore设置(快捷)",
        params: [
          { key: "Settings", label: "设置内容", type: "json", default: {} }
        ]
      },
      {
        cmd: "/settingsManager/initGeoReference",
        name: "初始化地理参考",
        params: [
          { key: "ProjectedCRS", label: "投影坐标系", type: "string", default: "EPSG:4547" },
          { key: "GeographicCRS", label: "地理坐标系", type: "string", default: "EPSG:4490" },
          { key: "OriginLatitude", label: "原点纬度", type: "float", default: 22.516226 },
          { key: "OriginLongitude", label: "原点经度", type: "float", default: 113.883095 },
          { key: "OriginAltitude", label: "原点高度", type: "float", default: 0, unit: "米" }
        ]
      }
    ]
  }
};
