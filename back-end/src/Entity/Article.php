<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'articles')]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['article:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['article:read', 'article:write'])]
    #[Assert\NotBlank(message: "Le titre ne peut pas être vide")]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: "Le titre doit contenir au moins {{ limit }} caractères",
        maxMessage: "Le titre ne peut pas dépasser {{ limit }} caractères"
    )]
    private ?string $title = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    #[Assert\Length(
        max: 500,
        maxMessage: "Le résumé ne peut pas dépasser {{ limit }} caractères"
    )]
    private ?string $summary = null;

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['article:read', 'article:write'])]
    #[Assert\Choice(
        choices: ['standard', 'data-story', 'analysis', 'tutorial', 'news'],
        message: "Type d'article invalide"
    )]
    private ?string $type = 'standard'; // standard, data-story, analysis, etc.

    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    #[Assert\Choice(
        choices: ['valorant', 'cs2', 'cod', 'fortnite', 'general'],
        message: "Jeu invalide"
    )]
    private ?string $game = 'general'; // valorant, cs2, cod, fortnite, general

    #[ORM\Column(type: 'string', length: 50)]
    #[Groups(['article:read', 'article:write'])]
    #[Assert\Choice(
        choices: ['draft', 'review', 'published', 'archived'],
        message: "Statut invalide"
    )]
    private ?string $status = 'draft'; // draft, review, published

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:read'])]
    private ?User $author = null;

    // Blocks relation commented - table doesn't exist, using JSON column instead
    // #[ORM\OneToMany(mappedBy: 'article', targetEntity: Block::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    // #[ORM\OrderBy(['position' => 'ASC'])]
    // #[Groups(['article:read'])]
    // private Collection $blocks;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?array $blocks = [];

    #[ORM\Column(type: 'integer', options: ['default' => 0])]
    #[Groups(['article:read'])]
    private int $viewCount = 0;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['article:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['article:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['article:read'])]
    private ?\DateTimeInterface $publishedAt = null;

    #[ORM\OneToMany(mappedBy: 'article', targetEntity: Rating::class, cascade: ['remove'])]
    private Collection $ratings;

    #[ORM\OneToMany(mappedBy: 'article', targetEntity: Comment::class, cascade: ['remove'], orphanRemoval: true)]
    #[ORM\OrderBy(['createdAt' => 'DESC'])]
    private Collection $comments;

    #[ORM\ManyToOne(targetEntity: Theme::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['article:read'])]
    private ?Theme $theme = null;

    public function __construct()
    {
        // $this->blocks = new ArrayCollection(); // Commented - table doesn't exist
        $this->ratings = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getSummary(): ?string
    {
        return $this->summary;
    }

    public function setSummary(?string $summary): self
    {
        $this->summary = $summary;
        $this->updatedAt = new \DateTime();
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

    public function getGame(): ?string
    {
        return $this->game;
    }

    public function setGame(?string $game): self
    {
        $this->game = $game;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        if ($status === 'published' && $this->publishedAt === null) {
            $this->publishedAt = new \DateTime();
        }
        $this->updatedAt = new \DateTime();
        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;
        return $this;
    }

    // Block methods commented - table doesn't exist
    // public function getBlocks(): Collection
    // {
    //     return $this->blocks;
    // }

    // public function addBlock(Block $block): self
    // {
    //     if (!$this->blocks->contains($block)) {
    //         $this->blocks[] = $block;
    //         $block->setArticle($this);
    //     }
    //     $this->updatedAt = new \DateTime();
    //     return $this;
    // }

    // public function removeBlock(Block $block): self
    // {
    //     if ($this->blocks->removeElement($block)) {
    //         if ($block->getArticle() === $this) {
    //             $block->setArticle(null);
    //         }
    //     }
    //     $this->updatedAt = new \DateTime();
    //     return $this;
    // }

    public function getBlocks(): ?array
    {
        return $this->blocks ?? [];
    }

    public function setBlocks(?array $blocks): self
    {
        $this->blocks = $blocks;
        return $this;
    }

    public function getViewCount(): int
    {
        return $this->viewCount;
    }

    public function incrementViewCount(): self
    {
        $this->viewCount++;
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

    public function getPublishedAt(): ?\DateTimeInterface
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeInterface $publishedAt): self
    {
        $this->publishedAt = $publishedAt;
        return $this;
    }

    public function getRatings(): Collection
    {
        return $this->ratings;
    }

    #[Groups(['article:read'])]
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

    #[Groups(['article:read'])]
    public function getRatingCount(): int
    {
        return $this->ratings->count();
    }

    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setArticle($this);
        }
        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment)) {
            if ($comment->getArticle() === $this) {
                $comment->setArticle(null);
            }
        }
        return $this;
    }

    #[Groups(['article:read'])]
    public function getCommentCount(): int
    {
        return $this->comments->count();
    }

    public function getTheme(): ?Theme
    {
        return $this->theme;
    }

    public function setTheme(?Theme $theme): self
    {
        $this->theme = $theme;
        return $this;
    }
}
