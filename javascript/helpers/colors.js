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