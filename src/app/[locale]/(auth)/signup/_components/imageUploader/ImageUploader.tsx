import { Delete, Upload } from '@/src/components/svgs'
import { fileToBase64 } from '@/src/utils/fileToBase64'
import React, { useState, useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

interface CustomFile extends File {
    preview: string
    base64: string
}

type ImageUploaderProps = {
    field: {
        value: CustomFile[] | undefined
        onChange: (files: CustomFile[]) => void
    }
}

const ImageUploader = ({ field }: ImageUploaderProps) => {
    const [files, setFiles] = useState<CustomFile[]>(field.value ? field.value : [])
    const { t } = useTranslation()

    const onDrop = useCallback(
        async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (rejectedFiles.length > 0) {

                alert(t('fileTooLarge'))
                return
            }

            const updatedFiles: CustomFile[] = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const base64 = await fileToBase64(file)
                    return Object.assign(file, {
                        preview: URL.createObjectURL(file),
                        base64,
                    })
                })
            )
            setFiles(updatedFiles)
            field.onChange(updatedFiles)
        },
        [field]
    )

    const deleteFile = useCallback(
        (fileToDelete: CustomFile, event: React.MouseEvent) => {
            event.preventDefault()
            event.stopPropagation()
            setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete))
            field.onChange(files.filter((file) => file !== fileToDelete))
        },
        [files, field]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxSize: 5 * 1024 * 1024,
    })

    return (
        <div>
            <div {...getRootProps()} className="dropzone focus:outline-none">
                <input
                    className="flex h-[38px] w-full rounded-lg border border-[#828bab] bg-[#FFFFFF] px-3 py-2 text-sm placeholder:text-placeholderColor focus:ring-0"
                    {...getInputProps()}
                />
                <p>
                    {isDragActive ? (
                        <div className="flex flex-row gap-3">
                            <div className="flex h-[38px] w-full cursor-pointer flex-row items-center gap-3 rounded-lg border border-[#828bab] bg-[#FFFFFF] px-3 py-2 text-sm text-placeholderColor">
                                <span className="text-center">{t('dropFile')}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-3">
                            <div className="flex h-[38px] w-full cursor-pointer flex-row items-center gap-3 rounded-lg border border-[#828bab] bg-[#FFFFFF] px-3 py-2 text-sm text-placeholderColor">
                                {files.length ? (
                                    files.map((file) => (
                                        <div
                                            className="flex w-full flex-row justify-between gap-2"
                                            key={file.name}
                                        >
                                            <p className="w-0 flex-1 truncate text-black">
                                                {file.name}
                                            </p>
                                            <Delete
                                                className="h-5 w-auto cursor-pointer fill-placeholderColor hover:fill-[red]"
                                                onClick={(
                                                    event: React.MouseEvent<Element, MouseEvent>
                                                ) => {
                                                    deleteFile(file, event)
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-row items-center gap-2">
                                        <Upload className="h-5 w-5" />
                                        <span className=" text-xs lg:text-sm">
                                            {t('uploadFile')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </p>
            </div>
        </div>
    )
}

export default ImageUploader
