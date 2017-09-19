'use strict'

module.exports = {
  // Base health and defense. (This is tied only to the knight's level.)
  baseHero: {
    health: 607,
    defense: 316
  },

  // Equipment (armor, rings, amulets, and pets). More of these means more simulations to run.
  //
  // As a rule of thumb, it's unnecessary to include both of two armors of the same element when
  // one of them has a lower defense. After all, they act completely identically, aside from one
  // having one lower stat; there is no possible case in which using the armor of lesser defense
  // is a better choice. On the other hand, it's good to include a set of armors which contains
  // a variety of elemental combinations; sometimes a higher defense value doesn't outweigh the
  // resistance that armors with different elements have.
  //
  // Comparable can be said about rings and amulets. Trinkets like these may grant their wearers
  // a boost to health, defense, or both. Since any given trinket may only have one element, it
  // might seem like it's best to just give the program the ring or amulet that seems to have an
  // advantage over the others of the same element. But there is no hard statement that you should
  // always look to optimize health over defense, or vice versa, so it's good to include a set
  // which has variety in both defense and health boosts.
  //
  // Pets only have one stat, though (a boost to both attack and defense), so you may as well
  // only enter one pet for each element (the one with the greatest attack/defense boost).
  //
  // All this equipment is stored in a convenient table-like listing. If you follow that, it'll
  // be easier to manage and understand this code.
  equips: {
    // Name, +DEF, elements
    //                                               Air    Water    Fire    Mystic    Earth
    armor: [
      ['Prehistoric Huntsguard', 1604,             ['air',                            'earth']],
      ['Gunslinger\'s Trappings', 1382,            ['air', 'water'                           ]],
    //['Northerner\'s Battlegear', 685,            [       'water'                           ]],
      ['Pelagic Platemail', 1447,                  [       'water'                           ]],
      ['Siegemage Robes', 1633,                    [       'water',         'mystic'         ]],
      ['Darkscale Battlegear', 1143,               [                'fire', 'mystic'         ]],
      ['Overgrown Lifeplate', 1382,                [                        'mystic', 'earth']],
    //['Silver Chromatic Mantle', 390, 'starmetal'],
    ],

    // Name, +DEF, +HP, element
    //                                               Air    Water    Fire    Mystic    Earth
    rings: [
      ['Stinging Stone of Endurance', 141, 0,       'air'                                    ],
      ['Crest of Growth', 0, 44,                    'air'                                    ],
      ['Holy Petal of Shelter', 161, 105,                  'water'                           ],
      ['Stinging Sheath of Endurance', 126, 0,                      'fire'                   ],
      ['Lavish Crest', 0, 44,                                       'fire'                   ],
      ['Sturdy Loop', 66, 0,                                                'mystic'         ],
      ['Fierce Stone of Rest', 0, 14,                                       'mystic'         ],
      ['Cupid\'s Love', 273, 16,                                                      'earth'],
      ['Robust Stone of Youth', 91, 22,                                               'earth'],
      ['(--none--)', 0, 0, '*'],
    ],

    // Name, +DEF, +HP, element
    //                                               Air    Water    Fire    Mystic    Earth
    amulets: [
      ['Choker of Iron', 180, 0,                    'air'                                    ],
      ['Bauble of Rest', 0, 15,                     'air'                                    ],
      ['Locket of Endurance', 90, 0,                       'water'                           ],
      ['Shining Locket', 0, 24,                            'water'                           ],
      ['Necklace of Shelter', 153, 0,                               'fire'                   ],
      ['Pillars of Grace', 0, 58,                                   'fire'                   ],
      ['Shining Majestic of Endurance', 137, 28,                    'fire'                   ],
      ['Prism of Endurance', 95, 0,                                         'mystic'         ],
      ['Stinging Heirloom of Majesty', 0, 90,                               'mystic'         ],
      ['Shining Necklace of Endurance', 74, 23,                             'mystic'         ],
      ['Sturdy Pendant of Skill', 52, 0,                                              'earth'],
      ['Charm of Youth', 0, 32,                                                       'earth'],
      ['(--none--)', 0, 0, '*'],
    ],

    // Name, +ATK/DEF, element
    //                                               Air    Water    Fire    Mystic    Earth
    pets: [
      ['Puffwyrm', 232,                             'air'                                    ],
      ['Rivergill', 102,                                   'water'                           ],
      ['Pyrebrush', 76,                                             'fire'                   ],
      ['Dreadhorn', 192,                                                    'mystic'         ],
      ['Mudfur', 313,                                                                 'earth'],
      ['(--none--)', 0, '*'],
    ]
  },

  // A "zone" is a stage of a dungeon in the world map. For example, 'DarKndm1' refers to the
  // normal difficulty stage of Kingdom of Darkness; 'Steppes3' refers to the Valor stage of
  // Sparking Steppes.
  //
  // Every zone has a list of waves. When a simulation for this zone runs, the program will
  // pick a random item from the corresponding array in waveEntries and use that as the list of
  // enemies the hero needs to fight.
  //
  // All that is used to simulate the fact that most zones in Knights and Dragons are composed
  // of two types of waves: a series of random waves, and then a boss wave. Each zone has a list
  // of possible random waves, which is used for picking the waves fought before the boss.
  //
  // Also found within the data for a given zone is the data for each of the enemies fought in
  // that zone. The reason we store enemy data per-zone rather than in a global bestiary is
  // because every zone contains enemies of different stats. As an example, you'll see that the
  // ToughRats in Relic Ruins have much less attack than those found in the Kingdom of Darkness.
  //
  // Every enemy has three important pieces of information: the enemy's elements, its dropped
  // experience, and its attack stat. An enemy's attack stat can't simply be gotten at a glance
  // in-game; rather, it must be calculated using the `getAttackStat` function in battle-sim.js.
  // (See the end of that file for example usage.) Its experience can be found by looking at the
  // values of the experience bubble items picked up after beating the enemies in a battle's wave.
  // (This tends to require a fair amount of patience, since it can be hard to pick out single
  // experience bubbles in the cloud of items that drop at the end of a wave.)
  zoneData: {
    'GrdCros1': {
      waves: ['random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['ToughRat', 'ToughRat', 'AirHarpy'],
          ['ToughRat', 'ToughRat', 'ToughRat', 'ToughRat'],
          ['ToughRat', 'ToughRat', 'AirHarpy', 'AirHarpy'],
        ],
        'boss': [
          ['ToughRat', 'AirHarpy', 'Cockatrs']
        ]
      },
      enemies: {
        'ToughRat': ['earth', 6392, 210], // 5
        'AirHarpy': ['air', 6392, 234], // 5 234
        'Cockatrs': [['earth', 'air'], 12784, 779] // 10 779
      }
    },

    'Zephyr1': {
      waves: ['random', 'random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['FlotBear', 'FlotBear', 'MysGrmln', 'MysGrmln'],
          ['FlotBear', 'MysGrmln', 'FlotBear'],
          ['MysGrmln', 'MysGrmln', 'MysGrmln', 'MysGrmln']
        ],
        'boss': [
          ['MysSpirit', 'MysGrmln', 'LitCloud'],
          ['MysSpirit', 'MysGrmln', 'FlotBear', 'LitCloud'],
        ]
      },
      enemies: {
        // TODO: These stats are all wrong. (Still!)
        'FlotBear': ['air', 15895, 725],
        'MysGrmln': ['mystic', 14025, 621],
        'MysSpirit': ['mystic', 19916, 863],
        'LitCloud': ['air', 49791, 2601]
      }
    },

    'Zephyr2': {
      waves: ['random', 'random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['FlotBear', 'MysGrmln', 'MysGrmln', 'FlotBear'],
          ['MysSpirit', 'FlotBear', 'MysGrmln', 'MysGrmln'],
          ['MysGrmln', 'MysGrmln', 'MysGrmln', 'MysGrmln'],
          ['MysGrmln', 'MysGrmln', 'FlotBear', 'FlotBear', 'MysGrmln']
        ],
        'boss': [
          ['MysSpirit', 'FlotBear', 'MysGrmln', 'WndTurtl']
        ]
      },
      enemies: {
        'FlotBear': ['air', 18500, 766],
        'MysGrmln': ['mystic', 13320, 657],
        'MysSpirit': ['mystic', 18870, 912],
        'WndTurtl': ['mystic', 54000, 2430]
      }
    },

    // TODO: Go through the Writhing Cascades again, with less defense, to get
    // more accurate attack values.

    'Cascads1': {
      waves: ['random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['AirGhost', 'AirGhost', 'WtrMage'],
          ['AirGhost', 'WtrMage', 'AirGhost'],
          ['WtrMage', 'WtrMage'],
        ],
        'boss': [
          ['AirGhost', 'StormGod']
        ],
      },
      enemies: {
        'AirGhost': ['air', 4156, 179],
        'WtrMage': ['water', 5818, 179],
        'StormGod': [['air', 'water'], 9143, 596]
      }
    },

    'Cascads2': {
      waves: ['random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['WtrMage', 'AirGhost', 'AirGhost'],
          ['AirGhost', 'WtrMage', 'AirGhost'],
          ['AirGhost', 'AirGhost', 'FishMan'],
          ['FishMan', 'WtrMage']
        ],
        'boss': [
          ['AirGhost', 'WtrMage', 'StormGod']
        ]
      },
      enemies: {
        'AirGhost': ['air', 5554, 189],
        'WtrMage': ['water', 3702, 189],
        'FishMan': ['water', 3702, 226],
        'StormGod': ['air', 11108, 629]
      }
    },

    'Cascads3': {
      waves: ['random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['AirGhost', 'AirGhost', 'MysGhost', 'AirGhost'],
          ['AirGhost', 'WtrMage', 'FishMan'],
          ['WtrMage', 'WtrMage', 'MysGhost', 'WtrMage']
        ],
        'boss': [
          ['AirGhost', 'FishMan', 'WtrMage', 'MadSteam']
        ]
      },
      enemies: {
        'AirGhost': ['air', 5554, 211],
        'MysGhost': ['mystic', 5554, 211],
        'WtrMage': ['water', 7405, 211],
        'FishMan': ['water', 7405, 253],
        'MadSteam': [['fire', 'water'], 1108, 702]
      }
    },

    'Cascads4': {
      waves: ['random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['AirGhost', 'MysGhost', 'AirGhost'],
          ['MysGhost', 'AirGhost', 'MysGhost', 'AirGhost'],
          ['WtrMage', 'WtrMage', 'WtrMage']
        ],
        'boss': [
          ['FishMan', 'AirGhost', 'WtrMage', 'MadSteam']
        ]
      },
      enemies: {
        'AirGhost': ['air', 5554, 234],
        'MysGhost': ['mystic', 5554, 234],
        'WtrMage': ['water', 7405, 234],
        'FishMan': ['water', 7405, 280],
        'MadSteam': [['water', 'fire'], 12959, 779]
      }
    },

    'Cascads5': {
      waves: ['random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['MysGhost', 'MysGhost', 'FishMan'],
          ['AirGhost', 'FishMan', 'AirGhost', 'WtrMage'],
          ['AirGhost', 'AirGhost', 'MysGhost', 'MysGhost', 'AirGhost']
        ],
        'boss': [
          ['FishMan', 'AirGhost', 'FishMan', 'SeaSrpnt']
        ]
      },
      enemies: {
        'AirGhost': ['air', 5554, 258],
        'MysGhost': ['mystic', 5554, 258],
        'WtrMage': ['water', 9256, 258],
        'FishMan': ['water', 7405, 309],
        'SeaSrpnt': [['water', 'air'], 12959, 859]
      }
    },

    'Steppes1': {
      waves: ['random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['MudBeast', 'MudBeast', 'MudBeast'],
          ['MudBeast', 'MysDryad', 'MysDryad'],
        ],
        'boss': [
          ['MysDryad', 'MudBeast', 'Chimera']
        ]
      },
      enemies: {
        'MudBeast': ['earth', 8312, 296],
        'MysDryad': ['mystic', 8312, 296],
        'Chimera': [['earth', 'mystic'], 15239, 985] // 11 985
      }
    },

    'BlzTids1': {
      waves: ['random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['FyrBeast', 'FyrBeast', 'FyrBeast'],
          ['FyrBeast', 'MysGrmln', 'FyrBeast', 'FyrBeast'],
          ['FyrBeast', 'MysGrmln', 'MysGrmln']
        ],
        'boss': [
          ['MysGrmln', 'FyrBeast', 'Hydra']
        ]
      },
      enemies: {
        'FyrBeast': ['fire', 10000, 382],
        'MysGrmln': ['mystic', 8343, 327],
        'Hydra': [['fire', 'water'], 19000, 1212]
      }
    },

    'Citadel1': {
      waves: ['random', 'random', 'random', 'random', 'random', 'random', 'boss'],
      waveEntries: {
        'random': [
          ['FyrBeast', 'FyrBeast', 'FyrBeast'],
          ['MudBear', 'FyrBeast', 'FyrBeast', 'FyrBeast'],
          ['MudBear', 'MudBear', 'FyrBeast'], // 2634
        ],
        'boss': [
          ['RockFish', 'FyrBeast', 'SklClubr']
        ]
      },
      enemies: {
        'FyrBeast': ['fire', 20365, 830],
        'MudBear': ['earth', 16662, 791],
        'RockFish': ['earth', 17773, 800], // TODO: This is definitely not exactly right!
        'SklClubr': ['mystic', 36657, 2634]
      }
    },

    'DarKndm1': {
      waves: ['boss1', 'boss2', 'boss3'],
      waveEntries: {
        'boss1': [
          ['ToughRat', 'ToughRat', 'RockFish', 'TerBear', 'StonSnek']
        ],
        'boss2': [
          ['ArmrFish', 'Swashbuk', 'Swashbuk', 'WatrElem']
        ],
        'boss3': [
          ['TerStatu', 'WtrBeast', 'WtrBeast', 'WtrHawk', 'Assassin']
        ]
      },
      enemies: {
        'ToughRat': ['earth', 19500, 808], // 18
        'RockFish': ['earth', 19333, 1167],
        'TerBear': ['earth', 19333, 898],
        'StonSnek': ['earth', 33833, 2990],

        'ArmrFish': ['water', 20195, 1122],
        'Swashbuk': ['water', 19333, 898],
        'WatrElem': ['water', 37055, 2990],

        'TerStatu': ['earth', 17722, 1077],
        'WtrBeast': ['water', 19333, 942],
        'WtrHawk': ['water', 22555, 1077],
        'Assassin': [['mystic', 'earth'], 40277, 2990]

        // 1560 defense
      }
    }
  }
}
