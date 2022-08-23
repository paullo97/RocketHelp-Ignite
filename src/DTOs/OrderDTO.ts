import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type OrderFireStoreDTO = {
    patrimony: string;
    description: string;
    status: 'open' | 'close';
    solution?: string;
    created_ad: FirebaseFirestoreTypes.Timestamp;
    closed_ad: FirebaseFirestoreTypes.Timestamp;
}