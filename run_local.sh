#!/bin/bash

# IKH Explorer - Local Run Script
# This script starts a local web server to view the website.

PORT=8000

echo "------------------------------------------------"
echo "IKH Explorer Yerel Sunucu Başlatılıyor..."
echo "Adres: http://localhost:$PORT"
echo "Durdurmak için: Ctrl+C"
echo "------------------------------------------------"

# Check if python3 is installed
if command -v python3 &>/dev/null; then
    python3 -m http.server $PORT
elif command -v python &>/dev/null; then
    python -m SimpleHTTPServer $PORT
else
    echo "Hata: Python yüklü değil. Lütfen Python yükleyin veya index.html dosyasını doğrudan tarayıcıda açın."
    exit 1
fi
