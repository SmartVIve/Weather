import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image
} from 'react-native';


export default class Forecast extends Component {
    render() {
        return (
            <FlatList
                data={this.props.forecast}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) =>
                    <View style={styles.forecastFlatList}>
                        <Text style={styles.textColor}>{item.date.substr(8,10)+'日'}</Text>
                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                            <Image style={styles.weatherIcon}
                                   source={{uri: 'https://cdn.heweather.com/cond_icon/' + item.cond_code_d + '.png'}}/>
                            <Text style={styles.textColor}>{item.cond_txt_d}</Text>
                        </View>
                        <Text style={styles.textColor}>{item.tmp_min + "~" + item.tmp_max + "℃"}</Text>
                    </View>
                }
            />
        )
    }
}

const styles = StyleSheet.create({
    forecastFlatList: {
        height: 48,
        flexDirection: "row",
        marginLeft: 16,
        marginRight: 16,
        justifyContent: "space-between",
        alignItems: "center"
    },
    weatherIcon: {
        width: 32,
        height: 32,
        tintColor: "white"
    },
    textColor: {
        color: "white"
    },
});
