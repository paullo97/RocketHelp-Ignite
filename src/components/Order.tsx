import { Box, Circle, HStack, IPressableProps, Pressable, Text, useTheme, VStack } from 'native-base';
import { CircleWavyCheck, ClockAfternoon, Hourglass } from 'phosphor-react-native';
import React from 'react';

export type OrderProps = {
    id: string;
    patrimony: string;
    when: string;
    status: 'open' | 'close';
}
type Props = IPressableProps & {
    data: OrderProps;
}
export function Order({ data, ...rest }: Props){
    const { colors } = useTheme();
    const statusType = data.status === 'open' ? colors.secondary[700] : colors.green[300];

    return (
        <Pressable {...rest}>
            <HStack
                bg="gray.600"
                mb={4}
                alignItems="center"
                justifyContent="space-between"
                rounded="sm"
                overflow="hidden">

                <Box h="full" w={2} bg={statusType}></Box>
                <VStack flex={1} my={5} ml={5}>
                    <Text color="white" fontSize="md">
                        Patrimônio: { data.patrimony }
                    </Text>

                    <HStack alignItems="center" >
                        <ClockAfternoon size={15} color={colors.gray[300]}></ClockAfternoon>
                        <Text color="gray.200" fontSize="xs" ml={1}> { data.when }</Text>
                    </HStack>
                </VStack>
                <Circle bg="gray.500" h={12} w={12} mr={5}>
                    {
                        data.status === 'close'
                        ? <CircleWavyCheck size={24} color={statusType}></CircleWavyCheck>
                        : <Hourglass size={24} color={statusType}></Hourglass>
                    }
                </Circle>
            </HStack>
        </Pressable>
    )
}