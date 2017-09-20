'use strict'

const { zoneData, baseHero, equips } = require('./data')
const {
  getPossibleKnights, bulkSimulateBattles,
  detailedShowResults, getTopNResults, getTopNResultsSeparateArmor,
  undetailedShowTopNResults
} = require('./bulk')

const knights = getPossibleKnights(baseHero, equips)

const results = bulkSimulateBattles({
  knights,
  zoneData
  // zoneData: {'Zephyr1': zoneData['Zephyr1']}
})

const sortByProperty = p => (a, b) => b[p] - a[p]
results.sort(sortByProperty('xpPerHealthBar'))
// results.sort(sortByProperty('survivableBattleCount'))

undetailedShowTopNResults(results, Infinity)
console.log('')
detailedShowResults(getTopNResultsSeparateArmor(results, 3))

console.log('Total simulation results:', results.length)
console.log('Total knight setups:', knights.length)
