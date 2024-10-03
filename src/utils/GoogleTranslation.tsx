import { useState, useEffect } from 'react'
import axios from 'axios'

const GeorgianTranslator = ({ georgianText }: any) => {
    const [translatedText, setTranslatedText] = useState('')

    useEffect(() => {
        const translateText = async () => {
            try {
                const response = await axios.post(
                    'https://translation.googleapis.com/language/translate/v2',
                    {},
                    {
                        params: {
                            q: georgianText,
                            target: 'en',
                            key: process.env.NEXT_PUBLIC_GOOGLE_TRANSLATION_KEY,
                        },
                    }
                )
                setTranslatedText(response.data.data.translations[0].translatedText)
            } catch (error) {
                console.error('Translation error:', error)
                setTranslatedText('Error translating text')
            }
        }

        if (georgianText) {
            translateText()
        }
    }, [georgianText])

    return (
        <div>
            <p>{georgianText}</p>
            <p>{translatedText}</p>
        </div>
    )
}

export default GeorgianTranslator
