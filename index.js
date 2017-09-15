// process.stdout.write('\x1b[1J\x1b[H')

const CRIT_MODIFIER = 1.5
const ELEMENTAL_MODIFIER = 1.5

const zoneData = {
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
  }
}

const elements = ['air', 'water', 'fire', 'mystic', 'earth']

const getAdvantageFactor = function(attackerElements, defenderElements) {
  const awesomes = []
  const atkEls = Array.isArray(attackerElements) ? attackerElements : [attackerElements]
  const defEls = Array.isArray(defenderElements) ? defenderElements : [defenderElements]
  for (const atkEl of atkEls) {
    if (elements.indexOf(atkEl) === -1) {
      continue
    }
    for (const defEl of defEls) {
      if (elements[(elements.indexOf(atkEl) + 1) % elements.length] === defEl) {
        awesomes.push(atkEl + ' -> ' + defEl)
      }
    }
  }
  const count = awesomes.length
  if (count === 0) {
    return 0.6
  } else if (count === 1) {
    return 1.0
  } else if (count === 2) {
    return 1.3
  } else {
    throw new Error('Bad advantage factor count: ' + count + ' ' + awesomes.join(', '))
  }
}

const getDamage = function(attackerLevel, attackerAttack, defenderDefense, attackerElements, defenderElements) {
  const advantageFactor = getAdvantageFactor(attackerElements, defenderElements)

  return (2.4 * attackerLevel) * attackerAttack / defenderDefense * advantageFactor
}

const getAttackStat = function(damageDealt, attackerLevel, defenderDefense, attackerElements, defenderElements) {
  const advantageFactor = getAdvantageFactor(attackerElements, defenderElements)

  return damageDealt / ((2.4 * attackerLevel) / defenderDefense * advantageFactor)
}

const getEnemyDamage = function(enemy, knight) {
  return getDamage(1, enemy[1], knight.defense, enemy[0], knight.elements)
}

const getBattleStats = function(zone, knight) {
  let damage = 0, xp = 0
  for (const waveCode of zone.waves) {
    const waveList = zone.waveEntries[waveCode]
    const wave = waveList[Math.floor(Math.random() * waveList.length)]
    for (const enemyCode of wave) {
      const enemy = zone.enemies[enemyCode]

      if (!enemy) {
        console.warn('Enemy entry does not exist:', enemyCode)
        continue
      }

      damage += getEnemyDamage(enemy, knight)
      xp += enemy[2]
    }
  }
  return {damage, xp}
}

// ---------------------------------------

const heroDefense = 589

const equips = {
  armor: [
    ['Prehistoric Huntsguard', 1436, ['earth', 'air']],
    ['Siegemage Robes', 1543, ['mystic', 'water']],
    ['Darkscale Battlegear', 1143, ['mystic', 'fire']],
    ['Overgrown Lifeplate', 1382, ['mystic', 'earth']],
  ],
  rings: [
    ['Cupid\'s Love', 267, 'earth'],
    ['Stinging Stone of Endurance', 141, 'air'],
    ['Holy Petal of Shelter', 159, 'water'],
    ['Sturdy Loop', 66, 'mystic'],
    ['Stinging Sheath of Endurance', 126, 'fire']
  ],
  amulets: [
    ['Choker of Iron', 170, 'air'],
    ['Sturdy Pendant of Skill', 52, 'earth'],
    ['Prism of Endurance', 95, 'mystic'],
    ['Necklace of Shelter', 153, 'fire'],
  ],
  pets: [
    ['Mudfur', 313, 'earth'],
    ['Dreadhorn', 192, 'mystic'],
    ['Puffwyrm', 232, 'air'],
    ['Pyrebrush', 76, 'fire'],
    ['Rivergill', 102, 'water'],
  ]
}

const joinArrays = (a, b) => a.concat(b)
const possibleKnights = equips.armor.map(armor => {
  const elementFilter = item => armor[2].some(el => el === item[2])
  return equips.rings.filter(elementFilter).map(ring => {
    return equips.amulets.filter(elementFilter).map(amulet => {
      return equips.pets.filter(elementFilter).map(pet => {
        return {
          title: `${armor[0]} + ${ring[0]} + ${amulet[0]} + ${pet[0]}`,
          defense: armor[1] + ring[1] + amulet[1] + pet[1] + heroDefense,
          elements: armor[2]
        }
      })
    }).reduce(joinArrays, [])
  }).reduce(joinArrays, [])
}).reduce(joinArrays, [])

const entries = possibleKnights.map(knight => {
  return Object.entries(zoneData).map(([ zoneName, zone ]) => {
    const samples = 500
    let totalDamage = 0, totalXP = 0
    for (let i = 0; i < samples; i++) {
      const stats = getBattleStats(zone, knight)
      totalDamage += stats.damage
      totalXP += stats.xp
    }
    const avgDamage = totalDamage / samples
    const avgXP = totalXP / samples
    const rate = avgXP / avgDamage

    return {knight, zoneName, zone, avgDamage, avgXP, rate}
  })
}).reduce((a, b) => a.concat(b), [])

entries.sort((a, b) => b.rate - a.rate)

const map = fn => (strings, ...expressions) => {
  const result = [strings[0]]
  expressions.forEach((expr, i) => {
    result.push(fn(expr), strings[i + 1])
  })
  return result.join('')
}

const round = map(arg => {
  if (typeof arg === 'number') {
    return Math.round(arg)
  } else {
    return arg
  }
})

for (let i = entries.length - 1; i >= 0; --i) {
  const { zoneName, rate, avgDamage, avgXP, knight } = entries[i]
  console.log(round`${rate} (${avgXP}/${avgDamage}) \t-- [${zoneName}] ${knight.title}`)
}

console.log('')

for (let i = 2; i >= 0; --i) {
  const { zoneName, knight, avgDamage, avgXP, rate } = entries[i]
  console.log(round`[${zoneName}] ${knight.title}`)
  console.log(round`Average damage: ${avgDamage}`)
  console.log(round`Average XP: ${avgXP}`)
  console.log(round`XP/damage rate: ${rate} (Higher is better)`)
  console.log('')
}

console.log('-------------------------------------------')

console.log('Attack stat:', getAttackStat(33, 1, 2666, ['mystic'], ['earth', 'air']))
//console.log('damage:', getDamage(1, 18240, 2388, ['earth'], ['mystic', 'earth']))

