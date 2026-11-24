# Bistrot

Un jeu de cuisine en pixel art, vu de dessus : prépare les commandes et envoie-les au passe avant la fin du ticket.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Flèches** (ou ZQSD) : se déplacer.
- **Espace** : prendre ou poser ce qui est devant toi.
- **E** (maintenir) : hacher ce qui est sur la planche.
- **P** ou **Échap** : pause.
- **À la souris** : clique sur une case et le cuisinier y va, prend, pose ou hache tout seul.

## Comment ça marche

- Les **clients** s'installent dans la salle, à droite ; leurs **tickets** arrivent en haut, avec une barre de patience.
- Prends les ingrédients dans les **caisses** et **hache**-les sur la planche.
- Le steak haché va à la **poêle**, les pommes de terre hachées à la **friteuse** ; trois tomates ou trois oignons hachés vont dans la **marmite** pour une soupe.
- La **pizza** : pose la pâte sur un plan de travail, garnis-la de tomate et de fromage hachés, puis enfourne-la au **four**.
- **Dresse l'assiette** sur un plan de travail, puis pose-la sur le **passe** : le client mange, content.
- Au-dessus de chaque poste, une **jauge** montre la cuisson ; quand « !! » clignote, ça va **brûler** : vide le brûlé à la poubelle.
- La bulle au-dessus du cuisinier montre ce que deviendra l'assiette en main, cochée si un client l'a commandée.
- **Trois minutes** de service. Un ticket raté coûte 10 points et le client repart fâché.

## Pourboires, combos et clients pressés

- Servir **vite** rapporte un **pourboire** (+8 ou +15).
- Servir plusieurs plats **à la suite** (moins de 25 secondes entre deux) fait un **combo** : +5 par plat d'affilée, jusqu'à +20. Un ticket raté le casse.
- Les clients **pressés** (ticket marqué PRESSÉ) attendent moins longtemps mais paient moitié plus.

## Les cuisines

Onze cuisines, plus compactes qu'avant : **Le comptoir**, **Burgers**, **Soupes**, **Friterie**, **Fromagerie** (portes battantes), **Pizzeria**, **Salon de thé**, **Grand service** et **Coup de feu** (portes battantes et deux coups de feu où les commandes arrivent deux fois plus vite), puis **Tapis roulant** et **Le bateau**, les cuisines qui bougent. Les portes battantes s'ouvrent et se ferment toutes les six secondes ; un passage reste toujours libre à côté. Chaque cuisine donne jusqu'à **trois étoiles** ; une étoile ouvre la suivante.

### Les cuisines qui bougent (nouveau en 1.2.0)

- **Tapis roulant** (burgers, cheeseburgers, frites) : un mur coupe la cuisine en deux, les caisses et les planches à gauche, la poêle, la friteuse, les assiettes et le passe à droite. Deux **tapis roulants** traversent le mur : ce que tu poses dessus avance tout seul d'une case toutes les 0,4 seconde jusqu'au bout (en haut vers la droite, en bas vers la gauche). Le tour à pied par le bas reste possible, mais il est long.
- **Le bateau** (salade tomate, soupe à l'oignon, coupe de fraises) : une cuisine de navire, coque en planches et hublots sur la mer. Le bateau **tangue** : quand il penche fort, toute la cuisine glisse, « Ça tangue ! » s'affiche et la houle te pousse vers le bas du pont ; il faut corriger sa route.

## Statistiques

Le panneau Records garde le **meilleur score** et les **étoiles** de chaque cuisine, le nombre de **plats servis**, le total des **pourboires** et des étoiles.

## Données et synchronisation

Tes scores sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Bistrot → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
