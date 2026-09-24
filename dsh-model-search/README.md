# dsh-model-search

🔍 为 [dsh](https://github.com/deepseek-ai) Web GUI 输入框旁的模型选择座位增加**即时搜索**与**键盘快捷导航**功能。

打开模型菜单即可输入关键词，按模型名、模型 ID 或 Provider 供应商快速过滤并直接切换。

---

## ✨ 特性亮点

- ⚡️ **即时模糊过滤**：输入即时过滤，大小写不敏感，支持按名称、ID 以及所属 Provider 进行匹配。
- 🔍 **空格分词多关键词**：支持多词空格拆分，各关键词独立匹配，精确定位目标模型。
- ⌨️ **全键盘交互支持**：支持 `↑` / `↓` 方向键浏览结果，`Enter` 一键选中，`Esc` 双阶清空与回退。
- 🧩 **轻量无额外依赖**：仅消费 Web 端运行时 seed 模块（`react`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-client-ui-slots` 等），零打包包袱。
- 🛡️ **优雅无侵入接管**：通过插槽优先级抢占，不侵入修改任何 dsh 核心源码；官方模型目录服务与推理等级面板完全保留，dsh 官方更新不影响本插件。

---

## 📋 环境要求

- **dsh**：≥ `0.1.5-rc.3`（需支持 web profile 的 client 插件机制与 `/plugins` 路由）
- **平台**：仅 Web 模式（`dsh web`）

---

## 🚀 快速安装

> **注意**：请确保已至少启动过一次 `dsh web`（以生成 `~/.dsh/profiles/web` 运行环境）。

### 方式一：一键自动安装（推荐）

进入本插件目录，直接运行自带的安装脚本：

```bash
cd dsh-model-search
./install.sh
```

*(或者通过 npm/pnpm 触发：`pnpm run install:dsh`)*

脚本会自动完成：
1. 本地目录软链（`link`）安装到 `~/.dsh/profiles/web`；
2. 自动检测并在 `~/.dsh/profiles/web/cordis.patch.yml` 中追加 `model-search` 配置行；
3. 输出后续重启指引。

---

### 方式二：终端一行单行命令（One-Liner）

在 `dsh-model-search` 所在目录直接粘贴执行：

```bash
pnpm --dir ~/.dsh/profiles/web add link:"$(pwd)" && \
(grep -q "name: dsh-model-search" ~/.dsh/profiles/web/cordis.patch.yml 2>/dev/null || printf "\n- id: model-search\n  name: dsh-model-search\n" >> ~/.dsh/profiles/web/cordis.patch.yml) && \
pkill -f "dsh/lib/bin.js web" && dsh web --no-open
```

---

### 方式三：手动分步安装

适合需要精确把控配置或使用分发 tarball 的场景：

#### 1. 安装包本体

```bash
# 选项 A：tarball 离线包安装
dsh plugin --profile web add /path/to/dsh-model-search-1.0.0.tgz

# 选项 B：本地目录软链（推荐开发修改时使用，支持热重载）
cd ~/.dsh/profiles/web
pnpm add link:/path/to/dsh-model-search
```

> **说明**：执行 `add` 时若提示 `declares no dsh.bundle — installed as a plain dependency, not a profile layer` 属于完全正常的预期提示，本插件通过下一步的 patch 配置层挂载组合。

#### 2. 配置 profile 组合

编辑 `~/.dsh/profiles/web/cordis.patch.yml`，在末尾追加配置：

```yaml
- id: model-search
  name: dsh-model-search
```

#### 3. 重启生效

因为 profile patch 层在服务进程启动时装配，修改后重启 `dsh web` 即可：

```bash
pkill -f "dsh/lib/bin.js web"
dsh web --no-open
```

> *dsh 会话状态是持久化的，重启后浏览器重新连接即可无缝继续原会话。*

---

## ⌨️ 快捷键与操作

| 按键 / 操作 | 功能描述 |
| :--- | :--- |
| **键入文字** | 即时过滤模型列表（忽略大小写，空格分词取并交集） |
| **`↑` / `↓`** | 在过滤出的结果项列表中向上/向下切换选中高亮 |
| **`Enter`** | 切换并选择当前高亮项（若未按方向键，默认直接选中第 1 个匹配项） |
| **`Esc`** | **第 1 次按**：清空搜索框关键字<br>**第 2 次按**：退出搜索下拉框并返回上级菜单 |

---

## 🔍 验证与排错 (Troubleshooting)

### 验证方法
1. 在浏览器中打开 dsh Web 界面；
2. 点击输入框右侧的模型按钮 → 点击「模型」；
3. 如果列表上方出现 **「搜索模型或提供方…」** 输入框，即表示插件已成功接管并生效。

### 常见排查步骤
若重启后依然展示官方默认的原生面板，请依次检查：
1. **进程是否真正重启**：确认老进程已退出，新启动的进程加载了最新配置。
2. **Patch 配置格式**：检查 `~/.dsh/profiles/web/cordis.patch.yml` 中的缩进是否合规，`name` 必须精准等于 `dsh-model-search`。
3. **依赖是否存在**：检查 `~/.dsh/profiles/web/node_modules/dsh-model-search` 软链或目录是否存在。

---

## 🗑️ 卸载

### 方式一：一键卸载

```bash
cd dsh-model-search
./uninstall.sh
```

### 方式二：手动卸载
1. 打开 `~/.dsh/profiles/web/cordis.patch.yml`，删除 `model-search` 相关两行配置；
2. 执行移除依赖：
   ```bash
   dsh plugin --profile web remove dsh-model-search
   ```
3. 重启 `dsh web` 即可恢复官方默认座位。

---

## 🛠️ 原理解析

- **双端分工结构**：
  - **Host 侧**（`lib/index.js`）：提供空实现入口，仅用于在 Cordis 的组合依赖树中挂载此节点；
  - **Client 侧**（`lib/client.js`）：通过 `package.json` 中的 `dsh.client` 与 `exports["./client"]` 导出并在浏览器端被自动发现与装配。
- **SlotCore 优先级接管**：
  - `conversation.input.model` 是 `single` 单选型插槽；
  - SlotCore 按 `priority` 升序排序，只渲染排在最前面的组件；
  - 官方组件默认优先级为 `0`，本插件设置为 `-1000`，因而官方组件会被自动跳过渲染，无缝替换为带搜索的界面。
- **无缝复用原生服务**：
  - 官方底层插件仍在后台组合中，`ctx.modelDirectories` 状态服务与 `/model` 弹窗逻辑完全由其继续提供；
  - 本插件仅消费官方公开的上下文接口（`available` / `directory` / `load` / `select` 等），保证原生体验的一致性与稳定性。
