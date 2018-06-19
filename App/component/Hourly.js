import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image
} from 'react-native';

export default class Hourly extends Component {
    render() {
        let time = this.props.hourly === '' ? null :
            <Text style={styles.upDateTime}>{this.props.hourly.update.loc.substr(11, 15) + "时更新"}</Text>
        return (
            <View>
                {time}
                <View style={styles.separator}/>
                <FlatList
                    data={this.props.hourly.hourly}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) =>
                        <View style={styles.hourlyFlatList}>
                            <Text style={styles.textColor}>{item.time.substr(11, 15)}</Text>
                            <Image style={styles.weatherIcon}
                                   source={{uri: 'https://cdn.heweather.com/cond_icon/' + item.cond_code + '.png'}}/>
                            <Text style={styles.textColor}>{item.tmp + "°"}</Text>
                            <View/>
                        </View>
                    }
                />
                <View style={styles.separator}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    hourlyFlatList: {
        height: 96,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
    },
    textColor: {
        color: "white"
    },
    separator: {
        height: 1,
        backgroundColor: "white"
    },
    weatherIcon: {
        width: 32,
        height: 32,
        tintColor: "white"
    },
    upDateTime: {
        marginLeft: 16,
        color: "white"
    }
});