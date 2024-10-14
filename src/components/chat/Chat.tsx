'use client'

import React, { useEffect } from 'react'

const ChatraComponent = () => {
    useEffect(() => {
        // Load Chatra script
        ;(function (d, w, c) {
            w.ChatraID = 'k7fNHdZQkWpbDyfng'
            var s = d.createElement('script')
            w[c] =
                w[c] ||
                function () {
                    ;(w[c].q = w[c].q || []).push(arguments)
                }
            s.async = true
            s.src = 'https://call.chatra.io/chatra.js'
            if (d.head) d.head.appendChild(s)
        })(document, window, 'Chatra')
    }, [])

    return null // This component doesn't render anything
}

export default ChatraComponent
