import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { paginationStyles } from "./PaginationStyles";
import { commonStyle } from "../../CommonStyle";
import CustomVerticalSeparator from "../lists/CustomVertticalSeparator";

const Custom_Pagination = ({
    /** array que ira mostrar na paginacao */
    paginationArray,
    /** lida com o clique da pagina pressionada, retorna o valor da pagina para ser enviada a chamada da API */
    onPagePress }:
    { paginationArray: number[], onPagePress: (page: number) => void }) => {

    const [currentPage, setCurrentPage] = useState<number>(1)

    function clickedPage(page: number) {
        setCurrentPage(page)
        onPagePress(page)
    }

    return (
        <View style={[{ backgroundColor: "#0A3147", padding: 12, elevation: 2 }, commonStyle.margin_8, commonStyle.border_radius_32]}>
            <FlatList
                horizontal
                data={paginationArray}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => <PaginationItem
                    currentPage={currentPage!}
                    paginationArray={paginationArray}
                    item={item}
                    onPagePress={(item) => clickedPage(item)} />} />
        </View >
    );
}

const PaginationItem = ({ currentPage, item, onPagePress, paginationArray }:
    { currentPage: number, paginationArray: number[], item: number, onPagePress: (item: number) => void }) => {
    return (
        <View>
            {currentPage == paginationArray[item - 1]
                ? <TouchableOpacity style={paginationStyles.clickedItem}>
                    <Text style={paginationStyles.text}>{item}</Text>
                </TouchableOpacity> :

                <TouchableOpacity style={paginationStyles.item} onPress={() => onPagePress(item)}>
                    <Text style={paginationStyles.textClicked}>{item}</Text>
                </TouchableOpacity>
            }
        </View >

    );
}

export default Custom_Pagination;

