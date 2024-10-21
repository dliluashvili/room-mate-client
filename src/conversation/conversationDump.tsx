import {
    generateTwilioAccessTokenByIdMutation,
    lookupOrCreateTwilioUserResourceMutation,
} from '@/graphql/mutation'
import { useMutation, useReactiveVar } from '@apollo/client'
import { Client as TwilioClient } from '@twilio/conversations'
import { twilioClientVar } from './conversationVars'

const chatParticipantIds = [
    '1088',
    '1075',
    '1074',
    '1073',
    '1072',
    '1071',
    '1070',
    '1069',
    '1068',
    '1067',
    '1066',
    '1065',
    '1058',
    '1056',
    '1055',
    '1054',
    '1052',
    '1051',
    '1050',
    '1049',
    '1048',
    '1047',
    '1046',
    '1045',
    '1044',
    '1043',
    '1042',
    '1041',
    '1040',
    '1039',
    '1036',
    '1035',
    '1033',
    '1032',
    '1012',
    '1011',
    '1010',
    '1009',
    '1008',
    '1006',
    '1005',
    '962',
    '961',
    '960',
    '959',
    '958',
    '957',
    '956',
    '955',
    '954',
    '953',
    '952',
    '951',
    '950',
    '949',
    '948',
    '947',
    '946',
    '945',
    '944',
]
const requestParticipantIds = [
    943, 942, 941, 940, 939, 938, 937, 936, 935, 934, 933, 932, 931, 930, 929, 928, 927, 926, 925,
    924, 923, 922, 921, 920, 919, 918, 917, 916, 915, 914, 913, 912, 911, 910, 909, 908, 907, 906,
]

const Comp = () => {
    const twilioClient = useReactiveVar(twilioClientVar)

    const [lookupOrCreateTwilioUserResource] = useMutation(lookupOrCreateTwilioUserResourceMutation)
    const [generateTwilioAccessTokenById] = useMutation(generateTwilioAccessTokenByIdMutation)

    const handleChatsCreate = async () => {
        chatParticipantIds.forEach(async (participantId) => {
            const twilioUserResourceResponse = await lookupOrCreateTwilioUserResource({
                variables: { userId: participantId },
            })

            if (twilioUserResourceResponse) {
                const conversation = await twilioClient!.createConversation()

                const settledParticipantAdd = await Promise.allSettled([
                    conversation.add(twilioClient!.user.identity),
                    conversation.add(participantId),
                ])

                const isFulfilledParticipantAdd = settledParticipantAdd.every(
                    (settledParticipant) => settledParticipant.status === 'fulfilled'
                )

                const messageText = 'dump message'

                if (isFulfilledParticipantAdd) {
                    await conversation
                        .sendMessage(messageText)
                        .then(async () => console.log('success'))
                        .catch(async () => console.log('error'))
                }
            }
        })
    }

    const handleRequestsCreate = async () => {
        for (const participantId of requestParticipantIds) {
            const { data } = await generateTwilioAccessTokenById({
                variables: {
                    id: participantId,
                },
            })

            if (data?.generateTwilioAccessTokenById) {
                const currentClient = new TwilioClient(data.generateTwilioAccessTokenById)

                const twilioUserResourceResponse = await lookupOrCreateTwilioUserResource({
                    variables: { userId: String(participantId) },
                })

                console.log({ currentClient })

                if (twilioUserResourceResponse) {
                    const conversation = await currentClient!.createConversation()

                    const settledParticipantAdd = await Promise.allSettled([
                        conversation.add(currentClient!.user.identity),
                        conversation.add(twilioClient!.user.identity),
                    ])

                    const isFulfilledParticipantAdd = settledParticipantAdd.every(
                        (settledParticipant) => settledParticipant.status === 'fulfilled'
                    )

                    const messageText = 'dump message'

                    if (isFulfilledParticipantAdd) {
                        await conversation
                            .sendMessage(messageText)
                            .then(async () => console.log('success'))
                            .catch(async () => console.log('error'))
                    }
                }
            }
        }
    }

    return (
        <>
            <button onClick={handleChatsCreate} className="bg-green-500 text-white">
                create chat
            </button>
            <div className="w-4"></div>
            <button onClick={handleRequestsCreate} className="bg-green-500 text-white">
                create request
            </button>
        </>
    )
}

export default Comp
