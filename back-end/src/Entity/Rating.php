<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'ratings')]
class Rating
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['rating:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'integer')]
    #[Groups(['rating:read', 'rating:write'])]
    private ?int $stars = null; // 0 à 5

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['rating:read', 'rating:write'])]
    private ?string $comment = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'ratings')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['rating:read'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Article::class, inversedBy: 'ratings')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Article $article = null;

    #[ORM\ManyToOne(targetEntity: Block::class, inversedBy: 'ratings')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Block $block = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['rating:read'])]
    private ?\DateTimeInterface $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStars(): ?int
    {
        return $this->stars;
    }

    public function setStars(int $stars): self
    {
        if ($stars < 0 || $stars > 5) {
            throw new \InvalidArgumentException('Stars must be between 0 and 5');
        }
        $this->stars = $stars;
        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
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

    public function getBlock(): ?Block
    {
        return $this->block;
    }

    public function setBlock(?Block $block): self
    {
        $this->block = $block;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
}
