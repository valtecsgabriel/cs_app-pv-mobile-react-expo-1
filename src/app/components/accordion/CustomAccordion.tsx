import { ReactNode, useState } from "react";
import { Animated, Pressable, View } from "react-native";

interface rProp {
    visibleChildren: ReactNode
    hiddenChildren: ReactNode
}
const CustomAccordion = ({ visibleChildren, hiddenChildren }: rProp) => {

    const [openBottom, setOpenBottom] = useState(false);
    const [dragY] = useState(new Animated.Value(0));

    function animateDownSwipe(extraBottomOpen: boolean, dragY: Animated.Value) {
        const toValue = extraBottomOpen ? 0 : -15;
        Animated.timing(dragY, {
            toValue,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }

    function downSwipe(): void {
        animateDownSwipe(openBottom, dragY)
        setOpenBottom(!openBottom);
    }



    return (
        <Pressable onPress={() => downSwipe()}>
            <Animated.View style={{backgroundColor: "#fff", borderStartStartRadius: 20, marginTop: 4}}>
                {visibleChildren}
            </Animated.View>

            {/** CONTEUDO EXIBIDO AO ABRIR O ITEM */}
            {openBottom && (
                <View style={{backgroundColor: "#fff", borderEndEndRadius: 20, marginBottom: 8}}>
                    {hiddenChildren}
                </View>
            )}

        </Pressable>
    );
}

export default CustomAccordion;