#!/usr/bin/env bash
set -e

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROFILE_DIR="${HOME}/.dsh/profiles/web"
PATCH_FILE="${PROFILE_DIR}/cordis.patch.yml"

echo "==> 正在为 dsh Web GUI 安装 dsh-model-search 插件..."

if [ ! -d "$PROFILE_DIR" ]; then
  echo "错误: 未找到 dsh web profile 目录 ($PROFILE_DIR)。请先运行一次 'dsh web' 进行初始化。"
  exit 1
fi

# 1. 链接本地插件到 web profile
echo "==> [1/3] 链接本地插件依赖..."
pnpm --dir "$PROFILE_DIR" add "link:${PLUGIN_DIR}" --silent

# 2. 检查并写入 cordis.patch.yml
echo "==> [2/3] 配置 cordis.patch.yml..."
touch "$PATCH_FILE"
if grep -q "name: dsh-model-search" "$PATCH_FILE"; then
  echo "    已存在 dsh-model-search 配置，跳过写入。"
else
  cat << 'EOF' >> "$PATCH_FILE"

- id: model-search
  name: dsh-model-search
EOF
  echo "    已成功追加 model-search 配置行。"
fi

# 3. 提示重启
echo "==> [3/3] 安装配置完成！"
echo ""
echo "请执行以下命令重启 dsh web 服务以生效："
echo "  pkill -f \"dsh/lib/bin.js web\" && dsh web --no-open"
echo ""
