export default class SearchForm {
    selectors = {
        form: '[data-js-search-form]',
        button: '[data-js-search-form-button]',
        wrapper: '[data-js-search-form-wrapper]'
    }

    formStates = {
        active: 'search-form--active'
    }

    mediaQuery = {
        mobile: window.matchMedia('(max-width: 767px)')
    }

    cachedElements = new Map()

    constructor() {
        this.cacheForms()
        this.bindEvents()
    }

    cacheForms() {
        const wrappers = document.querySelectorAll(this.selectors.wrapper)

        wrappers.forEach((wrapper) => {
            const form = wrapper.querySelector(this.selectors.form)
            const button = wrapper.querySelector(this.selectors.button)

            if (form && button) {
                this.cachedElements.set(wrapper, {
                    form,
                    button
                })
            }
        })
    }

    hideAllForms() {
        this.cachedElements.forEach(({ form, button }) => {
            form.classList.remove(this.formStates.active)
            button.classList.remove(this.formStates.active)
            button.setAttribute('aria-expanded', 'false')
        })
    }

    manage(formWrapper) {
        const { form, button } = this.cachedElements.get(formWrapper)

        form.classList.add(this.formStates.active)
        button.classList.add(this.formStates.active)

        const formStyleDuration = getComputedStyle(form)
            .getPropertyValue('transition-duration')

        const duration = formStyleDuration.includes('s')
            ? parseFloat(formStyleDuration) * 1000
            : parseFloat(formStyleDuration)

        setTimeout(() => {
            form.querySelector('input')?.focus()
        }, duration)

        const isFormActive = form.classList.contains(this.formStates.active)
        button.setAttribute('aria-expanded', isFormActive.toString())
    }

    onClick(event) {
        if (!this.mediaQuery.mobile.matches) return

        const formWrapper = event.target.closest(this.selectors.wrapper)

        if (!formWrapper || !this.cachedElements.has(formWrapper)) {
            this.hideAllForms()
            return
        }

        this.manage(formWrapper)
    }

    bindEvents() {
        document.addEventListener('click', (event) => this.onClick(event))
    }
}
