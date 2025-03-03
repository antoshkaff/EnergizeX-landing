export default class Modal {
    selectors = {
        modalButton: '[data-js-modal-button]',
        modalButtonClose: '[data-js-modal-button-close]',
        modal: '[data-js-modal]'
    }

    modalStates = {
        open: 'modal--open'
    }

    cachedElements = new Map()
    openModals = new Set()

    constructor() {
        this.bindEvents()
        this.cacheModalsButtons()
    }

    cacheModalsButtons() {
        const modalButtons = Array.from(document.querySelectorAll(this.selectors.modalButton))
        const modals = Array.from(document.querySelectorAll(this.selectors.modal))

        modals.forEach((modal) => {
            const modalButtonsClose = Array.from(modal.querySelectorAll(this.selectors.modalButtonClose))
            const openButtons = modalButtons.filter(
                (btn) => btn.dataset.jsModalButton === modal.dataset.jsModal
            );

            this.cachedElements.set(modal, {
                modal,
                openButtons,
                closeButtons: modalButtonsClose
            })
        })
    }

    getModalElements(elementForSearch) {
        for (const [modal, { openButtons, closeButtons }] of this.cachedElements) {
            if (
                elementForSearch === modal ||
                openButtons.includes(elementForSearch) ||
                closeButtons.includes(elementForSearch)
            ) {
                return { modal, openButtons, closeButtons }
            }
        }
        return null
    }

    openModal(modal) {
        modal.showModal()
        modal.classList.add(this.modalStates.open)

        this.openModals.add(modal)
    }

    closeModals(modal) {
        const transitionDuration = getComputedStyle(modal)
            .getPropertyValue('transition-duration')

        const duration = transitionDuration.includes('s')
            ? parseFloat(transitionDuration) * 1000
            : parseFloat(transitionDuration)

        modal.classList.remove(this.modalStates.open)

        setTimeout(() => {
            modal.close()
            this.openModals.delete(modal)
        }, duration)
    }

    onClick(event) {
        const { target } = event

        const modalButton = target.closest(this.selectors.modalButton)
        const modalButtonClose = target.closest(this.selectors.modalButtonClose)
        const modal = target.closest(this.selectors.modal)

        if (modalButtonClose) {
            const { modal } = this.getModalElements(modalButtonClose)
            const href = modalButtonClose.getAttribute('href')

            if(href) {
                const targetElement = document.querySelector(href)
                setTimeout(() => {
                    targetElement.focus()
                }, 400)
            }

            this.closeModals(modal);
            return;
        }

        if (target.tagName === 'DIALOG') {
            this.openModals.forEach((modal) => this.closeModals(modal))
            return;
        }

        if (modalButton) {
            const { modal } = this.getModalElements(modalButton)
            this.openModal(modal);
            return;
        }

        if (!modal) {
            this.openModals.forEach((modal) => this.closeModals(modal))
        }
    }

    onESC(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            this.openModals.forEach((modal) => this.closeModals(modal))
        }
    }

    bindEvents() {
        document.addEventListener('click', (event) => this.onClick(event))
        document.addEventListener('keydown', (event) => this.onESC(event))
    }
}