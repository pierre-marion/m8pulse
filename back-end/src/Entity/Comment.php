<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'comments')]
class Comment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['comment:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Article::class, inversedBy: 'comments')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Article $article = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups(['comment:read'])]
    private ?User $author = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['comment:read', 'comment:write'])]
    #[Assert\NotBlank(message: "Le commentaire ne peut pas être vide")]
    #[Assert\Length(
        min: 2,
        max: 2000,
        minMessage: "Le commentaire doit contenir au moins {{ limit }} caractères",
        maxMessage: "Le commentaire ne peut pas dépasser {{ limit }} caractères"
    )]
    private ?string $content = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['comment:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['comment:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups(['comment:read'])]
    private bool $isEdited = false;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        $this->updatedAt = new \DateTime();
        if ($this->id !== null) {
            $this->isEdited = true;
        }
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

    public function getIsEdited(): bool
    {
        return $this->isEdited;
    }

    #[Groups(['comment:read'])]
    public function getAuthorName(): ?string
    {
        return $this->author ? $this->author->getUsername() : null;
    }
}
