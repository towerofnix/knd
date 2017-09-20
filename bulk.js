// bulk.js - contains useful functions for simulating many battles

'use strict'

const { getBattleStats } = require('./battle-sim')

const joinArrays = (a, b) => a.concat(b)

function getPossibleKnights(knightBase, equipData) {
  return equipData.armor.map(armor => {
    const elementFilter = n => item => (armor[2] === 'starmetal' || item[n] === '*') ? true : armor[2].some(el => el === item[n])
    return equipData.rings.filter(elementFilter(3)).map(ring => {
      return equipData.amulets.filter(elementFilter(3)).map(amulet => {
        const health = knightBase.health + ring[2] + amulet[2]
        const baseDef = knightBase.defense + armor[1] + ring[1] + amulet[1]
        if (armor[2] === 'starmetal') {
          return [{
            title: `${armor[0]} + ${ring[0]} + ${amulet[0]} (Any pet)`,
            defense: baseDef,
            health,
            elements: 'starmetal',
            armor, ring, amulet, pet: ['(--Any pet--)', 0, '(--Any element--)']
          }]
        } else {
          return equipData.pets.filter(elementFilter(2)).map(pet => {
            return {
              title: `${armor[0]} + ${ring[0]} + ${amulet[0]} + ${pet[0]}`,
              defense: baseDef + pet[1],
              health,
              elements: armor[2],
              armor, ring, amulet, pet
            }
          })
        }
      }).reduce(joinArrays, [])
    }).reduce(joinArrays, [])
  }).reduce(joinArrays, [])
}

function bulkSimulateBattles({
  // The array of possible knights. Probably gotten through `getPossibleKnights`.
  knights,

  // The zone data. See data.js.
  zoneData,

  // The number of simulations to run for any given setup.
  sampleSimulationsPerSetup = 200
}) {
  // Note that the result is not sorted in any particular way.
  return knights.map(knight => {
    return Object.entries(zoneData).map(([ zoneName, zone ]) => {
      let totalDamage = 0, totalXP = 0
      for (let i = 0; i < sampleSimulationsPerSetup; i++) {
        const stats = getBattleStats(zone, knight)
        totalDamage += stats.damage
        totalXP += stats.xp
      }
      const avgDamage = totalDamage / sampleSimulationsPerSetup
      const avgXP = totalXP / sampleSimulationsPerSetup
      const xpRate = avgXP / avgDamage
      const xpPerHealthBar = xpRate * knight.health
      const survivableBattleCount = knight.health / avgDamage

      return {knight, zoneName, zone, avgDamage, avgXP, xpRate, xpPerHealthBar, survivableBattleCount}
    })
  }).reduce(joinArrays, [])
}

// Logging/result display utilities -----------------

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

const pad = (str, len) => str.length >= len ? str : pad(str + ' ', len)

function undetailedShowTopNResults(results, count) {
  for (let i = Math.min(count, results.length - 1); i >= 0; --i) {
    const { zoneName, xpRate, xpPerHealthBar, avgDamage, avgXP, knight } = results[i]
    console.log(
      pad(`(# ${i + 1}) `, results.length.toString().length + 6) +
      pad(round`{${xpPerHealthBar} XP} = ${knight.health} * ${xpRate} (${avgXP}/${avgDamage})`, 35)
      + `--  [${zoneName}] ${knight.title}`)
  }
}

function getTopNResults(results, count) {
  const displayedResults = []

  for (const result of results.slice(0, count)) {
    displayedResults.unshift(result)
  }

  return displayedResults
}

function getTopNResultsSeparateArmor(results, count) {
  const displayedArmors = []
  const displayedResults = []
  for (let i = 0; i < results.length && displayedArmors.length < 3; i++) {
    const { knight: { armor } } = results[i]

    if (displayedArmors.includes(armor)) {
      continue
    }

    displayedResults.unshift(results[i])
    displayedArmors.push(armor)
  }

  return displayedResults
}

function detailedShowResults(results) {
  for (const { zoneName, knight, avgDamage, avgXP, xpRate, xpPerHealthBar, survivableBattleCount } of results) {
    console.log(round`[${zoneName}] ${knight.title}`)
    console.log(round`Experience per full health bar (${knight.health} HP): ${xpPerHealthBar}`)
    console.log(round`Average damage: ${avgDamage}`)
    console.log(round`Average XP: ${avgXP}`)
    console.log(round`XP/damage rate: ${xpRate} (Higher is better)`)
    console.log(`Survivable battle count: ${Math.floor(survivableBattleCount)}`)
    console.log('')
  }
}

module.exports = {
  getPossibleKnights,
  bulkSimulateBattles,
  undetailedShowTopNResults,
  getTopNResultsSeparateArmor,
  getTopNResults,
  detailedShowResults
}
