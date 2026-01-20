<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'datasets')]
class Dataset
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['dataset:read', 'visualization:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['dataset:read', 'dataset:write', 'visualization:read'])]
    #[Assert\NotBlank(message: "Le nom du dataset ne peut pas être vide")]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: "Le nom doit contenir au moins {{ limit }} caractères",
        maxMessage: "Le nom ne peut pas dépasser {{ limit }} caractères"
    )]
    private ?string $name = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['dataset:read', 'dataset:write'])]
    #[Assert\Length(
        max: 1000,
        maxMessage: "La description ne peut pas dépasser {{ limit }} caractères"
    )]
    private ?string $description = null;

    #[ORM\Column(type: 'string', length: 500, nullable: true)]
    #[Groups(['dataset:read', 'dataset:write'])]
    #[Assert\Url(message: "L'URL de la source n'est pas valide")]
    private ?string $source = null; // URL Google Sheets, fichier CSV, etc.

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['dataset:read'])]
    private ?string $filename = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['dataset:read'])]
    private ?string $filepath = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['dataset:read', 'visualization:read'])]
    private array $variables = []; // [{name: "Kills", type: "numérique"}, ...]

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['dataset:read'])]
    private ?array $data = null; // Données parsées

    #[ORM\Column(type: 'integer', nullable: true)]
    #[Groups(['dataset:read'])]
    private ?int $rowCount = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['dataset:read'])]
    private ?string $status = 'processing'; // processing, ready, error

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['dataset:read', 'dataset:write'])]
    private ?string $game = 'general'; // general, cs2, valorant, etc.

    #[ORM\Column(type: 'boolean')]
    #[Groups(['dataset:read', 'dataset:write'])]
    private bool $public = true; // Dataset public ou privé

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'datasets')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['dataset:read'])]
    private ?User $uploader = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['dataset:read'])]
    private ?\DateTimeInterface $uploadedAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['dataset:read'])]
    private ?\DateTimeInterface $validatedAt = null;

    public function __construct()
    {
        $this->uploadedAt = new \DateTime();
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

    public function getSource(): ?string
    {
        return $this->source;
    }

    public function setSource(?string $source): self
    {
        $this->source = $source;
        return $this;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(?string $filename): self
    {
        $this->filename = $filename;
        return $this;
    }

    public function getFilepath(): ?string
    {
        return $this->filepath;
    }

    public function setFilepath(?string $filepath): self
    {
        $this->filepath = $filepath;
        return $this;
    }

    public function getVariables(): array
    {
        return $this->variables;
    }

    public function setVariables(array $variables): self
    {
        $this->variables = $variables;
        return $this;
    }

    public function getData(): ?array
    {
        return $this->data;
    }

    public function setData(?array $data): self
    {
        $this->data = $data;
        $this->rowCount = $data ? count($data) : 0;
        return $this;
    }

    public function getRowCount(): ?int
    {
        return $this->rowCount;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        if ($status === 'ready') {
            $this->validatedAt = new \DateTime();
        }
        return $this;
    }

    public function getUploader(): ?User
    {
        return $this->uploader;
    }

    public function setUploader(?User $uploader): self
    {
        $this->uploader = $uploader;
        return $this;
    }

    public function getUploadedAt(): ?\DateTimeInterface
    {
        return $this->uploadedAt;
    }

    public function getValidatedAt(): ?\DateTimeInterface
    {
        return $this->validatedAt;
    }

    public function getGame(): ?string
    {
        return $this->game;
    }

    public function setGame(string $game): self
    {
        $this->game = $game;
        return $this;
    }

    public function isPublic(): bool
    {
        return $this->public;
    }

    public function setPublic(bool $public): self
    {
        $this->public = $public;
        return $this;
    }
}
