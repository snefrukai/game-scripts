function lockSkill(skill) {
  skillsUnlocked[skill] = false // main func
  forceStopSkill(skill)
  if (
    PAGES[currentPage].skillID !== undefined &&
    PAGES[currentPage].skillID === skill
  )
    changePage(Pages.Bank)
  if (defaultPageOnLoad === skill) changeSetting(2, Pages.Bank, false, false)
  updateSkillWindow(skill) // update ui
  updateSkillLevelCap()
  SwalLocale.fire({
    icon: 'success',
    title: 'Skill Locked!',
    html: `<span class='text-dark'>You can no longer use ${SKILLS[skill].name}. I hope you made the right choice!<br><br>Active passive bonuses from this Skill will still be active.</span>`,
  })
}

function attemptToLockSkill(skill) {
  SwalLocale.fire({
    icon: 'warning',
    title: `Lock ${SKILLS[skill].name}?`,
    html: `<h5 class='text-danger font-w700 mb-2'>This decision is final!</h5><h5 class='text-danger font-w700 mb-2'>${SKILLS[skill].name} will be permanently disabled.</span>`,
    showCancelButton: true,
    confirmButtonText: getLangString('MENU_TEXT', 'CONFIRM'),
  }).then((result) => {
    if (result.value) {
      lockSkill(skill)
    }
  })
}

function unlockSkill(skill) {
  if (!tutorialComplete || !GAMEMODES[currentGamemode].isAdventure) {
    skillsUnlocked[skill] = true
    updateSkillWindow(skill)
  } else if (gp >= getPriceToUnlockSkill()) {
    updateGP(-getPriceToUnlockSkill())
    skillsUnlocked[skill] = true
    updateSkillWindow(skill)
    SwalLocale.fire({
      icon: 'success',
      title: getLangString('MENU_TEXT', 'SKILL_UNLOCKED'),
      html: `<span class='text-dark'>${getLangString(
        'MENU_TEXT',
        'YOU_MAY_USE_SKILL'
      )}</span>`,
    })
    let count = 0
    for (let i = 0; i < skillsUnlocked.length; i++) {
      if (skillsUnlocked[i]) count++
    }
    count -= 4
    sendPlayFabEvent('adv_skill_unlocked', {
      skillID: skill,
      unlockOrder: count,
    })
    if (skill === Skills.Astrology) game.astrology.onSkillUnlock()
  }
}

// ========================================================================== //
//

// Items['Diamond_Luck_Potion_IV'] 636
usePotion(636)
function usePotion(itemID, isOffline = false, potionSelection = false) {
  const bankID = getBankId(itemID)
  if (bankID >= 0) {
    updateHerbloreBonuses(itemID, 0, true, isOffline)
    updateItemInBank(bankID, itemID, -1, false, isOffline)
  }
  if (potionSelection) loadPotions()
}

function loadPotions() {
  createPotionSelect()
  if (SETTINGS.general.autoReusePotion.includes(currentPage))
    $('.settings-toggle-43').prop('checked', true)
  else $('.settings-toggle-43').prop('checked', false)
}

// ========================================================================== //
//
