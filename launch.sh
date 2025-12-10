#!/bin/bash

echo "🔍 Vérification de Docker..."

# Vérifier si Docker Desktop est lancé
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas lancé !"
    echo ""
    echo "📝 Instructions pour démarrer :"
    echo "   1. Ouvrez l'application 'Docker' depuis votre dossier Applications"
    echo "   2. Attendez que Docker soit complètement démarré (icône stable dans la barre de menu)"
    echo "   3. Relancez ce script"
    echo ""
    
    # Essayer de lancer Docker automatiquement
    echo "🚀 Tentative de lancement de Docker Desktop..."
    open -a Docker
    
    echo "⏳ Attente du démarrage de Docker (cela peut prendre 30-60 secondes)..."
    
    # Attendre que Docker soit prêt
    counter=0
    max_wait=60
    while ! docker info > /dev/null 2>&1; do
        if [ $counter -eq $max_wait ]; then
            echo "❌ Timeout : Docker n'a pas démarré après ${max_wait} secondes"
            echo "   Veuillez lancer Docker manuellement et réessayer"
            exit 1
        fi
        sleep 1
        counter=$((counter + 1))
        if [ $((counter % 5)) -eq 0 ]; then
            echo "   ... encore $((max_wait - counter)) secondes maximum"
        fi
    done
    
    echo "✅ Docker est maintenant prêt !"
    echo ""
fi

# Docker est prêt, lancer le script principal
echo "✅ Docker est actif !"
echo ""
./start.sh
