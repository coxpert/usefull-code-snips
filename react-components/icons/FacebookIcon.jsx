import React from 'react'

const RectFacebookIcon = ({ style, size = 24, ...rest }) => {
    return (
        <svg style={{ width: size, height: size, pointerEvents: 'none', ...style }} {...rest} viewBox="0 0 24 24">
            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z" />
        </svg>
    );
}

const CircleFacebookIcon = ({ style, size = 24, ...rest }) => {
    return (
        <svg style={{ width: size, height: size, pointerEvents: 'none', ...style }} {...rest} viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="31" fill="#3b5998"></circle>
            <path d="M34.1,47V33.3h4.6l0.7-5.3h-5.3v-3.4c0-1.5,0.4-2.6,2.6-2.6l2.8,0v-4.8c-0.5-0.1-2.2-0.2-4.1-0.2 c-4.1,0-6.9,2.5-6.9,7V28H24v5.3h4.6V47H34.1z" fill="white"></path>
        </svg>
    );
}

const FacebookIcon = CircleFacebookIcon

export default FacebookIcon