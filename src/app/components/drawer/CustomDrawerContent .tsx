import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import ColorStyle from '../../ColorStyle';
import { commonStyle } from '../../CommonStyle';
import { DataKey } from '../../enum/DataKeys';
import { removeValueFromStorage, storeSimpleData } from '../../services/storage/AsyncStorageConfig';
import { logout } from '../../view_controller/login/LoginViewController';
import appConfig from '../../../../app.json';



const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const navigation = useNavigation();

    const handleLogout = () => {
        // Chame sua função de logout aqui
        logout(DataKey.LoginResponse).then(() => {
            removeValueFromStorage(DataKey.IsConfigValidada).then(() => {
                storeSimpleData(DataKey.MaintainOpenConfig, "true")
                navigation.navigate('Login');
            })
        });
    };

    return (
        <DrawerContentScrollView
            {...props}
            style={{
                backgroundColor: ColorStyle.colorPrimary300
            }}
        >
            <DrawerItemList {...props} />
            <TouchableHighlight
                onPress={handleLogout}
                underlayColor={'white'}
                style={{ margin: 16, padding: 10, borderRadius: 8 }}
            >
                <Text
                    style={[
                        commonStyle.common_fontWeight_800,
                        {
                            color: ColorStyle.colorPrimary100,

                        }
                    ]}
                >
                    Sair
                </Text>
            </TouchableHighlight>

            <Text
                style={[
                    commonStyle.common_fontWeight_800,
                    {
                        color: ColorStyle.colorPrimary100,

                    }
                ]}
            >
                -Versão: {appConfig.expo.version}
            </Text>
        </DrawerContentScrollView>
    );
};

export default CustomDrawerContent;
