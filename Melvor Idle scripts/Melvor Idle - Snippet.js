// ==UserScript==
// @name         Melvor Idle - Snippet
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       snefrukai
// @match                 *://melvoridle.com/*
// @match                 *://www.melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// // @require      https://raw.githubusercontent.com/snefrukai/game-scripts/main/Melvor%20Idle%20scripts/src/equipmentSwap.js
// @grant        none
// ==/UserScript==

// * upgrade selected item by item ID at set interval
window.upgradeItem_repeat = function (itemID, fn, count, minute) {
  function upgradedItemID(itemID) {
    return items[itemID].trimmedItemID
  }

  // function upgrade(itemID, qty) {
  //   confirmUpgradeItem(itemID, upgradedItemID(itemID), qty)
  // }

  // ! func name 'upgradeItemAll' could cause freeze in tampermonkley
  function upgradeAll(itemID) {
    for (let k = 0; k < itemID.length; k++) {
      confirmUpgradeItemAll(itemID[k], upgradedItemID(itemID[k]))
      console.log('upgrading item ID', itemID[k])
    }
  }

  function repeat(itemID, fn = upgradeAll, count = 10000, minute = 5) {
    let i = 0
    function recur() {
      fn(itemID)
      i += 1
      console.log('upgraded', i, 'times')
      setTimeout(function () {
        if (i < count) {
          recur()
        }
      }, 1000 * 60 * minute)
    }
    recur()
  }

  repeat(
    (itemID = [
      768, // air shard
      769, // water ...
      770, // earth ...
      771, // fire ...
      // 890, // mys stone
      // 886, // mys stone charge
    ])
  )
}

// * hide no gathering account's skills
window.checkNoGathering = function () {
  var noGatheringSkills = [
    0, // woodcutting
    1, // mining
    2, // firemaking
    4, // fishing
    10, // thiving
    20, // agility
    22, // astrology
  ]

  if (username && username.includes('NG')) {
    console.log('Detected "No Gathering".')

    noGatheringSkills.forEach((skill) => {
      $('#nav-skill-tooltip-' + skill.toString()).remove()

      // in-game func
      if (skillsUnlocked[skill] != false) {
        skillsUnlocked[skill] = false
        forceStopSkill(skill)
        if (
          PAGES[currentPage].skillID !== undefined &&
          PAGES[currentPage].skillID === skill
        )
          changePage(Pages.Bank)
        if (defaultPageOnLoad === skill)
          changeSetting(2, Pages.Bank, false, false)
        updateSkillWindow(skill) // update ui
        updateSkillLevelCap()
      }
    })

    console.log('"No Gathering" skills locked and hidden.')
  }
}

// * eat to full hp
window.autoEatToFull_repeat = function (sec = 1) {
  let hp = {
    current: 0,
    max: 1,
    food: 0,
  }
  let hpSelector = {
    current: '#combat-player-hitpoints-current',
    max: '#combat-player-hitpoints-max',
  }
  var activeFoodSelector = '#combat-food-container .text-combat-smoke'

  function autoEatToFull(params) {
    var hpSelectorArr = Object.entries(hpSelector)
    for (let i = 0; i < hpSelectorArr.length; i++) {
      let str = $(hpSelectorArr[i][1])[0].textContent
      hp[hpSelectorArr[i][0]] = getInt(str)
      // console.log(str)
    }

    var foodSrc = $(activeFoodSelector)[0].childNodes[1]['src']
    var foodName = foodSrc.match(/\w+\.\w+$/g)[0] // match return array
    hp['food'] = getInt($(activeFoodSelector)[0].childNodes[2].textContent)
    // console.log(foodName)

    var hpLoss = hp['max'] - hp['current']
    var eatFoodAmount = Math.floor(hpLoss / hp['food'])
    if (hpLoss > 0) {
      for (let i = 0; i < eatFoodAmount; i++) {
        $('#combat-footer-minibar-eat-btn').click()
      }
      console.log('hp loss:', hpLoss, ', ate *', eatFoodAmount, foodName)
    } else {
      console.log('hp full')
    }
  }

  function getInt(str) {
    var numb = Number(str.replace(/\D+/g, ''))
    return numb
  }

  function repeat(fn = autoEatToFull, count = 60 * 24, sec = 10) {
    let i = 0
    function recur() {
      fn()
      i += 1
      console.log('auto eat', i, 'times, next check in', sec, 'sec')
      setTimeout(function () {
        if (i < count) {
          recur()
        }
      }, 1000 * sec)
    }
    recur()
  }
  repeat(autoEatToFull, (count = (3600 / sec) * 24 * 10), (sec = sec))
}

// * add mastery pool xp to skill after overnight
window.addPoolXPForCount = function (skillID, count, sec = 30) {
  var i = 0
  var checkPool = setInterval(() => {
    checkPoint = parseFloat(
      document.querySelector('.mastery-pool-xp-progress-15').textContent
    )
    // if (checkPoint < 95.5) {
    addMasteryXPToPool(skillID, 4046897, false, true)
    i = i + 1
    console.log('add pool xp:', Skills[skillID], i, 'times')
    if (i == count) {
      clearInterval(checkPool)
      console.log('add pool xp: finished')
    }
    // }
  }, 1000 * sec)
}

// * start skill (folked from Action Queue)
// call
// start: setAction(actionCategory, actionName, skillItem, skillItem2, qty)
// result = action.start()

window.setSkillAction = function (actionName, skillItem1, skillItem2) {
  const itemID = items.findIndex((a) => a.name == skillItem1)
  let actionID = 0
  switch (actionName) {
    case 'Agility':
      return () => {
        if (game.activeSkill !== globalThis.ActiveSkills.Agility)
          game.agility.start()
        return true
      }
    case 'Astrology': {
      const constellation = Astrology.constellations.find(
        (a) => a.name == skillItem1
      ) // Find constellation
      return () => {
        if (skillLevel[CONSTANTS.skill.Astrology] < constellation.level)
          return false
        if (
          game.astrology.activeConstellation.id != constellation.id ||
          game.activeSkill != globalThis.ActiveSkills.ASTROLOGY
        )
          game.astrology.studyConstellationOnClick(constellation)
        return true
      }
    }
    case 'Cooking': {
      const itemID = items.findIndex((a) => a.name == skillItem2)
      const recipe = Cooking.recipes.find((a) => a.itemID == itemID)
      const category = recipe.category
      if (skillItem1 == 'Active') {
        return () => {
          const passives = []
          ;[0, 1, 2].forEach((c) => {
            game.cooking.onCollectStockpileClick(c)
            if (c != category && game.cooking.passiveCookTimers.has(c))
              passives.push(c)
          })
          if (skillLevel[CONSTANTS.skill.Cooking] < recipe.cookingLevel)
            return false
          if (game.cooking.selectedRecipes.get(category).itemID != itemID)
            game.cooking.onRecipeSelectionClick(recipe)
          if (
            game.activeSkill == globalThis.ActiveSkills.COOKING &&
            game.cooking.activeCookingCategory == category
          )
            return true
          game.cooking.onActiveCookButtonClick(category)
          passives.forEach((a) => game.cooking.onPassiveCookButtonClick(a))
          return true
        }
      } else {
        return () => {
          ;[0, 1, 2].forEach((category) =>
            game.cooking.onCollectStockpileClick(category)
          )
          if (
            skillLevel[CONSTANTS.skill.Cooking] <
            Cooking.recipes.find((a) => a.itemID == itemID).level
          )
            return false
          if (game.cooking.selectedRecipes.get(category).itemID != itemID)
            game.cooking.onRecipeSelectionClick(recipe)
          if (game.cooking.passiveCookTimers.has(category)) return true
          game.cooking.onPassiveCookButtonClick(category)
          return true
        }
      }
    }
    case 'Crafting':
      actionID = Crafting.recipes.find((a) => a.itemID == itemID).masteryID
      return () => {
        if (
          skillLevel[CONSTANTS.skill.Crafting] <
          Crafting.recipes[actionID].level
        )
          return false
        if (game.crafting.selectedRecipeID !== actionID)
          game.crafting.selectRecipeOnClick(actionID)
        if (game.activeSkill !== globalThis.ActiveSkills.CRAFTING)
          game.crafting.start(true)
        return true
      }
    case 'Firemaking':
      actionID = Firemaking.recipes.findIndex((x) => x.logID == itemID)
      return () => {
        if (
          skillLevel[CONSTANTS.skill.Firemaking] <
          Firemaking.recipes[actionID].levelRequired
        )
          return false
        if (
          !game.firemaking.activeRecipe ||
          game.firemaking.activeRecipe.logID !== actionID
        )
          game.firemaking.selectLog(actionID)
        if (!game.firemaking.isActive) game.firemaking.burnLog()
        return true
      }
    case 'Fishing': {
      const fish = Fishing.data.find((a) => a.itemID == itemID)
      const area = Fishing.areas.find((a) => a.fish.includes(fish))
      return () => {
        if (
          (!player.equipment.slotArray
            .map((a) => a.item.id)
            .includes(CONSTANTS.item.Barbarian_Gloves) &&
            area.id == 6) ||
          (!game.fishing.secretAreaUnlocked && area.id == 7) ||
          skillLevel[CONSTANTS.skill.Fishing] < fish.level
        )
          return false
        game.fishing.onAreaFishSelection(area, fish)
        if (
          game.activeSkill !== globalThis.ActiveSkills.FISHING ||
          game.fishing.activeFishingArea != area
        ) {
          game.fishing.onAreaStartButtonClick(area)
        }
        return true
      }
    }
    case 'Fletching':
      actionID = Fletching.recipes.find((a) => a.itemID == itemID).masteryID
      const log = items.findIndex((a) => a.name == skillItem2)
      if (skillItem1 != 'Arrow Shafts') {
        return () => {
          if (
            skillLevel[CONSTANTS.skill.Fletching] <
            Fletching.recipes[actionID].level
          )
            return false
          if (game.fletching.selectedRecipeID !== actionID)
            game.fletching.selectRecipeOnClick(actionID)
          if (game.activeSkill !== globalThis.ActiveSkills.FLETCHING)
            game.fletching.start()
          return true
        }
      }
      return () => {
        if (
          skillLevel[CONSTANTS.skill.Fletching] <
            Fletching.recipes[actionID].level ||
          !checkBankForItem(log)
        )
          return false
        if (
          game.fletching.selectedAltRecipe != log ||
          selectedFletch !== actionID
        )
          game.fletching.selectAltRecipeOnClick(log)
        if (game.activeSkill !== globalThis.ActiveSkills.FLETCHING)
          game.fletching.start()
        return true
      }
    case 'Herblore':
      actionID = Herblore.potions.findIndex((a) => a.name == skillItem1)
      return () => {
        if (
          skillLevel[CONSTANTS.skill.Herblore] <
          Herblore.potions[actionID].level
        )
          return false
        if (game.herblore.selectedRecipeID !== actionID)
          game.herblore.selectRecipeOnClick(actionID)
        if (!game.herblore.isActive) game.herblore.start()
        return true
      }
    case 'Mining':
      actionID = Mining.rockData.findIndex((a) => a.name == skillItem1)
      // game.mining.onRockClick(actionID)

      return () => {
        if (
          (actionID === 9 && !game.mining.canMineDragonite) ||
          skillLevel[CONSTANTS.skill.Mining] <
            Mining.rockData[actionID].levelRequired
        )
          return false
        if (!game.mining.isActive || game.mining.selectedRockId != actionID)
          game.mining.onRockClick(actionID)
        return true
      }
    case 'Magic': {
      actionID = AltMagic.spells.findIndex((a) => a.name == skillItem1)
      const magicItem = items.findIndex((a) => a.name == skillItem2)
      return () => {
        if (skillLevel[CONSTANTS.skill.Magic] < AltMagic.spells[actionID].level)
          return false
        if (game.altMagic.selectedSpellID !== actionID)
          game.altMagic.selectSpellOnClick(actionID)
        switch (AltMagic.spells[actionID].consumes) {
          case 3:
          case 2:
            const bar = Smithing.recipes.find((a) => a.itemID == magicItem)
            if (skillLevel[CONSTANTS.skill.Smithing] < bar.level) return false
            if (game.altMagic.selectedSmithingRecipe != bar)
              game.altMagic.selectBarOnClick(bar)
            break
          case 1:
          case 0:
            if (game.altMagic.selectedConversionItem != magicItem)
              game.altMagic.selectItemOnClick(magicItem)
            break
        }
        if (!game.altMagic.isActive) game.altMagic.start()
        return true
      }
    }
    case 'Runecrafting':
      actionID = Runecrafting.recipes.findIndex((a) => a.itemID == itemID)
      return () => {
        if (
          skillLevel[CONSTANTS.skill.Runecrafting] <
          Runecrafting.recipes[actionID].level
        )
          return false
        if (game.runecrafting.selectedRecipeID !== actionID)
          game.runecrafting.selectRecipeOnClick(actionID)
        if (game.activeSkill !== globalThis.ActiveSkills.RUNECRAFTING)
          game.runecrafting.start(true)
        return true
      }
    case 'Smithing':
      actionID = Smithing.recipes.findIndex((a) => a.itemID == itemID)
      return () => {
        if (
          skillLevel[CONSTANTS.skill.Smithing] <
          Smithing.recipes[actionID].level
        )
          return false
        if (game.smithing.selectedRecipeID !== actionID)
          game.smithing.selectRecipeOnClick(actionID)
        if (!game.smithing.isActive) game.smithing.start()
        return true
      }
    case 'Summoning': {
      const summonID = Summoning.marks.findIndex((a) => a.itemID == itemID)
      let recipeID = 0
      if (options.actions['Start Skill']['Summoning'][skillItem1] != null) {
        const ingredientID = items.findIndex((a) => a.name == skillItem2)
        recipeID = Summoning.marks[summonID].nonShardItemCosts.findIndex(
          (a) => a == ingredientID
        )
      }
      return () => {
        //exit if low level
        if (
          skillLevel[CONSTANTS.skill.Summoning] <
          Summoning.marks[summonID].level
        )
          return false
        //if summon is not selected, choose it
        if (
          game.summoning.selectedRecipeID != summonID ||
          game.summoning.selectedAltRecipe != recipeID
        ) {
          game.summoning.selectRecipeOnClick(summonID)
          game.summoning.selectAltRecipeOnClick(recipeID)
        }
        if (game.activeSkill !== globalThis.ActiveSkills.SUMMONING)
          game.summoning.start()
        return game.activeSkill === globalThis.ActiveSkills.SUMMONING
      }
    }
    case 'Thieving': {
      const npc = Thieving.npcs.find((a) => a.name == skillItem1)
      const area = Thieving.areas.find((a) => a.npcs.includes(npc.id))
      const panel = thievingMenu.areaPanels.find((a) => a.area == area)
      return () => {
        if (skillLevel[CONSTANTS.skill.Thieving] < npc.level) return false
        if (
          game.activeSkill == globalThis.ActiveSkills.THIEVING &&
          game.thieving.currentNPC == npc
        )
          return true
        thievingMenu.selectNPCInPanel(npc, panel)
        game.thieving.startThieving(area, npc)
        return true
      }
    }
    case 'Woodcutting':
      actionID = [itemID, items.findIndex((a) => a.name == skillItem2)].slice(
        0,
        playerModifiers.increasedTreeCutLimit + 1
      )
      return () => {
        let result = true
        let currentTrees = []
        game.woodcutting.activeTrees.forEach((a) => currentTrees.push(a.id))
        currentTrees.forEach((tree) => {
          if (actionID.includes(tree)) {
            actionID.splice(
              actionID.findIndex((a) => a == tree),
              1
            )
          } else {
            actionID.unshift(tree)
          }
        })

        actionID.forEach((i) => {
          if (
            skillLevel[CONSTANTS.skill.Woodcutting] >=
            Woodcutting.trees[i].levelRequired
          ) {
            game.woodcutting.selectTree(Woodcutting.trees[i])
          } else {
            result = false
          }
        })
        return result
      }
  }
}

// ========================================================================== //
// * footer
;(function () {
  function loadScript() {
    // Load script after the actual Melvor game has loaded
    if (typeof isLoaded !== typeof undefined && isLoaded) {
      clearInterval(scriptLoader)

      // autoEquipmentSwap()
      checkNoGathering()
      addPoolXPForCount()
      setSkillAction()

      const scriptElem = document.createElement('script')
      scriptElem.textContent = `try {(${startSnippets})();} catch (e) {console.log(e);}`
      document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem)
    }
  }

  const scriptLoader = setInterval(loadScript, 250)
})()
