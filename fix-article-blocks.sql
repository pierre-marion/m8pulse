-- Script pour corriger le format des blocs des articles pré-générés
-- Transforme le format imbriqué en format plat compatible avec le renderer

USE m8pulse;

-- Supprimer les anciens articles de démo s'ils existent
DELETE FROM articles WHERE id IN (1, 2);

-- Recréer les articles avec un format de blocs compatible
INSERT INTO articles (id, title, summary, type, game, author_id, status, blocks, published_at) VALUES
(1, 
 'Analyse de la performance Gentlemates vs Vitality', 
 'Analyse détaillée des statistiques du match GM vs VIT sur Dust2. Découvrez les moments clés et les performances individuelles qui ont fait la différence.',
 'analysis',
 'cs2',
 1, 
 'published',
 JSON_ARRAY(
   JSON_OBJECT('type', 'title', 'titleLevel', 'h1', 'content', 'Performance Gentlemates vs Vitality'),
   JSON_OBJECT('type', 'text', 'content', 'Ce match sur Dust2 a été particulièrement intense. Les Gentlemates ont montré une maîtrise tactique exceptionnelle face à Vitality, l\'une des meilleures équipes européennes.\n\nAnalysons ensemble les statistiques qui ont fait la différence.'),
   JSON_OBJECT('type', 'title', 'titleLevel', 'h2', 'content', 'Les moments clés'),
   JSON_OBJECT('type', 'text', 'content', 'Le tournant du match s\'est joué au round 18, où une excellente rotation des Gentlemates a permis de reprendre le contrôle du site B.\n\nLes clutchs successifs de l\'IGL ont complètement changé la dynamique de la partie.')
 ),
 NOW()),

(2,
 'Guide tactique : Contrôle de map sur Mirage',
 'Stratégies avancées pour dominer la carte Mirage. Apprenez les timings, les smokes essentielles et les rotations optimales.',
 'standard',
 'cs2',
 1,
 'published',
 JSON_ARRAY(
   JSON_OBJECT('type', 'title', 'titleLevel', 'h1', 'content', 'Maîtriser Mirage'),
   JSON_OBJECT('type', 'text', 'content', 'Mirage est une carte équilibrée qui demande une excellente coordination d\'équipe et une compréhension parfaite des timings.\n\nVoici les points clés pour dominer cette map emblématique.'),
   JSON_OBJECT('type', 'title', 'titleLevel', 'h2', 'content', 'Contrôle du mid'),
   JSON_OBJECT('type', 'text', 'content', 'Le contrôle du milieu de carte est crucial sur Mirage. Une smoke window et une molly connector permettent de sécuriser cette zone dès le début du round.\n\nNe négligez jamais l\'importance d\'avoir un joueur dédié au mid control.')
 ),
 NOW()),

(3,
 'Top 10 des plays de la semaine',
 'Les actions les plus spectaculaires de la semaine en esport FPS. Clutchs impossibles, aces mémorables et moments de génie tactique.',
 'standard',
 'general',
 1,
 'published',
 JSON_ARRAY(
   JSON_OBJECT('type', 'title', 'titleLevel', 'h1', 'content', 'Les meilleurs plays de la semaine'),
   JSON_OBJECT('type', 'text', 'content', 'Cette semaine a été riche en actions spectaculaires ! Des clutchs 1v5 aux aces éclair, voici notre sélection des 10 meilleurs moments.\n\nChaque play démontre le niveau exceptionnel des compétiteurs professionnels.'),
   JSON_OBJECT('type', 'title', 'titleLevel', 'h2', 'content', 'N°1 : Le clutch impossible'),
   JSON_OBJECT('type', 'text', 'content', 'En finale du tournament, dans une situation désespérée à 1v4 avec la bombe plantée, notre joueur a réalisé l\'impossible. Entre gestion parfaite du temps, aim précis et mind games, ce clutch restera dans les annales.\n\nLa foule s\'est levée d\'un bond pour applaudir cette performance.')
 ),
 NOW());

-- Réinitialiser l'auto-increment
ALTER TABLE articles AUTO_INCREMENT = 4;

SELECT 'Articles mis à jour avec succès !' as message;
