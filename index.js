'use strict'

const CRIT_MODIFIER = 1.5
const ELEMENTAL_MODIFIER = 1.5

const { zoneData, equips } = require('./data')
const { getBattleStats } = require('./battle-sim')

const heroDefense = 316
const heroHealth = 607

const joinArrays = (a, b) => a.concat(b)
const possibleKnights = equips.armor.map(armor => {
  const elementFilter = n => item => (armor[2] === 'starmetal' || item[n] === '*') ? true : armor[2].some(el => el === item[n])
  return equips.rings.filter(elementFilter(3)).map(ring => {
    return equips.amulets.filter(elementFilter(3)).map(amulet => {
      const health = heroHealth + ring[2] + amulet[2]
      const baseDef = heroDefense + armor[1] + ring[1] + amulet[1]
      if (armor[2] === 'starmetal') {
        return [{
          title: `${armor[0]} + ${ring[0]} + ${amulet[0]} (Any pet)`,
          defense: baseDef,
          health,
          elements: 'starmetal',
          armor, ring, amulet, pet: ['(--Any pet--)', 0, '(--Any element--)']
        }]
      } else {
        return equips.pets.filter(elementFilter(2)).map(pet => {
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
    const score = rate * knight.health

    return {knight, zoneName, zone, avgDamage, avgXP, rate, score}
  })
}).reduce(joinArrays, [])

entries.sort((a, b) => b.score - a.score)

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

for (let i = Math.min(2000, entries.length - 1); i >= 0; --i) {
  const { zoneName, rate, score, avgDamage, avgXP, knight } = entries[i]
  console.log(pad(round`{${score}} = ${knight.health} * ${rate} (${avgXP}/${avgDamage})`, 32) + `--  [${zoneName}] ${knight.title}`)
}

console.log('')

const displayedArmors = []
const displayedEntries = []
for (let i = 0; i < entries.length && displayedArmors.length < 3; i++) {
  const { knight: { armor } } = entries[i]

  if (displayedArmors.includes(armor)) {
    continue
  }

  displayedEntries.unshift(entries[i])
  displayedArmors.push(armor)
}

for (const { zoneName, knight, avgDamage, avgXP, rate, score } of displayedEntries) {
  console.log(round`[${zoneName}] ${knight.title}`)
  console.log(round`Experience per full health bar (${knight.health} HP): ${score}`)
  console.log(round`Average damage: ${avgDamage}`)
  console.log(round`Average XP: ${avgXP}`)
  console.log(round`XP/damage rate: ${rate} (Higher is better)`)
  console.log('')
}

console.log('Total entries:', entries.length)
console.log('Total possible knights:', possibleKnights.length)
