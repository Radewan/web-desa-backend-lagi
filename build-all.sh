#!/bin/bash

# List semua nama service
services=(
  administrasi-service
  agenda-service
  comment-service
  galeri-service
  infografis-service
  message-service
  news-service
  organization-service
  pkk-service
  product-service
  user-service
)

# Jalankan build di setiap folder
for service in "${services[@]}"; do
  echo "🔧 Building $service..."
  if [ -d "$service" ]; then
    cd "$service"
    
    # Jalankan npm install (kalau perlu)
    npm install

    # untuk database
    npx prisma migrate deploy

    # Jalankan npm run build
    npm run build

    cd ..
    echo "✅ $service selesai dibuild"
  else
    echo "❌ Folder $service tidak ditemukan!"
  fi
done

echo "🎉 Semua service selesai dibuild!"
