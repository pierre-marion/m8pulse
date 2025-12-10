<?php

namespace App\Controller;

use App\Entity\Dataset;
use App\Entity\Visualization;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/visualizations', name: 'api_visualizations_')]
#[OA\Tag(name: 'Visualisations')]
class VisualizationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $visualizations = $this->entityManager->getRepository(Visualization::class)->findBy(
            [],
            ['createdAt' => 'DESC']
        );
        
        $data = $this->serializer->serialize($visualizations, 'json', ['groups' => 'visualization:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $visualization = $this->entityManager->getRepository(Visualization::class)->find($id);
        
        if (!$visualization) {
            return $this->json(['error' => 'Visualization not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = $this->serializer->serialize($visualization, 'json', ['groups' => 'visualization:read']);
        
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    #[IsGranted('ROLE_AUTHOR')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['name']) || !isset($data['type']) || !isset($data['dataset_id'])) {
            return $this->json([
                'error' => 'name, type and dataset_id are required'
            ], Response::HTTP_BAD_REQUEST);
        }
        
        $dataset = $this->entityManager->getRepository(Dataset::class)->find($data['dataset_id']);
        
        if (!$dataset) {
            return $this->json(['error' => 'Dataset not found'], Response::HTTP_NOT_FOUND);
        }
        
        $validTypes = ['barchart', 'piechart', 'scatterplot', 'histogram', 'linechart', 'areachart', 'heatmap'];
        if (!in_array($data['type'], $validTypes)) {
            return $this->json([
                'error' => 'Invalid visualization type',
                'valid_types' => $validTypes
            ], Response::HTTP_BAD_REQUEST);
        }
        
        // Valider les variables selon le type de graphique
        $selectedVariables = $data['selected_variables'] ?? null;
        $validationError = $this->validateVariablesForChartType($data['type'], $selectedVariables, $dataset);
        
        if ($validationError) {
            return $this->json(['error' => $validationError], Response::HTTP_BAD_REQUEST);
        }
        
        $visualization = new Visualization();
        $visualization->setName($data['name']);
        $visualization->setDescription($data['description'] ?? null);
        $visualization->setType($data['type']);
        $visualization->setDataset($dataset);
        $visualization->setConfig($data['config'] ?? []);
        $visualization->setSelectedVariables($selectedVariables);
        $visualization->setColors($data['colors'] ?? null);
        $visualization->setOptions($data['options'] ?? null);
        $visualization->setCreatedBy($this->getUser());
        
        $this->entityManager->persist($visualization);
        $this->entityManager->flush();
        
        return $this->json([
            'message' => 'Visualization created successfully',
            'id' => $visualization->getId()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    #[IsGranted('ROLE_AUTHOR')]
    public function update(int $id, Request $request): JsonResponse
    {
        $visualization = $this->entityManager->getRepository(Visualization::class)->find($id);
        
        if (!$visualization) {
            return $this->json(['error' => 'Visualization not found'], Response::HTTP_NOT_FOUND);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['name'])) {
            $visualization->setName($data['name']);
        }
        
        if (isset($data['description'])) {
            $visualization->setDescription($data['description']);
        }
        
        if (isset($data['type'])) {
            $visualization->setType($data['type']);
        }
        
        if (isset($data['config'])) {
            $visualization->setConfig($data['config']);
        }
        
        if (isset($data['selected_variables'])) {
            $visualization->setSelectedVariables($data['selected_variables']);
        }
        
        if (isset($data['colors'])) {
            $visualization->setColors($data['colors']);
        }
        
        if (isset($data['options'])) {
            $visualization->setOptions($data['options']);
        }
        
        if (isset($data['dataset_id'])) {
            $dataset = $this->entityManager->getRepository(Dataset::class)->find($data['dataset_id']);
            if ($dataset) {
                $visualization->setDataset($dataset);
            }
        }
        
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Visualization updated successfully']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_AUTHOR')]
    public function delete(int $id): JsonResponse
    {
        $visualization = $this->entityManager->getRepository(Visualization::class)->find($id);
        
        if (!$visualization) {
            return $this->json(['error' => 'Visualization not found'], Response::HTTP_NOT_FOUND);
        }
        
        $this->entityManager->remove($visualization);
        $this->entityManager->flush();
        
        return $this->json(['message' => 'Visualization deleted successfully']);
    }

    /**
     * Valide les variables sélectionnées selon le type de graphique
     */
    private function validateVariablesForChartType(string $chartType, ?array $selectedVariables, Dataset $dataset): ?string
    {
        if (!$selectedVariables || empty($selectedVariables)) {
            return 'selected_variables are required';
        }
        
        // Récupérer les variables typées du dataset
        $datasetVariables = $dataset->getVariables();
        if (!$datasetVariables) {
            return 'Dataset variables must be defined before creating visualization';
        }
        
        // Créer un mapping nom => type
        $variableTypes = [];
        foreach ($datasetVariables as $var) {
            $variableTypes[$var['name']] = $var['type'];
        }
        
        // Vérifier que toutes les variables sélectionnées existent
        foreach ($selectedVariables as $varName) {
            if (!isset($variableTypes[$varName])) {
                return "Variable '$varName' not found in dataset";
            }
        }
        
        // Validation selon le type de graphique
        switch ($chartType) {
            case 'piechart':
                // Pie chart: 1 catégorielle + 1 numérique
                if (count($selectedVariables) !== 2) {
                    return 'Pie chart requires exactly 2 variables (1 categorical + 1 numeric)';
                }
                $categorical = 0;
                $numeric = 0;
                foreach ($selectedVariables as $varName) {
                    if ($variableTypes[$varName] === 'catégorielle') $categorical++;
                    if ($variableTypes[$varName] === 'numérique') $numeric++;
                }
                if ($categorical !== 1 || $numeric !== 1) {
                    return 'Pie chart requires 1 categorical variable and 1 numeric variable';
                }
                break;
                
            case 'histogram':
                // Histogram: 1 variable numérique
                if (count($selectedVariables) !== 1) {
                    return 'Histogram requires exactly 1 numeric variable';
                }
                if ($variableTypes[$selectedVariables[0]] !== 'numérique') {
                    return 'Histogram requires a numeric variable';
                }
                break;
                
            case 'scatterplot':
                // Scatter plot: 2 variables numériques
                if (count($selectedVariables) !== 2) {
                    return 'Scatter plot requires exactly 2 numeric variables';
                }
                foreach ($selectedVariables as $varName) {
                    if ($variableTypes[$varName] !== 'numérique') {
                        return 'Scatter plot requires 2 numeric variables';
                    }
                }
                break;
                
            case 'barchart':
                // Bar chart: 1 catégorielle + au moins 1 numérique
                if (count($selectedVariables) < 2) {
                    return 'Bar chart requires at least 2 variables (1 categorical + 1+ numeric)';
                }
                $hasCategorical = false;
                $hasNumeric = false;
                foreach ($selectedVariables as $varName) {
                    if ($variableTypes[$varName] === 'catégorielle') $hasCategorical = true;
                    if ($variableTypes[$varName] === 'numérique') $hasNumeric = true;
                }
                if (!$hasCategorical || !$hasNumeric) {
                    return 'Bar chart requires at least 1 categorical and 1 numeric variable';
                }
                break;
                
            case 'linechart':
            case 'areachart':
                // Line/Area chart: 1 variable X (peut être catégorielle ou numérique) + au moins 1 numérique pour Y
                if (count($selectedVariables) < 2) {
                    return ucfirst($chartType) . ' requires at least 2 variables (1 for X axis + 1+ numeric for Y)';
                }
                $hasNumeric = false;
                foreach ($selectedVariables as $varName) {
                    if ($variableTypes[$varName] === 'numérique') $hasNumeric = true;
                }
                if (!$hasNumeric) {
                    return ucfirst($chartType) . ' requires at least 1 numeric variable';
                }
                break;
                
            case 'heatmap':
                // Heatmap: 2 variables catégorielles + 1 numérique
                if (count($selectedVariables) !== 3) {
                    return 'Heatmap requires exactly 3 variables (2 categorical + 1 numeric)';
                }
                $categorical = 0;
                $numeric = 0;
                foreach ($selectedVariables as $varName) {
                    if ($variableTypes[$varName] === 'catégorielle') $categorical++;
                    if ($variableTypes[$varName] === 'numérique') $numeric++;
                }
                if ($categorical !== 2 || $numeric !== 1) {
                    return 'Heatmap requires 2 categorical variables and 1 numeric variable';
                }
                break;
        }
        
        return null; // Pas d'erreur
    }

    #[Route('/types', name: 'types', methods: ['GET'])]
    public function types(): JsonResponse
    {
        return $this->json([
            'types' => [
                ['id' => 'barchart', 'name' => 'Bar Chart', 'description' => 'Diagramme en barres', 'requires' => '1 catégorielle + 1+ numérique'],
                ['id' => 'piechart', 'name' => 'Pie Chart', 'description' => 'Diagramme circulaire', 'requires' => '1 catégorielle + 1 numérique'],
                ['id' => 'scatterplot', 'name' => 'Scatter Plot', 'description' => 'Nuage de points', 'requires' => '2 numériques'],
                ['id' => 'histogram', 'name' => 'Histogram', 'description' => 'Histogramme', 'requires' => '1 numérique'],
                ['id' => 'linechart', 'name' => 'Line Chart', 'description' => 'Graphique linéaire', 'requires' => '1 X + 1+ numériques'],
                ['id' => 'areachart', 'name' => 'Area Chart', 'description' => 'Graphique en aires', 'requires' => '1 X + 1+ numériques'],
                ['id' => 'heatmap', 'name' => 'Heatmap', 'description' => 'Carte de chaleur', 'requires' => '2 catégorielles + 1 numérique']
            ]
        ]);
    }
}
