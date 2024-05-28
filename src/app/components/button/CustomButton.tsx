import { Text, TouchableHighlight } from "react-native";


export interface CustomButtonProps {
    title: string,
    onPress: (prop?: any) => void,
    onLongPress?: () => void,
    disabled?: boolean,
    buttonStyle: object,
    textStyle: object
}


const CustomButton = ({ title, onPress, onLongPress, disabled = false, buttonStyle = {}, textStyle = {} }: CustomButtonProps) => {
    return (
        <TouchableHighlight
            onPress={onPress}
            disabled={disabled}
            style={buttonStyle}
            onLongPress={onLongPress}
            underlayColor='white'
        >
            <Text style={textStyle}>{title}</Text>
        </TouchableHighlight>
    );
}

export default CustomButton;