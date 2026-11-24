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

- **Guests** sit down in the dining room, on the right; their **tickets** come in at the top, each with a patience bar.
- Take ingredients from the **crates** and **chop** them on the board.
- The chopped patty goes in the **pan**, chopped potatoes in the **fryer**; three chopped tomatoes or onions go in the **pot** for a soup.
- **Pizza**: put the dough on a worktop, top it with chopped tomato and cheese, then bake it in the **oven**.
- **Plate up** on a worktop, then put the plate on the **pass**: the guest eats, happy.
- Above each station, a **gauge** shows the cooking; when "!!" blinks, it is about to **burn**: empty burnt food in the bin.
- The bubble above the cook shows what the plate in hand will become, ticked if a guest ordered it.
- **Three minutes** of service. A missed ticket costs 10 points and the guest leaves angry.

## Tips, combos and hurried guests

- Serving **fast** earns a **tip** (+8 or +15).
- Serving several dishes **in a row** (less than 25 seconds apart) makes a **combo**: +5 per dish in a row, up to +20. A missed ticket breaks it.
- **Hurried** guests (ticket marked HURRY) wait less but pay half as much again.

## Kitchens

Eleven kitchens, more compact than before: **The Counter**, **Burgers**, **Soups**, **Chip Shop**, **Cheese Shop** (swinging doors), **Pizzeria**, **Tea Room**, **Big Service** and **Rush Hour** (swinging doors and two rushes when orders come twice as fast), then **Conveyor belt** and **The boat**, the moving kitchens. Swinging doors open and close every six seconds; a way through always stays free next to them. Each kitchen gives up to **three stars**; one star unlocks the next.

### Moving kitchens (new in 1.2.0)

- **Conveyor belt** (burgers, cheeseburgers, fries): a wall splits the kitchen in two, crates and boards on the left, pan, fryer, plates and pass on the right. Two **conveyor belts** cross the wall: what you put on them moves on by itself one tile every 0.4 second to the end (top one to the right, bottom one to the left). Walking round through the bottom is still possible, but it is long.
- **The boat** (tomato salad, onion soup, strawberry cup): a ship's galley, plank hull and portholes on the sea. The boat **rocks**: when it leans hard, the whole kitchen slides, "It rocks!" shows up and the swell pushes you down the deck; you have to correct your course.

## Stats

The Bests panel keeps the **best score** and **stars** for each kitchen, the number of **dishes served**, total **tips** and total stars.

## Data and sync

Your scores are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Bistro → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
