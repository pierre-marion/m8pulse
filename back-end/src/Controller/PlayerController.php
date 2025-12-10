<?php

namespace App\Controller;

use App\Service\GoogleSheetsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class PlayerController extends AbstractController
{
    private GoogleSheetsService $googleSheetsService;
    private string $spreadsheetId = '1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY';
    private string $sheetName = 'PlayerRoster';

    public function __construct(GoogleSheetsService $googleSheetsService)
    {
        $this->googleSheetsService = $googleSheetsService;
    }

    #[Route('/api/cod/players', name: 'api_cod_players', methods: ['GET'])]
    public function getCodPlayers(): JsonResponse
    {
        try {
            $players = $this->googleSheetsService->getCodPlayerRoster(
                $this->spreadsheetId,
                $this->sheetName
            );

            return $this->json([
                'success' => true,
                'data' => $players,
                'count' => count($players)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/valo/players', name: 'api_valo_players', methods: ['GET'])]
    public function getValoPlayers(): JsonResponse
    {
        try {
            $spreadsheetId = '1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg';
            $sheetName = 'PlayerRoster';
            
            $players = $this->googleSheetsService->getValoPlayerRoster(
                $spreadsheetId,
                $sheetName
            );

            return $this->json([
                'success' => true,
                'data' => $players,
                'count' => count($players)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    #[Route('/api/cs2/players', name: 'api_cs2_players', methods: ['GET'])]
    public function getCs2Players(): JsonResponse
    {
        try {
            $spreadsheetId = '1afhfsV8ph7fyt-XQA6KuNERDpowavTkvL01SILbgCe8';
            $sheetName = 'PlayerRoster';
            
            $players = $this->googleSheetsService->getCs2PlayerRoster(
                $spreadsheetId,
                $sheetName
            );

            return $this->json([
                'success' => true,
                'data' => $players,
                'count' => count($players)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
