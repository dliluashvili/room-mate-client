import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Slider } from '@/src/components/ui/slider'
import { FilterInput, Language, QuestionsWithAnswersFor } from '@/graphql/typesGraphql'
import { getQuestionsWithAnswersQuery } from '@/graphql/query'
import { useQuery } from '@apollo/client'
import { Button } from '@/src/components/ui/button'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import FilterLoading from '../loaders/FilterLoading'
import { CloseCircle } from '@/src/components/svgs'
import FilterSelectComponent from './filterComponents/FilterSelectComponent'
import { FilterRangePicker } from './filterComponents/FilterRangePicker'
import FilterSelectGender from './filterComponents/FilterSelectGender'

type RangeDataProps = {
    questionId: string
    questionName: string
    dataRange: string[] | string
}
type AnswerIdProps = {
    questionId: string
    questionName: string
    answerIds: string[] | string
}
type GenderProps = {
    columnName: string
    data: string | string[]
}

type FilterComponentProps = {
    transformedParams: FilterInput[]
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function Filter({ transformedParams, isOpen, setIsOpen }: FilterComponentProps) {
    const { t } = useTranslation()
    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const locale = params.locale
    const [key, setKey] = useState(0)
    const [ranges, setRanges] = useState<RangeDataProps[]>([])
    const [answers, setAnswers] = useState<AnswerIdProps[]>([])
    const [gender, setGender] = useState<GenderProps[]>([])

    const { loading, error, data } = useQuery(getQuestionsWithAnswersQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            lang: locale as Language,
            getFor: 'FILTER' as QuestionsWithAnswersFor,
        },
    })

    const rangeChangeHandler = (questionId: string, questionName: string, dataRange: string[]) => {
        const existingIndex = ranges.findIndex((query) => query.questionId === questionId)
        if (existingIndex !== -1) {
            setRanges((prevQueries) => {
                const updatedQueries = [...prevQueries]
                updatedQueries[existingIndex] = {
                    ...updatedQueries[existingIndex],
                    dataRange: dataRange,
                }
                return updatedQueries
            })
        } else if (existingIndex !== -1 && dataRange.length === 0) {
            setRanges((prevQueries) => prevQueries.filter((item) => item.questionId !== questionId))
        } else {
            setRanges((prevQueries) => [
                ...prevQueries,
                { questionId: questionId, questionName: questionName, dataRange: dataRange },
            ])
        }
    }

    const filterUpdateHandler = () => {
        setIsOpen(false)
        const params = new URLSearchParams()

        ranges.forEach((query, index) => {
            if (query.dataRange && query.dataRange.length > 0 && Array.isArray(query.dataRange)) {
                params.set(`range[${index}][questionId]`, query.questionId)
                params.set(`range[${index}][questionName]`, query.questionName)
                params.set(`range[${index}][dataRange]`, query.dataRange.join(','))
            }
        })

        answers.forEach((query, index) => {
            if (query.answerIds && query.answerIds.length > 0) {
                params.set(`answer[${index}][questionId]`, query.questionId)
                params.set(`answer[${index}][questionName]`, query.questionName)
                if (Array.isArray(query.answerIds)) {
                    params.set(`answer[${index}][answerIds]`, query.answerIds.join(','))
                } else {
                    params.set(`answer[${index}][answerIds]`, query.answerIds)
                }
            }
        })
        gender.forEach((query, index) => {
            if (query.data && query.data.length > 0) {
                params.set(`answer[${index}][columnName]`, query.columnName)

                if (Array.isArray(query.data)) {
                    params.set(`answer[${index}][data]`, query.data.join(','))
                } else {
                    params.set(`answer[${index}][data]`, query.data)
                }
            }
        })

        router.push(pathname + '?' + params.toString())
    }
    const filterClearHandler = () => {
        setKey((prevKey) => prevKey + 1)
        setRanges([])
        setAnswers([])
        setGender([])
        const page = searchParams.get('page')
        if (page) {
            const newPathname = `${pathname}?page=${page}`
            router.push(newPathname)
        } else {
            const newPathname = `${pathname}?page=1`
            router.push(newPathname)
        }
    }

    useEffect(() => {
        transformedParams.forEach((obj) => {
            if (obj.answerIds && obj.questionId) {
                setAnswers((prevAnswers) => {
                    const index = prevAnswers.findIndex(
                        (answer) => answer.questionId === obj.questionId
                    )
                    if (index !== -1) {
                        return prevAnswers.map((answer) =>
                            answer.questionId === obj.questionId ? (obj as AnswerIdProps) : answer
                        )
                    } else {
                        return [...prevAnswers, obj as AnswerIdProps]
                    }
                })
            } else if (obj.dataRange && obj.questionId) {
                setRanges((prevRanges) => {
                    const index = prevRanges.findIndex(
                        (range) => range.questionId === obj.questionId
                    )
                    if (index !== -1) {
                        return prevRanges.map((range) =>
                            range.questionId === obj.questionId ? (obj as RangeDataProps) : range
                        )
                    } else {
                        return [...prevRanges, obj as RangeDataProps]
                    }
                })
            } else if (obj.columnName === 'gender_id') {
                setGender((prevGender) => {
                    const index = prevGender.findIndex((g) => g.columnName === 'gender_id')
                    if (index !== -1) {
                        return prevGender.map((g) =>
                            g.columnName === 'gender_id' ? (obj as GenderProps) : g
                        )
                    } else {
                        return [...prevGender, obj as GenderProps]
                    }
                })
            }
        })
    }, [transformedParams, isOpen])

    if (loading) return <FilterLoading />
    if (error) return <p>Error: {error.message}</p>

 

    return (
        <>
            <section
                className={`${isOpen ? 'fixed z-[100000] h-screen w-full overflow-auto border-t-2 px-6 py-6 sm:px-16 md:px-20 md:py-10' : 'relative p-0'} flex h-full  w-full  flex-col gap-4 bg-white p-0  md:gap-6 `}
            >
                {isOpen ? (
                    <div className="flex h-auto w-full flex-row items-center justify-end gap-3">
                        <button
                            className="underline underline-offset-1"
                            onClick={filterClearHandler}
                        >
                            {t('clearFilters')}
                        </button>
                        <CloseCircle className="h-6 w-6" onClick={() => setIsOpen(!isOpen)} />
                    </div>
                ) : null}
                <div className=" hidden h-auto w-full flex-row items-center justify-end hover:underline lg:flex">
                    <button onClick={filterClearHandler}>{t('clearFilters')}</button>
                </div>
                <FilterSelectGender gender={gender} setGender={setGender} />
                {data?.getQuestionsWithAnswers &&
                    [...data.getQuestionsWithAnswers]
                        .sort((a, b) => {
                            if (a.uiFieldInfo?.filterInput?.type === 'numeric') return 1
                            if (b.uiFieldInfo?.filterInput?.type === 'numeric') return -1
                            return 0
                        })
                        .map((item) => (
                            <div key={item.id}>
                                {item.uiFieldInfo.filterInput?.type === 'select' && (
                                    <>
                                        <label className="w-full text-sm">
                                            {item.translations && item?.translations[0].title}
                                        </label>

                                        <FilterSelectComponent
                                            key={key}
                                            answers={answers}
                                            questionId={item.id}
                                            questionName={item.name}
                                            answersId={item.answers}
                                            setAnswers={setAnswers}
                                            isMulti={
                                                item.uiFieldInfo.filterInput.variant === 'multiple'
                                            }
                                        />
                                    </>
                                )}
                                {item.uiFieldInfo?.filterInput?.type === 'button' &&
                                    item.uiFieldInfo?.filterInput?.renderAs === 'range' && (
                                        <>
                                            <label className="w-full text-sm">
                                                {item.translations && item.translations[0]?.title}
                                            </label>
                                            <FilterRangePicker
                                                isOpen={isOpen}
                                                key={key}
                                                className="mt-2 w-full"
                                                rangeChangeHandler={rangeChangeHandler}
                                                questionName={item.name}
                                                questionId={item.id}
                                                ranges={ranges}
                                            />
                                        </>
                                    )}
                                {item.uiFieldInfo?.filterInput?.type === 'numeric' &&
                                    item.uiFieldInfo?.filterInput?.renderAs === 'range' && (
                                        <>
                                            <label className=" w-full text-sm">
                                                {item.translations && item.translations[0]?.title}
                                            </label>
                                            <Slider
                                                isOpen={isOpen}
                                                key={key}
                                                questionId={item.id}
                                                questionName={item.name}
                                                ranges={ranges}
                                                rangeChangeHandler={rangeChangeHandler}
                                            />
                                        </>
                                    )}
                            </div>
                        ))}
                <Button variant="filter" className="mt-6 w-full " onClick={filterUpdateHandler}>
                    {t('searchBtn')}
                </Button>
            </section>
        </>
    )
}
