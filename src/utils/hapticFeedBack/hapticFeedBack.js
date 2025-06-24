export const hapticFeedback = (style = 'medium') => {
    if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style)
    }
}
