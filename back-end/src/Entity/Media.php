<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'media')]
class Media
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['media:read', 'article:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['media:read', 'media:write', 'article:read'])]
    private ?string $name = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['media:read', 'article:read'])]
    private ?string $filename = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['media:read', 'article:read'])]
    private ?string $path = null;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['media:read', 'article:read'])]
    private ?string $mimeType = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['media:read'])]
    private ?int $size = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['media:read', 'media:write'])]
    private ?array $tags = [];

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['media:read', 'article:read'])]
    private ?string $type = 'image'; // image, video, document

    #[ORM\Column(type: 'datetime')]
    #[Groups(['media:read'])]
    private ?\DateTimeInterface $uploadedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['media:read'])]
    private ?User $uploadedBy = null;

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

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): self
    {
        $this->filename = $filename;
        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;
        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): self
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): self
    {
        $this->size = $size;
        return $this;
    }

    public function getTags(): ?array
    {
        return $this->tags;
    }

    public function setTags(?array $tags): self
    {
        $this->tags = $tags;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getUploadedAt(): ?\DateTimeInterface
    {
        return $this->uploadedAt;
    }

    public function getUploadedBy(): ?User
    {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): self
    {
        $this->uploadedBy = $uploadedBy;
        return $this;
    }
}
