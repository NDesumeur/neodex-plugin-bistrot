# Bistro

A top-down pixel art cooking game: prepare the orders and send them to the pass before the ticket runs out.

*Version française : [README.md](README.md)*

## Controls

- **Arrows** (or WASD): move.
- **Space**: pick up or put down what is in front of you.
- **E** (hold): chop what is on the board.
- **P** or **Esc**: pause.
- **Mouse**: click a tile and the cook walks there, then picks up, puts down or chops on their own.

## How it works

- **Orders** come in at the top, each with a time bar.
- Take ingredients from the **crates** and **chop** them on the board.
- The chopped patty goes in the **pan**; three chopped tomatoes or onions go in the **pot** for a soup.
- **Plate up** on a worktop, then put the plate on the **pass**.
- Whatever stays on the heat **ends up burning**: empty it in the bin.
- Served plates come back after a few seconds.
- **Three minutes** of service. A missed ticket costs 10 points; a dish served fast earns a tip.

## Kitchens

Six kitchens: **The Counter**, **Burgers**, **Soups**, **Cheese Shop**, **Big Service** and **Rush Hour**. Each gives up to **three stars**; one star unlocks the next.

## Stats

The Bests panel keeps the **best score** and **stars** for each kitchen, the number of **dishes served** and the total stars.

## Data and sync

Your scores are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Bistro → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
