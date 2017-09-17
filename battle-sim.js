'use strict'

const elements = ['air', 'water', 'fire', 'mystic', 'earth']

function getAdvantageFactor(attackerElements, defenderElements) {
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

function getDamage(attackerLevel, attackerAttack, defenderDefense, attackerElements, defenderElements) {
  const advantageFactor = getAdvantageFactor(attackerElements, defenderElements)

  return (2.4 * attackerLevel) * attackerAttack / defenderDefense * advantageFactor
}

function getAttackStat(damageDealt, attackerLevel, defenderDefense, attackerElements, defenderElements) {
  const advantageFactor = getAdvantageFactor(attackerElements, defenderElements)

  return damageDealt / ((2.4 * attackerLevel) / defenderDefense * advantageFactor)
}

function getEnemyDamage(enemy, knight) {
  return getDamage(1, enemy[1], knight.defense, enemy[0], knight.elements)
}

function getBattleStats(zone, knight) {
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

module.exports = {
  getAdvantageFactor,
  getDamage,
  getAttackStat,
  getEnemyDamage,
  getBattleStats
}

if (require.main === module) {
  process.stdout.write('\x1b[1J\x1b[H')
  console.log('Attack stat:', getAttackStat(18, 1, 1560, ['earth'], ['mystic', 'fire']))
}
