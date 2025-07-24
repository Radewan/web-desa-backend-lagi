#!/bin/bash

# List semua folder service
SERVICES=(
  "administrasi-service"
  "agenda-service"
  "api-gateway"
  "comment-service"
  "galeri-service"
  "infografis-service"
  "message-service"
  "news-service"
  "organization-service"
  "pkk-service"
  "product-service"
  "user-service"
)

echo "🚀 Menjalankan semua service dari /dist/index.js dengan PM2..."

for dir in "${SERVICES[@]}"; do
  SCRIPT_PATH="$dir/dist/index.js"
  
  if [[ -f "$SCRIPT_PATH" ]]; then
    echo "▶️  Menjalankan $dir ..."
    pm2 start "$SCRIPT_PATH" --name "$dir"
  else
    echo "⚠️  File tidak ditemukan: $SCRIPT_PATH"
  fi
done

# Simpan konfigurasi PM2
echo "💾 Menyimpan konfigurasi PM2..."
pm2 save

# Setup agar PM2 auto-start saat reboot
echo "🔁 Setup PM2 startup..."
pm2 startup systemd -u $USER --hp $HOME

echo "✅ Semua service sudah dijalankan!"
