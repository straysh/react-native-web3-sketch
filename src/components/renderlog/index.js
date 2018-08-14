import React, {Component} from 'react'
import {Body, Button, Container, Header, Icon, Left, Right, Text, Title} from 'native-base'
import {FlatList, View} from 'react-native'
import {getDate} from './lib'

export default class Renderlog extends Component {
  constructor(props) {
    super(props)
    this.state = {log: []}
  }

  componentDidMount() {
    const run = this.props.navigation.getParam('run', () => {
    })
    run.bind(this)()
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
        <Text style={{flex: 1}}>{item.header}</Text>
        <Text style={{flex: 1}}>{item.message}</Text>
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
          data={this.state.log}
          keyExtractor={(item, index) => String(index)}
          renderItem={this.renderItem}
          ListEmptyComponent={(<Text>~</Text>)}/>
      </Container>
    )
  }
}
