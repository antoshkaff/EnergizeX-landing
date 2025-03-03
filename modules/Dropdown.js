export default class Dropdown {
    selectors = {
        dropdownElement: '[data-js-dropdown]',
        dropdownButton: '[data-js-dropdown-button]',
        dropdownList: '[data-js-dropdown-list]'
    }

    dropdownStates = {
        buttonOpen: 'dropdown--open',
        listOpen: 'dropdown__list--open'
    }

    cachedElements = new Map()

    constructor() {
        this.bindEvents()
    }

    getDropdownElements(elementForSearch) {
        const dropdownElement = elementForSearch.closest(this.selectors.dropdownElement)

        if(!this.cachedElements.has(dropdownElement)) {
            const dropdownButton = dropdownElement.querySelector(this.selectors.dropdownButton)
            const dropdownList = dropdownElement.querySelector(this.selectors.dropdownList)

            this.cachedElements.set(dropdownElement, {
                dropdownElement,
                dropdownButton,
                dropdownList
            })
        }

        return this.cachedElements.get(dropdownElement)
    }

    closeAllDropElements() {

        this.cachedElements.forEach(({ dropdownButton, dropdownList}) => {
            dropdownButton.classList.remove(this.dropdownStates.buttonOpen)
            dropdownButton.setAttribute('aria-expanded', 'false')
            dropdownList.classList.remove(this.dropdownStates.listOpen)
        })

    }

    manageDropElement(dropdownElement) {
        const { dropdownButton, dropdownList } = this.getDropdownElements(dropdownElement)
        const isDropdownOpen = dropdownButton.classList.toggle(this.dropdownStates.buttonOpen)

        dropdownList.classList.toggle(this.dropdownStates.listOpen, isDropdownOpen)

        dropdownButton.setAttribute('aria-expanded', isDropdownOpen.toString())
    }

    onClick(event) {
        const dropdownElement = event.target.closest(this.selectors.dropdownElement)

        if(!dropdownElement) {
            this.closeAllDropElements()
            return
        }

        this.manageDropElement(dropdownElement)
        this.getDropdownElements(dropdownElement)
    }

    bindEvents() {
        document.addEventListener('click', (event) => this.onClick(event))
    }
}