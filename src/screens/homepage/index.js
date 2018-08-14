import React, {Component} from 'react'
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base'
import {StyleSheet} from 'react-native'

export default class Homepage extends Component {
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
          <Title>测试列表</Title>
          </Body>
          <Right/>
        </Header>

        <Content>
          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Bip39')
                  }}>
            <Text>Bip39</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Web3')
                  }}>
            <Text>Web3</Text>
          </Button>

          <Button block style={s.button}
                  onPress={() => {
                    this.props.navigation.navigate('Ethers')
                  }}>
            <Text>Ethers</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

const s = StyleSheet.create({
  button: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#00B8C4',
    marginBottom: 10,
  }
})
