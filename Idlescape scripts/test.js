// ========================================================================== //
// * check action
// ========================================================================== //

$('.status-action').childNodes
$('.status-action').childNodes[0].innerHTML // Fighting
$('.status-action').childNodes[0].textContent // Fighting

// ========================================================================== //
// * click page
// ========================================================================== //

leftNavSrc = '.drawer-item.active.noselect .drawer-item-left .drawer-item-icon'

foo = leftNavSrc + '[src="/images/runecrafting/RuneCraftingIcon.png"]'
$(foo) // works
$(foo).click() // works

foo = leftNavSrc + '[src="/images/cooking/cooking_icon.png"'
$$(foo) // works
$(foo).click() // works

// * help

function contains(selector, text) {
  var elements = document.querySelectorAll(selector)
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent)
  })
}
foo = '.drawer-item.active.noselect'
contains(foo, 'Mining')

// ! creat shortcut map
shortcut = []
leftNav = $$('.drawer-item.active.noselect')

function getIndex(params) {
  // get all left nav
  // leftNav[5].childNodes[0].textContent
  // leftNav[5].click()

  // get index of shortcut in left nav

  for (let i = 0; i < leftNav.length; i++) {
    const shortcutList = [
      'Mining', //
      'Cooking',
    ]
    const sample = leftNav[i].childNodes[0].textContent
    if (shortcutList.includes(sample)) {
      shortcut[sample] = i // cant use shortcutMap.i
      // shortcutMap.push(text)
      console.log(i)
    }
  }

  console.log(shortcut)
}
getIndex()
foo = 'Mining'
foo = 'Cooking'
leftNav[shortcut[foo]].click()

// ========================================================================== //
// * check monster
// ========================================================================== //

foo = document.getElementsByClassName('Corrupted Tree ')
foo = document.getElementsByClassName('Infected Naga ')
if (foo.length > 0) {
  $$('.combat-bar-button')[4].click()
}

// ========================================================================== //
// * test
// ========================================================================== //

function marketplace() {
  //let foo = "Buy"
  //return document.getElementsByClassName("marketplace-back-button")[0].textContent.includes(foo);
  //document.getElementsByClassName("marketplace-back-button")[0].textContent="test1"

  const btn = document.getElementsByClassName('marketplace-back-button')[0]
  btn.addEventListener('click', function (event) {
    console.log('Button Clicked')
  })
}

// ========================================================================== //
// ! bugs
// ========================================================================== //

// ! $ not working in combat monster class
foo = $('.Infected Naga ')

// var foo = document.getElementsByClassName('Infected Naga ')
foo = document.getElementsByClassName('Corrupted Tree ')

console.log(document.querySelector('.Corrupted Tree '))
console.log(foo.length)
