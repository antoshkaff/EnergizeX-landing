export default class Slider {
    selectors = {
        sliderContainer: '[data-js-slider-container]',
        sliderWrapper: '[data-js-slider-wrapper]',
        slider: '[data-js-slider]',
        sliderItem: '[data-js-slider-item]',
        paginationWrapper: '[data-js-pagination-wrapper]',
        paginationItem: '[data-js-pagination]',
        paginationButton: '[data-js-pagination-button]',
        paginationButtonAdditional: '[data-js-pagination-button-additional]'
    }

    buttonStates = {
        current: 'pagination__button--current',
        additionalActive: 'pagination__button-large--active'
    }

    sliderOptions = {
        autoscroll: 'autoscroll'
    }

    additionalButtonOptions = {
        back: 'back',
        forward: 'forward'
    }

    mediaQuery = {
        smallMobile: window.matchMedia("(max-width: 480px)"),
        largeMobile: window.matchMedia("(max-width: 600px)"),
        tablet: window.matchMedia("(min-width: 767px)"),
        laptop: window.matchMedia("(min-width: 1024px)"),
        desktop: window.matchMedia("(min-width: 1200px)")
    }

    autoScrollsDuration = 3000
    allAutoScrolls = new Map()

    cachedElements = new Map()

    constructor() {
        this.bindEvents()
        this.cacheSliders()
        this.initAutoScroll()
        this.watchMediaQuery()
    }

    cacheSliders() {
        const sliderContainers = document.querySelectorAll(this.selectors.sliderContainer)

        Array.from(sliderContainers).forEach((sliderContainer) => {
            if(!this.cachedElements.has(sliderContainer)) {
                const sliderWrapper = sliderContainer.querySelector(this.selectors.sliderWrapper)
                const slider = sliderWrapper.querySelector(this.selectors.slider)
                const sliderItems = slider.querySelectorAll(this.selectors.sliderItem)

                const paginationWrapper = sliderContainer.querySelector(this.selectors.paginationWrapper)
                const paginationItems = sliderContainer.querySelectorAll(this.selectors.paginationItem)
                const paginationButtons = sliderContainer.querySelectorAll(this.selectors.paginationButton)
                const paginationButtonsAdditional = sliderContainer.querySelectorAll(this.selectors.paginationButtonAdditional)

                this.cachedElements.set(sliderContainer, {
                    sliderContainer,
                    sliderWrapper,
                    slider,
                    sliderItems,
                    paginationWrapper,
                    paginationItems,
                    paginationButtons,
                    paginationButtonsAdditional
                })
            }
        })
    }

    watchMediaQuery() {
        Object.entries(this.mediaQuery).forEach(([key, mediaQuery]) => {
            mediaQuery.addEventListener("change", () => {
                this.cachedElements.forEach(({ slider }) => {
                    const { paginationButtons } = this.getSliderElements(slider)
                    const { currentSlide } = this.getSliderState(slider)

                    this.scrollSlider(paginationButtons[currentSlide])
                })
            })
        })
    }

    getSliderElements(elementForSearch) {
        const sliderContainer = elementForSearch.closest(this.selectors.sliderContainer)

        return this.cachedElements.get(sliderContainer)
    }

    getSliderState(slider) {
        const { paginationButtons } = this.getSliderElements(slider)
        const currentSlide = Array.from(paginationButtons)
            .findIndex((button) => button.classList.contains(this.buttonStates.current))

        return {
            currentSlide
        }
    }

    buttonsState(paginationButton) {
        const { slider, paginationButtons, paginationButtonsAdditional } = this.getSliderElements(paginationButton)

        paginationButtons
            .forEach(paginationButton => paginationButton.classList.remove(this.buttonStates.current))

        paginationButton.classList.add(this.buttonStates.current)

        if(paginationButtonsAdditional.length) {
            const buttonBack = Array.from(paginationButtonsAdditional).find((button) => button.dataset.jsPaginationButtonAdditional
                === this.additionalButtonOptions.back)
            const buttonForward = Array.from(paginationButtonsAdditional).find((button) => button.dataset.jsPaginationButtonAdditional
                === this.additionalButtonOptions.forward)

            const { currentSlide } = this.getSliderState(slider)

            if(currentSlide > 0) {
                buttonBack.classList.add(this.buttonStates.additionalActive)
            } else {
                buttonBack.classList.remove(this.buttonStates.additionalActive)
            }

            if(currentSlide < paginationButtonsAdditional.length) {
                buttonForward.classList.add(this.buttonStates.additionalActive)
            } else {
                buttonForward.classList.remove(this.buttonStates.additionalActive)
            }
        }
    }

    autoScroll(sliderContainer, { currentSlide = 0} = {}) {
        const { slider, paginationButtons } = this.getSliderElements(sliderContainer)
        const maxSlides = paginationButtons.length - 1

        const interval = setInterval(() => {
            currentSlide >= maxSlides
                ? currentSlide = 0
                : currentSlide++
            this.scrollSlider(paginationButtons[currentSlide])
        }, this.autoScrollsDuration)

        this.allAutoScrolls.set(slider, interval)
    }

    initAutoScroll() {
        this.cachedElements.forEach(({ sliderContainer, slider }) => {
            if(slider.dataset.jsSlider === this.sliderOptions.autoscroll) {
                this.autoScroll(sliderContainer)
            }
        })
    }

    resetAutoScroll(slider) {
        clearInterval(this.allAutoScrolls.get(slider))
        const { currentSlide } = this.getSliderState(slider)

        this.autoScroll(slider, {currentSlide})
    }

    scrollSlider(paginationButton) {
        const { slider, sliderItems } = this.getSliderElements(paginationButton)

        const sliderMainItem = sliderItems[0]
        const paginationIndex = paginationButton.dataset.jsPaginationButton

        const gap = parseInt(getComputedStyle(slider).getPropertyValue('column-gap')) || 0
        const offset = (sliderMainItem.clientWidth + gap) * paginationIndex

        this.buttonsState(paginationButton)

        slider.style.translate = `-${offset}px`
    }

    scrollSliderAdditional(paginationButtonAdditional) {
        const { slider, paginationButtons } = this.getSliderElements(paginationButtonAdditional)

        const { currentSlide } = this.getSliderState(slider)

        const isForward = paginationButtonAdditional.dataset.jsPaginationButtonAdditional
            === this.additionalButtonOptions.forward

        if (isForward) {
            if (currentSlide < paginationButtons.length - 1) {
                this.scrollSlider(paginationButtons[currentSlide + 1]);
            }
        } else {
            if (currentSlide > 0) {
                this.scrollSlider(paginationButtons[currentSlide - 1]);
            }
        }
    }

    onClick(event) {
        const { target } = event
        const paginationButton = target.closest(this.selectors.paginationButton)
        const paginationButtonAdditional = target.closest(this.selectors.paginationButtonAdditional)

        if(paginationButton) {
            const { slider } = this.getSliderElements(paginationButton)

            this.scrollSlider(paginationButton)

            if(slider.dataset.jsSlider === this.sliderOptions.autoscroll) {
                this.resetAutoScroll(slider)
            }
        }

        if(paginationButtonAdditional) {
            this.scrollSliderAdditional(paginationButtonAdditional)
        }
    }

    bindEvents() {
        document.addEventListener('click', (event) => this.onClick(event))
    }
}