import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { CardDetails } from '../components/CardDetails';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { OrderFireStoreDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormat';

type RouteParams = {
    orderId: string;
}

type OrderDetails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}
export function Details(){
    const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
    const [isLoading, setIsLoading] = useState(true);
    const [solution, setSolution] = useState('');
    const route = useRoute();
    const { orderId } = route.params as RouteParams;
    const { colors } = useTheme();

    const navigation = useNavigation();

    function handleOrderClose(){
        if(!solution)
        {
            return Alert.alert('Solicitação', 'Informe Solução para encerrar Solicitação');
        }

        setIsLoading(true);

        firestore()
            .collection<OrderFireStoreDTO>('orders')
            .doc(orderId)
            .update({
                status: 'close',
                solution,
                closed_ad: firestore.FieldValue.serverTimestamp()
            })
            .then(() =>
            {
                Alert.alert('Solicitação', 'Solicitação Encerrada');
                navigation.goBack();
            })
            .catch((error) =>
            {
                console.log(error);
                Alert.alert('Solicitação', 'Não foi possivel encerrar a solicitação')
            });
        setIsLoading(false);
    }

    useEffect(() =>
    {
        firestore()
            .collection<OrderFireStoreDTO>('orders')
            .doc(orderId)
            .get()
            .then((response) =>
            {
                const { patrimony, description, status, created_ad, closed_ad, solution } = response.data();
                const closed = closed_ad ? dateFormat(closed_ad) : null;


                setOrder({
                    id: response.id,
                    patrimony,
                     description,
                     solution,
                     status,
                     closed,
                     when: dateFormat(created_ad)
                });

                setIsLoading(false);
            })
    }, [])

    if(isLoading)
    {
        return <Loading />
    }

    return (
        <VStack flex={1} bg="gray.700">
            <Box p={6} bg="gray.600">
                <Header title="Solicitação"></Header>
            </Box>
            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === 'close'
                    ? <CircleWavyCheck size={22} color={colors.green[300]}></CircleWavyCheck>
                    : <Hourglass size={22} color={colors.secondary[300]}></Hourglass>
                }

                <Text
                    fontSize="sm"
                    color={order.status === 'close' ? colors.green[300] : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase">
                        { order.status === 'close' ? 'Finalizados' : 'Em andamento'}
                </Text>
            </HStack>
            <ScrollView mx={5} showsVerticalScrollIndicator={false}>
                <CardDetails
                    title="equipamento"
                    description={`Patromonio: ${order.patrimony}`}
                    icon={DesktopTower}
                    footer={order.when}>
                </CardDetails>

                <CardDetails
                    title="Descrição do Problema"
                    description={order.description}
                    icon={Clipboard}>
                </CardDetails>

                <CardDetails
                    title="Solução"
                    icon={CircleWavyCheck}
                    description={order.solution}
                    footer={order.closed && `Encerrado em ${order.closed}`}>
                        {
                            order.status === 'open' &&
                            <Input
                                placeholder='Descrição da Solução'
                                onChangeText={setSolution}
                                h={24}
                                textAlignVertical="top"
                                multiline>
                            </Input>
                        }

                </CardDetails>
            </ScrollView>

            {
                order.status === 'open' &&
                <Button
                    title="Encerrar Solicitação"
                    m={5}
                    onPress={handleOrderClose}
                    isLoading={isLoading}>
                </Button>
            }
        </VStack>
    )
}