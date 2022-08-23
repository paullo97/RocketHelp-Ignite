import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Center, FlatList, Heading, HStack, IconButton, Text, useTheme, VStack } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Logo from '../assets/Logo_horizontal.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { Loading } from '../components/Loading';
import { Order, OrderProps } from '../components/Order';
import { OrderFireStoreDTO } from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormat';


export function Home(){
    const [isLoading, setIsLoading] = useState(true);

    const { colors } = useTheme();
    const [ statusSelected, setStatusSelected] = useState<'open' | 'close'>('open');
    const [ orders, setOrders ] = useState<OrderProps[]>([]);

    /** For Navigate between screens */
    const navigation = useNavigation();
    function handleNewOrder(){
        navigation.navigate('new');
    }

    function handleOrderDetails(orderId: string){
        navigation.navigate('details', { orderId })
    }

    function handleLogout(){
        auth().signOut().catch((error) =>
        {
            console.log(error);
            return Alert.alert('Sair', 'Não foi possivel realizar, por favor tente em instantes');
        });
    }

    useEffect(() =>
    {
        setIsLoading(true);
        const subscriber = firestore().collection<OrderFireStoreDTO>('orders').where('status', '==', statusSelected)
        .onSnapshot((snapshot) =>
        {
            const data = snapshot.docs.map((doc) => {
                const { patrimony, description, status, created_ad} = doc.data();
                return {
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    when: dateFormat(created_ad)
                };
            });

            setOrders(data);
            setIsLoading(false);
        })

        return subscriber;

    }, [statusSelected])

    return(
        <VStack flex={1} pb={6} bg="gray.700">
            <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
                bg="gray.700"
                pt={12}
                pb={5}
                px={6}>
                <Logo />

                <IconButton icon={<SignOut size={26} color={colors.gray[300]}/>} onPress={handleLogout}></IconButton>
            </HStack>

            <VStack flex={1} px={6}>
                <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center">
                    <Heading color="gray.100">Meus Chamados</Heading>
                    <Text color="gray.200" fontSize="md">
                        { orders.length }
                    </Text>
                </HStack>

                <HStack space={3} mb={8}>
                    <Filter
                        title='Em Andamento'
                        type='open'
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}>
                    </Filter>

                    <Filter
                        title='Finalizados'
                        type='close'
                        onPress={() => setStatusSelected('close')}
                        isActive={statusSelected === 'close'}>
                    </Filter>
                </HStack>

                {
                    isLoading ? <Loading/> :
                    <FlatList
                        data={orders}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={ item } onPress={() => handleOrderDetails(item.id)}></Order>}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color={colors.gray[300]} size={40}></ChatTeardropText>
                                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                                    Você ainda não possui {'\n'}
                                    Solicitações {' '}
                                    { statusSelected === 'open' ? 'Em Andamento' : 'Finalizadas'}
                                </Text>
                            </Center>
                        )}>
                    </FlatList>
                }

                <Button title="Nova Solicitação" onPress={handleNewOrder}></Button>
            </VStack>
        </VStack>
    )
}