import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class MenuItem extends React.Component {
    render() {
        let marginLeft = 85

        if (this.props.startGroup === 'appetizers') {
            marginLeft = 10
        } else if (this.props.startGroup === 'entrees') {
            marginLeft = 35
        }else if (this.props.startGroup === 'desserts') {
            marginLeft = 25
        }   
        return(
            <View style={styles.container}>
                {
                    this.props.startGroup !== " " && 
                    <Text style={[styles.menuHeaderText, {marginLeft: marginLeft}]}>
                        {this.props.startGroup}
                    </Text>
                }
                {
                    this.props.selected &&
                    <View style={styles.quantityView}>
                        <View style={{marginRight: 10, alignItems:'center'}}>
                            <MaterialIcons name="add" style={styles.icons} onPress={() => this.props.increaseQuantity(this.props.item)}/>
                            <Text style={styles.quantityText}>
                                {this.props.quantity}
                            </Text>
                            <MaterialIcons name="remove" style={styles.icons} onPress={() => this.props.decreaseQuantity(this.props.item)}/>
                        </View>
                    </View>
                }
                
                <View style={[styles.itemView, {borderColor: this.props.selected ? "#14DB88" : '#1C5BFF'}]}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.props.onSelectItem(this.props.item)}>
                        <View style={{marginLeft: 10, flex: 1}}>
                            <Text style={styles.itemNameText}>
                                {this.props.item.name}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <View>
                                    <Text style={styles.itemDescriptionText}>
                                        {this.props.item.description}
                                    </Text>
                                    <Text style={styles.itemCostText}>
                                        {"$" + this.props.item.price}
                                    </Text>
                                </View>
                                <View style={{alignItems: 'flex-end'}}>
                                    <Image
                                        style={styles.itemImage}
                                        source={{uri: this.props.item.picture}}
                                    />
                                    {
                                        this.props.recommended && 
                                        <MaterialIcons name="star" />
                                    }
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingBottom: 8,
        paddingTop: 8
    },
    itemView: {
        borderWidth: 3,
        height: 130,
        width: 260,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginLeft: 10
    },
    quantityView: {
        borderWidth: 3,
        borderRadius: 10,
        borderColor: "#1C5BFF",
        position: 'absolute',
        right: 20,
        height: 100,
        width: 50,
        alignItems: 'flex-end',
        justifyContent: 'center',
        top: 8
    },
    itemNameText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 15,
        color: "#000000",
        marginTop: 10,
    },
    itemDescriptionText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        color: "rgba(66, 66, 66, 0.6)",
        fontSize: 13,
        width: 120
    },
    menuHeaderText: {
        transform: [{
            rotateZ: '30deg'
        }],
        paddingTop: 20,
        marginTop: 0,
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 15,
        color: "#000000",
    },
    itemCostText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#1C5BFF',
    },
    itemImage: {
        width: 100,
        height: 70,
        borderRadius: 4,
        marginLeft: 10,
        marginTop: 10
    },
    quantityText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#1C5BFF',
    },
    icons: {
        color: "#1C5BFF",
        fontSize: 20
    }
})