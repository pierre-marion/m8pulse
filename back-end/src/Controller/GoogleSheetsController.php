<?php

namespace App\Controller;

use App\Service\GoogleSheetsService;
use App\Entity\Dataset;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

#[Route('/api/google-sheets', name: 'api_google_sheets_')]
#[OA\Tag(name: 'Google Sheets')]
class GoogleSheetsController extends AbstractController
{
    public function __construct(
        private GoogleSheetsService $googleSheetsService,
        private EntityManagerInterface $entityManager
    ) {}
    
    /**
     * Récupère directement les stats des joueurs depuis Google Sheets (pas d'auth requise)
     */
    #[Route('/players/{game}', name: 'get_players', methods: ['GET'])]
    #[OA\Get(
        description: "Récupère les statistiques des joueurs depuis Google Sheets configuré",
        parameters: [
            new OA\Parameter(
                name: 'game',
                in: 'path',
                description: 'Type de jeu (valorant, cod, cs2)',
                required: true,
                schema: new OA\Schema(type: 'string', enum: ['valorant', 'cod', 'cs2'])
            ),
            new OA\Parameter(
                name: 'spreadsheetId',
                in: 'query',
                description: 'ID du Google Sheet (optionnel, utilise celui configuré par défaut)',
                required: false,
                schema: new OA\Schema(type: 'string')
            )
        ]
    )]
    public function getPlayers(Request $request, string $game): JsonResponse
    {
        try {
            // Récupérer l'ID du spreadsheet depuis la query ou utiliser celui par défaut depuis .env
            $spreadsheetId = $request->query->get('spreadsheetId');
            
            // Si pas d'ID fourni, utiliser celui configuré dans .env
            if (!$spreadsheetId) {
                $envKey = 'GOOGLE_SHEET_' . strtoupper($game) . '_ID';
                $spreadsheetId = $_ENV[$envKey] ?? null;
                
                if (!$spreadsheetId) {
                    return $this->json([
                        'error' => 'Google Sheet non configuré',
                        'message' => "Ajoutez {$envKey} dans votre fichier .env ou passez ?spreadsheetId=VOTRE_ID dans l'URL",
                        'help' => 'Exemple: /api/google-sheets/players/valorant?spreadsheetId=1ABC123...'
                    ], Response::HTTP_BAD_REQUEST);
                }
            }
            
            // Récupérer les données selon le type de jeu
            $players = [];
            switch (strtolower($game)) {
                case 'valorant':
                case 'valo':
                    $players = $this->googleSheetsService->getValoPlayerRoster($spreadsheetId);
                    break;
                case 'cod':
                case 'warzone':
                    $players = $this->googleSheetsService->getCodPlayerRoster($spreadsheetId);
                    break;
                case 'cs2':
                case 'csgo':
                    $players = $this->googleSheetsService->getCs2PlayerRoster($spreadsheetId);
                    break;
                default:
                    return $this->json([
                        'error' => 'Type de jeu invalide',
                        'message' => 'Utilisez: valorant, cod, ou cs2'
                    ], Response::HTTP_BAD_REQUEST);
            }
            
            return $this->json([
                'success' => true,
                'game' => $game,
                'count' => count($players),
                'players' => $players,
                'spreadsheetId' => $spreadsheetId
            ]);
            
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Impossible de récupérer les données',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    
    /**
     * Récupère l'historique des matchs depuis Google Sheets (pas d'auth requise)
     */
    #[Route('/matches/{game}', name: 'get_matches', methods: ['GET'])]
    #[OA\Get(
        description: "Récupère l'historique des matchs depuis Google Sheets",
        parameters: [
            new OA\Parameter(
                name: 'game',
                in: 'path',
                description: 'Type de jeu (valorant, cod, cs2)',
                required: true,
                schema: new OA\Schema(type: 'string', enum: ['valorant', 'cod', 'cs2'])
            ),
            new OA\Parameter(
                name: 'spreadsheetId',
                in: 'query',
                description: 'ID du Google Sheet',
                required: false,
                schema: new OA\Schema(type: 'string')
            ),
            new OA\Parameter(
                name: 'sheetName',
                in: 'query',
                description: 'Nom de la feuille (défaut: MatchesResults)',
                required: false,
                schema: new OA\Schema(type: 'string')
            )
        ]
    )]
    public function getMatches(Request $request, string $game): JsonResponse
    {
        try {
            // Récupérer l'ID du spreadsheet
            $spreadsheetId = $request->query->get('spreadsheetId');
            
            if (!$spreadsheetId) {
                $envKey = 'GOOGLE_SHEET_' . strtoupper($game) . '_ID';
                $spreadsheetId = $_ENV[$envKey] ?? null;
                
                if (!$spreadsheetId) {
                    return $this->json([
                        'error' => 'Google Sheet non configuré',
                        'message' => "Ajoutez {$envKey} dans votre fichier .env ou passez ?spreadsheetId=VOTRE_ID dans l'URL"
                    ], Response::HTTP_BAD_REQUEST);
                }
            }
            
            // Nom de la feuille (par défaut "MatchesResults")
            $sheetName = $request->query->get('sheetName', 'MatchesResults');
            
            // Récupérer les matchs
            $matches = $this->googleSheetsService->getMatchHistory($spreadsheetId, $sheetName);
            
            return $this->json([
                'success' => true,
                'game' => $game,
                'count' => count($matches),
                'matches' => $matches,
                'spreadsheetId' => $spreadsheetId,
                'sheetName' => $sheetName
            ]);
            
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Impossible de récupérer les matchs',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    
    /**
     * Récupère les infos d'un Google Sheet
     */
    #[Route('/info', name: 'info', methods: ['POST'])]
    #[OA\Post(
        description: "Récupère les informations d'un Google Sheet (titre, feuilles, dimensions)",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'url', type: 'string', example: 'https://docs.google.com/spreadsheets/d/ABC123/edit')
                ]
            )
        )
    )]
    public function getInfo(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['url'])) {
            return $this->json(['error' => 'URL is required'], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            $spreadsheetId = $this->googleSheetsService->extractSpreadsheetId($data['url']);
            $info = $this->googleSheetsService->getSheetInfo($spreadsheetId);
            
            return $this->json($info);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Impossible de récupérer les infos du Google Sheet',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    
    /**
     * Récupère les données d'une feuille spécifique
     */
    #[Route('/data', name: 'data', methods: ['POST'])]
    #[OA\Post(
        description: "Récupère les données d'une feuille Google Sheet",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'url', type: 'string', example: 'https://docs.google.com/spreadsheets/d/ABC123/edit'),
                    new OA\Property(property: 'range', type: 'string', example: 'Sheet1!A1:Z1000', nullable: true)
                ]
            )
        )
    )]
    public function getData(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['url'])) {
            return $this->json(['error' => 'URL is required'], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            $spreadsheetId = $this->googleSheetsService->extractSpreadsheetId($data['url']);
            $range = $data['range'] ?? 'A1:Z1000';
            
            $sheetData = $this->googleSheetsService->getSheetData($spreadsheetId, $range);
            
            return $this->json([
                'data' => $sheetData,
                'count' => count($sheetData)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Impossible de récupérer les données du Google Sheet',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    
    /**
     * Récupère toutes les feuilles d'un Google Sheet
     */
    #[Route('/all', name: 'all', methods: ['POST'])]
    #[OA\Post(
        description: "Récupère toutes les données de toutes les feuilles d'un Google Sheet",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'url', type: 'string', example: 'https://docs.google.com/spreadsheets/d/ABC123/edit')
                ]
            )
        )
    )]
    public function getAllSheets(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['url'])) {
            return $this->json(['error' => 'URL is required'], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            $spreadsheetId = $this->googleSheetsService->extractSpreadsheetId($data['url']);
            $allData = $this->googleSheetsService->getAllSheets($spreadsheetId);
            
            return $this->json([
                'spreadsheetId' => $spreadsheetId,
                'sheets' => $allData
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Impossible de récupérer les données du Google Sheet',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    
    /**
     * Importe un Google Sheet en tant que Dataset
     */
    #[Route('/import', name: 'import', methods: ['POST'])]
    #[IsGranted('ROLE_DATA_PROVIDER')]
    #[OA\Post(
        description: "Importe un Google Sheet en tant que Dataset dans M8Pulse",
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'url', type: 'string', example: 'https://docs.google.com/spreadsheets/d/ABC123/edit'),
                    new OA\Property(property: 'name', type: 'string', example: 'Stats FPS 2024'),
                    new OA\Property(property: 'description', type: 'string', example: 'Statistiques des matchs FPS 2024'),
                    new OA\Property(property: 'range', type: 'string', example: 'Sheet1!A1:Z1000', nullable: true),
                    new OA\Property(property: 'public', type: 'boolean', example: true)
                ]
            )
        )
    )]
    public function importAsDataset(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['url']) || !isset($data['name'])) {
            return $this->json(['error' => 'URL and name are required'], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            $spreadsheetId = $this->googleSheetsService->extractSpreadsheetId($data['url']);
            $range = $data['range'] ?? 'A1:Z1000';
            
            // Récupérer les données
            $sheetData = $this->googleSheetsService->getSheetData($spreadsheetId, $range);
            
            // Créer le dataset
            $dataset = new Dataset();
            $dataset->setName($data['name']);
            $dataset->setDescription($data['description'] ?? '');
            $dataset->setFilename('google-sheet-' . $spreadsheetId . '.json');
            $dataset->setOriginalFilename($data['name'] . '.json');
            $dataset->setFilePath('google-sheets/' . $spreadsheetId);
            $dataset->setMimeType('application/json');
            $dataset->setSizeBytes(strlen(json_encode($sheetData)));
            $dataset->setRowCount(count($sheetData));
            
            // Déterminer les colonnes
            if (!empty($sheetData)) {
                $columns = [];
                $firstRow = $sheetData[0];
                foreach ($firstRow as $key => $value) {
                    $columns[] = [
                        'name' => $key,
                        'type' => is_numeric($value) ? 'number' : 'string',
                        'description' => ''
                    ];
                }
                $dataset->setColumnsInfo($columns);
            }
            
            $dataset->setProvider($this->getUser());
            $dataset->setPublic($data['public'] ?? false);
            $dataset->setStatus('ready');
            
            $this->entityManager->persist($dataset);
            $this->entityManager->flush();
            
            // Sauvegarder les données dans un fichier JSON
            $uploadDir = __DIR__ . '/../../public/uploads/datasets/google-sheets';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $jsonFile = $uploadDir . '/' . $spreadsheetId . '.json';
            file_put_contents($jsonFile, json_encode($sheetData, JSON_PRETTY_PRINT));
            
            return $this->json([
                'message' => 'Google Sheet importé avec succès',
                'dataset' => [
                    'id' => $dataset->getId(),
                    'name' => $dataset->getName(),
                    'rowCount' => $dataset->getRowCount(),
                    'columns' => $dataset->getColumnsInfo()
                ]
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Impossible d\'importer le Google Sheet',
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    
    /**
     * Importe et remplace un Dataset existant depuis Google Sheets
     */
    #[Route('/import-replace/{id}', name: 'import_replace', methods: ['POST'])]
    #[IsGranted('ROLE_DATA_PROVIDER')]
    #[OA\Post(
        description: "Met à jour un Dataset existant avec les données d'un Google Sheet",
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'url', type: 'string', example: 'https://docs.google.com/spreadsheets/d/ABC123/edit'),
                    new OA\Property(property: 'range', type: 'string', example: 'PlayerRoster!A1:L100', nullable: true),
                    new OA\Property(property: 'game', type: 'string', example: 'valorant', description: 'Type de jeu: valorant, cod, cs2')
                ]
            )
        )
    )]
    public function importReplaceDataset(Request $request, int $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['url'])) {
            return $this->json(['error' => 'URL is required'], Response::HTTP_BAD_REQUEST);
        }
        
        // Récupérer le dataset existant
        $dataset = $this->entityManager->getRepository(Dataset::class)->find($id);
        
        if (!$dataset) {
            return $this->json(['error' => 'Dataset not found'], Response::HTTP_NOT_FOUND);
        }
        
        try {
            $spreadsheetId = $this->googleSheetsService->extractSpreadsheetId($data['url']);
            $game = $data['game'] ?? 'valorant';
            
            // Récupérer les données selon le type de jeu
            $playerData = [];
            switch (strtolower($game)) {
                case 'valorant':
                case 'valo':
                    $playerData = $this->googleSheetsService->getValoPlayerRoster($spreadsheetId, $data['range'] ?? 'PlayerRoster');
                    break;
                case 'cod':
                case 'call of duty':
                    $playerData = $this->googleSheetsService->getCodPlayerRoster($spreadsheetId, $data['range'] ?? 'PlayerRoster');
                    break;
                case 'cs2':
                case 'counter-strike':
                    $playerData = $this->googleSheetsService->getCs2PlayerRoster($spreadsheetId, $data['range'] ?? 'PlayerRoster');
                    break;
                default:
                    // Import générique
                    $range = $data['range'] ?? 'A1:ZZ1000';
                    $result = $this->googleSheetsService->importGenericDataset($spreadsheetId, 'Sheet1', $range);
                    $playerData = $result['data'];
                    break;
            }
            
            // Mettre à jour le dataset
            $dataset->setRowCount(count($playerData));
            $dataset->setSource($data['url']);
            $dataset->setValidatedAt(new \DateTime());
            $dataset->setStatus('ready');
            
            // Mettre à jour les colonnes
            if (!empty($playerData)) {
                $columns = [];
                $firstRow = $playerData[0];
                foreach ($firstRow as $key => $value) {
                    $columns[] = [
                        'name' => $key,
                        'type' => is_numeric($value) ? 'numérique' : 'catégorielle',
                        'description' => ''
                    ];
                }
                $dataset->setVariables($columns);
            }
            
            $this->entityManager->flush();
            
            // Sauvegarder les données
            $uploadDir = __DIR__ . '/../../public/uploads/datasets/google-sheets';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $jsonFile = $uploadDir . '/' . $dataset->getId() . '-' . $spreadsheetId . '.json';
            file_put_contents($jsonFile, json_encode($playerData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            
            // Mettre à jour le filepath
            $dataset->setFilepath('uploads/datasets/google-sheets/' . $dataset->getId() . '-' . $spreadsheetId . '.json');
            $this->entityManager->flush();
            
            return $this->json([
                'message' => 'Dataset mis à jour avec succès',
                'dataset' => [
                    'id' => $dataset->getId(),
                    'name' => $dataset->getName(),
                    'rowCount' => $dataset->getRowCount(),
                    'columns' => $dataset->getVariables(),
                    'source' => $dataset->getSource(),
                    'filepath' => $dataset->getFilepath(),
                    'game' => $game
                ],
                'preview' => array_slice($playerData, 0, 5)
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Impossible d\'importer le Google Sheet',
                'message' => $e->getMessage(),
                'trace' => $_ENV['APP_ENV'] === 'dev' ? $e->getTraceAsString() : null
            ], Response::HTTP_BAD_REQUEST);
        }
    }
    
    /**
     * Crée un nouveau Dataset depuis Google Sheets avec import automatique
     */
    #[Route('/quick-import', name: 'quick_import', methods: ['POST'])]
    #[IsGranted('ROLE_DATA_PROVIDER')]
    #[OA\Post(
        description: "Import rapide d'un Google Sheet comme nouveau Dataset",
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'url', type: 'string', example: 'https://docs.google.com/spreadsheets/d/ABC123/edit'),
                    new OA\Property(property: 'name', type: 'string', example: 'Stats Valorant Joueurs'),
                    new OA\Property(property: 'description', type: 'string', example: 'Statistiques des joueurs Valorant'),
                    new OA\Property(property: 'game', type: 'string', example: 'valorant', description: 'Type de jeu: valorant, cod, cs2, generic'),
                    new OA\Property(property: 'range', type: 'string', example: 'PlayerRoster!A1:L100', nullable: true),
                    new OA\Property(property: 'public', type: 'boolean', example: true)
                ]
            )
        )
    )]
    public function quickImport(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['url']) || !isset($data['name'])) {
            return $this->json(['error' => 'URL and name are required'], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            $spreadsheetId = $this->googleSheetsService->extractSpreadsheetId($data['url']);
            $game = $data['game'] ?? 'generic';
            
            // Récupérer les infos du sheet
            $sheetInfo = $this->googleSheetsService->getSheetInfo($spreadsheetId);
            
            // Récupérer les données selon le type de jeu
            $playerData = [];
            switch (strtolower($game)) {
                case 'valorant':
                case 'valo':
                    $playerData = $this->googleSheetsService->getValoPlayerRoster($spreadsheetId, $data['range'] ?? 'PlayerRoster');
                    break;
                case 'cod':
                case 'call of duty':
                    $playerData = $this->googleSheetsService->getCodPlayerRoster($spreadsheetId, $data['range'] ?? 'PlayerRoster');
                    break;
                case 'cs2':
                case 'counter-strike':
                    $playerData = $this->googleSheetsService->getCs2PlayerRoster($spreadsheetId, $data['range'] ?? 'PlayerRoster');
                    break;
                default:
                    // Import générique
                    $range = $data['range'] ?? 'A1:ZZ1000';
                    $result = $this->googleSheetsService->importGenericDataset($spreadsheetId, 'Sheet1', $range);
                    $playerData = $result['data'];
                    break;
            }
            
            // Créer le dataset
            $dataset = new Dataset();
            $dataset->setName($data['name']);
            $dataset->setDescription($data['description'] ?? 'Importé depuis Google Sheets: ' . $sheetInfo['title']);
            $dataset->setSource($data['url']);
            $dataset->setUploader($this->getUser());
            $dataset->setRowCount(count($playerData));
            $dataset->setStatus('ready');
            $dataset->setValidatedAt(new \DateTime());
            
            // Déterminer les colonnes
            if (!empty($playerData)) {
                $columns = [];
                $firstRow = $playerData[0];
                foreach ($firstRow as $key => $value) {
                    $columns[] = [
                        'name' => $key,
                        'type' => is_numeric($value) ? 'numérique' : 'catégorielle',
                        'description' => ''
                    ];
                }
                $dataset->setVariables($columns);
            }
            
            $this->entityManager->persist($dataset);
            $this->entityManager->flush();
            
            // Sauvegarder les données dans un fichier JSON
            $uploadDir = __DIR__ . '/../../public/uploads/datasets/google-sheets';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $jsonFile = $uploadDir . '/' . $dataset->getId() . '-' . $spreadsheetId . '.json';
            file_put_contents($jsonFile, json_encode($playerData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            
            // Mettre à jour le filepath
            $dataset->setFilepath('uploads/datasets/google-sheets/' . $dataset->getId() . '-' . $spreadsheetId . '.json');
            $this->entityManager->flush();
            
            return $this->json([
                'success' => true,
                'message' => 'Google Sheet importé avec succès',
                'dataset' => [
                    'id' => $dataset->getId(),
                    'name' => $dataset->getName(),
                    'description' => $dataset->getDescription(),
                    'rowCount' => $dataset->getRowCount(),
                    'columns' => $dataset->getVariables(),
                    'source' => $dataset->getSource(),
                    'filepath' => $dataset->getFilepath(),
                    'game' => $game,
                    'sheetTitle' => $sheetInfo['title']
                ],
                'preview' => array_slice($playerData, 0, 5)
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Impossible d\'importer le Google Sheet',
                'message' => $e->getMessage(),
                'trace' => $_ENV['APP_ENV'] === 'dev' ? $e->getTraceAsString() : null
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
