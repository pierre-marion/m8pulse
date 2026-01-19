-- Suppression des anciens articles de démo
DELETE FROM articles WHERE id IN (1, 2);

-- Réinitialiser l'auto-increment
ALTER TABLE articles AUTO_INCREMENT = 1;

-- Article 1 : Data Story Valorant avec visualisation
INSERT INTO articles (id, title, summary, type, game, status, author_id, view_count, created_at, updated_at, published_at, blocks) VALUES
(1, 
 'Analyse Performance M8 Valorant - Janvier 2026',
 'Décryptage des statistiques de notre équipe Valorant sur le dernier tournoi. Découvrez qui sont nos meilleurs performers et les axes d''amélioration.',
 'data-story',
 'valorant',
 'published',
 1,
 42,
 NOW(),
 NOW(),
 NOW(),
 '[
   {
     "type": "title",
     "content": "Introduction : Un mois intense",
     "level": 2,
     "position": 0
   },
   {
     "type": "text",
     "content": "Le mois de janvier a été marqué par notre participation au **VCT Challengers France**. Notre roster a affronté les meilleures équipes françaises avec un objectif clair : se qualifier pour les playoffs. Les statistiques révèlent des performances prometteuses mais aussi des points à travailler.",
     "position": 1
   },
   {
     "type": "visualization",
     "content": null,
     "config": {
       "type": "bar",
       "title": "Average Combat Score par joueur",
       "dataset": "stats-valorant-janvier",
       "xAxis": "Joueur",
       "yAxis": "ACS",
       "color": "#FF4655"
     },
     "position": 2
   },
   {
     "type": "title",
     "content": "Nos stars : ScreaM et TenZ en forme",
     "level": 2,
     "position": 3
   },
   {
     "type": "text",
     "content": "Sans surprise, **ScreaM** domine nos statistiques avec un ACS moyen de 312. Son agressivité calculée sur Jett lui permet de créer des ouvertures décisives. **TenZ** suit de près avec 298 ACS, excellant particulièrement sur les maps Haven et Bind grâce à sa maîtrise de Reyna.",
     "position": 4
   },
   {
     "type": "title",
     "content": "Axes d''amélioration",
     "level": 2,
     "position": 5
   },
   {
     "type": "text",
     "content": "Notre taux de victoire sur Icebox reste problématique (33%). L''équipe doit retravailler les rotations défensives et mieux coordonner les utilities. Le coaching staff a prévu des scrims intensifs cette semaine.",
     "position": 6
   }
 ]'
);

-- Article 2 : News classique CS2
INSERT INTO articles (id, title, summary, type, game, status, author_id, view_count, created_at, updated_at, published_at, blocks) VALUES
(2,
 'M8 CS2 : Recrutement de ZywOo confirmé !',
 'L''information qui fait trembler la scène française : ZywOo rejoint officiellement M8 en tant qu''AWPer principal. Découvrez les détails du transfert.',
 'news',
 'cs2',
 'published',
 1,
 156,
 NOW() - INTERVAL 2 DAY,
 NOW() - INTERVAL 2 DAY,
 NOW() - INTERVAL 2 DAY,
 '[
   {
     "type": "title",
     "content": "Un transfert historique",
     "level": 2,
     "position": 0
   },
   {
     "type": "text",
     "content": "C''est officiel ! Après des semaines de rumeurs, **ZywOo** rejoint M8 pour la saison 2026. Le joueur français, considéré comme l''un des meilleurs AWPers au monde, portera nos couleurs dès le prochain Major.",
     "position": 1
   },
   {
     "type": "text",
     "content": "\"Rejoindre M8 était une évidence. Le projet sportif est ambitieux et l''équipe a un énorme potentiel. J''ai hâte de commencer les entraînements avec mes nouveaux coéquipiers,\" a déclaré ZywOo lors de la conférence de presse.",
     "position": 2
   },
   {
     "type": "title",
     "content": "Composition du nouveau roster",
     "level": 2,
     "position": 3
   },
   {
     "type": "text",
     "content": "Avec ce recrutement, M8 aligne désormais :\n\n- **ZywOo** (AWP)\n- **shox** (IGL/Rifler)\n- **apEX** (Entry Fragger)\n- **RpK** (Support)\n- **Spinx** (Rifler)\n\nPremier match officiel : **25 janvier vs G2 Esports** au Blast Premier Spring Groups.",
     "position": 4
   }
 ]'
);

-- Article 3 : Analyse tactique Call of Duty
INSERT INTO articles (id, title, summary, type, game, status, author_id, view_count, created_at, updated_at, published_at, blocks) VALUES
(3,
 'Décryptage : Comment M8 domine sur Hardpoint',
 'Analyse tactique approfondie de nos stratégies Hardpoint qui nous ont permis de remporter 78% de nos matchs sur ce mode en janvier.',
 'analysis',
 'cod',
 'published',
 1,
 89,
 NOW() - INTERVAL 1 DAY,
 NOW() - INTERVAL 1 DAY,
 NOW() - INTERVAL 1 DAY,
 '[
   {
     "type": "title",
     "content": "Le Hardpoint : notre mode de prédilection",
     "level": 2,
     "position": 0
   },
   {
     "type": "text",
     "content": "Avec **78% de victoires** sur Hardpoint en janvier, M8 s''impose comme une référence sur ce mode. Notre approche repose sur trois piliers : rotation anticipée, trading efficace et gestion des killstreaks.",
     "position": 1
   },
   {
     "type": "title",
     "content": "1. Rotation anticipée : 15 secondes d''avance",
     "level": 2,
     "position": 2
   },
   {
     "type": "text",
     "content": "Notre IGL **Crimsix** a mis en place une règle stricte : **quitter le hill à -15 secondes** pour setup la prochaine. Cette discipline nous permet d''arriver en premiers sur 82% des rotations, offrant un avantage positionnel décisif.",
     "position": 3
   },
   {
     "type": "title",
     "content": "2. Trading : ne jamais mourir seul",
     "level": 2,
     "position": 4
   },
   {
     "type": "text",
     "content": "Les stats parlent d''elles-mêmes : notre **trade death ratio** atteint 3.2, soit le meilleur de la CDL. Chaque mort est immédiatement vengée, empêchant l''adversaire de capitaliser sur ses eliminations. **Scump** excelle dans ce rôle avec un timing parfait.",
     "position": 5
   },
   {
     "type": "title",
     "content": "3. Killstreaks : un timing chirurgical",
     "level": 2,
     "position": 6
   },
   {
     "type": "text",
     "content": "Contrairement à d''autres équipes qui spamment leurs UAVs, M8 garde ses streaks pour les **hills critiques** (2ème et 4ème rotation). Cette économie stratégique nous donne un avantage massif aux moments clés du match.",
     "position": 7
   },
   {
     "type": "title",
     "content": "Conclusion",
     "level": 2,
     "position": 8
   },
   {
     "type": "text",
     "content": "Ce système rodé fait de M8 un adversaire redoutable sur Hardpoint. Prochaine étape : appliquer ces principes aux maps Invasion et Karachi où nos stats sont encore perfectibles (respectivement 65% et 59% de winrate).",
     "position": 9
   }
 ]'
);

-- Confirmation
SELECT 'Articles créés avec succès !' AS status;
