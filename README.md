# dsh-plugins

面向 [dsh](https://github.com/deepseek-ai)（DeepSeek Shell / Web GUI）的实用功能插件集合与生态扩展。

---

## 插件列表

| 插件名称 | 适用平台 | 说明 | 文档 |
| :--- | :--- | :--- | :--- |
| [**dsh-model-search**](./dsh-model-search) | Web | 为 Web GUI 输入框旁的模型座位增加即时搜索与过滤能力，支持按模型名称、ID、提供商分词匹配与键盘导航切换。 | [查看详情](./dsh-model-search/README.md) |

*(更多插件持续开发与收录中…)*

---

## 插件安装通用流程

`dsh` 基于 Cordis 微内核架构构建，插件主要通过 profile 进行管理与组合。以 Web 端插件为例：

### 极速一键安装（推荐）

本仓库内插件通常自带 `install.sh` 脚本，可直接进入对应子目录执行自动配置：

```bash
cd <plugin-name>
./install.sh
```

---

### 手动安装流程

#### 1. 安装插件依赖

**推荐方式：源码软链（本地开发/克隆使用）**

```bash
cd ~/.dsh/profiles/web
pnpm add link:/path/to/dsh-plugins/<plugin-name>
```

**可选方式：打包为 tgz 离线安装**

如需分发给其他环境，可在对应插件目录下使用 `npm pack` 打包：

```bash
cd /path/to/dsh-plugins/<plugin-name>
npm pack  # 将在当前目录生成 <plugin-name>-<version>.tgz

# 随后通过 dsh 安装生成的 tarball：
dsh plugin --profile web add ./<plugin-name>-<version>.tgz
```

> **说明**：纯客户端 UI 插件若无 `dsh.bundle` 会有标准安装提示，直接通过后续的配置文件进入 profile 组合即可。

#### 2. 配置 profile 组合

编辑 `~/.dsh/profiles/web/cordis.patch.yml`，在插件列表追加对应的声明行：

```yaml
- id: <plugin-id>
  name: <plugin-package-name>
```

以 `dsh-model-search` 为例：

```yaml
- id: model-search
  name: dsh-model-search
```

#### 3. 重启生效

因为 profile patch 层在进程启动时解析装配，完成修改后需重启 `dsh web`：

```bash
pkill -f "dsh/lib/bin.js web"
dsh web --no-open
```

---

## 插件架构与开发规范

本仓库收录的插件遵循 `dsh` 插件系统规范：

### 1. 结构规范
- **Host 半** (`lib/index.js`)：Node.js 侧实现。纯 UI 插件导出空 `apply` 函数，用于在 Host 组合中注册该行以触发 Client 模块图挂载。
- **Client 半** (`lib/client.js`)：浏览器侧 UI 实现，通过 `package.json` 中的 `dsh.client` 与 `exports["./client"]` 暴露。

### 2. package.json 声明示例
```json
{
  "name": "dsh-plugin-example",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale"
      ]
    }
  }
}
```

### 3. UI 插槽与抢占（SlotCore）
- `dsh` Web 界面广泛使用 `@deepseek-ai/dsh-client-ui-slots`。
- 对于 `single` 类型座位（如 `conversation.input.model`），SlotCore 按 `priority` 升序排列并优先渲染前排组件。自定义插件可通过配置较低的 `priority`（如 `-1000`）实现无侵入式视图接管。

---

## 项目结构

```text
dsh-plugins/
├── README.md               # 仓库总览与使用说明
└── dsh-model-search/       # Web GUI 模型搜索框插件
    ├── package.json
    ├── README.md
    ├── install.sh          # 一键安装脚本
    ├── uninstall.sh        # 一键卸载脚本
    └── lib/
        ├── index.js        # Host 侧空占位 / 注册入口
        └── client.js       # Client 侧带搜索界面的 Model 座位实现
```

---

## 许可证

本项目采用 [MIT License](LICENSE)（或按子项目各自声明）。
