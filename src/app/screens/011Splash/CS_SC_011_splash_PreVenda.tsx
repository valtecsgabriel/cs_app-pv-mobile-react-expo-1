import { ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { commonStyle } from "../../CommonStyle";
import ColorStyle from "../../ColorStyle";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

const CS_SC_011_splash_PreVenda = () => {
    const { navigate } = useNavigation()
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                style={{ flex: 1 }}
                source={require('../../../../assets/Pre-venda.png')}
            >
                <View
                    style={[

                        {
                            height: "100%",
                            marginHorizontal: 15,
                            paddingVertical: 60,
                            alignItems: "center",
                            justifyContent: "space-between"
                        }
                    ]}
                >
                    <Text
                        style={[
                            commonStyle.common_fontWeight_800,
                            {
                                width: "auto",
                                fontSize: 50,
                                textAlign: "left",
                                color: "white",
                            }
                        ]}
                    >
                        Faça suas vendas de forma rápida e segura
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigate('Splash_Produto')}
                        style={[
                            commonStyle.border_radius_32,
                            commonStyle.align_centralizar,
                            {
                                flexDirection: "row",
                                backgroundColor: ColorStyle.colorPrimary100,
                                width: "100%",
                                height: 60,
                            }
                        ]}
                    >
                        <Text
                            style={[
                                commonStyle.common_fontWeight_600,
                                commonStyle.font_size_18,
                                {
                                    color: ColorStyle.colorPrimary300,
                                    marginRight: 12
                                }
                            ]}
                        >
                            Proximo
                        </Text>
                        <Ionicons size={24} color={ColorStyle.colorPrimary300} name="arrow-forward-outline"/>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default CS_SC_011_splash_PreVenda;