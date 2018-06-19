import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    TouchableNativeFeedback
} from 'react-native';

export default class NavigationView extends Component {
    render() {
        return (
            <View style={styles.main}>
                <Image style={styles.bg} source={require('../images/menu_bg.jpg')}/>
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate("AddLocation", {
                    callback: (location) => {
                        //添加地址返回
                        this.props.addLocation(location);
                    }
                })}>
                    <View style={styles.textView}>
                        <Text style={styles.text}>添加城市</Text>
                    </View>
                </TouchableNativeFeedback>
                <FlatList
                    data={this.props.locationItem}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) =>
                        <TouchableNativeFeedback onPress={() => {this.props.addLocation(item);}}>
                            <View style={styles.textView}>
                                <Text style={styles.text}>{item}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: "white"
    },
    bg:{
        width: 300,
        height: 206
    },
    textView:{
        height: 48,
        justifyContent: "center",
    },
    text:{
        marginLeft:16,
        fontSize:18
    }
});