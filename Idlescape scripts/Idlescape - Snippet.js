// ==UserScript==
// @name         Idlescape - Snippet
// @namespace    test
// @version      0.1
// @description  collections of snippets
// @author       snefrukai
// @match        *://*.idlescape.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idlescape.com
// @grant        none
// ==/UserScript==

;(function () {
  ;('use strict')

  // ========================================================================== //
  // * setDefaultPage
  // ========================================================================== //

  // Default Page on Load
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
    if (setDefaultPage != 'active skill') defaultPage = setDefaultPage
    else {
      // get action
      var foo = document.getElementsByClassName('status-action')[0].innerText
      var getAction = foo.match(/[A-z]+/)[0]
      if (getAction == 'Fighting') defaultPage = 'Attack'
      else if (getAction == 'Idling') defaultPage = idlingPage
      else defaultPage = getAction
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

  // ========================================================================== //
  // * shortcuts
  // ========================================================================== //

  // shortcuts() // ! test}

  function shortcuts(params) {
    // ========================================================================== //
    // close popups

    var popupSelector = '.MuiDialog-container'

    // when press 'Esc'
    document.onkeydown = function (e) {
      var closePopup = e.key === 'Escape' || e.key === 'Esc'
      if (closePopup) if (checkExist(popupSelector)) clickClose()
    }

    // when click outside of popup box
    document.querySelector('#root').onclick = function (e) {
      // only when popup is shown, only add click to popup
      if (checkExist(popupSelector)) {
        var popup = document.querySelectorAll(popupSelector)[0]
        popup.onclick = function (e) {
          // document.querySelector('#root').onclick = function (e) {
          var isClosest = e.target.closest('.MuiPaper-root') // popupBox
          if (!isClosest) clickClose()
        }
      }
    }

    function checkExist(selector) {
      var tar = document.querySelectorAll(selector)
      var isExist = tar.length !== 0
      // if (isExist) console.log(selector, 'exist') // ! test
      return isExist
    }

    function clickClose() {
      foo = '.close-dialog-button'
      if (checkExist(foo)) {
        document.querySelectorAll(foo)[0].click()
      }
    }
  }
  
  // ========================================================================== //
  // * footer
  // ========================================================================== //

  function onGameReady(callback) {
    const foo = 'play-area-container'
    // const foo = 'status-action'
    const gameContainer = document.getElementsByClassName(foo)
    // gameContainer.length
    if (gameContainer.length === 0) {
      setTimeout(function () {
        onGameReady(callback)
      }, 500)
    } else {
      callback()
    }
  }

  function init() {
    openDefaultPage(setDefaultPage[0])
    shortcuts()
  }

  onGameReady(function () {
    init()
  })
})()
