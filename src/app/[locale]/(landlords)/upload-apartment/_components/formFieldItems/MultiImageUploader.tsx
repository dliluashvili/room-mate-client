import { useState, useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { AddPhoto, Trash } from '@/src/components/svgs'

interface CustomFile extends File {
    preview: string
    base64: string
}

interface MultiImageUploaderProps {
    field: any
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ field }) => {
    const [files, setFiles] = useState<CustomFile[]>(field.value || [])
    const { t } = useTranslation()

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = (error) => reject(error)
        })
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (rejectedFiles.length > 0) {
                alert(t('fileTooLarge'))
                return
            }

            const newFiles: CustomFile[] = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const base64 = await fileToBase64(file)
                    return Object.assign(file, {
                        preview: URL.createObjectURL(file),
                        base64,
                    })
                })
            )

            const updatedFiles = [...files, ...newFiles]
            setFiles(updatedFiles)
            field.onChange(updatedFiles.map((file) => file.base64)) // Call the field.onChange with the base64 strings
        },
        [files, field, t]
    )

    const deleteFile = useCallback(
        (fileToDelete: CustomFile) => {
            const updatedFiles = files.filter((file) => file !== fileToDelete)
            setFiles(updatedFiles)
            field.onChange(updatedFiles.map((file) => file.base64)) // Call the field.onChange with the base64 strings
        },
        [files, field]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.avif'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
    })
    return (
        <div className="   w-full">
            <div
                {...getRootProps()}
                className="cursor-pointer rounded-lg border  border-[#828bab] p-4 text-center transition-colors hover:border-hoverGreen"
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-gray-600">{t('dropFiles')}</p>
                ) : (
                    <div className="flex flex-col items-center">
                        <AddPhoto className="mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-gray-600">{t('dragDropOrClick')}</p>
                    </div>
                )}
            </div>

            {files.length > 0 && (
                <div className="mt-4  grid w-full grid-cols-2  gap-x-2 gap-y-2 md:grid-cols-3 lg:grid-cols-5">
                    {files.map((file: any, index: number) => (
                        <div key={index} className="relative  h-32 w-full ">
                            <Image
                                fill
                                src={file.preview}
                                alt={file.name}
                                className="w-h-full h-full rounded object-cover"
                            />
                            <button
                                className="absolute  right-2 top-2 rounded-sm bg-[#F2F5FF] p-1 "
                                onClick={() => deleteFile(file)}
                            >
                                <Trash className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MultiImageUploader
