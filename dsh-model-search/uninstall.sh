#!/usr/bin/env bash
set -e

PROFILE_DIR="${HOME}/.dsh/profiles/web"
PATCH_FILE="${PROFILE_DIR}/cordis.patch.yml"

echo "==> 正在从 dsh Web GUI 卸载 dsh-model-search 插件..."

if [ ! -d "$PROFILE_DIR" ]; then
  echo "错误: 未找到 dsh web profile 目录 ($PROFILE_DIR)。"
  exit 1
fi

# 1. 从 cordis.patch.yml 中移除配置
if [ -f "$PATCH_FILE" ]; then
  echo "==> [1/2] 清理 cordis.patch.yml 配置..."
  cp "$PATCH_FILE" "${PATCH_FILE}.bak"
  awk '
    /- id: model-search/ { skip=1; next }
    skip && /name: dsh-model-search/ { skip=0; next }
    skip { print "- id: model-search"; skip=0 }
    { print }
  ' "${PATCH_FILE}.bak" > "$PATCH_FILE"
  rm -f "${PATCH_FILE}.bak"
  echo "    已从 cordis.patch.yml 移除配置。"
fi

# 2. 移除包依赖
echo "==> [2/2] 移除依赖包..."
pnpm --dir "$PROFILE_DIR" remove dsh-model-search --silent 2>/dev/null || true

echo "==> 卸载完成！请重启 dsh web 服务以恢复官方默认组件："
echo "  pkill -f \"dsh/lib/bin.js web\" && dsh web --no-open"
echo ""
