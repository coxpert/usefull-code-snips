export default {
    init: function (Vue) {
        Vue.directive('tooltip', {
            bind: function (el, binding) {
                const { value } = binding
                const appendToolTip = () => {
                    const rect = el.getBoundingClientRect()
                    const tooltipContainerId = 'bz-tooltip-container'
                    let toolTipContainer = document.getElementById(tooltipContainerId)
                    if (toolTipContainer === null && value) {
                        toolTipContainer = document.createElement('div')
                        toolTipContainer.setAttribute('id', tooltipContainerId)
                        toolTipContainer.style.cssText = `
                            position: absolute;
                            top: ${rect.bottom + 10}px;
                            color: white;
                            font-size: 14px;
                            z-index: 10001;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            padding: 0 10px;
                            background-color: #232E21;
                            border-radius: 6px;
                            height: 28px;
                            box-shadow: 0 0 8px 4px #0000078;
                            transform-origin: top center;
                            transform: scale(0);
                        `

                        const tail = document.createElement('div')

                        tail.style.cssText = `
                            position: absolute;
                            top: -5px;
                            z-index: -1;
                            background-color: #232E21;
                            border-radius: 2px;
                            height: 18px;
                            width: 18px;
                            transform: rotate(45deg);
                            border-radius: 2px;
                        `
                        toolTipContainer.innerHTML = value

                        toolTipContainer.prepend(tail)
                        document.body.appendChild(toolTipContainer)

                        setTimeout(() => {
                            if (toolTipContainer) {
                                toolTipContainer.style.cssText =
                                    toolTipContainer.style.cssText +
                                    `
                                        left: ${rect.left + rect.width / 2 - toolTipContainer.clientWidth / 2}px;
                                        transform: scale(1);
                                        transition-delay: 500ms;
                                        transition: all 200ms ease-out;
                                    `
                            }
                        }, 10)

                        function removeTooltip() {
                            toolTipContainer?.remove()
                            el.removeEventListener('mouseleave', removeTooltip)
                        }

                        el.addEventListener('mouseleave', removeTooltip)
                    }
                }

                el.addEventListener('click', appendToolTip)
            }
        })

        Vue.directive('click-outside', {
            bind: function (el, binding) {
                const { value } = binding
                this.event = function (event) {
                    const selector = window.getSelector(el)
                    if (selector) {
                        const target = event.target
                        if (target && target.nodeType === 1 && target.parentNode && !target.closest(selector)) {
                            if (typeof value === 'function') {
                                value(event)
                            } else {
                                window.LOG.error('outside click callback is not a function', el)
                            }
                        }
                    } else {
                        document.body.removeEventListener('mousedown', this.event)
                    }
                }
                document.body.addEventListener('mousedown', this.event.bind(this))
            }.bind(this),
            unbind: function () {
                document.body.removeEventListener('mousedown', this.event)
            }.bind(this)
        })

        // Ripple Effect when clicking
        Vue.directive('ripple', {
            // When the bound element is inserted into the DOM...
            inserted: function (el) {
                // listen for click events to trigger the ripple
                el.addEventListener(
                    'click',
                    function (e) {
                        // Setup
                        const target = el.getBoundingClientRect()
                        const buttonSize = target.width > target.height ? target.width : target.height
                        // remove any previous ripple containers
                        const elements = document.getElementsByClassName('bz-ripple')
                        while (elements[0]) {
                            elements[0].parentNode.removeChild(elements[0])
                        }
                        // create the ripple container and append it to the target element
                        const ripple = document.createElement('span')
                        ripple.setAttribute('class', 'bz-ripple')
                        el.appendChild(ripple)

                        // set the ripple container to the click position and start the animation
                        setTimeout(function () {
                            ripple.style.width = buttonSize + 'px'
                            ripple.style.height = buttonSize + 'px'
                            ripple.style.top = e.offsetY - buttonSize / 2 + 'px'
                            ripple.style.left = e.offsetX - buttonSize / 2 + 'px'
                            ripple.setAttribute('class', 'bz-ripple bz-ripple-effect')
                        }, 100)
                    },
                    false
                )
            }
        })

        // Drop Down when clicking

        Vue.directive('dropdown', {
            bind: function (el, binding) {
                function doClose() {
                    if (!isOpen) return
                    isOpen = false
                    el.classList.remove('show')
                    document.removeEventListener('mousedown', onClose, false)
                }
                function onClose(e) {
                    if (e && el.contains(e.target)) return
                    doClose()
                }
                function onOpen(_e) {
                    if (isOpen) return
                    isOpen = true
                    el.classList.add('show')
                    document.addEventListener('mousedown', onClose, false)
                }
                function onToggle(_e) {
                    isOpen ? onClose() : onOpen()
                }
                function onBlur(_e) {
                    setTimeout(() => {
                        const activeEl = document.activeElement
                        if (activeEl !== document.body && !el.contains(activeEl)) {
                            doClose()
                        }
                    })
                }
                let isOpen = false
                const toggle = el.querySelector('[dropdown-toggle]')
                const { value } = binding

                const { autoClose, click = 'toggle', focus = false } = value || {}
                if (click === 'toggle') {
                    toggle.addEventListener('click', onToggle, false)
                } else if (click === 'open') {
                    toggle.addEventListener('click', onOpen, false)
                }
                if (focus === 'open') {
                    toggle.addEventListener('focus', onOpen, false)
                    toggle.addEventListener('blur', onBlur, false)
                }

                autoClose && el.addEventListener('mouseup', doClose, false)

                el.classList.add('bz-dropdown')
            }
        })
    }
}