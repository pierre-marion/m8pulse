<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'welcome_config')]
class WelcomeConfig
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['welcome:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['welcome:read', 'welcome:write'])]
    private ?string $welcomeText = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['welcome:read', 'welcome:write'])]
    private array $visualizationConfig = []; // Config pour WebGL/A-FRAME/ThreeJS

    #[ORM\Column(type: 'boolean')]
    #[Groups(['welcome:read', 'welcome:write'])]
    private bool $isActive = true;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['welcome:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWelcomeText(): ?string
    {
        return $this->welcomeText;
    }

    public function setWelcomeText(string $welcomeText): self
    {
        $this->welcomeText = $welcomeText;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getVisualizationConfig(): array
    {
        return $this->visualizationConfig;
    }

    public function setVisualizationConfig(array $visualizationConfig): self
    {
        $this->visualizationConfig = $visualizationConfig;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }
}
