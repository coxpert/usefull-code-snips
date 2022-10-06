const rgbToHex = (rgb) => {
    const rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/
    let result
    let r
    let g
    let b
    let hex = ''
    if ((result = rgbRegex.exec(rgb))) {
        r = window.componentFromStr(result[1], result[2])
        g = window.componentFromStr(result[3], result[4])
        b = window.componentFromStr(result[5], result[6])
        hex = '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }
    return hex
}

const pastelColors = () => {
    const r = Math.round(Math.random() * 127 + 127).toString(16)
    const g = Math.round(Math.random() * 127 + 127).toString(16)
    const b = Math.round(Math.random() * 127 + 127).toString(16)
    return '#' + r + g + b
}

const subtleColors = () => {
    const r = Math.round(Math.random() * 127).toString(16)
    const g = Math.round(Math.random() * 127).toString(16)
    const b = Math.round(Math.random() * 127).toString(16)
    return '#' + r + g + b
}

const variantColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

