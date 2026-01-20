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

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['dataset:read'])]
    private ?string $filename = null;

    #[ORM\Column(name: 'original_filename', type: 'string', length: 255)]
    #[Groups(['dataset:read'])]
    private ?string $originalFilename = null;

    #[ORM\Column(name: 'file_path', type: 'string', length: 500)]
    #[Groups(['dataset:read'])]
    private ?string $filePath = null;

    #[ORM\Column(name: 'mime_type', type: 'string', length: 100)]
    #[Groups(['dataset:read'])]
    private ?string $mimeType = null;

    #[ORM\Column(name: 'size_bytes', type: 'bigint')]
    #[Groups(['dataset:read'])]
    private ?int $sizeBytes = null;

    #[ORM\Column(name: 'row_count', type: 'integer', nullable: true)]
    #[Groups(['dataset:read'])]
    private ?int $rowCount = 0;

    #[ORM\Column(name: 'columns_info', type: 'json')]
    #[Groups(['dataset:read', 'visualization:read'])]
    private array $columnsInfo = [];

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'datasets')]
    #[ORM\JoinColumn(name: 'provider_id', nullable: false)]
    #[Groups(['dataset:read'])]
    private ?User $provider = null;

    #[ORM\Column(type: 'boolean', nullable: true)]
    #[Groups(['dataset:read', 'dataset:write'])]
    private bool $public = false;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('processing', 'ready', 'error')", nullable: true)]
    #[Groups(['dataset:read'])]
    private ?string $status = 'processing';

    #[ORM\Column(name: 'error_message', type: 'text', nullable: true)]
    #[Groups(['dataset:read'])]
    private ?string $errorMessage = null;

    #[ORM\Column(name: 'created_at', type: 'datetime', nullable: true)]
    #[Groups(['dataset:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime', nullable: true)]
    #[Groups(['dataset:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->columnsInfo = [];
        $this->public = false;
        $this->status = 'processing';
        $this->rowCount = 0;
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

    public function getOriginalFilename(): ?string
    {
        return $this->originalFilename;
    }

    public function setOriginalFilename(?string $originalFilename): self
    {
        $this->originalFilename = $originalFilename;
        return $this;
    }

    public function getFilePath(): ?string
    {
        return $this->filePath;
    }

    public function setFilePath(?string $filePath): self
    {
        $this->filePath = $filePath;
        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(?string $mimeType): self
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    public function getSizeBytes(): ?int
    {
        return $this->sizeBytes;
    }

    public function setSizeBytes(?int $sizeBytes): self
    {
        $this->sizeBytes = $sizeBytes;
        return $this;
    }

    public function getColumnsInfo(): array
    {
        return $this->columnsInfo;
    }

    public function setColumnsInfo(array $columnsInfo): self
    {
        $this->columnsInfo = $columnsInfo;
        return $this;
    }

    public function getProvider(): ?User
    {
        return $this->provider;
    }

    public function setProvider(?User $provider): self
    {
        $this->provider = $provider;
        return $this;
    }

    public function getErrorMessage(): ?string
    {
        return $this->errorMessage;
    }

    public function setErrorMessage(?string $errorMessage): self
    {
        $this->errorMessage = $errorMessage;
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

    public function getRowCount(): ?int
    {
        return $this->rowCount;
    }

    public function setRowCount(?int $rowCount): self
    {
        $this->rowCount = $rowCount;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
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
