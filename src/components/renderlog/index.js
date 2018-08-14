import React, {Component} from 'react'
import {Body, Button, Container, Header, Icon, Left, Right, Text, Title} from 'native-base'
import {FlatList, View} from 'react-native'
import {getDate} from './lib'

export default class Renderlog extends Component {
  constructor(props) {
    super(props)
    this.state = {log: [], progress: null}
  }

  componentDidMount() {
    const run = this.props.navigation.getParam('run', () => {
    })
    run.bind(this)()
  }

  progress = (p, max) => {
    this.setState({progress: `${p + 1} / ${max}`})
  }
  info = (...msg) => {
    const {log} = this.state
    log.push({
      type: `info`,
      header: `Info[${getDate()}]`,
      message: `${msg[0]} → ${msg[1]}`,
    })
    this.setState({log})
  }
  equal = (a, b, message = '') => {
    const {log} = this.state
    log.push({
      type: `equal`,
      result: a === b,
      header: `Info[${getDate()}]`,
      message: `${message}`,
    })
    this.setState({log})
  }
  error = (...error) => {
    const {log} = this.state
    log.push({
      type: `error`,
      header: `Error[${getDate()}]`,
      message: `${error.toString()}`,
    })
    this.setState({log})
  }

  renderItem = ({item}) => {
    return (
      <View style={{flexDirection: 'column', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingLeft: 5, paddingRight: 5}}>
        {/*<Text style={{flex: 1}}>{item.header}</Text>*/}
        <View style={{flexDirection: 'row'}}>
          <Text style={{flex: 1}}>{item.message}</Text>
          {item.type !== 'equal' ? null : (
            item.result ?
              <Icon name="ios-checkmark" style={{color: 'green', width: 15}}/> :
              <Icon name="ios-close" style={{color: 'red', width: 15}}/>
          )}
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
          <Title>{this.props.navigation.getParam('title', '测试')}</Title>
          </Body>
          <Right/>
        </Header>

        <FlatList
          data={this.state.log.filter(item => {
            return this.state.progress === null || item.result === false
          })}
          keyExtractor={(item, index) => String(index)}
          renderItem={this.renderItem}
          ListEmptyComponent={(<Text>No Failed Testcase Found!</Text>)}
          ListHeaderComponent={(<Text>{this.state.progress}</Text>)}/>
      </Container>
    )
  }
}
