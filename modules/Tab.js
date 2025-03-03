export default class Tab {
    selectors = {
        tabContainer: '[data-js-tab-container]',
        tab: '[data-js-tab]',
        tabButton: '[data-js-tab-button]',
        tabContent: '[data-js-tab-content]'
    }

    tabButtonStates = {
        current: 'tab__button--current'
    }

    cachedElements = new Map()
    openTabContent = new Map()

    constructor() {
        this.cacheTab()
        this.initOpenTabContent()
        this.bindEvents()
    }

    cacheTab() {
        const tabs = document.querySelectorAll(this.selectors.tab)

        Array.from(tabs).forEach((tab) => {
            if(!this.cachedElements.has(tab)) {
                const tabContainer = tab.closest(this.selectors.tabContainer)
                const tabButtons = Array.from(tab.querySelectorAll(this.selectors.tabButton))
                const tabContents = Array.from(tabContainer.querySelectorAll(this.selectors.tabContent))

                this.cachedElements.set(tab, {
                    tabContainer,
                    tabButtons,
                    tabContents
                })
            }
        })
    }

    getTabElements(elementForSearch) {
        for (const [tab, { tabContainer, tabButtons, tabContents }] of this.cachedElements) {
            if (
                elementForSearch === tab ||
                elementForSearch === tabContainer ||
                tabButtons.includes(elementForSearch) ||
                tabContents.includes(elementForSearch)
            ) {
                return { tab, tabContainer, tabButtons, tabContents }
            }
        }
        return null
    }

    initOpenTabContent() {
        for (const [tab, { tabContents, tabButtons }] of this.cachedElements) {
            const openTabContent = tabContents.find((tabContent) => !tabContent.hidden)

            if(openTabContent) {
                const openedTabButton = tabButtons
                    .find(tabButton => openTabContent.dataset.jsTabContent === tabButton.dataset.jsTabButton)
                this.openTabContent.set(tab, {
                    tab,
                    openTabContent,
                    openedTabButton
                })
            }
        }

    }

    switchTab(tabButton) {
        const { tab, tabContents } = this.getTabElements(tabButton)

        const { openTabContent, openedTabButton } = this.openTabContent.get(tab)

        openedTabButton.setAttribute('aria-selected', 'false')
        openedTabButton.classList.remove(this.tabButtonStates.current)
        openTabContent.hidden = true
        this.openTabContent.delete(tab)

        const content = tabContents
            .find(tabContent => tabContent.dataset.jsTabContent === tabButton.dataset.jsTabButton)

        tabButton.setAttribute('aria-selected', 'true');
        tabButton.classList.add(this.tabButtonStates.current)
        content.hidden = false

        this.openTabContent.set(tab, {
            tab,
            openTabContent: content,
            openedTabButton: tabButton
        })
    }

    onClick(event) {
        const tabButton = event.target.closest(this.selectors.tabButton)

        if(!tabButton) {
            return
        }

        this.switchTab(tabButton)
    }

    bindEvents() {
        document.addEventListener('click', (event) => this.onClick(event))
        document.addEventListener('focusin', (event) => this.onClick(event))
    }
}