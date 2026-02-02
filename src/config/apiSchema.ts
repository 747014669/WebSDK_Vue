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
          { key: "newLocation", label: "目标位置", type: "vector3", default: [0.9721862123144714,424.43107679053503,371.7628626505302], unit: "米", desc: "必填：目标世界坐标" },
          { key: "NewRotation", label: "目标旋转", type: "vector3", default: [-22.218017202593682,-159.68495872009152,0], unit: "度", desc: "可选：目标旋转[pitch,yaw,roll]" },
          { key: "Zoom", label: "距离", type: "float", default: 0, unit: "米", desc: "可选：目标点到相机的距离，范围1-10000" },
          { key: "duration", label: "过渡时间", type: "float", default: 1.25, unit: "秒", desc: "可选：过渡动画时长，推荐0-60" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredLocation",
        name: "设置相机位置",
        params: [
          { key: "Location", label: "目标位置", type: "vector3", default: [0.9721862123144714,424.43107679053503,371.7628626505302], unit: "米", desc: "必填：目标世界坐标" },
          { key: "Zoom", label: "距离", type: "float", default: 50, unit: "米", desc: "可选：目标点到相机的距离，范围1-10000" },
          { key: "duration", label: "过渡时间", type: "float", default: 0.75, unit: "秒", desc: "可选：过渡动画时长" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredYaw",
        name: "设置偏航角",
        params: [
          { key: "NewYaw", label: "偏航角", type: "float", default: 0, unit: "度", desc: "必填：目标偏航角" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredPitch",
        name: "设置俯仰角",
        params: [
          { key: "NewPitch", label: "俯仰角", type: "float", default: 0, unit: "度", desc: "必填：目标俯仰角，通常限制在-90到90度" }
        ]
      },
      {
        cmd: "/cameraManager/setDesiredZoom",
        name: "设置变焦",
        params: [
          { key: "Zoom", label: "变焦距离", type: "float", default: 50, unit: "米", desc: "必填：沿视线方向移动距离，正值向前，负值向后，范围-10000到10000" }
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
          { key: "Tag1", label: "主屏标签", type: "string", default: "D302469673D9189E21AD1B6626C61BD9", desc: "必填：主屏幕（左侧）中可见Actor的标签" },
          { key: "Tag2", label: "分屏标签", type: "string", default: "F5D482FA18AB6E6579528AF9E500E14D", desc: "必填：分屏（右侧）中可见Actor的标签" }
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
          { key: "waypoints", label: "路径点", type: "json", default: [[60.71,597.2,607.75], [113.55,367.21,610.48], [67.4,37.56,602.27], [71.72,-149.95,702.25], [-354.55,-208.8,577.23], [-655.85,225.21,522.09]], desc: "必填：漫游路径点数组，至少2个点" },
          { key: "rotations", label: "旋转", type: "json", default: [[-45.08,-156.38,0.0], [-45.62,-171.86,0.0], [-44.11,140.98,0.0], [-43.67,121.15,0.0], [-39.63,70.36,-0.00], [-41.99,-7.71,-0.0]], desc: "必填：与路径点对应的旋转数组" },
          { key: "segmentDurations", label: "分段时长", type: "json", default: [], desc: "可选：每个分段的持续时间数组，与totalDuration二选一" },
          { key: "totalDuration", label: "总时长", type: "float", default: 10, unit: "秒", desc: "可选：整个漫游的总时长，与segmentDurations二选一" }
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
        { key: "bShow", label: "显示", type: "boolean", default: true, desc: "必填：true=显示，false=隐藏" },
        { key: "Position", label: "位置", type: "json", default: [100, 100], desc: "可选：Widget位置[x,y]，屏幕坐标（像素）" }
      ]},
      { cmd: "/analysisTool/hideSkyline", name: "隐藏天际线", params: [] },
      {
        cmd: "/analysisTool/activateViewshed",
        name: "激活可视域分析",
        params: [
          { key: "FOV", label: "视场角", type: "float", default: 90, unit: "度", desc: "可选：视场角，范围30-120" },
          { key: "Resolution", label: "分辨率", type: "integer", default: 1024, desc: "可选：渲染目标分辨率，范围256-2048" },
          { key: "DepthBias", label: "深度偏移", type: "float", default: 20, unit: "厘米", desc: "可选：深度偏移，用于避免Z-fighting" },
          { key: "HeightOffset", label: "观察高度", type: "float", default: 1.6, unit: "米", desc: "可选：点击点的高度偏移" },
        ]
      },
      { cmd: "/analysisTool/deactivateViewshed", name: "取消可视域", params: [] },
      {
        cmd: "/analysisTool/activateLineOfSight",
        name: "激活通视分析",
        params: [
          { key: "LineThickness", label: "线条粗细", type: "float", default: 2, unit: "像素", desc: "可选：线条粗细" }
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
            ],
            desc: "可选：分析类型"
          },
          { key: "Resolution", label: "分辨率", type: "integer", default: 512, desc: "可选：采样分辨率，范围64-2048" },
          { key: "ContourSettings", label: "等高线设置", type: "json", default: {"Interval": 5.0,"MajorInterval": 5,"ShowLabels": true}, desc: "可选：等高线配置（当AnalysisType=Contour时有效）" },
          { key: "SlopeAspectSettings", label: "坡度坡向设置", type: "json", default: {"SlopeOpacity": 0.7,"ShowAspectArrows": true,"ArrowSpacing": 50.0,"FlatThreshold": 2.0}, desc: "可选：坡度坡向配置（当AnalysisType=SlopeAspect时有效）" }
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
          { key: "Tags", label: "标签配置", type: "json", default: [{"Tag": "D302469673D9189E21AD1B6626C61BD9", "Show": true}], desc: "必填：Tag配置数组，每项包含Tag和Show字段" }
        ]
      },
      {
        cmd: "/gls/ShowModelChildrenByTag",
        name: "显隐模型及子对象",
        params: [
          { key: "Tags", label: "标签配置", type: "json", default: [{"Tag": "888FC56BE06AACEBB930455DC8DEC0D0", "Show": true}], desc: "必填：Tag配置数组" }
        ]
      },
      {
        cmd: "/gls/ShowModelByLayers",
        name: "根据Layer显隐",
        params: [
          { key: "Layers", label: "图层配置", type: "json", default: [{"Layer": "Architecture", "Show": true}], desc: "必填：Layer配置数组" }
        ]
      },
      {
        cmd: "/gls/DestroyModelByTags",
        name: "根据Tag删除模型",
        params: [
          { key: "Tags", label: "标签数组", type: "json", default: ["TempObject"], desc: "必填：需要删除的Tag数组" }
        ]
      },
      {
        cmd: "/gls/HighlightModelByTag",
        name: "高亮模型",
        params: [
          { key: "Tag", label: "模型标签", type: "string", default: "SelectedBuilding", desc: "必填：模型Tag标识" },
          { key: "Channel", label: "高亮通道", type: "integer", default: 1, desc: "必填：高亮通道1-6，对应不同描边颜色" }
        ]
      },
      {
        cmd: "/gls/CancelHighlightByTag",
        name: "取消高亮",
        params: [
          { key: "Tag", label: "模型标签", type: "string", default: "", desc: "可选：模型Tag，为空则取消所有高亮" }
        ]
      },
      {
        cmd: "/gls/LoadStreamingLevel",
        name: "加载流送关卡",
        params: [
          { key: "Levels", label: "关卡名称", type: "json", default: ["Level_District_A"], desc: "必填：关卡名称数组" }
        ]
      },
      {
        cmd: "/gls/UnloadStreamingLevel",
        name: "卸载流送关卡",
        params: [
          { key: "Levels", label: "关卡名称", type: "json", default: ["Level_District_A"], desc: "必填：关卡名称数组" }
        ]
      },
      {
        cmd: "/gls/PlaySequence",
        name: "播放序列",
        params: [
          { key: "Sequence", label: "序列路径", type: "string", default: "/Game/environment/KCDH_lSequence", desc: "序列资源路径" },
          { key: "State", label: "状态", type: "select", default: "play",
            options: [
              { label: "播放", value: "play" },
              { label: "暂停", value: "pause" },
              { label: "重置", value: "reset" },
              { label: "重播", value: "replay" }
            ],
            desc: "可选：播放状态"
          },
          { key: "Speed", label: "速度", type: "float", default: 1.0, desc: "可选：播放速度倍率" },
          { key: "Progress", label: "进度", type: "float", default: 0.0, desc: "可选：播放进度0.0-1.0" }
        ]
      },
      {
        cmd: "/gls/GetPropertyById",
        name: "获取属性(ID)",
        params: [
          { key: "Id", label: "Actor标识", type: "string", default: "D302469673D9189E21AD1B6626C61BD9", desc: "必填：Actor的Tag标识" },
          { key: "Property", label: "属性名", type: "string", default: "bHidden", desc: "必填：属性名称" }
        ]
      },
      {
        cmd: "/gls/SetPropertyById",
        name: "设置属性(ID)",
        params: [
          { key: "Id", label: "Actor标识", type: "string", default: "D302469673D9189E21AD1B6626C61BD9", desc: "必填：Actor的Tag标识" },
          { key: "Property", label: "属性名", type: "string", default: "bHidden", desc: "必填：属性名称" },
          { key: "PropertyValue", label: "属性值", type: "json", default: true, desc: "必填：属性值" }
        ]
      },
      {
        cmd: "/gls/ExecuteFunctionById",
        name: "执行方法(ID)",
        params: [
          { key: "Id", label: "Actor标识", type: "string", default: "Door_001", desc: "必填：Actor的Tag标识" },
          { key: "Function", label: "方法名", type: "string", default: "OpenDoor", desc: "必填：方法名称" }
        ]
      },
      {
        cmd: "/gls/FrameSelect",
        name: "框选功能",
        params: [
          { key: "bActive", label: "激活", type: "boolean", default: true, desc: "可选：true=激活框选，false=取消框选" },
          { key: "TagPatterns", label: "排除前缀", type: "json", default: ["System_"], desc: "可选：Tag前缀排除列表" },
          { key: "bIncludeHidden", label: "包含隐藏", type: "boolean", default: false, desc: "可选：是否包含隐藏的Actor" }
        ]
      },
      {
        cmd: "/gls/GetHitResultUnderCursor",
        name: "获取鼠标碰撞",
        params: [
          { key: "bActive", label: "激活", type: "boolean", default: true, desc: "可选：true=激活监听，false=取消监听" }
        ]
      },
      {
        cmd: "/gls/GetTagsWithPattern",
        name: "获取Tag列表",
        params: [
          { key: "Pattern", label: "前缀模式", type: "string", default: "Building_", desc: "必填：Tag前缀模式" }
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
          { key: "Ids", label: "ID数组", type: "json", default: ["building"], desc: "必填：POI ID数组，单个ID自动扩展或多个ID需与位置数量相等" },
          { key: "Group", label: "分组", type: "string", default: "Buildings", desc: "必填：分组名称" },
          { key: "Positions", label: "位置数组", type: "json", default: [[0,0,0]], unit: "米", desc: "必填：坐标数组 [[x,y,z], ...]" },
          { key: "PoiClass", label: "POI Actor类", type: "string", default: "", desc: "可选：POI Actor类路径，默认AWebCorePoiActorBase" },
          { key: "UMGClass", label: "UMG Widget类", type: "string", default: "", desc: "可选：UMG Widget类路径，默认POIUMG_Standard" },
          { key: "StyleJson", label: "样式配置", type: "json", default: {}, desc: "可选：样式对象，配置控件样式" },
          { key: "Texts", label: "文本内容", type: "json", default: {}, desc: "可选：文本内容对象，为每个POI设置不同文本" },
          { key: "MergeStrategy", label: "合并策略", type: "select", default: "None", 
            options: [
              { label: "无(默认)", value: "None" },
              { label: "合并到现有分组", value: "Merge" }
            ],
            desc: "可选：当Group已存在时的处理策略"
          },
          { key: "EnableClick", label: "启用点击", type: "boolean", default: true, desc: "可选：是否启用点击交互" },
          { key: "EnableHover", label: "启用悬停", type: "boolean", default: false, desc: "可选：是否启用悬停交互" },
          { key: "Events", label: "事件绑定", type: "json", default: {}, desc: "可选：事件绑定配置对象，支持click/hover/unhover" }
        ]
      },
      {
        cmd: "/poiManager/UpdatePoi",
        name: "更新POI",
        params: [
          { key: "PoiIds", label: "POI ID数组", type: "json", default: [], desc: "可选：POI标识符数组，与Group二选一" },
          { key: "Group", label: "分组", type: "string", default: "", desc: "可选：分组ID，与PoiIds二选一" },
          { key: "StyleJson", label: "样式配置", type: "json", default: {}, desc: "必填：样式对象" }
        ]
      },
      {
        cmd: "/poiManager/SetAggregation",
        name: "设置聚合",
        params: [
          { key: "GroupID", label: "分组ID", type: "string", default: "Default", desc: "必填：分组名称" },
          { key: "EnableAggregation", label: "启用聚合", type: "boolean", default: true, desc: "可选：是否启用聚合" },
          { key: "AggregationDistance", label: "聚合基准距离", type: "float", default: 1000, unit: "米", desc: "可选：用于计算四叉树层级的基准距离" },
          { key: "MinClusterSize", label: "最小簇大小", type: "integer", default: 4, desc: "可选：只有≥此值的网格才显示为聚合" },
          { key: "MaxTreeDepth", label: "四叉树最大深度", type: "integer", default: 6, desc: "可选：0-8，控制聚合层级数量" },
          { key: "HysteresisRatio", label: "滞后比率", type: "float", default: 1.2, desc: "可选：防止相机轻微移动导致频繁更新" },
          { key: "ClusterStyleJson", label: "聚合POI样式", type: "json", default: {}, desc: "可选：聚合POI样式对象" },
          { key: "ClusterActorClass", label: "聚合Actor类", type: "string", default: "", desc: "可选：聚合POI的Actor类路径，默认APoiClusterActor" },
          { key: "ClusterWidgetClass", label: "聚合Widget类", type: "string", default: "", desc: "可选：聚合POI的Widget类路径，默认使用原始POI的Widget类" },
          { key: "VisualizerType", label: "可视化类型", type: "select", default: "Actor",
            options: [
              { label: "Actor", value: "Actor" }
            ],
            desc: "可选：可视化类型，固定为Actor"
          }
        ]
      },
      {
        cmd: "/poiManager/DestroyPoi",
        name: "销毁POI",
        params: [
          { key: "IDs", label: "POI ID数组", type: "json", default: [], desc: "可选：POI标识符数组，与Group二选一" },
          { key: "Group", label: "分组", type: "string", default: "", desc: "可选：分组ID，与IDs二选一" }
        ]
      },
      {
        cmd: "/poiManager/BindPoiEvent",
        name: "绑定事件",
        params: [
          { key: "PoiID", label: "POI ID", type: "string", default: "poi_0", desc: "必填：POI标识符" },
          { key: "EventType", label: "事件类型", type: "select", default: "click",
            options: [
              { label: "点击", value: "click" },
              { label: "悬停", value: "hover" },
              { label: "离开", value: "unhover" }
            ],
            desc: "必填：事件类型"
          },
          { key: "CallbackFunction", label: "回调函数名", type: "string", default: "", desc: "可选：前端回调函数名称，与Actions二选一或同时使用" },
          { key: "Actions", label: "Action列表", type: "json", default: [], desc: "可选：Action绑定列表，与CallbackFunction二选一或同时使用" }
        ]
      },
      {
        cmd: "/poiManager/UnbindPoiEvent",
        name: "解绑事件",
        params: [
          { key: "PoiID", label: "POI ID", type: "string", default: "poi_0", desc: "必填：POI标识符" },
          { key: "EventType", label: "事件类型", type: "select", default: "click",
            options: [
              { label: "点击", value: "click" },
              { label: "悬停", value: "hover" },
              { label: "离开", value: "unhover" }
            ],
            desc: "必填：事件类型"
          },
          { key: "ActionName", label: "Action名称", type: "string", default: "", desc: "可选：要解绑的Action名称，为空则解绑该事件的所有绑定" }
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
            ],
            desc: "必填：路径类型"
          },
          { key: "points", label: "路径点", type: "json", default: [[0,0,0], [100,0,0]], desc: "必填：路径点数组[[x,y,z],...]，单位米" },
          { key: "commonStyle", label: "通用样式", type: "json", default: {}, desc: "可选：通用样式配置对象" },
          { key: "config", label: "类型配置", type: "json", default: {}, desc: "可选：类型专属配置对象" }
        ]
      },
      {
        cmd: "/markManager/BeginDrawPath",
        name: "开始绘制路径",
        params: [
          { key: "pathType", label: "路径类型", type: "string", default: "Default", desc: "必填：路径类型" },
          { key: "style", label: "路径样式", type: "json", default: {}, desc: "可选：路径样式配置" }
        ]
      },
      { cmd: "/markManager/FinishDrawPath", name: "完成绘制", params: [] },
      {
        cmd: "/markManager/UpdatePathStyle",
        name: "更新路径样式",
        params: [
          { key: "pathId", label: "路径ID", type: "string", default: "path_1", desc: "必填：路径ID" },
          { key: "style", label: "样式", type: "json", default: {}, desc: "必填：新的样式配置" }
        ]
      },
      {
        cmd: "/markManager/DeletePath",
        name: "删除路径",
        params: [
          { key: "pathId", label: "路径ID", type: "string", default: "path_1", desc: "必填：要删除的路径ID" }
        ]
      },
      { cmd: "/markManager/ClearAllPaths", name: "清除所有路径", params: [] },
      {
        cmd: "/markManager/StartTravel",
        name: "开始漫游",
        params: [
          { key: "pathId", label: "路径ID", type: "string", default: "path_1", desc: "必填：路径ID" },
          { key: "duration", label: "时长", type: "float", default: 10, unit: "秒", desc: "可选：漫游时长" },
          { key: "travelType", label: "漫游类型", type: "select", default: "Fly",
            options: [
              { label: "飞行", value: "Fly" },
              { label: "车辆", value: "Vehicle" },
              { label: "角色", value: "Character" }
            ],
            desc: "可选：漫游类型"
          },
          { key: "loop", label: "循环", type: "boolean", default: false, desc: "可选：是否循环漫游" }
        ]
      },
      { cmd: "/markManager/StopTravel", name: "停止漫游", params: [] },
      {
        cmd: "/markManager/PauseTravel",
        name: "暂停漫游",
        params: [
          { key: "paused", label: "暂停", type: "boolean", default: true, desc: "可选：true=暂停，false=恢复" }
        ]
      },
      {
        cmd: "/markManager/SetTravelProgress",
        name: "设置漫游进度",
        params: [
          { key: "progress", label: "进度", type: "float", default: 0.5, desc: "必填：漫游进度0.0-1.0" }
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
          { key: "DataPoints", label: "数据点", type: "json", default: [[0,0,0.8], [10,0,0.5]], desc: "必填：数据点数组[[x,y,value],...]" },
          { key: "InfluenceRadius", label: "影响半径", type: "float", default: 100, unit: "米", desc: "可选：影响半径" },
          { key: "FalloffType", label: "衰减类型", type: "select", default: 2,
            options: [
              { label: "线性", value: 0 },
              { label: "平方", value: 1 },
              { label: "高斯", value: 2 }
            ],
            desc: "可选：衰减类型"
          }
        ]
      },
      {
        cmd: "/heatmapManager/updateHeatmap",
        name: "更新热力图",
        params: [
          { key: "DataPoints", label: "数据点", type: "json", default: [[0,0,0.9]], desc: "必填：数据点数组" },
          { key: "InfluenceRadius", label: "影响半径", type: "float", default: 100, unit: "米", desc: "可选：影响半径" }
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
            ],
            desc: "必填：测量类型"
          },
          { key: "Points", label: "测量点", type: "json", default: [[0,0,0], [100,0,0]], desc: "必填：测量点数组[[x,y,z],...]，单位米" }
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
            ],
            desc: "必填：测量类型"
          }
        ]
      },
      {
        cmd: "/measurement/clearMeasurement",
        name: "清除测量",
        params: [
          { key: "MeasurementId", label: "测量ID", type: "integer", default: 1, desc: "可选：要清除的测量ID，不提供则清除所有" }
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
          { key: "pakFilePath", label: "Pak路径", type: "string", default: "D:/Assets/library.pak", desc: "必填：Pak文件的完整路径" },
          { key: "libraryName", label: "资源库名称", type: "string", default: "", desc: "可选：资源库名称（展示用途）" },
          { key: "assetType", label: "资源类型", type: "select", default: "All",
            options: [
              { label: "全部", value: "All" },
              { label: "静态网格", value: "StaticMesh" },
              { label: "材质", value: "Material" },
              { label: "纹理", value: "Texture" }
            ],
            desc: "可选：资源类型过滤"
          }
        ]
      },
      {
        cmd: "/assetLibrary/closeAssetLibraryUI",
        name: "关闭资源库UI",
        params: [
          { key: "libraryName", label: "库名称", type: "string", default: "", desc: "可选：指定关闭某个库名对应的界面，留空则关闭所有" },
          { key: "unloadPak", label: "卸载Pak", type: "boolean", default: false, desc: "可选：是否同时卸载Pak文件" }
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
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak", desc: "必填：Pak文件的完整路径" },
          { key: "MountPath", label: "挂载路径", type: "string", default: "../.../../", desc: "可选：Pak文件的挂载路径" }
        ]
      },
      {
        cmd: "/pakLoadManager/mountPakFile2",
        name: "挂载Pak(高级)",
        params: [
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak", desc: "必填：Pak文件的完整路径" },
          { key: "MountPath", label: "挂载路径", type: "string", default: "../.../../", desc: "可选：Pak文件的挂载路径" },
          { key: "RegisterName", label: "虚拟路径", type: "string", default: "/Game/", desc: "可选：虚拟路径前缀" }
        ]
      },
      {
        cmd: "/pakLoadManager/registerMountPoint",
        name: "注册挂载点",
        params: [
          { key: "RootPath", label: "虚拟根路径", type: "string", default: "/Game/", desc: "必填：虚拟根路径" },
          { key: "ContentPath", label: "物理路径", type: "string", default: "../../../Content/", desc: "必填：物理内容路径" }
        ]
      },
      {
        cmd: "/pakLoadManager/getFilesInPak",
        name: "获取Pak文件列表",
        params: [
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak", desc: "必填：Pak文件的完整路径" }
        ]
      },
      {
        cmd: "/pakLoadManager/unmountPakFile",
        name: "卸载Pak",
        params: [
          { key: "pakFileName", label: "Pak路径", type: "string", default: "D:/Assets/content.pak", desc: "必填：需要卸载的Pak文件路径" }
        ]
      },
      {
        cmd: "/pakLoadManager/registerEncryptionKey",
        name: "注册加密密钥",
        params: [
          { key: "AesKey", label: "AES密钥", type: "string", default: "", desc: "必填：AES加密密钥(Base64或Hex格式)" }
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
            default: [{"image_1": "https://th.bing.com/th/id/R.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0"}],
            desc: "必填：图片配置数组，每个对象为{注册名:URL}的键值对" }
        ]
      },
      {
        cmd: "/CacheManager/clearImageCache",
        name: "清理缓存",
        params: [
          { key: "all", label: "清空所有", type: "boolean", default: false, desc: "可选：是否清空所有缓存" },
          { key: "keys", label: "缓存键", type: "json", default: ["image_1"], desc: "可选：要清理的图片注册名数组（当all=false时使用）" }
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
            ],
            desc: "必填：设置类型名称"
          }
        ]
      },
      { cmd: "/settingsManager/getAllSettings", name: "获取所有设置", params: [] },
      {
        cmd: "/settingsManager/updateSettings",
        name: "更新设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings", desc: "必填：设置类型名称" },
          { key: "Settings", label: "设置内容", type: "json", default: {}, desc: "必填：要更新的设置JSON对象，支持部分更新" }
        ]
      },
      {
        cmd: "/settingsManager/updateSettingProperty",
        name: "更新单个属性",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings", desc: "必填：设置类型名称" },
          { key: "PropertyPath", label: "属性路径", type: "string", default: "SystemUnit", desc: "必填：属性路径，嵌套属性使用点号分隔" },
          { key: "PropertyValue", label: "属性值", type: "string", default: "Meters", desc: "必填：属性值（字符串格式）" }
        ]
      },
      {
        cmd: "/settingsManager/resetSettings",
        name: "重置设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings", desc: "必填：设置类型名称" }
        ]
      },
      {
        cmd: "/settingsManager/reloadSettings",
        name: "重新加载设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings", desc: "必填：设置类型名称" }
        ]
      },
      {
        cmd: "/settingsManager/saveSettings",
        name: "保存设置",
        params: [
          { key: "SettingType", label: "设置类型", type: "string", default: "SystemSettings", desc: "必填：设置类型名称" }
        ]
      },
      { cmd: "/settingsManager/saveAllSettings", name: "保存所有设置", params: [] },
      { cmd: "/settingsManager/getSystemSettings", name: "获取系统设置(快捷)", params: [] },
      {
        cmd: "/settingsManager/updateSystemSettings",
        name: "更新系统设置(快捷)",
        params: [
          { key: "Settings", label: "设置内容", type: "json", default: {"SystemUnit": "Meters"}, desc: "必填：要更新的系统设置JSON对象" }
        ]
      },
      { cmd: "/settingsManager/getHandlerSettings", name: "获取Handler设置(快捷)", params: [] },
      {
        cmd: "/settingsManager/updateHandlerSettings",
        name: "更新Handler设置(快捷)",
        params: [
          { key: "Settings", label: "设置内容", type: "json", default: {}, desc: "必填：要更新的Handler设置JSON对象，支持部分更新" }
        ]
      },
      { cmd: "/settingsManager/getWebCoreSettings", name: "获取WebCore设置(快捷)", params: [] },
      {
        cmd: "/settingsManager/updateWebCoreSettings",
        name: "更新WebCore设置(快捷)",
        params: [
          { key: "Settings", label: "设置内容", type: "json", default: {}, desc: "必填：要更新的WebCore设置JSON对象，支持部分更新" }
        ]
      },
      {
        cmd: "/settingsManager/initGeoReference",
        name: "初始化地理参考",
        params: [
          { key: "ProjectedCRS", label: "投影坐标系", type: "string", default: "EPSG:4547", desc: "可选：投影坐标系标识符" },
          { key: "GeographicCRS", label: "地理坐标系", type: "string", default: "EPSG:4490", desc: "可选：地理坐标系标识符" },
          { key: "OriginLatitude", label: "原点纬度", type: "float", default: 22.516226, desc: "可选：原点纬度，范围-90到90" },
          { key: "OriginLongitude", label: "原点经度", type: "float", default: 113.883095, desc: "可选：原点经度，范围-180到180" },
          { key: "OriginAltitude", label: "原点高度", type: "float", default: 0, unit: "米", desc: "可选：原点高度" },
          { key: "PlanetShape", label: "星球形状", type: "integer", default: 0, desc: "可选：0=平面地球，1=球形地球" },
          { key: "bOriginAtPlanetCenter", label: "原点在星球中心", type: "boolean", default: false, desc: "可选：原点是否在星球中心" },
          { key: "bOriginLocationInProjectedCRS", label: "使用投影坐标", type: "boolean", default: false, desc: "可选：原点是否使用投影坐标" }
        ]
      }
    ]
  }
};
