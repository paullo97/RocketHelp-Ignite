import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { VStack } from 'native-base';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';


export function Register(){
    const [isLoading, setIsLoading] = useState(false);
    const [patrimony, setPatrimony] = useState('');
    const [description, setDescription] = useState('');
    const navigation = useNavigation();

    function handleNewOrder(){
        if(!patrimony || !description)
        {
            return Alert.alert('Registrar', 'Preencha todos os Campos');
        }

        setIsLoading(true);
        firestore()
            .collection('orders')
            .add({
                patrimony,
                description,
                status: 'open',
                created_ad: firestore.FieldValue.serverTimestamp()
            })
            .then(() =>
            {
                Alert.alert('Solicitação', 'Solicitação Registrada com Sucesso');
                navigation.goBack();
            })
            .catch((error) =>
            {
                console.log(error);
                setIsLoading(false);
                return Alert.alert('Solicitação', 'Não foi possivel registrar o pedido');
            })
    }
    return (
        <VStack flex={1} p={6} bg="gray.600">
            <Header title="Nova Solicitação"></Header>
            <Input placeholder='Numero do Patrimonio' mt={4} keyboardType="numeric" onChangeText={setPatrimony}></Input>
            <Input placeholder='Descrição do Problema' mt={5} flex={1} multiline={true} textAlignVertical="top" onChangeText={setDescription}></Input>
            <Button title="Cadastrar" mt={5} isLoading={isLoading} onPress={handleNewOrder}></Button>
        </VStack>
    )
}