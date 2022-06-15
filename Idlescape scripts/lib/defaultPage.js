// * Default Page on Load

// openDefaultPage(setDefaultPage[0]) // ! test

var setDefaultPage = [
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

function openDefaultPage(setDefaultPage = 'active skill') {
  var leftNav = document.getElementsByClassName('drawer-item-left')
  // console.log(leftNav)

  var idlingPage = 'Attack' // set idling page (no action)
  var defaultPage = ''

  // get default page from setting
  if (setDefaultPage != 'active skill') {
    defaultPage = setDefaultPage
  } else {
    // get action
    var foo = document.getElementsByClassName('status-action')[0].innerText
    var getAction = foo.match(/[A-z]+/)[0]
    console.log(getAction)

    if (getAction == 'Fighting') {
      defaultPage = 'Attack'
    } else if (getAction == 'Idling') {
      defaultPage = idlingPage
    } else {
      defaultPage = getAction
    }

    // defaultPage =
    //   getAction == 'Fighting'
    //     ? 'Attack'
    //     : getAction == 'Idling'
    //     ? 'idle'
    // : getAction
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
