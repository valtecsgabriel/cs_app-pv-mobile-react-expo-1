import { FlatList, SafeAreaView, View } from "react-native";
import HeaderUserInfo from "../../components/headers/HeaderUserInfo";
import ItemIconTitleHalfRoundedWhite from "../../components/items/ItemIconTitleHalfRoundedWhite";
import { data } from "./ListMenu";
import { useNavigation } from "@react-navigation/native";


const CS_SC_Menu = () => {
    const { navigate } = useNavigation()
    return (
        <SafeAreaView>
            <HeaderUserInfo />
            <View style={{
                paddingVertical: 32
            }}>
                <FlatList
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    numColumns={3}
                    renderItem={({ item }) => {
                        return (
                            <ItemIconTitleHalfRoundedWhite
                                title={item.title}
                                onPress={() => item.onPress(navigate)}
                                iconName={item.iconName}
                            />
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
}


export default CS_SC_Menu;