import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    Image
} from 'react-native';

export default class Header extends Component {
    render() {
        return (
            <View style={styles.header}>
                <TouchableHighlight underlayColor="transparent" onPress={this.props.onPress}>
                    <Image style={styles.menuIcon} source={require('../images/menu.png')}/>
                </TouchableHighlight>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: 48,
        flexDirection: "row",
        alignItems: "center"
    },
    menuIcon: {
        marginLeft: 16,
        width: 24,
        height: 24,
        tintColor: "white"
    },
    title:{
        marginLeft: 8,
        fontSize: 22,
        color: "white"
    }
});
