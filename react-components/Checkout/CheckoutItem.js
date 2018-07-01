import React from 'react';
import { StyleSheet, View, Text } from 'react-native'

export default class CheckoutItem extends React.Component {
    render() {
        return(
            <View style={styles.container}>
                <View style={{flex: 1, marginLeft: 5}}>
                    <Text style={styles.itemNameText}>
                        {this.props.item.name}
                    </Text>
                    <View style={styles.lowerContainer}>
                        <Text style={styles.descriptionText}>
                            {this.props.item.description}
                        </Text>
                        <View style={{marginLeft: 10, alignItems: 'center'}}>
                            <Text style={styles.itemQuantityText}>
                                {'$' + this.props.item.price}
                            </Text>
                            <Text style={styles.itemQuantityText}>
                                {'x' + this.props.item.quantity}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderColor: '#14DB88',
        borderWidth: 3,
        borderRadius: 10,
        height: 100,
        width: 300,
        margin: 3
    },
    itemNameText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000000'
    },
    lowerContainer: {
        flexDirection: 'row'
    },
    descriptionText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 15,
        color: 'rgba(66, 66, 66, 0.6)',
        width: 200
    },
    itemQuantityText: {
        fontFamily: 'Sofia Pro',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#1C5BFF'
    }
})