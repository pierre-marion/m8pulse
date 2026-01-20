<?php

namespace App\Controller;

use App\Entity\Dataset;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/datasets', name: 'api_datasets_')]
#[OA\Tag(name: 'Datasets')]
class DatasetController extends AbstractController
{
    private string $uploadDirectory;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {
        $this->uploadDirectory = __DIR__ . '/../../public/uploads/datasets';
    }

    #[Route('', name: 'list', methods: ['GET'])]
    #[OA\Get(
        path: '/api/datasets',
        summary: 'Liste tous les datasets',
        description: 'Récupère la liste de tous les fichiers de données uploadés (CSV, Google Sheets)',
        tags: ['Datasets']
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des datasets',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'name', type: 'string', example: 'stats-vitality-2024.csv'),
                    new OA\Property(property: 'source', type: 'string', example: 'google_sheets'),
                    // new OA\Property(property: 'uploadedAt', type: 'string', format: 'date-time'),
                    new OA\Property(property: 'rowCount', type: 'integer', example: 245)
                ]
            )
        )
    )]
    public function list(): JsonResponse
    {
        $datasets = $this->entityManager->getRepository(Dataset::class)->findBy(
            [],
            ['createdAt' => 'DESC']
        );
        
        $data = $this->serializer->serialize($datasets, 'json', ['groups' => 'dataset:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        path: '/api/datasets/{id}',
        summary: 'Affiche un dataset spécifique',
        description: 'Récupère les détails d\'un dataset incluant les métadonnées et les variables définies',
        tags: ['Datasets']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'ID du dataset',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Détails du dataset',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'id', type: 'integer', example: 1),
                new OA\Property(property: 'name', type: 'string', example: 'stats-kills.csv'),
                new OA\Property(property: 'filePath', type: 'string'),
                new OA\Property(property: 'variables', type: 'array', items: new OA\Items(type: 'object')),
                new OA\Property(property: 'rowCount', type: 'integer', example: 245)
            ]
        )
    )]
    #[OA\Response(response: 404, description: 'Dataset non trouvé')]
    #[OA\Response(response: 403, description: 'Accès refusé')]
    public function show(int $id): JsonResponse
    {
        $dataset = $this->entityManager->getRepository(Dataset::class)->find($id);
        if (!$dataset) {
            return $this->json(['error' => 'Dataset not found'], Response::HTTP_NOT_FOUND);
        }
        $this->denyAccessUnlessGranted('DATASET_VIEW', $dataset);

        // Inclure les variables dans la réponse
        $data = json_decode($this->serializer->serialize($dataset, 'json', ['groups' => 'dataset:read']), true);
        if ($dataset->getColumnsInfo()) {
            $data['variables'] = $dataset->getColumnsInfo();
        }

        // Ajouter les données du CSV (pour affichage dans le front)
        try {
            $filename = $dataset->getFilename();
            if ($filename) {
                $fullPath = $this->uploadDirectory . '/' . $filename;
                if (file_exists($fullPath)) {
                    $parsed = $this->parseCSV($fullPath);
                    $data['data'] = $parsed['data'] ?? [];
                } else {
                    $data['data'] = [];
                }
            } else {
                $data['data'] = [];
            }
        } catch (\Exception $e) {
            // Si erreur lors du parsing, on retourne un tableau vide
            $data['data'] = [];
        }

        return $this->json($data);
    }

    #[Route('/{id}/variables', name: 'update_variables', methods: ['PATCH'])]
    #[OA\Patch(
        path: '/api/datasets/{id}/variables',
        summary: 'Définir les types de colonnes (variables)',
        description: 'Configure les types de variables pour chaque colonne du dataset (numérique ou catégorielle)',
        security: [['bearerAuth' => []]],
        tags: ['Datasets']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'ID du dataset',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'variables',
                    type: 'array',
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: 'name', type: 'string', example: 'kills'),
                            new OA\Property(property: 'type', type: 'string', enum: ['numérique', 'catégorielle'], example: 'numérique')
                        ]
                    ),
                    example: [
                        ['name' => 'kills', 'type' => 'numérique'],
                        ['name' => 'player', 'type' => 'catégorielle']
                    ]
                )
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Variables mises à jour',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'message', type: 'string', example: 'Variables updated successfully')
            ]
        )
    )]
    #[OA\Response(response: 404, description: 'Dataset non trouvé')]
    public function updateVariables(int $id, Request $request): JsonResponse
    {
        $dataset = $this->entityManager->getRepository(Dataset::class)->find($id);
        
        if (!$dataset) {
            return $this->json(['error' => 'Dataset not found'], Response::HTTP_NOT_FOUND);
        }
        
        $this->denyAccessUnlessGranted('DATASET_EDIT', $dataset);
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['variables']) || !is_array($data['variables'])) {
            return $this->json(['error' => 'Invalid variables format'], Response::HTTP_BAD_REQUEST);
        }
        
        // Valider le format des variables
        foreach ($data['variables'] as $variable) {
            if (!isset($variable['name']) || !isset($variable['type'])) {
                return $this->json(['error' => 'Each variable must have name and type'], Response::HTTP_BAD_REQUEST);
            }
            
            if (!in_array($variable['type'], ['numérique', 'catégorielle'])) {
                return $this->json(['error' => 'Variable type must be "numérique" or "catégorielle"'], Response::HTTP_BAD_REQUEST);
            }
        }
        
        $dataset->setColumnsInfo($data['variables']);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Variables updated successfully',
            'variables' => $dataset->getColumnsInfo()
        ]);
    }

    #[Route('/import/google-sheets', name: 'import_google_sheets', methods: ['POST'])]
    #[IsGranted('ROLE_PROVIDER')]
    #[OA\Post(
        summary: 'Importer un dataset depuis Google Sheets',
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                required: ['spreadsheet_id', 'sheet_name', 'name'],
                properties: [
                    new OA\Property(property: 'spreadsheet_id', type: 'string', description: 'ID du Google Sheet'),
                    new OA\Property(property: 'sheet_name', type: 'string', description: 'Nom de la feuille (tab)', example: 'Sheet1'),
                    new OA\Property(property: 'range', type: 'string', description: 'Plage optionnelle (ex: A:Z)', nullable: true),
                    new OA\Property(property: 'name', type: 'string', description: 'Nom du dataset'),
                    new OA\Property(property: 'description', type: 'string', nullable: true)
                ]
            )
        )
    )]
    public function importFromGoogleSheets(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('DATASET_CREATE');
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['spreadsheet_id']) || !isset($data['sheet_name']) || !isset($data['name'])) {
            return $this->json([
                'error' => 'spreadsheet_id, sheet_name and name are required'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        try {
            // Utiliser GoogleSheetsService pour importer
            $projectDir = $this->getParameter('kernel.project_dir');
            $googleService = new \App\Service\GoogleSheetsService($projectDir);
            
            $importedData = $googleService->importGenericDataset(
                $data['spreadsheet_id'],
                $data['sheet_name'],
                $data['range'] ?? null
            );
            
            if (empty($importedData['data'])) {
                return $this->json(['error' => 'No data found in the Google Sheet'], Response::HTTP_BAD_REQUEST);
            }
            
            // Créer un fichier CSV temporaire avec les données
            if (!is_dir($this->uploadDirectory)) {
                mkdir($this->uploadDirectory, 0777, true);
            }
            
            $filename = uniqid() . '_gsheet.csv';
            $filepath = $this->uploadDirectory . '/' . $filename;
            
            $fp = fopen($filepath, 'w');
            
            // Écrire les headers
            fputcsv($fp, $importedData['headers']);
            
            // Écrire les données
            foreach ($importedData['data'] as $row) {
                $rowValues = [];
                foreach ($importedData['headers'] as $header) {
                    $rowValues[] = $row[$header] ?? '';
                }
                fputcsv($fp, $rowValues);
            }
            
            fclose($fp);
            
            // Créer l'entité Dataset
            $dataset = new Dataset();
            $dataset->setName($data['name']);
            $dataset->setDescription($data['description'] ?? null);
            $dataset->setFilename($filename);
            $dataset->setSource('Google Sheets: ' . $data['spreadsheet_id']);
            $dataset->setProvider($this->getUser());
            $dataset->setColumnsInfo($importedData['variables']); // Auto-détection des types
            
            $this->entityManager->persist($dataset);
            $this->entityManager->flush();
            
            return $this->json([
                'message' => 'Dataset imported successfully from Google Sheets',
                'id' => $dataset->getId(),
                'rowCount' => $importedData['rowCount'],
                'variables' => $importedData['variables']
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Failed to import from Google Sheets',
                'details' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/upload', name: 'upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('DATASET_CREATE');
        
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }
        
        // Vérifier que c'est un CSV
        if ($file->getClientMimeType() !== 'text/csv' && $file->guessExtension() !== 'csv') {
            return $this->json(['error' => 'Only CSV files are allowed'], Response::HTTP_BAD_REQUEST);
        }
        
        // Créer le répertoire s'il n'existe pas
        if (!is_dir($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 0777, true);
        }
        
        // Générer un nom de fichier unique
        $filename = uniqid() . '.csv';
        
        // Déplacer le fichier
        $file->move($this->uploadDirectory, $filename);
        
        // Parser le CSV
        $filepath = $this->uploadDirectory . '/' . $filename;
        $parsedData = $this->parseCSV($filepath);
        
        if (!$parsedData) {
            return $this->json(['error' => 'Failed to parse CSV file'], Response::HTTP_BAD_REQUEST);
        }
        
        $dataset = new Dataset();
        $dataset->setName($request->request->get('name') ?? $file->getClientOriginalName());
        $dataset->setDescription($request->request->get('description'));
        $dataset->setSource($request->request->get('source'));
        $dataset->setPublic($request->request->get('public', 'true') === 'true');
        $dataset->setFilename($filename);
        $dataset->setOriginalFilename($file->getClientOriginalName());
        $dataset->setFilePath('/uploads/datasets/' . $filename);
        $dataset->setMimeType(mime_content_type($filepath) ?: 'text/csv');
        $dataset->setSizeBytes(filesize($filepath));
        $dataset->setColumnsInfo($parsedData['variables']);
        $dataset->setRowCount(count($parsedData['data']));
        $dataset->setStatus('processing');
        $dataset->setProvider($this->getUser());
        
        try {
            $this->entityManager->persist($dataset);
            $this->entityManager->flush();
        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur lors de l\'enregistrement en base',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        return $this->json([
            'message' => 'Dataset uploaded successfully',
            'id' => $dataset->getId(),
            'variables' => $parsedData['variables'],
            'row_count' => $dataset->getRowCount()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}/validate', name: 'validate', methods: ['POST'])]
    public function validate(int $id, Request $request): JsonResponse
    {
        $dataset = $this->entityManager->getRepository(Dataset::class)->find($id);
        
        if (!$dataset) {
            return $this->json(['error' => 'Dataset not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('DATASET_EDIT', $dataset);
        
        $data = json_decode($request->getContent(), true);
        
        // Mettre à jour les types de variables si fournis
        if (isset($data['variables'])) {
            $dataset->setColumnsInfo($data['variables']);
        }
        
        $dataset->setStatus('ready');
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Dataset validated successfully']);
    }

    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $dataset = $this->entityManager->getRepository(Dataset::class)->find($id);
        
        if (!$dataset) {
            return $this->json(['error' => 'Dataset not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Vérifier les permissions via le Voter
        $this->denyAccessUnlessGranted('DATASET_EDIT', $dataset);
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['name'])) {
            $dataset->setName($data['name']);
        }
        
        if (isset($data['description'])) {
            $dataset->setDescription($data['description']);
        }
        
        if (isset($data['variables'])) {
            $dataset->setColumnsInfo($data['variables']);
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Dataset updated successfully']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_PROVIDER')]
    public function delete(int $id): JsonResponse
    {
        $dataset = $this->entityManager->getRepository(Dataset::class)->find($id);
        
        if (!$dataset) {
            return $this->json(['error' => 'Dataset not found'], Response::HTTP_NOT_FOUND);
        }
        
        // Supprimer le fichier physique
        if ($dataset->getFilename()) {
            $filePath = $this->uploadDirectory . '/' . $dataset->getFilename();
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
        
        $this->entityManager->remove($dataset);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Dataset deleted successfully']);
    }

    /**
     * Parse un fichier CSV et détecte automatiquement les types de variables
     */
    private function parseCSV(string $filepath): ?array
    {
        if (!file_exists($filepath)) {
            return null;
        }
        
        // Détecter le séparateur (priorité au point-virgule selon le brief)
        $content = file_get_contents($filepath);
        $separator = strpos($content, ';') !== false ? ';' : ',';
        
        $data = [];
        $dataArray = []; // Format array 2D pour les charts
        $variables = [];
        $headers = [];
        
        if (($handle = fopen($filepath, 'r')) !== false) {
            // Lire les en-têtes avec le bon séparateur
            $headers = fgetcsv($handle, 0, $separator);
            
            if (!$headers) {
                fclose($handle);
                return null;
            }
            
            // Nettoyer les en-têtes (trim whitespace)
            $headers = array_map('trim', $headers);
            
            // Ajouter les headers comme première ligne du format array
            $dataArray[] = $headers;
            
            // Initialiser les variables
            foreach ($headers as $header) {
                $variables[] = [
                    'name' => $header,
                    'type' => 'numérique' // Par défaut
                ];
            }
            
            // Lire les données
            $rowIndex = 0;
            while (($row = fgetcsv($handle, 0, $separator)) !== false && $rowIndex < 1000) { // Limiter à 1000 lignes
                $row = array_map('trim', $row); // Nettoyer les valeurs
                
                // Format objet (pour compatibilité)
                $rowData = [];
                foreach ($row as $index => $value) {
                    $rowData[$headers[$index]] = $value;
                    
                    // Détecter le type de variable (si ce n'est pas numérique, c'est catégoriel)
                    if (!is_numeric($value) && $value !== '' && $value !== null) {
                        $variables[$index]['type'] = 'catégorielle';
                    }
                }
                $data[] = $rowData;
                
                // Format array 2D (pour les charts)
                $dataArray[] = array_values($row);
                
                $rowIndex++;
            }
            
            fclose($handle);
        }
        
        return [
            'variables' => $variables,
            'data' => $dataArray, // Utiliser le format array 2D
            'separator' => $separator
        ];
    }
}
