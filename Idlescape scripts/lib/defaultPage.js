// * Default Page on Load
function openDefaultPage() {
  const setDefaultPage = [
    // ! change and comment out the default page
    'active skill',
    // 'Fighting',
    // 'Mining',
    // 'Foraging',
    // 'Fishing',
    // 'Smithing',
    // 'Farming',
    // 'Cooking',
    // 'Crafting',
    // 'Runecrafting',
    // 'Enchanting',
  ]
  var leftNav = document.querySelectorAll('.drawer-item-left')
  const idlingPage = 'Attack' // set idling page (no action)
  var defaultPage = ''

  if (setDefaultPage[0] != 'active skill') {
    // set selected skill as default
    defaultPage = setDefaultPage[0]
    console.log(defaultPage)
  } else if (setDefaultPage[0] == 'active skill') {
    // set action as default page
    let getAction = document
    .querySelectorAll('.status-action')[0]
    .innerText.match(/[A-z]+/)[0]
    switch (getAction) {
      case 'Fighting':
        defaultPage = 'Attack'
        break
      case 'Idling':
        defaultPage = idlingPage
        break
        default:
          defaultPage = getAction
    }

    // if (getAction == 'Fighting') defaultPage = 'Attack'
    // else if (getAction == 'Idling') defaultPage = idlingPage
    // else defaultPage = getAction

    // console.log(defaultPage)
  }
  
  // check default page w left nav. if hit, click
  for (let i = 0; i < leftNav.length; i++) {
    let sample = leftNav[i].textContent
    // console.log(sample)
    if (sample == defaultPage) {
      leftNav[i].click()
      console.log('default page loaded:', defaultPage)
    }
  }
}

openDefaultPage() // ! test