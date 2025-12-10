<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'visualizations')]
class Visualization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['visualization:read', 'article:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['visualization:read', 'visualization:write', 'article:read'])]
    private ?string $name = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['visualization:read', 'visualization:write'])]
    private ?string $description = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['visualization:read', 'visualization:write', 'article:read'])]
    private ?string $type = null; // barchart, piechart, scatterplot, histogram, linechart, etc.

    #[ORM\ManyToOne(targetEntity: Dataset::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['visualization:read'])]
    private ?Dataset $dataset = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['visualization:read', 'visualization:write', 'article:read'])]
    private array $config = []; // Configuration du graphique

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['visualization:read', 'visualization:write', 'article:read'])]
    private ?array $selectedVariables = null; // Variables sélectionnées à afficher

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['visualization:read', 'visualization:write', 'article:read'])]
    private ?array $colors = null; // Palette de couleurs

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['visualization:read', 'visualization:write'])]
    private ?array $options = null; // Options graphiques (taille, légendes, etc.)

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['visualization:read'])]
    private ?User $createdBy = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['visualization:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['visualization:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getDataset(): ?Dataset
    {
        return $this->dataset;
    }

    public function setDataset(?Dataset $dataset): self
    {
        $this->dataset = $dataset;
        return $this;
    }

    public function getConfig(): array
    {
        return $this->config;
    }

    public function setConfig(array $config): self
    {
        $this->config = $config;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getSelectedVariables(): ?array
    {
        return $this->selectedVariables;
    }

    public function setSelectedVariables(?array $selectedVariables): self
    {
        $this->selectedVariables = $selectedVariables;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getColors(): ?array
    {
        return $this->colors;
    }

    public function setColors(?array $colors): self
    {
        $this->colors = $colors;
        return $this;
    }

    public function getOptions(): ?array
    {
        return $this->options;
    }

    public function setOptions(?array $options): self
    {
        $this->options = $options;
        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }
}
