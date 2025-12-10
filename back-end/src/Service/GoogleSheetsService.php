<?php

namespace App\Service;

class GoogleSheetsService
{
    private $client;
    private $sheetsService;

    public function __construct(string $projectDir)
    {
        $this->client = new \Google_Client();
        $this->client->setApplicationName('M8Pulse');
        $this->client->setScopes([\Google_Service_Sheets::SPREADSHEETS_READONLY]);
        
        $credentialsPath = $projectDir . '/config/google-credentials.json';
        $this->client->setAuthConfig($credentialsPath);
        
        $this->sheetsService = new \Google_Service_Sheets($this->client);
    }

    /**
     * Récupère les données d'une feuille Google Sheets
     * 
     * @param string $spreadsheetId L'ID du Google Sheet
     * @param string $range La plage à lire (ex: 'Sheet1!A1:Z100' ou 'PlayerRoster!A:M')
     * @return array Les données de la feuille
     */
    public function getSheetData(string $spreadsheetId, string $range): array
    {
        $response = $this->sheetsService->spreadsheets_values->get($spreadsheetId, $range);
        $values = $response->getValues();

        if (empty($values)) {
            return [];
        }

        return $values;
    }

    /**
     * Convertit les données brutes du sheet en tableau associatif
     * La première ligne est considérée comme les en-têtes
     * 
     * @param array $sheetData Les données brutes du sheet
     * @return array Tableau d'objets avec les en-têtes comme clés
     */
    public function convertToAssociativeArray(array $sheetData): array
    {
        if (empty($sheetData)) {
            return [];
        }

        $headers = array_shift($sheetData); // Première ligne = en-têtes
        $result = [];

        foreach ($sheetData as $row) {
            $rowData = [];
            foreach ($headers as $index => $header) {
                $rowData[$header] = $row[$index] ?? null;
            }
            $result[] = $rowData;
        }

        return $result;
    }

    /**
     * Récupère les données des joueurs COD depuis le PlayerRoster
     * Colonnes: ID, Name, Role Specific, Nationality, Join Date, Status, Games Played, Wins, Losses, Overall KD, HP KD, S&D KD, OL KD
     */
    public function getCodPlayerRoster(string $spreadsheetId, string $sheetName = 'PlayerRoster'): array
    {
        $range = $sheetName . '!A:M';
        $sheetData = $this->getSheetData($spreadsheetId, $range);
        $players = $this->convertToAssociativeArray($sheetData);

        $formattedPlayers = [];
        foreach ($players as $player) {
            $id = $player['ID'] ?? '';
            $name = $player['Name'] ?? '';
            
            if (empty($id) || empty($name)) {
                continue;
            }

            $formattedPlayers[] = [
                'id' => $id,
                'name' => $name,
                'roleSpecific' => $player['Role Specific'] ?? null,
                'nationality' => $player['Nationality'] ?? null,
                'joinDate' => $player['Join Date'] ?? null,
                'status' => $player['Status'] ?? null,
                'gamesPlayed' => isset($player['Games Played']) && $player['Games Played'] !== '' ? (int)$player['Games Played'] : 0,
                'wins' => isset($player['Wins']) && $player['Wins'] !== '' ? (int)$player['Wins'] : 0,
                'losses' => isset($player['Losses']) && $player['Losses'] !== '' ? (int)$player['Losses'] : 0,
                'overallKD' => isset($player['Overall KD']) && $player['Overall KD'] !== '' ? (float)str_replace(',', '.', $player['Overall KD']) : null,
                'hpKD' => isset($player['HP KD']) && $player['HP KD'] !== '' ? (float)str_replace(',', '.', $player['HP KD']) : null,
                'sndKD' => isset($player['S&D KD']) && $player['S&D KD'] !== '' ? (float)str_replace(',', '.', $player['S&D KD']) : null,
                'olKD' => isset($player['OL KD']) && $player['OL KD'] !== '' ? (float)str_replace(',', '.', $player['OL KD']) : null,
            ];
        }

        return $formattedPlayers;
    }

    /**
     * Récupère les données des joueurs Valorant depuis le PlayerRoster
     * Colonnes: ID, Name, Role Specific, Nationality, Join Date, Status, Games Played, Wins, Losses, KDA, ACS, Rating
     */
    public function getValoPlayerRoster(string $spreadsheetId, string $sheetName = 'PlayerRoster'): array
    {
        $range = $sheetName . '!A:L';
        $sheetData = $this->getSheetData($spreadsheetId, $range);
        $players = $this->convertToAssociativeArray($sheetData);

        $formattedPlayers = [];
        foreach ($players as $player) {
            $id = $player['ID'] ?? '';
            $name = $player['Name'] ?? '';
            
            if (empty($id) || empty($name)) {
                continue;
            }

            $formattedPlayers[] = [
                'id' => $id,
                'name' => $name,
                'roleSpecific' => $player['Role Specific'] ?? null,
                'nationality' => $player['Nationality'] ?? null,
                'joinDate' => $player['Join Date'] ?? null,
                'status' => $player['Status'] ?? null,
                'gamesPlayed' => isset($player['Games Played']) && $player['Games Played'] !== '' ? (int)$player['Games Played'] : 0,
                'wins' => isset($player['Wins']) && $player['Wins'] !== '' ? (int)$player['Wins'] : 0,
                'losses' => isset($player['Losses']) && $player['Losses'] !== '' ? (int)$player['Losses'] : 0,
                'kda' => isset($player['KDA']) && $player['KDA'] !== '' ? (float)str_replace(',', '.', $player['KDA']) : null,
                'acs' => isset($player['ACS']) && $player['ACS'] !== '' ? (float)str_replace(',', '.', $player['ACS']) : null,
                'rating' => isset($player['Rating']) && $player['Rating'] !== '' ? (float)str_replace(',', '.', $player['Rating']) : null,
            ];
        }

        return $formattedPlayers;
    }

    /**
     * Récupère les données des joueurs CS2 depuis le PlayerRoster
     * Colonnes: ID, Name, Role Specific, Nationality, Join Date, Status, Games Played, Wins, Losses, Rating, T Rating, CT Rating
     */
    public function getCs2PlayerRoster(string $spreadsheetId, string $sheetName = 'PlayerRoster'): array
    {
        $range = $sheetName . '!A:L';
        $sheetData = $this->getSheetData($spreadsheetId, $range);
        $players = $this->convertToAssociativeArray($sheetData);

        $formattedPlayers = [];
        foreach ($players as $player) {
            $id = $player['ID'] ?? '';
            $name = $player['Name'] ?? '';
            
            if (empty($id) || empty($name)) {
                continue;
            }

            $formattedPlayers[] = [
                'id' => $id,
                'name' => $name,
                'roleSpecific' => $player['Role Specific'] ?? null,
                'nationality' => $player['Nationality'] ?? null,
                'joinDate' => $player['Join Date'] ?? null,
                'status' => $player['Status'] ?? null,
                'gamesPlayed' => isset($player['Games Played']) && $player['Games Played'] !== '' ? (int)$player['Games Played'] : 0,
                'wins' => isset($player['Wins']) && $player['Wins'] !== '' ? (int)$player['Wins'] : 0,
                'losses' => isset($player['Losses']) && $player['Losses'] !== '' ? (int)$player['Losses'] : 0,
                'rating' => isset($player['Rating']) && $player['Rating'] !== '' ? (float)str_replace(',', '.', $player['Rating']) : null,
                'tRating' => isset($player['T Rating']) && $player['T Rating'] !== '' ? (float)str_replace(',', '.', $player['T Rating']) : null,
                'ctRating' => isset($player['CT Rating']) && $player['CT Rating'] !== '' ? (float)str_replace(',', '.', $player['CT Rating']) : null,
            ];
        }

        return $formattedPlayers;
    }

    /**
     * Importe un dataset générique depuis Google Sheets
     * Retourne les données brutes avec détection automatique des colonnes
     * 
     * @param string $spreadsheetId L'ID du Google Sheet
     * @param string $sheetName Le nom de la feuille (tab) à lire
     * @param string|null $range La plage optionnelle (par défaut lit toutes les colonnes)
     * @return array ['headers' => [...], 'data' => [...], 'variables' => [...]]
     */
    public function importGenericDataset(string $spreadsheetId, string $sheetName = 'Sheet1', ?string $range = null): array
    {
        // Si aucune plage n'est spécifiée, lire toutes les colonnes
        $fullRange = $range ?? ($sheetName . '!A:ZZ');
        $sheetData = $this->getSheetData($spreadsheetId, $fullRange);
        
        if (empty($sheetData)) {
            return [
                'headers' => [],
                'data' => [],
                'variables' => []
            ];
        }
        
        // Première ligne = headers
        $headers = array_shift($sheetData);
        
        // Initialiser les variables avec détection automatique
        $variables = [];
        foreach ($headers as $header) {
            $variables[$header] = [
                'name' => $header,
                'type' => 'numérique', // Par défaut
                'distinctValues' => []
            ];
        }
        
        // Lire les données et détecter les types
        $data = [];
        $maxRowsForDetection = min(1000, count($sheetData)); // Limiter l'analyse à 1000 lignes
        
        for ($i = 0; $i < count($sheetData); $i++) {
            $row = $sheetData[$i];
            $rowData = [];
            
            foreach ($row as $colIndex => $value) {
                if (!isset($headers[$colIndex])) {
                    continue;
                }
                
                $header = $headers[$colIndex];
                $rowData[$header] = $value;
                
                // Détection de type (seulement sur les premières lignes)
                if ($i < $maxRowsForDetection) {
                    // Si une valeur n'est pas numérique (et non vide), c'est catégoriel
                    if ($value !== '' && $value !== null && !is_numeric($value)) {
                        $variables[$header]['type'] = 'catégorielle';
                    }
                    
                    // Pour les variables catégorielles, stocker les valeurs distinctes (max 100)
                    if ($variables[$header]['type'] === 'catégorielle' && 
                        count($variables[$header]['distinctValues']) < 100 &&
                        !in_array($value, $variables[$header]['distinctValues'])) {
                        $variables[$header]['distinctValues'][] = $value;
                    }
                }
            }
            
            $data[] = $rowData;
        }
        
        // Nettoyer les variables (enlever distinctValues pour alléger la réponse)
        $cleanVariables = [];
        foreach ($variables as $var) {
            $cleanVariables[] = [
                'name' => $var['name'],
                'type' => $var['type']
            ];
        }
        
        return [
            'headers' => $headers,
            'data' => $data,
            'variables' => $cleanVariables,
            'rowCount' => count($data)
        ];
    }

    /**
     * Récupère l'historique des matchs depuis une feuille Google Sheets
     * Format: Date, Opponent, Tournament, BO, Score M8, Score Opp, Map 1, Map 2, Score M1, Score M2, Map 3, Score M3, MVP M8
     */
    public function getMatchHistory(string $spreadsheetId, string $sheetName = 'MatchesResults'): array
    {
        $range = $sheetName . '!A:Z';
        $sheetData = $this->getSheetData($spreadsheetId, $range);
        $matches = $this->convertToAssociativeArray($sheetData);

        $formattedMatches = [];
        foreach ($matches as $match) {
            // Vérifier qu'on a au moins une date et un adversaire
            if (empty($match['Date'] ?? '') && empty($match['Opponent'] ?? '')) {
                continue;
            }

            $scoreM8 = isset($match['Score M8']) && $match['Score M8'] !== '' ? (int)$match['Score M8'] : 0;
            $scoreOpp = isset($match['Score Opp']) && $match['Score Opp'] !== '' ? (int)$match['Score Opp'] : 0;
            
            $formattedMatches[] = [
                'date' => $match['Date'] ?? '',
                'opponent' => $match['Opponent'] ?? '',
                'tournament' => $match['Tournament'] ?? '',
                'bo' => $match['BO'] ?? '',
                'scoreM8' => $scoreM8,
                'scoreOpp' => $scoreOpp,
                'score' => $scoreM8 . '-' . $scoreOpp,
                'win' => $scoreM8 > $scoreOpp,
                'team' => 'Gentle Mates',
                'maps' => [
                    [
                        'name' => $match['Map 1'] ?? null,
                        'score' => $match['Score M1'] ?? null
                    ],
                    [
                        'name' => $match['Map 2'] ?? null,
                        'score' => $match['Score M2'] ?? null
                    ],
                    [
                        'name' => $match['Map 3'] ?? null,
                        'score' => $match['Score M3'] ?? null
                    ]
                ],
                'mvp' => $match['MVP M8'] ?? null
            ];
        }

        return $formattedMatches;
    }

    /**
     * Récupère les infos d'un spreadsheet (métadonnées)
     */
    public function getSheetInfo(string $spreadsheetId): array
    {
        $spreadsheet = $this->sheetsService->spreadsheets->get($spreadsheetId);
        
        $sheets = [];
        foreach ($spreadsheet->getSheets() as $sheet) {
            $properties = $sheet->getProperties();
            $sheets[] = [
                'title' => $properties->getTitle(),
                'sheetId' => $properties->getSheetId(),
                'rowCount' => $properties->getGridProperties()->getRowCount(),
                'columnCount' => $properties->getGridProperties()->getColumnCount()
            ];
        }
        
        return [
            'title' => $spreadsheet->getProperties()->getTitle(),
            'sheets' => $sheets
        ];
    }

    /**
     * Extrait l'ID d'un Google Sheet depuis une URL
     */
    public function extractSpreadsheetId(string $url): string
    {
        if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Si c'est déjà un ID, le retourner tel quel
        return $url;
    }

    /**
     * Récupère toutes les données de toutes les feuilles
     */
    public function getAllSheets(string $spreadsheetId): array
    {
        $info = $this->getSheetInfo($spreadsheetId);
        $allData = [];
        
        foreach ($info['sheets'] as $sheet) {
            $range = $sheet['title'] . '!A:ZZ';
            $data = $this->getSheetData($spreadsheetId, $range);
            $allData[$sheet['title']] = $this->convertToAssociativeArray($data);
        }
        
        return $allData;
    }
}

