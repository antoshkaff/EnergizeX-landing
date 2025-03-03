export default class Notification {
    selectors = {
        notification: '[data-js-notification]',
        closeButton: '[data-js-notification-close-button]'
    }

    animations = {
        show: 'banner__notification--animation-fadeIn',
        hide: 'banner__notification--animation-fadeOut'
    }

    cachedElements = new Map()

    constructor() {
        this.cacheNotifications()
        this.animateNotification(null, {
            isAll: true,
            animationName: this.animations.show
        })
        this.bindEvents()
    }

    cacheNotifications() {
        const notifications = document.querySelectorAll(this.selectors.notification)

        Array.from(notifications).forEach((notification) => {
            if(!this.cachedElements.has(notification)) {
                const closeButton = notification.querySelector(this.selectors.closeButton)
                this.cachedElements.set(notification, {
                    closeButton
                })
            }
        })
    }

    getNotificationElements(elementForSearch) {
        if(this.cachedElements.has(elementForSearch)) {
            return this.cachedElements.get(elementForSearch)
        }

        for(const [notification, { closeButton }] of this.cachedElements) {
            if(
                elementForSearch === notification ||
                elementForSearch === closeButton) {
                return {
                    notification,
                    closeButton
                }
            }
        }
    }

    animateNotification(notification, {
        isAll = false,
        animationName = this.animations.show
    }){
        if(isAll) {
            for(const [notification] of this.cachedElements) {
                if(notification.classList.contains(animationName)) {
                    notification.classList.remove(animationName)
                }
                notification.classList.add(animationName)
            }
            return
        }

        if(notification.classList.contains(this.animations.show)) {
            notification.classList.remove(this.animations.show)
        }
        if(notification.classList.contains(this.animations.hide)) {
            notification.classList.remove(this.animations.hide)
        }

        notification.classList.add(animationName)
    }

    closeNotification(notification) {
        this.animateNotification(notification, {
            animationName: this.animations.hide
        })
        const animationDuration = getComputedStyle(notification).getPropertyValue('animation-duration')
        const duration = animationDuration.includes('s')
            ? parseFloat(animationDuration) * 1000
            : parseFloat(animationDuration)

        setTimeout(() => {
            notification.remove()
        }, duration)
    }

    onClick(event) {
        const { target } = event

        const closeButton = target.closest(this.selectors.closeButton)

        if(!closeButton) {
            return
        }

        const { notification } = this.getNotificationElements(closeButton)
        this.closeNotification(notification)
    }

    bindEvents() {
        document.addEventListener('click', (event) => this.onClick(event))
    }
}