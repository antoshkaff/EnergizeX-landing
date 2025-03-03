export default class Timer {
    selectors = {
        timer: '[data-js-timer]',
        days: '[data-js-timer-days]',
        hours: '[data-js-timer-hours]',
        minutes: '[data-js-timer-minutes]',
        seconds: '[data-js-timer-seconds]'
    }

    cachedElements = new Map()
    countdownInterval = null

    constructor(initialTimeInSeconds) {
        this.remainingTime = initialTimeInSeconds
        this.cacheTimers()
        this.startCountdown()
    }

    cacheTimers() {
        const timers = document.querySelectorAll(this.selectors.timer)

        timers.forEach(timer => {
            if (!this.cachedElements.has(timer)) {
                const daysElement = timer.querySelector(this.selectors.days)
                const hoursElement = timer.querySelector(this.selectors.hours)
                const minutesElement = timer.querySelector(this.selectors.minutes)
                const secondsElement = timer.querySelector(this.selectors.seconds)
                this.cachedElements.set(timer, {
                    daysElement,
                    hoursElement,
                    minutesElement,
                    secondsElement
                })
            }
        })
    }

    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval)
        }

        this.updateCountdown()
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000)
    }

    updateCountdown() {
        if (this.remainingTime <= 0) {
            clearInterval(this.countdownInterval)
            this.setTimerValues(0, 0, 0, 0)
            return
        }

        this.remainingTime--

        const days = Math.floor(this.remainingTime / (60 * 60 * 24))
        const hours = Math.floor((this.remainingTime % (60 * 60 * 24)) / (60 * 60))
        const minutes = Math.floor((this.remainingTime % (60 * 60)) / 60)
        const seconds = this.remainingTime % 60

        this.setTimerValues(days, hours, minutes, seconds)
    }

    setTimerValues(days, hours, minutes, seconds) {
        this.cachedElements.forEach(({ daysElement, hoursElement, minutesElement, secondsElement }) => {
            daysElement.textContent = this.formatNumber(days)
            hoursElement.textContent = this.formatNumber(hours)
            minutesElement.textContent = this.formatNumber(minutes)
            secondsElement.textContent = this.formatNumber(seconds)
        })
    }

    formatNumber(number) {
        return number < 10 ? `0${number}` : number
    }

}