#!/bin/bash

# S'assurer que Docker est dans le PATH
export PATH="/usr/local/bin:$PATH"

echo "🛑 Arrêt de M8Pulse..."
docker compose down

echo "✅ Services arrêtés !"
