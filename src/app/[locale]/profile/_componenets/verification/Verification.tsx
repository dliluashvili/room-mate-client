import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@apollo/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import { identityVerificationImagesUpload } from '@/graphql/mutation'
import { fileToBase64 } from '@/src/utils/fileToBase64'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function Verification() {
    const { t } = useTranslation()
    const [selfie, setSelfie] = useState(null)
    const [frontId, setFrontId] = useState(null)
    const [backId, setBackId] = useState(null)
    const [message, setMessage] = useState('')
    const [uploadImages, { loading, error }] = useMutation(identityVerificationImagesUpload)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const { data: result, errors: errors } = await uploadImages({
                variables: {
                    input: {
                        selfie,
                        idFrontImage: frontId,
                        idBackImage: backId,
                    },
                },
            })
            if (result) {
                if (result.identityVerificationImagesUpload) {
                    setMessage('successUpload')
                    setSelfie(null)
                    setFrontId(null)
                    setBackId(null)
                }
            } else if (errors) {
                if (errors[0]?.message === 'IDENTITY_IMAGES__REQUIRED') {
                    setMessage('requiredAllImage')
                } else if (errors[0]?.message === 'USERVERIFIED ') {
                    setMessage('alreadyVerified')
                } else if (errors[0]?.message === 'USER__UNDER_REVIEW') {
                    setMessage('inReview')
                } else if (errors[0]?.message === 'ID_FRONT_IMAGEREQUIRED') {
                    setMessage('frontIdRequired')
                } else if (errors[0]?.message === 'ID_BACK_IMAGEREQUIRED') {
                    setMessage('backIdRequired')
                } else if (errors[0]?.message === 'SELFIE__REQUIRED') {
                    setMessage('selfieRequired')
                }
            }
        } catch (err) {
            console.error('Upload error:', err)
        }
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

    const FileUpload = ({ onFileUpload, title, preview }: any) => {
        const { t } = useTranslation()
        const onDrop = useCallback(
            async (acceptedFiles: any) => {
                if (acceptedFiles.length > 1) {
                    alert(t('maxImage'))
                    return
                }

                const file = acceptedFiles[0]

                if (file.size > MAX_FILE_SIZE) {
                    alert(t('maxMb'))
                    return
                }

                const base64 = await fileToBase64(file)
                onFileUpload(base64)
            },
            [onFileUpload]
        )

        const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })

        return (
            <div className="space-y-2">
                <div
                    {...getRootProps()}
                    className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-blue-500"
                >
                    <input {...getInputProps()} />

                    <p>{t('dragDrop')}</p>
                </div>
                {preview && (
                    <div className="relative mt-2 h-52 w-full bg-slate-100">
                        <Image
                            src={preview}
                            fill
                            alt={`${title} preview`}
                            className=" h-52 w-full rounded-md object-contain"
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <Card className=" w-full border-none ">
            <CardHeader>
                <CardTitle>{t('verification')}</CardTitle>
                <p className="mt-4">{t('verifyText')}</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid  gap-4 md:grid-cols-1 lg:grid-cols-3">
                    <div className="max-w-80">
                        <h3 className="mb-2 font-semibold">{t('selfie')}</h3>
                        <FileUpload onFileUpload={setSelfie} title="selfie" preview={selfie} />
                    </div>
                    <div className="max-w-80">
                        <h3 className="mb-2 font-semibold">{t('frontId')}</h3>
                        <FileUpload onFileUpload={setFrontId} title="front ID" preview={frontId} />
                    </div>
                    <div className="max-w-80">
                        <h3 className="mb-2 font-semibold">{t('backId')}</h3>
                        <FileUpload onFileUpload={setBackId} title="back ID" preview={backId} />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? t('uploading') : t('submit')}
                    </Button>
                    <p className={`${error ? 'text-red-500' : 'text-mainGreen'} mt-2 `}>
                        {t(message)}
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
