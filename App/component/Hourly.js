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
            <Text style={styles.upDateTime}>{new Date().getHours()+':'+ (new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes()) + "时更新"}</Text>
        return (
            <View>
                {time}
                <View style={styles.separator}/>
                <FlatList
                    data={this.props.hourly.hourly}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
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
        marginTop: 4,
        marginBottom: 4,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    textColor: {
        color: "white"
    },
    separator: {
        height: 1,
        backgroundColor: "white",
        opacity:0.5
    },
    weatherIcon: {
        width: 32,
        height: 32,
        tintColor: "white"
    },
    upDateTime: {
        marginLeft: 16,
        marginBottom:4,
        color: "white"
    }
});