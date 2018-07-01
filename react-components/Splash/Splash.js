import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'; 

export default class Splash extends React.Component {
    componentDidMount() {
        this.checkUserSignedIn().then(function(response) {
            let nextScreen;
            if (response.status === 200) {
                nextScreen = "Menu"
            } else {
                nextScreen = "Login"
            }
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: nextScreen })],
            });
            this.props.navigation.dispatch(resetAction);
        }.bind(this))
    }

    async checkUserSignedIn() {           
        try {
            return await fetch(
                "https://bonnie-api.dsys32.com/user/authenticated/"
            );
        } catch (error) {
            console.error(error);
        }
    }
    
    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.bonniesText}>
                    bonnie's
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C5BFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bonniesText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat',
        fontSize: 40,
        marginBottom: 30,
        fontWeight: 'bold',
    }
})