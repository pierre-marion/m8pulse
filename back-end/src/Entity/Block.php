<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'blocks')]
class Block
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['article:read', 'block:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['article:read', 'block:read', 'block:write'])]
    #[Assert\NotBlank(message: "Le type de bloc ne peut pas être vide")]
    #[Assert\Choice(
        choices: ['text', 'title', 'image', 'video', 'visualization', 'code', 'quote'],
        message: "Type de bloc invalide"
    )]
    private ?string $type = null; // text, title, image, visualization

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['article:read', 'block:read', 'block:write'])]
    private ?string $content = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['article:read', 'block:read', 'block:write'])]
    private ?array $config = null; // Configuration spécifique au type de bloc

    #[ORM\Column(type: 'integer')]
    #[Groups(['article:read', 'block:read', 'block:write'])]
    #[Assert\PositiveOrZero(message: "La position doit être positive ou zéro")]
    private int $position = 0;

    #[ORM\ManyToOne(targetEntity: Article::class, inversedBy: 'blocks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Article $article = null;

    #[ORM\ManyToOne(targetEntity: Media::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['article:read', 'block:read'])]
    private ?Media $media = null;

    #[ORM\ManyToOne(targetEntity: Visualization::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['article:read', 'block:read'])]
    private ?Visualization $visualization = null;

    #[ORM\OneToMany(mappedBy: 'block', targetEntity: Rating::class, cascade: ['remove'])]
    private Collection $ratings;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['article:read', 'block:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['article:read', 'block:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->ratings = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getConfig(): ?array
    {
        return $this->config;
    }

    public function setConfig(?array $config): self
    {
        $this->config = $config;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getPosition(): int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;
        return $this;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): self
    {
        $this->article = $article;
        return $this;
    }

    public function getMedia(): ?Media
    {
        return $this->media;
    }

    public function setMedia(?Media $media): self
    {
        $this->media = $media;
        return $this;
    }

    public function getVisualization(): ?Visualization
    {
        return $this->visualization;
    }

    public function setVisualization(?Visualization $visualization): self
    {
        $this->visualization = $visualization;
        return $this;
    }

    public function getRatings(): Collection
    {
        return $this->ratings;
    }

    #[Groups(['article:read', 'block:read'])]
    public function getAverageRating(): float
    {
        if ($this->ratings->isEmpty()) {
            return 0.0;
        }

        $sum = 0;
        foreach ($this->ratings as $rating) {
            $sum += $rating->getStars();
        }

        return round($sum / $this->ratings->count(), 2);
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
