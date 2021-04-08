import './style.css'

class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      keysContainer: null,
      keys: [],
    }

    this.evHandlers = {
      oninput: null,
      onclose: null,
    }

    this.properties = {
      value: '',
      capsLock: false,
      language: 'en',
    }
  }

  init() {
    this.elements.main = document.createElement('div')
    this.elements.keysContainer = document.createElement('div')

    this.elements.main.classList.add('keyboard', 'keyboard--hidden')
    this.elements.keysContainer.classList.add('keyboard__keys')
    this.elements.keysContainer.appendChild(
      this.addKeys(this.properties.language)
    )

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key'
    )

    this.elements.main.appendChild(this.elements.keysContainer)
    document.body.appendChild(this.elements.main)

    document.querySelectorAll('.use-keyboard').forEach((el) => {
      el.addEventListener('focus', () => {
        this.open(el.value, (currentValue) => {
          el.value = currentValue
        })
      })
    })
  }

  addKeys(language) {
    const fragment = document.createDocumentFragment()
    let keyLayout
    if (language === 'en') {
      keyLayout = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0',
        'backspace',
        'q',
        'w',
        'e',
        'r',
        't',
        'y',
        'u',
        'i',
        'o',
        'p',
        'caps',
        'a',
        's',
        'd',
        'f',
        'g',
        'h',
        'j',
        'k',
        'l',
        'enter',
        'done',
        'z',
        'x',
        'c',
        'v',
        'b',
        'n',
        'm',
        ',',
        '.',
        '?',
        'language',
        'space',
      ]
    }

    if (language === 'ru') {
      keyLayout = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0',
        'backspace',
        'й',
        'ц',
        'у',
        'к',
        'е',
        'н',
        'г',
        'ш',
        'щ',
        'з',
        'х',
        'ъ',
        'caps',
        'ф',
        'ы',
        'в',
        'а',
        'п',
        'р',
        'о',
        'л',
        'д',
        'ж',
        'э',
        'enter',
        'done',
        'я',
        'ч',
        'с',
        'м',
        'и',
        'т',
        'ь',
        'б',
        'ю',
        ',',
        '.',
        '?',
        'language',
        'space',
      ]
    }

    const createHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`
    }

    keyLayout.forEach((k) => {
      const keyElement = document.createElement('button')
      let insertLineBreak
      if (language === 'en') {
        insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(k) !== -1
      }
      if (language === 'ru') {
        insertLineBreak = ['backspace', 'ъ', 'enter', '?'].indexOf(k) !== -1
      }

      keyElement.setAttribute('type', 'button')
      keyElement.classList.add('keyboard__key')

      switch (k) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide')
          keyElement.innerHTML = createHTML('backspace')

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            )

            this.switchEvent('oninput')
          })

          break

        case 'caps':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activetab'
          )
          keyElement.innerHTML = createHTML('keyboard_capslock')

          keyElement.addEventListener('click', () => {
            this.switchCapsLock()
            keyElement.classList.toggle(
              'keyboard__key--active',
              this.properties.capsLock
            )
          })

          break

        case 'enter':
          keyElement.classList.add('keyboard__key--wide')
          keyElement.innerHTML = createHTML('keyboard_return')

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n'
            this.switchEvent('oninput')
          })

          break

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide')
          keyElement.innerHTML = createHTML('space_bar')

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n'
            this.switchEvent('oninput')
          })

          break

        case 'language':
          keyElement.innerHTML = createHTML('subtitles')
          keyElement.addEventListener('click', () => {
            this.switchLanguage()
            this.switchEvent('oninput')
          })

          break

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark')
          keyElement.innerHTML = createHTML('check_circle')

          keyElement.addEventListener('click', () => {
            this.close()
            this.switchEvent('onclose')
          })

          break

        default:
          keyElement.textContent = k.toLowerCase()

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock
              ? k.toUpperCase()
              : k.toLowerCase()
            this.switchEvent('oninput')
          })

          break
      }

      fragment.appendChild(keyElement)

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'))
      }
    })

    return fragment
  }

  switchEvent(handler) {
    if (typeof this.evHandlers[handler] == 'function') {
      this.evHandlers[handler](this.properties.value)
    }
  }

  switchCapsLock() {
    this.properties.capsLock = !this.properties.capsLock

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase()
      }
    }
  }

  switchLanguage() {
    if (this.properties.language === 'en') {
      this.updateKeys('ru')
    } else if (this.properties.language === 'ru') {
      this.updateKeys('en')
    }
  }

  open(value, oninput, onclose) {
    this.properties.value = value || ''
    this.evHandlers.oninput = oninput
    this.evHandlers.onclose = onclose
    this.elements.main.classList.remove('keyboard--hidden')
  }

  close() {
    this.properties.value = ''
    this.evHandlers.oninput = oninput
    this.evHandlers.onclose = onclose
    this.elements.main.classList.add('keyboard--hidden')
  }

  updateKeys(lan) {
    this.properties.language = lan
    this.elements.keysContainer.innerHTML = ''
    this.elements.keysContainer.appendChild(this.addKeys(lan))
    this.elements.keys = []
    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key'
    )
  }
}

window.addEventListener('DOMContentLoaded', function () {
  const keyboard = new Keyboard()
  keyboard.init()
})
